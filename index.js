const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const FormData = require("./model/adminModel");
const upload = require("./utils/upload");
const sendEmail = require("./utils/sendMail");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

app.get("/", (req, res) => {
  res.send("API is working...");
});

// Form Submit Route
app.post("/submit-form", upload.single("cv"), async (req, res) => {
  try {
    const { firstName, lastName, email, phone, title, company, reason } = req.body;

    // Save form details
    const formData = new FormData({ firstName, lastName, email, phone, title, company, reason });
    await formData.save();

    // Email content
    const message = `
New Form Submission:
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Title: ${title}
Company: ${company}
Reason: ${reason}
    `;

    // File as attachment
    const attachments = req.file
      ? [{ filename: req.file.originalname, content: req.file.buffer }]
      : [];

    // Send email
    await sendEmail(process.env.ADMIN_EMAIL, "New Form Submission", message, attachments);

    res.json({ success: true, message: "Form submitted & email sent successfully ✅" });
  } catch (error) {
    console.error("❌ Error in form submission:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
