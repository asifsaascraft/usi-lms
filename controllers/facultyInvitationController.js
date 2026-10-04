import FacultyInvitation from "../models/FacultyInvitation.js";

import sendEmailWithTemplate, {
  sendFacultyResponseNotification,
} from "../utils/sendEmail1.js";

import {
  generateResponseToken,
  hashResponseToken,
} from "../utils/invitationResponseToken.js";

import { getFacultyTemplateKey } from "../config/facultyInvitationTemplates.js";

/**
 * ---------------------------------------------------------
 * BUILD MERGE INFO
 * ---------------------------------------------------------
 *
 * Different ZeptoMail templates require different fields.
 *
 * WORKSHOP:
 *   faculty_name
 *   workshop_name
 *   date
 *   time
 *   venue
 *
 * SOLO_TALK:
 *   faculty_name
 *   topic
 *   date
 *   time
 *   hall
 *
 * PANELIST:
 *   faculty_name
 *   topic
 *   date
 *   time
 *   hall
 *   person_1_name
 *   person_1_contact
 *   ...
 *
 * MODERATOR:
 *   faculty_name
 *   topic
 *   date
 *   time
 *   hall
 *   person_1_name
 *   person_1_contact
 *   ...
 *
 * RESPONSE:
 *   accept_url
 *   decline_url
 */
const buildMergeInfo = (invitation, responseUrls = {}) => {
  const mergeInfo = {
    faculty_name: invitation.name || "",

    accept_url: responseUrls.acceptUrl || "",

    decline_url: responseUrls.declineUrl || "",
  };

  // -------------------------------------------------------
  // WORKSHOP
  // -------------------------------------------------------

  if (invitation.invitationType === "WORKSHOP") {
    mergeInfo.workshop_name = invitation.workshopName || "";

    mergeInfo.date = invitation.date || "";

    mergeInfo.time = invitation.time || "";
  }

  // -------------------------------------------------------
  // SOLO TALK
  // -------------------------------------------------------

  if (invitation.invitationType === "SOLO_TALK") {
    mergeInfo.topic = invitation.topic || "";

    mergeInfo.date = invitation.date || "";

    mergeInfo.time = invitation.time || "";

    mergeInfo.hall = invitation.hall || "";
  }

  // -------------------------------------------------------
  // PANELIST
  // -------------------------------------------------------

  if (invitation.invitationType === "PANELIST") {
    mergeInfo.topic = invitation.topic || "";

    mergeInfo.date = invitation.date || "";

    mergeInfo.time = invitation.time || "";

    mergeInfo.hall = invitation.hall || "";

    const panelPeople = invitation.panelPeople || [];

    for (let i = 0; i < 4; i++) {
      mergeInfo[`person_${i + 1}_name`] = panelPeople[i]?.name || "";

      mergeInfo[`person_${i + 1}_contact`] = panelPeople[i]?.contact || "";
    }
  }

  // -------------------------------------------------------
  // MODERATOR
  // -------------------------------------------------------

  if (invitation.invitationType === "MODERATOR") {
    mergeInfo.topic = invitation.topic || "";

    mergeInfo.date = invitation.date || "";

    mergeInfo.time = invitation.time || "";

    mergeInfo.hall = invitation.hall || "";

    const panelPeople = invitation.panelPeople || [];

    for (let i = 0; i < 4; i++) {
      mergeInfo[`person_${i + 1}_name`] = panelPeople[i]?.name || "";

      mergeInfo[`person_${i + 1}_contact`] = panelPeople[i]?.contact || "";
    }
  }

  return mergeInfo;
};

/**
 * ---------------------------------------------------------
 * CREATE FACULTY INVITATION
 * ---------------------------------------------------------
 *
 * POST /
 */
export const createFacultyInvitation = async (req, res) => {
  try {
    const invitation = await FacultyInvitation.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Faculty invitation created successfully",
      data: invitation,
    });
  } catch (error) {
    console.error("createFacultyInvitation error:", error);

    return res.status(400).json({
      success: false,
      message: error?.message || "Failed to create faculty invitation",
    });
  }
};

/**
 * ---------------------------------------------------------
 * GET ALL FACULTY INVITATIONS
 * ---------------------------------------------------------
 *
 * GET /
 *
 * Optional query filters:
 *
 * ?group=MP
 * ?group=OUT_OF_MP
 * ?invitationType=WORKSHOP
 * ?invitationType=SOLO_TALK
 * ?invitationType=PANELIST
 * ?invitationType=MODERATOR
 * ?responseStatus=PENDING
 * ?responseStatus=ACCEPTED
 * ?responseStatus=DECLINED
 * ?email=example@gmail.com
 */
export const getAllFacultyInvitations = async (req, res) => {
  try {
    const { group, invitationType, responseStatus, email } = req.query;

    const filter = {};

    // Filter by group
    if (group) {
      filter.group = group;
    }

    // Filter by invitation type
    if (invitationType) {
      filter.invitationType = invitationType;
    }

    // Filter by response status
    if (responseStatus) {
      filter.responseStatus = responseStatus;
    }

    // Filter by email
    if (email) {
      filter.email = email.toLowerCase().trim();
    }

    const invitations = await FacultyInvitation.find(filter)
      .select("-responseTokenHash -responseTokenExpiresAt")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: invitations.length,
      data: invitations,
    });
  } catch (error) {
    console.error("getAllFacultyInvitations error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to get faculty invitations",
    });
  }
};

/**
 * ---------------------------------------------------------
 * GET FACULTY INVITATION BY ID
 * ---------------------------------------------------------
 *
 * GET /:id
 */
export const getFacultyInvitationById = async (req, res) => {
  try {
    const invitation = await FacultyInvitation.findById(req.params.id).select(
      "-responseTokenHash -responseTokenExpiresAt",
    );

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Faculty invitation not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    console.error("getFacultyInvitationById error:", error);

    return res.status(400).json({
      success: false,
      message: error?.message || "Invalid faculty invitation ID",
    });
  }
};

/**
 * ---------------------------------------------------------
 * UPDATE FACULTY INVITATION
 * ---------------------------------------------------------
 *
 * PUT /:id
 */
export const updateFacultyInvitation = async (req, res) => {
  try {
    const invitation = await FacultyInvitation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Faculty invitation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Faculty invitation updated successfully",
      data: invitation,
    });
  } catch (error) {
    console.error("updateFacultyInvitation error:", error);

    return res.status(400).json({
      success: false,
      message: error?.message || "Failed to update faculty invitation",
    });
  }
};

/**
 * ---------------------------------------------------------
 * DELETE FACULTY INVITATION
 * ---------------------------------------------------------
 *
 * DELETE /:id
 */
export const deleteFacultyInvitation = async (req, res) => {
  try {
    const invitation = await FacultyInvitation.findByIdAndDelete(req.params.id);

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Faculty invitation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Faculty invitation deleted successfully",
      data: invitation,
    });
  } catch (error) {
    console.error("deleteFacultyInvitation error:", error);

    return res.status(400).json({
      success: false,
      message: error?.message || "Failed to delete faculty invitation",
    });
  }
};

/**
 * ---------------------------------------------------------
 * SEND SINGLE FACULTY INVITATION EMAIL
 * ---------------------------------------------------------
 *
 * POST /:id/send-email
 */
export const sendSingleFacultyInvitationEmail = async (req, res) => {
  try {
    const invitation = await FacultyInvitation.findById(req.params.id);

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Faculty invitation not found",
      });
    }

    // ---------------------------------------------------
    // GET ZEPTOMAIL TEMPLATE
    // ---------------------------------------------------

    const templateKey = getFacultyTemplateKey(
      invitation.group,
      invitation.invitationType,
    );

    // ---------------------------------------------------
    // GENERATE NEW RESPONSE TOKEN
    // ---------------------------------------------------
    //
    // Every time invitation is sent again,
    // old response links become invalid.
    //

    const rawToken = generateResponseToken();

    const tokenHash = hashResponseToken(rawToken);

    invitation.responseTokenHash = tokenHash;

    invitation.responseTokenExpiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    );

    invitation.responseStatus = "PENDING";

    invitation.respondedAt = null;

    await invitation.save();

    // ---------------------------------------------------
    // BUILD RESPONSE URLS
    // ---------------------------------------------------

    const baseUrl = process.env.FACULTY_RESPONSE_BASE_URL;

    if (!baseUrl) {
      throw new Error("FACULTY_RESPONSE_BASE_URL is not configured");
    }

    const cleanBaseUrl = baseUrl.replace(/\/$/, "");

    const acceptUrl = `${cleanBaseUrl}/api/faculty-invitations/respond/${rawToken}?action=accept`;

    const declineUrl = `${cleanBaseUrl}/api/faculty-invitations/respond/${rawToken}?action=decline`;

    // ---------------------------------------------------
    // BUILD MERGE VARIABLES
    // ---------------------------------------------------

    const mergeInfo = buildMergeInfo(invitation, {
      acceptUrl,
      declineUrl,
    });

    // ---------------------------------------------------
    // SEND EMAIL
    // ---------------------------------------------------

    const response = await sendEmailWithTemplate({
      to: invitation.email,
      name: invitation.name,
      templateKey,
      mergeInfo,
    });

    return res.status(200).json({
      success: true,
      message: "Faculty invitation email sent successfully",

      data: {
        invitationId: invitation._id,

        email: invitation.email,

        name: invitation.name,

        group: invitation.group,

        invitationType: invitation.invitationType,

        templateKey,

        responseStatus: invitation.responseStatus,

        responseTokenExpiresAt: invitation.responseTokenExpiresAt,

        mergeInfo,

        response,
      },
    });
  } catch (error) {
    console.error("sendSingleFacultyInvitationEmail error:", error);

    return res.status(500).json({
      success: false,
      message:
        error?.error?.message ||
        error?.message ||
        "Failed to send faculty invitation email",
    });
  }
};

/**
 * ---------------------------------------------------------
 * SEND BULK FACULTY INVITATION EMAILS
 * ---------------------------------------------------------
 *
 * POST /send-bulk-email
 *
 * No request body required.
 *
 * All faculty invitations from MongoDB
 * will receive their respective emails.
 */
export const sendBulkFacultyInvitationEmails = async (req, res) => {
  try {
    // Get ALL faculty invitations
    const invitations = await FacultyInvitation.find({});

    if (invitations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No faculty invitations found",
      });
    }

    const baseUrl = process.env.FACULTY_RESPONSE_BASE_URL;

    if (!baseUrl) {
      throw new Error("FACULTY_RESPONSE_BASE_URL is not configured");
    }

    const cleanBaseUrl = baseUrl.replace(/\/$/, "");

    const results = [];

    // ---------------------------------------------------
    // SEND ONE BY ONE
    // ---------------------------------------------------

    for (const invitation of invitations) {
      try {
        // -----------------------------------------------
        // GET TEMPLATE
        // -----------------------------------------------

        const templateKey = getFacultyTemplateKey(
          invitation.group,
          invitation.invitationType,
        );

        // -----------------------------------------------
        // GENERATE RESPONSE TOKEN
        // -----------------------------------------------

        const rawToken = generateResponseToken();

        const tokenHash = hashResponseToken(rawToken);

        invitation.responseTokenHash = tokenHash;

        invitation.responseTokenExpiresAt = new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        );

        invitation.responseStatus = "PENDING";

        invitation.respondedAt = null;

        await invitation.save();

        // -----------------------------------------------
        // RESPONSE URLS
        // -----------------------------------------------

        const acceptUrl = `${cleanBaseUrl}/api/faculty-invitations/respond/${rawToken}?action=accept`;

        const declineUrl = `${cleanBaseUrl}/api/faculty-invitations/respond/${rawToken}?action=decline`;

        // -----------------------------------------------
        // MERGE INFO
        // -----------------------------------------------

        const mergeInfo = buildMergeInfo(invitation, {
          acceptUrl,
          declineUrl,
        });

        // -----------------------------------------------
        // SEND EMAIL
        // -----------------------------------------------

        const response = await sendEmailWithTemplate({
          to: invitation.email,
          name: invitation.name,
          templateKey,
          mergeInfo,
        });

        results.push({
          invitationId: invitation._id,

          email: invitation.email,

          name: invitation.name,

          group: invitation.group,

          invitationType: invitation.invitationType,

          status: "SENT",

          response,
        });
      } catch (emailError) {
        console.error(`Bulk email failed for ${invitation.email}:`, emailError);

        results.push({
          invitationId: invitation._id,

          email: invitation.email,

          name: invitation.name,

          group: invitation.group,

          invitationType: invitation.invitationType,

          status: "FAILED",

          message:
            emailError?.error?.message ||
            emailError?.message ||
            "Email sending failed",
        });
      }
    }

    const successCount = results.filter(
      (item) => item.status === "SENT",
    ).length;

    const failedCount = results.filter(
      (item) => item.status === "FAILED",
    ).length;

    return res.status(200).json({
      success: true,

      message: "Bulk faculty invitation email process completed",

      summary: {
        total: results.length,

        sent: successCount,

        failed: failedCount,
      },

      results,
    });
  } catch (error) {
    console.error("sendBulkFacultyInvitationEmails error:", error);

    return res.status(500).json({
      success: false,
      message:
        error?.message || "Failed to send bulk faculty invitation emails",
    });
  }
};

/**
 * ---------------------------------------------------------
 * SHOW RESPONSE CONFIRMATION PAGE
 * ---------------------------------------------------------
 *
 * GET /respond/:token?action=accept
 * GET /respond/:token?action=decline
 *
 * IMPORTANT:
 * GET does NOT update MongoDB.
 *
 * This protects us from email security scanners
 * automatically opening the link.
 */
export const showFacultyInvitationResponsePage = async (req, res) => {
  try {
    const { token } = req.params;

    const { action } = req.query;

    // ---------------------------------------------------
    // VALIDATE ACTION
    // ---------------------------------------------------

    if (!["accept", "decline"].includes(action)) {
      return res.status(400).send(`
          <!DOCTYPE html>
          <html>
          <body style="font-family:Arial;text-align:center;padding:50px;">
            <h2>Invalid response</h2>
            <p>The invitation response link is invalid.</p>
          </body>
          </html>
        `);
    }

    // ---------------------------------------------------
    // FIND INVITATION
    // ---------------------------------------------------

    const tokenHash = hashResponseToken(token);

    const invitation = await FacultyInvitation.findOne({
      responseTokenHash: tokenHash,
    });

    if (!invitation) {
      return res.status(404).send(`
          <!DOCTYPE html>
          <html>
          <body style="font-family:Arial;text-align:center;padding:50px;">
            <h2>Invitation not found</h2>
            <p>This invitation link is invalid or no longer available.</p>
          </body>
          </html>
        `);
    }

    // ---------------------------------------------------
    // CHECK EXPIRY
    // ---------------------------------------------------

    if (
      invitation.responseTokenExpiresAt &&
      invitation.responseTokenExpiresAt < new Date()
    ) {
      return res.status(410).send(`
          <!DOCTYPE html>
          <html>
          <body style="font-family:Arial;text-align:center;padding:50px;">
            <h2>Invitation expired</h2>
            <p>This invitation response link has expired.</p>
          </body>
          </html>
        `);
    }

    // ---------------------------------------------------
    // ALREADY RESPONDED
    // ---------------------------------------------------

    if (invitation.responseStatus !== "PENDING") {
      return res.status(200).send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>57th MP PEDICON 2026</title>
          </head>

          <body
            style="
              font-family:Arial,Helvetica,sans-serif;
              text-align:center;
              padding:50px 20px;
            "
          >

            <h1>57th MP PEDICON 2026</h1>

            <h2>Response Already Submitted</h2>

            <p>
              Dear Dr. ${invitation.name},
            </p>

            <p>
              You have already responded to this invitation.
            </p>

            <h3>
              ${invitation.responseStatus}
            </h3>

          </body>
          </html>
        `);
    }

    const isAccept = action === "accept";

    const actionText = isAccept ? "Accept" : "Decline";

    const actionColor = isAccept ? "#198754" : "#b00000";

    return res.status(200).send(`
        <!DOCTYPE html>
        <html>

        <head>
          <meta charset="UTF-8" />

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          <title>
            57th MP PEDICON 2026
          </title>
        </head>

        <body
          style="
            margin:0;
            padding:0;
            background:#f5f5f5;
            font-family:Arial,Helvetica,sans-serif;
          "
        >

          <div
            style="
              max-width:600px;
              margin:60px auto;
              background:#ffffff;
              padding:40px 30px;
              text-align:center;
              border-radius:10px;
              box-shadow:0 2px 10px rgba(0,0,0,0.08);
            "
          >

            <h1>
              57th MP PEDICON 2026
            </h1>

            <h2>
              ${actionText} Invitation
            </h2>

            <p>
              Dear Dr. ${invitation.name},
            </p>

            <p>
              You are about to
              <strong>
                ${actionText.toLowerCase()}
              </strong>
              the following invitation:
            </p>

            ${
              invitation.topic
                ? `
                  <p>
                    <strong>Topic:</strong>
                    ${invitation.topic}
                  </p>
                `
                : ""
            }

            ${
              invitation.workshopName
                ? `
                  <p>
                    <strong>Workshop:</strong>
                    ${invitation.workshopName}
                  </p>
                `
                : ""
            }

            ${
              invitation.date
                ? `
                  <p>
                    <strong>Date:</strong>
                    ${invitation.date}
                  </p>
                `
                : ""
            }

            ${
              invitation.time
                ? `
                  <p>
                    <strong>Time:</strong>
                    ${invitation.time}
                  </p>
                `
                : ""
            }

            <p style="margin-top:30px;">
              Please click the button below to confirm.
            </p>

            <form
  method="POST"
  action="/api/faculty-invitations/respond/${token}"
  style="margin-top:30px;"
>
  <input
    type="hidden"
    name="action"
    value="${action}"
  />

  <button
    type="submit"
    style="
      background:${actionColor};
      color:#ffffff;
      border:none;
      padding:14px 30px;
      border-radius:6px;
      font-size:16px;
      font-weight:bold;
      cursor:pointer;
    "
  >
    Confirm ${actionText}
  </button>
</form>

          </div>

        </body>

        </html>
      `);
  } catch (error) {
    console.error("showFacultyInvitationResponsePage error:", error);

    return res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <body style="font-family:Arial;text-align:center;padding:50px;">
          <h2>Something went wrong</h2>
          <p>Please try again later.</p>
        </body>
        </html>
      `);
  }
};

/**
 * ---------------------------------------------------------
 * SAVE FACULTY RESPONSE
 * ---------------------------------------------------------
 *
 * POST /respond/:token
 *
 * Body:
 *
 * {
 *   "action": "accept"
 * }
 *
 * OR
 *
 * {
 *   "action": "decline"
 * }
 */
export const respondToFacultyInvitation = async (req, res) => {
  try {
    const { token } = req.params;

    const action = req.body?.action || req.query?.action;

    // ---------------------------------------------------
    // VALIDATE
    // ---------------------------------------------------

    if (!token) {
      return res.status(400).send(`
          <!DOCTYPE html>
          <html>
          <body style="font-family:Arial;text-align:center;padding:50px;">
            <h2>Invalid invitation link</h2>
          </body>
          </html>
        `);
    }

    if (!["accept", "decline"].includes(action)) {
      return res.status(400).send(`
          <!DOCTYPE html>
          <html>
          <body style="font-family:Arial;text-align:center;padding:50px;">
            <h2>Invalid response</h2>
          </body>
          </html>
        `);
    }

    // ---------------------------------------------------
    // FIND BY HASHED TOKEN
    // ---------------------------------------------------

    const tokenHash = hashResponseToken(token);

    const invitation = await FacultyInvitation.findOne({
      responseTokenHash: tokenHash,
    });

    if (!invitation) {
      return res.status(404).send(`
          <!DOCTYPE html>
          <html>
          <body style="font-family:Arial;text-align:center;padding:50px;">
            <h2>Invitation not found</h2>
            <p>This invitation link is invalid.</p>
          </body>
          </html>
        `);
    }

    // ---------------------------------------------------
    // CHECK EXPIRY
    // ---------------------------------------------------

    if (
      invitation.responseTokenExpiresAt &&
      invitation.responseTokenExpiresAt < new Date()
    ) {
      return res.status(410).send(`
          <!DOCTYPE html>
          <html>
          <body style="font-family:Arial;text-align:center;padding:50px;">
            <h2>Invitation expired</h2>
            <p>This invitation response link has expired.</p>
          </body>
          </html>
        `);
    }

    // ---------------------------------------------------
    // PREVENT SECOND RESPONSE
    // ---------------------------------------------------

    if (invitation.responseStatus !== "PENDING") {
      return res.status(409).send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>57th MP PEDICON 2026</title>
          </head>

          <body
            style="
              font-family:Arial,Helvetica,sans-serif;
              text-align:center;
              padding:50px 20px;
            "
          >

            <h1>
              57th MP PEDICON 2026
            </h1>

            <h2>
              Response Already Submitted
            </h2>

            <p>
              You have already responded to this invitation.
            </p>

            <h3>
              ${invitation.responseStatus}
            </h3>

          </body>
          </html>
        `);
    }

    // ---------------------------------------------------
    // SET STATUS
    // ---------------------------------------------------

    const newStatus = action === "accept" ? "ACCEPTED" : "DECLINED";

    invitation.responseStatus = newStatus;

    invitation.respondedAt = new Date();

    await invitation.save();

    // ---------------------------------------------------
    // NOTIFY ADMIN / ORGANIZING COMMITTEE
    // ---------------------------------------------------

    await sendFacultyResponseNotification({
      status: newStatus,
      invitation,
    });

    // ---------------------------------------------------
    // SUCCESS PAGE
    // ---------------------------------------------------

    const statusText = newStatus === "ACCEPTED" ? "accepted" : "declined";

    return res.status(200).send(`
        <!DOCTYPE html>
        <html>

        <head>
          <meta charset="UTF-8" />

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          <title>
            57th MP PEDICON 2026
          </title>
        </head>

        <body
          style="
            margin:0;
            padding:0;
            background:#f5f5f5;
            font-family:Arial,Helvetica,sans-serif;
          "
        >

          <div
            style="
              max-width:600px;
              margin:60px auto;
              background:#ffffff;
              padding:40px 30px;
              text-align:center;
              border-radius:10px;
              box-shadow:0 2px 10px rgba(0,0,0,0.08);
            "
          >

            <h1>
              57th MP PEDICON 2026
            </h1>

            <h2>
              Response Submitted Successfully
            </h2>

            <p>
              Dear Dr. ${invitation.name},
            </p>

            <p>
              Your response has been recorded successfully.
            </p>

            <div
              style="
                margin:30px 0;
                padding:15px;
                background:#f5f5f5;
                border-radius:6px;
              "
            >

              <strong>
                ${statusText.toUpperCase()}
              </strong>

            </div>

            <p>
              Thank you.
            </p>

          </div>

        </body>

        </html>
      `);
  } catch (error) {
    console.error("respondToFacultyInvitation error:", error);

    return res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <body
          style="
            font-family:Arial;
            text-align:center;
            padding:50px;
          "
        >

          <h2>
            Something went wrong
          </h2>

          <p>
            Please try again later.
          </p>

        </body>
        </html>
      `);
  }
};
