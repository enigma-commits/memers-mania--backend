import express from "express";
import connectDB from "./config/connectDB.js";
import dotenv from "dotenv";
import colors from "colors";
import { OAuth2Client } from "google-auth-library";
import mongoose from "mongoose";
import cors from 'cors';
import path from 'path'
import "./models/userModel.js";
import "./models/postModel.js";

import { fileURLToPath } from 'url';
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import bodyParser from "body-parser";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// Home page
app.use(express.static(path.join(__dirname, './build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './build/index.html'))
})
app.get("/", (req, res) => {
    res.send("Api is running......");
});

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
    console.log(
        `Server running in ${process.env.NODE_ENV} mode at port ${PORT}`.yellow
            .bold,
    );
});
