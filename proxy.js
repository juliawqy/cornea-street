import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

// Load variables
dotenv.config();

// Start Server
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.json());

// Home Route
app.get('/', (req, res) => {
    res.sendFile("index.html", {root: "./public"});
})