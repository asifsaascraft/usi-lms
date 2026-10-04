import Flyer from "../models/Flyer.js";

// =======================
// CREATE (ONLY ONE ALLOWED)
// =======================
export const createFlyer = async (req, res) => {
  try {
    const existing = await Flyer.findOne();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Flyer already exists. You can only update it.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Flyer image is required",
      });
    }

    const flyer = await Flyer.create({
      flyerImage: req.file.location,
      flyerType: req.body.flyerType,
    });

    return res.status(201).json({
      success: true,
      data: flyer,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create flyer",
    });
  }
};

// =======================
// GET (ONLY ONE)
// =======================
export const getFlyer = async (req, res) => {
  try {
    const flyer = await Flyer.findOne();

    return res.status(200).json({
      success: true,
      data: flyer || null,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch flyer",
    });
  }
};

// =======================
// UPDATE
// =======================
export const updateFlyer = async (req, res) => {
  try {
    const flyer = await Flyer.findOne();

    if (!flyer) {
      return res.status(404).json({
        success: false,
        message: "Flyer not found",
      });
    }

    if (req.file) {
      flyer.flyerImage = req.file.location;
    }

    if (req.body.flyerType) {
      flyer.flyerType = req.body.flyerType;
    }

    await flyer.save();

    return res.status(200).json({
      success: true,
      data: flyer,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update flyer",
    });
  }
};

// =======================
// DELETE
// =======================
export const deleteFlyer = async (req, res) => {
  try {
    const flyer = await Flyer.findOne();

    if (!flyer) {
      return res.status(404).json({
        success: false,
        message: "Flyer not found",
      });
    }

    await flyer.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Flyer deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete flyer",
    });
  }
};