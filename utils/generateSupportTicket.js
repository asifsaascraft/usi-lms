export const generateSupportTicketNumber = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ticket = "";

  for (let i = 0; i < 8; i++) {
    ticket += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return ticket;
};