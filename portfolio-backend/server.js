const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const { PutCommand, ScanCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require('./aws-config');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || "anika_secret_key_2026";

app.use(cors());
app.use(express.json());

// --- AUTH ---
app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const user = { userId: payload.sub, email: payload.email, name: payload.name, picture: payload.picture };
    await docClient.send(new PutCommand({ TableName: "Users", Item: user }));
    const sessionToken = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ user, sessionToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
});

// --- BOOKINGS ---
app.post('/api/bookings', async (req, res) => {
  const { userId, clientName, clientEmail, clientPhone, date, time, vision, questions } = req.body;
  
  const params = {
    TableName: "Bookings",
    Item: {
      bookingId: `book_${Date.now()}`,
      userId,
      clientName,
      clientEmail,
      clientPhone: clientPhone || "N/A",
      date,
      time,
      slot: `${date} at ${time}`, // Helper field for easy display
      vision: vision || "",
      questions: questions || "",
      status: "pending",
      createdAt: new Date().toISOString()
    }
  };
  try {
    await docClient.send(new PutCommand(params));
    res.status(201).json({ message: "Success" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/bookings/user/:userId', async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({
      TableName: "Bookings",
      FilterExpression: "userId = :uid",
      ExpressionAttributeValues: { ":uid": req.params.userId }
    }));
    res.json(Items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/bookings/admin', async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: "Bookings" }));
    res.json(Items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/bookings/:id', async (req, res) => {
  const { status } = req.body;
  try {
    await docClient.send(new UpdateCommand({
      TableName: "Bookings",
      Key: { bookingId: req.params.id },
      UpdateExpression: "set #s = :status",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: { ":status": status }
    }));
    res.json({ message: "Updated" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/bookings/:id', async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({ TableName: "Bookings", Key: { bookingId: req.params.id } }));
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- AVAILABILITY ---
app.post('/api/availability', async (req, res) => {
  try {
    await docClient.send(new PutCommand({
      TableName: "Availability",
      Item: { ...req.body, updatedAt: new Date().toISOString() }
    }));
    res.status(201).json({ message: "Updated" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/availability', async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: "Availability" }));
    res.json(Items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// REPLACE your current delete route with this:
app.delete('/api/availability/:date', async (req, res) => {
  try {
    const { date } = req.params;
    console.log("DELETE REQUEST RECEIVED FOR:", date);

    const params = {
      TableName: "Availability",
      Key: {
        "date": date // Ensure this matches your DynamoDB Partition Key name exactly
      }
    };

    await docClient.send(new DeleteCommand(params));
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));