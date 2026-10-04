import crypto from "crypto";

/**
 * Generate a secure random response token.
 */
export const generateResponseToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Hash the response token before storing it in MongoDB.
 */
export const hashResponseToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};