import express from "express";
import mongoose from "mongoose";

const router = express.Router();

const Post = mongoose.model("Post");
const User = mongoose.model("User");
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

// Request for posts from all the users.
router.get("/", verifyToken, async (req, res) => {
    try {
        const data = await Post.find();
        res.status(200).send(data);
    } catch (err) {
        res.send(err);
    }
});
// Create the posts from the users.
router.post("/create", verifyToken, async (req, res) => {
    const data = req.body;
    if (data.image) {
        data.image = data.image.replace(
            "upload/",
            "upload/w_498,h_498,c_scale/",
        );
    }
    // console.log(data.image);
    const post = new Post(data);
    const savedPost = await post.save();
    res.status(200).send({ Message: `Successfully Posted`, post: data });
});

// Request for comments.
router.get("/comments/:id", verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Post.find({ _id: id });
        // console.log(user[0]);
        res.status(200).send(user[0]);
    } catch (err) {
        res.send(err);
    }
});
// Post the comments.
router.post("/comments/:id", verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.findOneAndUpdate(
            {
                _id: id,
            },
            { comments: req.body.comments },
            { new: true },
        );
        // console.log("after this");
        // console.log(req.body);
        // console.log(post.comments);
        res.status(200).send(post.comments);
    } catch (err) {
        res.send(err);
    }
});
// Upvote the post.
router.post("/upvote/:id", verifyToken, async (req, res) => {
    try {
        console.log("UPVOTE", req.params.id)
        const id = req.params.id;
        const userId = req.body.userId;
        const post = await Post.find({ _id: id });
        let upVote = post[0].upVote.filter((value) => {
            return value != userId;
        });
        upVote.push(userId);
        const downVote = post[0].downVote.filter((value) => {
            return value != userId;
        });
        const update = await Post.findOneAndUpdate(
            {
                _id: id,
            },
            {
                upVote: upVote,
                downVote: downVote,
            },
            { new: true },
        );
        // res.send("This is the response you get");
        res.status(200).send({
            upVote: upVote.length,
            downVote: downVote.length,
        });
    } catch (err) {
        res.status(500).send(err);
    }
});
// Downvote the Post.
router.post("/downvote/:id", verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.body.userId;
        const post = await Post.find({ _id: id });
        let downVote = post[0].downVote.filter((value) => {
            return value != userId;
        });
        downVote.push(userId);
        const upVote = post[0].upVote.filter((value) => {
            return value != userId;
        });
        const update = await Post.findOneAndUpdate(
            {
                _id: id,
            },
            {
                upVote: upVote,
                downVote: downVote,
            },
            { new: true },
        );
        // console.log(update);
        res.status(200).send({
            upVote: upVote.length,
            downVote: downVote.length,
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Let the user comment .
router.get("/comment", verifyToken, (req, res) => {
    const bearerHeader = req.headers["authorization"];
    const bearer = bearerHeader.split(" ");
    // Get token from the array.
    const token = bearer[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(401);
            res.send({ Message: "Invalid User Token" });
        } else {
            res.send(`Hello from the comments ${decoded.name}`);
        }
    });
});
export default router;
