import CourseRegistration from "../models/CourseRegistration.js";
import WebinarRegistration from "../models/WebinarRegistration.js";
import User from "../models/User.js";

export const getMyAllRegistrations = async (req, res) => {
  try {
    const userId = req.user._id;

    // ------------------------------------
    // Validate user
    // ------------------------------------
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ------------------------------------
    // Fetch course registrations
    // ------------------------------------
    const courseRegs = await CourseRegistration.find({ userId })
      .populate("courseId")
      .sort({ createdAt: -1 });

    // ------------------------------------
    // Fetch webinar registrations
    // ------------------------------------
    const webinarRegs = await WebinarRegistration.find({ userId })
      .populate("webinarId")
      .sort({ createdAt: -1 });

    // ------------------------------------
    // Normalize response
    // ------------------------------------
    const courses = courseRegs.map((x) => ({
      registrationId: x._id,
      type: "course",
      details: x.courseId,
      registeredOn: x.createdAt,
      email: x.email,
      mobile: x.mobile,
      membershipNumber: x.membershipNumber,
    }));

    const webinars = webinarRegs.map((x) => ({
      registrationId: x._id,
      type: "webinar",
      details: x.webinarId,
      registeredOn: x.createdAt,
      email: x.email,
      mobile: x.mobile,
      membershipNumber: x.membershipNumber,
    }));

    // ------------------------------------
    // Merge + sort by latest registration
    // ------------------------------------
    const mergedRegistrations = [...courses, ...webinars].sort(
      (a, b) => new Date(b.registeredOn) - new Date(a.registeredOn)
    );

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      total: mergedRegistrations.length,
      coursesCount: courses.length,
      webinarsCount: webinars.length,
      data: mergedRegistrations,
    });
  } catch (error) {
    console.error("Get merged registrations error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch registrations",
      error: error.message,
    });
  }
};
