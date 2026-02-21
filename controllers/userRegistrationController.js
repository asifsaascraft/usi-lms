import CourseRegistration from "../models/CourseRegistration.js";
import WebinarRegistration from "../models/WebinarRegistration.js";
import ConferenceRegistration from "../models/ConferenceRegistration.js";
import User from "../models/User.js";

export const getMyAllRegistrations = async (req, res) => {
  try {
    const userId = req.user._id;

    // ------------------------------------
    // Validate user
    // ------------------------------------
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
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
    // Fetch conference registrations
    // ------------------------------------
    const conferenceRegs = await ConferenceRegistration.find({ userId })
      .populate("conferenceId")
      .sort({ createdAt: -1 });

    // ------------------------------------
    // Normalize courses
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

    // ------------------------------------
    // Normalize webinars
    // ------------------------------------
    const webinars = webinarRegs.map((x) => ({
      registrationId: x._id,
      type: "webinar",
      details: x.webinarId,
      registeredOn: x.createdAt,
      email: x.email,
      mobile: x.mobile,
      membershipNumber: x.membershipNumber,
      attended: x.attended,
      attendedAt: x.attendedAt,
    }));

    // ------------------------------------
    // Normalize conferences
    // ------------------------------------
    const conferences = conferenceRegs.map((x) => ({
      registrationId: x._id,
      type: "conference",
      details: x.conferenceId,
      registeredOn: x.createdAt,
      email: x.email,
      mobile: x.mobile,
      membershipNumber: x.membershipNumber,
    }));

    // ------------------------------------
    // Merge + sort by latest registration
    // ------------------------------------
    const mergedRegistrations = [
      ...courses,
      ...webinars,
      ...conferences,
    ].sort(
      (a, b) => new Date(b.registeredOn) - new Date(a.registeredOn)
    );

    // ------------------------------------
    // Final response
    // ------------------------------------
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
      conferencesCount: conferences.length,
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