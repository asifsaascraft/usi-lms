import axios from "axios";

const sendOtpSMS = async (mobile, otp) => {
  try {
    const message = `Login OTP for USI LMS is ${otp}. Do not share this OTP to anyone for security reasons. - SaaScraft Studio`;

    const params = {
      APIKey: process.env.SMS_GATEWAY_API_KEY,
      senderid: process.env.SMS_GATEWAY_SENDER_ID, 
      channel: "2",
      DCS: "0",
      flashsms: "0",
      number: mobile,
      text: message,
      route: process.env.SMS_GATEWAY_ROUTE,
      EntityId: process.env.SMS_GATEWAY_ENTITY_ID,
      dlttemplateid: process.env.SMS_GATEWAY_TEMPLATE_ID,
    };

    const response = await axios.get(process.env.SMS_GATEWAY_URL, { params });
    return response.data;
  } catch (error) {
    console.error("SMS OTP Error:", error.response?.data || error.message);
    throw error;
  }
};

export default sendOtpSMS;
