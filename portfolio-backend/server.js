const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require('./aws-config');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || "anika_secret_key_2026"; // Default for local dev

app.use(cors());
app.use(express.json());

// --- AUTH ROUTE ---
app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    const user = {
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    };

    // Save/Update user in DynamoDB
    await docClient.send(new PutCommand({ TableName: "Users", Item: user }));

    // Create a Session Token for persistence
    const sessionToken = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ user, sessionToken });
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ message: "Invalid Google Token" });
  }
});

// --- BOOKING ROUTES ---
app.post('/api/bookings', async (req, res) => {
  const { 
    userId, clientName, clientPhone, clientEmail, 
    peopleCount, slot, vision, questions 
  } = req.body;

  const params = {
    TableName: "Bookings",
    Item: {
      bookingId: `book_${Date.now()}`,
      userId,
      clientName,
      clientPhone,
      clientEmail,
      peopleCount,
      slot,
      vision,
      questions,
      status: "pending",
      createdAt: new Date().toISOString()
    }
  };

  try {
    await docClient.send(new PutCommand(params));
    res.status(201).json({ message: "Success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));