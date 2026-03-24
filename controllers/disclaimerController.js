import Disclaimer from "../models/Disclaimer.js";

/* ======================================================
   CREATE Disclaimer (ONLY if not exists) (Admin)
====================================================== */
export const createDisclaimer = async (req, res) => {
  try {
    const { disclaimerName } = req.body;

    // Check existing disclaimer
    const existing = await Disclaimer.findOne();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Disclaimer already exists. You can only update or delete it.",
      });
    }

    const disclaimer = await Disclaimer.create({ disclaimerName });

    res.status(201).json({
      success: true,
      message: "Disclaimer created successfully",
      data: disclaimer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   GET Disclaimer (Single)
====================================================== */
export const getDisclaimer = async (req, res) => {
  try {
    const disclaimer = await Disclaimer.findOne();

    if (!disclaimer) {
      return res.status(404).json({
        success: false,
        message: "No disclaimer found",
      });
    }

    res.status(200).json({
      success: true,
      data: disclaimer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   UPDATE Disclaimer (Only if exists)
====================================================== */
export const updateDisclaimer = async (req, res) => {
  try {
    const { disclaimerName } = req.body;

    const disclaimer = await Disclaimer.findOne();

    if (!disclaimer) {
      return res.status(404).json({
        success: false,
        message: "No disclaimer found to update",
      });
    }

    disclaimer.disclaimerName = disclaimerName || disclaimer.disclaimerName;

    await disclaimer.save();

    res.status(200).json({
      success: true,
      message: "Disclaimer updated successfully",
      data: disclaimer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   DELETE Disclaimer (Only if exists)
====================================================== */
export const deleteDisclaimer = async (req, res) => {
  try {
    const disclaimer = await Disclaimer.findOne();

    if (!disclaimer) {
      return res.status(404).json({
        success: false,
        message: "No disclaimer found to delete",
      });
    }

    await disclaimer.deleteOne();

    res.status(200).json({
      success: true,
      message: "Disclaimer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};