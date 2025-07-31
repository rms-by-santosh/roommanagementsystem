export const approvalMail = (username, details) => ({
  subject: "Your entry has been approved!",
  text: `Hello ${username},\n\nYour request (${details}) has been approved and added to the current sheet.`,
  html: `
    <p>Hello <strong>${username}</strong>,</p>
    <p>Your request for <strong>${details}</strong> has been <span style="color: green;"><strong>approved</strong></span> and added to the current sheet.</p>
  `,
});

export const rejectionMail = (username, details) => ({
  subject: "Your entry has been rejected.",
  text: `Hello ${username},\n\nUnfortunately, your request (${details}) has been rejected.`,
  html: `
    <p>Hello <strong>${username}</strong>,</p>
    <p style="color: red;">Unfortunately, your request for <strong>${details}</strong> has been <strong>rejected</strong>.</p>
  `,
});
