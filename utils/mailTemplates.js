export const approvalMail = (username, details) => ({
  subject: "Your entry has been approved!",
  text: `Hello ${username},\n\nYour request (${details}) has been approved and added to the current sheet.`,
});

export const rejectionMail = (username, details) => ({
  subject: "Your entry has been rejected.",
  text: `Hello ${username},\n\nUnfortunately, your request (${details}) has been rejected.`,
});
