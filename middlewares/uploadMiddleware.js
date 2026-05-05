// middlewares/uploadMiddleware.js
import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../config/s3.js";

/**
 * =========================
 * File filter
 * =========================
 * - brochureUpload → PDF only
 * - image → allow all (image handling unchanged)
 */
const webinarFileFilter = (req, file, cb) => {
  if (file.fieldname === "brochureUpload") {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed for brochure upload"), false);
    }
  } else {
    cb(null, true);
  }
};

/**
 * =========================
 * Webinar uploader
 * =========================
 */
export const uploadWebinarFiles = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    contentDisposition: "inline",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const folder =
        file.fieldname === "brochureUpload"
          ? "webinar-brochures"
          : "webinars";

      const fileName = `${folder}/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),

  fileFilter: webinarFileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

/**
 * =========================
 * Existing exports (unchanged)
 * =========================
 */
export const uploadCourseImage = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) =>
      cb(null, `courses/${Date.now()}-${file.originalname}`),
  }),
});

export const uploadConferenceImage = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) =>
      cb(null, `conferences/${Date.now()}-${file.originalname}`),
  }),
});

export const uploadUSIProfileImage = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) =>
      cb(null, `usi-profile-pictures/${Date.now()}-${file.originalname}`),
  }),
});

export const uploadSpeakerProfileImage = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) =>
      cb(null, `speaker-profile-pictures/${Date.now()}-${file.originalname}`),
  }),
});


/**
 * =========================
 * User Registration Document (PDF, 2MB)
 * =========================
 */
export const uploadUserDocument = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    contentDisposition: "inline",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      cb(null, `user-documents/${Date.now()}-${file.originalname}`);
    },
  }),

  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },

  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});


export const uploadFlyerImage = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      cb(null, `flyers/${Date.now()}-${file.originalname}`);
    },
  }),

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },

  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});