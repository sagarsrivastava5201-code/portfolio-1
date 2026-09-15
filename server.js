require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const mongoose = require("mongoose");
const cors = require("cors");

const Message = require("./models/Message");

const app = express();
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));


app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log("MongoDB Error:", err);
    });

function requireAdmin(req, res, next) {
  if (req.session.isAdmin) {
    return next();
  }

  res.status(401).json({
    message: "Unauthorized"
  });
}
// ===============================
// SAVE CONTACT MESSAGE
// ===============================

app.post("/api/messages", async (req, res) => {

    try {

        const { name, email, message } = req.body;

        const newMessage = new Message({
            name,
            email,
            message
        });

        await newMessage.save();

        res.status(201).json({
            success: true,
            message: "Message sent successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to send message"
        });

    }

});

// ===============================
// GET ALL CONTACT MESSAGES
// ===============================

app.get("/api/messages",requireAdmin,  async (req, res) => {

    try {

        const messages = await Message
            .find()
            .sort({ createdAt: -1 });

        res.json(messages);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to fetch messages"
        });

    }

});

// ===============================
// MARK MESSAGE AS READ
// ===============================

app.put("/api/messages/:id/read", requireAdmin, async (req, res) => {

    try {

        await Message.findByIdAndUpdate(
            req.params.id,
            { isRead: true }
        );

        res.json({
            success: true
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false
        });

    }

});

// ===============================
// DELETE MESSAGE
// ===============================

app.delete("/api/messages/:id", requireAdmin, async (req, res) => {

    try {

        await Message.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Message deleted"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete message"
        });

    }

});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    req.session.isAdmin = true;

    return res.json({
      success: true
    });
  }

  res.status(401).json({
    success: false,
    message: "Invalid email or password"
  });
});


// Admin page protection
app.get("/admin.html", requireAdmin, (req, res) => {
  res.sendFile(__dirname + "/admin.html");
});



// ===============================
// ADMIN LOGOUT
// ===============================

app.post("/api/logout", (req, res) => {

    req.session.destroy((err) => {

        if (err) {
            return res.status(500).json({
                success: false
            });
        }

        res.clearCookie("connect.sid");

        res.json({
            success: true
        });

    });

});

// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});