// controllers/webinarController.js
import Webinar from "../models/Webinar.js";
import Disclaimer from "../models/Disclaimer.js";

// =======================
// Get all webinars (public)
// =======================
export const getWebinars = async (req, res) => {
  try {
    const webinars = await Webinar.find().sort({ createdAt: -1 });

    const disclaimerDoc = await Disclaimer.findOne();

    const data = webinars.map((w) => {
      const obj = w.toObject({ virtuals: true });

      if (obj.disclaimer && disclaimerDoc) {
        obj.disclaimerName = disclaimerDoc.disclaimerName;
      }

      return obj;
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch webinars",
      error: error.message,
    });
  }
};

// =======================
// Get all active webinars (public)
// =======================
export const getActiveWebinars = async (req, res) => {
  try {
    const webinars = await Webinar.find({ status: "Active" }).sort({
      createdAt: -1,
    });

    const disclaimerDoc = await Disclaimer.findOne();

    const data = webinars.map((w) => {
      const obj = w.toObject({ virtuals: true });

      if (obj.disclaimer && disclaimerDoc) {
        obj.disclaimerName = disclaimerDoc.disclaimerName;
      }

      return obj;
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch active webinars",
      error: error.message,
    });
  }
};

// =======================
// Get Upcoming + Live Webinars (Active only) - Public
// =======================
export const getUpcomingWebinars = async (req, res) => {
  try {
    const webinars = await Webinar.find({ status: "Active" }).sort({
      createdAt: -1,
    });

    const disclaimerDoc = await Disclaimer.findOne();

    const result = webinars
      .map((w) => {
        const obj = w.toObject({ virtuals: true });

        if (obj.disclaimer && disclaimerDoc) {
          obj.disclaimerName = disclaimerDoc.disclaimerName;
        }

        return obj;
      })
      .filter(
        (w) => w.dynamicStatus === "Upcoming" || w.dynamicStatus === "Live"
      );

    res.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch webinars",
      error: error.message,
    });
  }
};

// =======================
// Get Active Webinar by ID (public)
// =======================
export const getActiveWebinarById = async (req, res) => {
  try {
    const { id } = req.params;

    const webinar = await Webinar.findOne({ _id: id, status: "Active" });

    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: "Active webinar not found",
      });
    }

    const disclaimerDoc = await Disclaimer.findOne();

    const obj = webinar.toObject({ virtuals: true });

    if (obj.disclaimer && disclaimerDoc) {
      obj.disclaimerName = disclaimerDoc.disclaimerName;
    }

    res.json({
      success: true,
      data: obj,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch active webinar",
      error: error.message,
    });
  }
};

// =======================
// Get Active USI Webinars
// =======================
export const getActiveUSIWebinars = async (req, res) => {
  try {
    const webinars = await Webinar.find({
      webinarType: "USI Webinar",
      status: "Active",
    }).sort({ createdAt: -1 });

    const disclaimerDoc = await Disclaimer.findOne();

    const data = webinars.map((w) => {
      const obj = w.toObject({ virtuals: true });

      if (obj.disclaimer && disclaimerDoc) {
        obj.disclaimerName = disclaimerDoc.disclaimerName;
      }

      return obj;
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch USI Webinars",
      error: error.message,
    });
  }
};

// =======================
// Get Active Smart Learning Program Webinars
// =======================
export const getActiveSmartLearningWebinars = async (req, res) => {
  try {
    const webinars = await Webinar.find({
      webinarType: "Smart Learning Program",
      status: "Active",
    }).sort({ createdAt: -1 });

    const disclaimerDoc = await Disclaimer.findOne();

    const data = webinars.map((w) => {
      const obj = w.toObject({ virtuals: true });

      if (obj.disclaimer && disclaimerDoc) {
        obj.disclaimerName = disclaimerDoc.disclaimerName;
      }

      return obj;
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Smart Learning webinars",
      error: error.message,
    });
  }
};

// =======================
// Get Active Live Operative Workshops
// =======================
export const getActiveLiveWorkshops = async (req, res) => {
  try {
    const webinars = await Webinar.find({
      webinarType: "Live Operative Workshops",
      status: "Active",
    }).sort({ createdAt: -1 });

    const disclaimerDoc = await Disclaimer.findOne();

    const data = webinars.map((w) => {
      const obj = w.toObject({ virtuals: true });

      if (obj.disclaimer && disclaimerDoc) {
        obj.disclaimerName = disclaimerDoc.disclaimerName;
      }

      return obj;
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Live Workshops",
      error: error.message,
    });
  }
};

// =======================
// Get single webinar (public)
// =======================
export const getWebinarById = async (req, res) => {
  try {
    const { id } = req.params;
    const webinar = await Webinar.findById(id);

    if (!webinar) {
      return res
        .status(404)
        .json({ success: false, message: "Webinar not found" });
    }

    const disclaimerDoc = await Disclaimer.findOne();

    const obj = webinar.toObject({ virtuals: true });

    if (obj.disclaimer && disclaimerDoc) {
      obj.disclaimerName = disclaimerDoc.disclaimerName;
    }

    res.json({
      success: true,
      data: obj,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch webinar",
      error: error.message,
    });
  }
};

// =======================
// Create webinar (admin only)
// =======================
export const createWebinar = async (req, res) => {
  try {
    if (!req.files?.image?.[0]) {
      return res.status(400).json({
        success: false,
        message: "Webinar image is required",
      });
    }

    const webinarData = {
      ...req.body,
      image: req.files.image[0].location,
      disclaimer: req.body.disclaimer === "true" || req.body.disclaimer === true,
    };

    if (req.files?.brochureUpload?.[0]) {
      webinarData.brochureUpload =
        req.files.brochureUpload[0].location;
    }

    const newWebinar = await Webinar.create(webinarData);

    res.status(201).json({
      success: true,
      data: newWebinar.toObject({ virtuals: true }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// =======================
// Update webinar (admin only)
// =======================
export const updateWebinar = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    if (req.files?.image?.[0]) {
      updatedData.image = req.files.image[0].location;
    }
    
    if (req.body.disclaimer !== undefined) {
      updatedData.disclaimer =
        req.body.disclaimer === "true" || req.body.disclaimer === true;
    }

    if (req.files?.brochureUpload?.[0]) {
      updatedData.brochureUpload =
        req.files.brochureUpload[0].location;
    }

    const updatedWebinar = await Webinar.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedWebinar) {
      return res.status(404).json({
        success: false,
        message: "Webinar not found",
      });
    }

    res.json({
      success: true,
      data: updatedWebinar.toObject({ virtuals: true }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// =======================
// Delete webinar (admin only)
// =======================
export const deleteWebinar = async (req, res) => {
  try {
    const { id } = req.params;

    const webinar = await Webinar.findByIdAndDelete(id);

    if (!webinar) {
      return res
        .status(404)
        .json({ success: false, message: "Webinar not found" });
    }

    res.json({ success: true, message: "Webinar deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete webinar",
      error: error.message,
    });
  }
};
