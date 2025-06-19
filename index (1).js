const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve index.html on GET /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Send Email Route
app.post("/send-email", async (req, res) => {
  const { receiver_email, subject, body_text } = req.body;

  try {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"Replit Mailer" <no-reply@example.com>',
      to: receiver_email,
      subject,
      text: body_text,
    });

    res.json({
      message: "Email sent!",
      preview: nodemailer.getTestMessageUrl(info),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});



