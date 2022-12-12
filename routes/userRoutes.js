import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import { OAuth2Client } from "google-auth-library";
import mongoose from "mongoose";
import jwt, { decode } from "jsonwebtoken";
const router = express.Router();

const Post = mongoose.model("Post");
const User = mongoose.model("User");

const client = new OAuth2Client(process.env.CLIENT_ID);

// Verify Token
const verifyToken = (req, res, next) => {
    // Get auth header value.
    const bearerHeader = req.headers["authorization"];

    // Check if bearer  is undefined.
    if (typeof bearerHeader !== "undefined") {
        // Split at the space.
        const bearer = bearerHeader.split(" ");
        // Get token from the array.
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
};

router.get("/", (req, res) => {
    res.send("hello from userRoutes");
});

// Store the information of Users.
// async function upsert(item) {
//     // Check if the item is already there in the users array.
// }

// Handle login.
router.post("/google-login", async (req, res) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const { name, email, picture, sub } = ticket.getPayload();
    const jwtToken = jwt.sign(
        { name, email, picture, sub },
        process.env.SECRET_KEY,
        {
            expiresIn: "1h",
        },
    );
    // upsert({ name, email, picture, sub, jwtToken });
    const foundUser = await User.findOne({ email: email });

    if (foundUser) {
        const updateUser = await User.findOneAndUpdate(
            { _id: foundUser._id },
            { jwtToken: jwtToken },
        );
        res.status(200).send({ user: updateUser });
    } else {
        const newUser = new User({
            name,
            email,
            imageUrl: picture,
            sub,
            jwtToken,
        });
        const savedUser = await newUser.save();
        res.status(200).send({ user: savedUser });
    }
});

// Verify the use token to be valid.
router.post("/verify", verifyToken, (req, res) => {
    const bearerHeader = req.headers["authorization"];
    const bearer = bearerHeader.split(" ");
    // Get token from the array.
    const token = bearer[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(401);
            res.send({ Message: "Invalid User Token" });
        } else {
            res.send(decoded);
        }
    });
});

export default router;
