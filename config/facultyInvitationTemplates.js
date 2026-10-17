export const FACULTY_TEMPLATE_ENV = {
  // -----------------------------------------
  // MP - 4 templates
  // -----------------------------------------

  MP_WORKSHOP: "ZEPTO_FACULTY_MP_WORKSHOP_TEMPLATE_KEY",

  MP_SOLO_TALK: "ZEPTO_FACULTY_MP_SOLO_TALK_TEMPLATE_KEY",

  MP_PANELIST: "ZEPTO_FACULTY_MP_PANELIST_TEMPLATE_KEY",

  MP_MODERATOR: "ZEPTO_FACULTY_MP_MODERATOR_TEMPLATE_KEY",

  // -----------------------------------------
  // OUT OF MP - 4 templates
  // -----------------------------------------

  OUT_WORKSHOP: "ZEPTO_FACULTY_OUT_WORKSHOP_TEMPLATE_KEY",

  OUT_SOLO_TALK: "ZEPTO_FACULTY_OUT_SOLO_TALK_TEMPLATE_KEY",

  OUT_PANELIST: "ZEPTO_FACULTY_OUT_PANELIST_TEMPLATE_KEY",

  OUT_MODERATOR: "ZEPTO_FACULTY_OUT_MODERATOR_TEMPLATE_KEY",

  // -----------------------------------------
  // NCD - 5 templates
  // -----------------------------------------

  NCD_SOLO_TALK: "ZEPTO_FACULTY_NCD_SOLO_TALK_TEMPLATE_KEY",

  NCD_SOLO_TALK_REIMBURSEMENT:
    "ZEPTO_FACULTY_NCD_SOLO_TALK_REIMBURSEMENT_TEMPLATE_KEY",

  NCD_SOLO_TALK_ALL_COMPLIMENTARY:
    "ZEPTO_FACULTY_NCD_SOLO_TALK_ALL_COMPLIMENTARY_TEMPLATE_KEY",

  NCD_PANELIST: "ZEPTO_FACULTY_NCD_PANELIST_TEMPLATE_KEY",

  NCD_PANELIST_REIMBURSEMENT:
    "ZEPTO_FACULTY_NCD_PANELIST_REIMBURSEMENT_TEMPLATE_KEY",

  NCD_PANELIST_ALL_COMPLIMENTARY:
    "ZEPTO_FACULTY_NCD_PANELIST_ALL_COMPLIMENTARY_TEMPLATE_KEY",

  NCD_MODERATOR: "ZEPTO_FACULTY_NCD_MODERATOR_TEMPLATE_KEY",

  NCD_MODERATOR_REIMBURSEMENT:
    "ZEPTO_FACULTY_NCD_MODERATOR_REIMBURSEMENT_TEMPLATE_KEY",
};

export const getFacultyTemplateKey = (group, invitationType) => {
  const groupPrefixMap = {
    MP: "MP",
    OUT_OF_MP: "OUT",
    NCD: "NCD",
  };

  const prefix = groupPrefixMap[group];

  if (!prefix) {
    throw new Error(`Invalid faculty invitation group: ${group}`);
  }

  const key = `${prefix}_${invitationType}`;

  const envName = FACULTY_TEMPLATE_ENV[key];

  if (!envName) {
    throw new Error(`No ZeptoMail template mapping for ${key}`);
  }

  const templateKey = process.env[envName];

  if (!templateKey) {
    throw new Error(`Missing environment variable: ${envName}`);
  }

  return templateKey;
};
