export const FACULTY_TEMPLATE_ENV = {
  MP_WORKSHOP:
    "ZEPTO_FACULTY_MP_WORKSHOP_TEMPLATE_KEY",

  OUT_WORKSHOP:
    "ZEPTO_FACULTY_OUT_WORKSHOP_TEMPLATE_KEY",

  MP_SOLO_TALK:
    "ZEPTO_FACULTY_MP_SOLO_TALK_TEMPLATE_KEY",

  OUT_SOLO_TALK:
    "ZEPTO_FACULTY_OUT_SOLO_TALK_TEMPLATE_KEY",

  MP_PANELIST:
    "ZEPTO_FACULTY_MP_PANELIST_TEMPLATE_KEY",

  OUT_PANELIST:
    "ZEPTO_FACULTY_OUT_PANELIST_TEMPLATE_KEY",

  MP_MODERATOR:
    "ZEPTO_FACULTY_MP_MODERATOR_TEMPLATE_KEY",

  OUT_MODERATOR:
    "ZEPTO_FACULTY_OUT_MODERATOR_TEMPLATE_KEY",
};

export const getFacultyTemplateKey = (
  group,
  invitationType,
) => {
  const prefix =
    group === "MP" ? "MP" : "OUT";

  const key = `${prefix}_${invitationType}`;

  const envName = FACULTY_TEMPLATE_ENV[key];

  if (!envName) {
    throw new Error(
      `No ZeptoMail template mapping for ${key}`,
    );
  }

  const templateKey = process.env[envName];

  if (!templateKey) {
    throw new Error(
      `Missing environment variable: ${envName}`,
    );
  }

  return templateKey;
};