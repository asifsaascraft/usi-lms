// utils/sendEmail.js

import { SendMailClient } from "zeptomail";
import dotenv from "dotenv";

dotenv.config();

const client = new SendMailClient({
  url: process.env.ZEPTO_URL,
  token: process.env.ZEPTO_TOKEN,
});

/**
 * Escape HTML special characters.
 */
const escapeHtml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Send email via ZeptoMail template.
 *
 * @param {Object} params
 * @param {string} params.to
 * @param {string} params.name
 * @param {string} params.templateKey
 * @param {Object} params.mergeInfo
 */
const sendEmailWithTemplate = async ({
  to,
  name,
  templateKey,
  mergeInfo,
}) => {
  try {
    const resp = await client.sendMailWithTemplate({
      mail_template_key: templateKey,

      from: {
        address: process.env.ZEPTO_FROM,
        name: "PEDICON 2026",
      },

      to: [
        {
          email_address: {
            address: to,
            name,
          },
        },
      ],

      merge_info: mergeInfo,
    });

    return resp;
  } catch (error) {
    console.error(
      "sendEmailWithTemplate error:",
      error,
    );

    throw error;
  }
};

/**
 * Send notification to organizing committee/admin
 * when a faculty member accepts or declines.
 */
export const sendFacultyResponseNotification = async ({
  status,
  invitation,
}) => {
  try {
    const emails = process.env.FACULTY_NOTIFICATION_EMAILS
      ?.split(",")
      .map((email) => email.trim())
      .filter(Boolean);

    if (!emails?.length) {
      console.warn(
        "FACULTY_NOTIFICATION_EMAILS is not configured.",
      );

      return;
    }

    const responseText =
      status === "ACCEPTED"
        ? "ACCEPTED"
        : "DECLINED";

    const recipients = emails.map((email) => ({
      email_address: {
        address: email,
      },
    }));

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Faculty Invitation Response</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
          font-family: Arial, Helvetica, sans-serif;
        "
      >

        <div
          style="
            max-width: 650px;
            margin: 30px auto;
            background: #ffffff;
            padding: 30px;
            border-radius: 8px;
          "
        >

          <h2 style="margin-top: 0;">
            Faculty Invitation ${responseText}
          </h2>

          <p>
            <strong>
              ${escapeHtml(invitation.name)}
            </strong>
            has
            <strong>
              ${responseText}
            </strong>
            the faculty invitation.
          </p>

          <hr />

          <p>
            <strong>Name:</strong>
            ${escapeHtml(invitation.name)}
          </p>

          <p>
            <strong>Email:</strong>
            ${escapeHtml(invitation.email)}
          </p>

          <p>
            <strong>Invitation Type:</strong>
            ${escapeHtml(invitation.invitationType)}
          </p>

          <p>
            <strong>Group:</strong>
            ${escapeHtml(invitation.group)}
          </p>

          ${
            invitation.topic
              ? `
                <p>
                  <strong>Topic:</strong>
                  ${escapeHtml(invitation.topic)}
                </p>
              `
              : ""
          }

          ${
            invitation.workshopName
              ? `
                <p>
                  <strong>Workshop:</strong>
                  ${escapeHtml(invitation.workshopName)}
                </p>
              `
              : ""
          }

          ${
            invitation.date
              ? `
                <p>
                  <strong>Date:</strong>
                  ${escapeHtml(invitation.date)}
                </p>
              `
              : ""
          }

          ${
            invitation.time
              ? `
                <p>
                  <strong>Time:</strong>
                  ${escapeHtml(invitation.time)}
                </p>
              `
              : ""
          }

          ${
            invitation.hall
              ? `
                <p>
                  <strong>Hall:</strong>
                  ${escapeHtml(invitation.hall)}
                </p>
              `
              : ""
          }

          ${
            invitation.venue
              ? `
                <p>
                  <strong>Venue:</strong>
                  ${escapeHtml(invitation.venue)}
                </p>
              `
              : ""
          }

          <p>
            <strong>Response:</strong>
            ${responseText}
          </p>

          <p>
            <strong>Responded At:</strong>
            ${escapeHtml(
              invitation.respondedAt
                ? invitation.respondedAt.toString()
                : "",
            )}
          </p>

        </div>

      </body>
      </html>
    `;

    const response = await client.sendMail({
      from: {
        address: process.env.ZEPTO_FROM,
        name: "PEDICON 2026",
      },

      to: recipients,

      subject:
        `Faculty Invitation ${responseText} - ${invitation.name}`,

      htmlbody: htmlBody,
    });

    return response;
  } catch (error) {
    console.error(
      "sendFacultyResponseNotification error:",
      error,
    );

    // Important:
    // Do NOT throw this error.
    //
    // The faculty response has already been saved in MongoDB.
    // Notification failure should not make the faculty
    // think their response was unsuccessful.
    return null;
  }
};

export default sendEmailWithTemplate;