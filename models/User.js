import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    prefix: {
      type: String,
      required: [true, "Prefix is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile is required"],
      match: [/^\d{10}$/, "Mobile number must be 10 digits"],
      trim: true,
      unique: true,
    },
    qualification: {
      type: String,
      trim: true,
    },
    affiliation: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      //required: [true, "Country is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    uploadDocument: {
      type: String,
      //required: [true, "Document is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved"],
      default: "Pending",
    },
    membershipNumber: {
      type: String,
    },
    password: {
      type: String,
    },
    // OTP login fields
    loginOtp: {
      type: String,
    },

    loginOtpExpires: {
      type: Date, // OTP valid till (10 minutes)
    },

    loginOtpResendAfter: {
      type: Date, // resend allowed after (2 minutes)
    },
    //  For forgot-password/reset-password
    passwordResetToken: {
      type: String,
      trim: true,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
    // Additional fields in user profile
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);


//  Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//  Compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
