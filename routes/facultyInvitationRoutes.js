import express from "express";

import {
  createFacultyInvitation,
  getAllFacultyInvitations,
  getFacultyInvitationById,
  updateFacultyInvitation,
  deleteFacultyInvitation,
  sendSingleFacultyInvitationEmail,
  sendBulkFacultyInvitationEmails,
  showFacultyInvitationResponsePage,
  respondToFacultyInvitation,
} from "../controllers/facultyInvitationController.js";

const router = express.Router();

// ---------------------------------------------------------
// CREATE
// ---------------------------------------------------------

router.post(
  "/",
  createFacultyInvitation,
);

// ---------------------------------------------------------
// BULK EMAIL
// ---------------------------------------------------------

router.post(
  "/send-bulk-email",
  sendBulkFacultyInvitationEmails,
);

// ---------------------------------------------------------
// FACULTY RESPONSE
// ---------------------------------------------------------
//
// IMPORTANT:
// These routes MUST come before /:id
//
// GET  -> shows confirmation page
// POST -> actually saves ACCEPTED / DECLINED
//

router.get(
  "/respond/:token",
  showFacultyInvitationResponsePage,
);

router.post(
  "/respond/:token",
  respondToFacultyInvitation,
);

// ---------------------------------------------------------
// GET ALL
// ---------------------------------------------------------

router.get(
  "/",
  getAllFacultyInvitations,
);

// ---------------------------------------------------------
// GET BY ID
// ---------------------------------------------------------

router.get(
  "/:id",
  getFacultyInvitationById,
);

// ---------------------------------------------------------
// UPDATE
// ---------------------------------------------------------

router.put(
  "/:id",
  updateFacultyInvitation,
);

// ---------------------------------------------------------
// DELETE
// ---------------------------------------------------------

router.delete(
  "/:id",
  deleteFacultyInvitation,
);

// ---------------------------------------------------------
// SEND SINGLE EMAIL
// ---------------------------------------------------------

router.post(
  "/:id/send-email",
  sendSingleFacultyInvitationEmail,
);

export default router;