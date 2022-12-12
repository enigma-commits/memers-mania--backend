import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectID,
            required: true,
            ref: "User",
        },
        imageUrl: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const postSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectID,
            required: true,
            ref: "User",
        },
        userName: {
            type: String,
            required: true,
        },
        userImage: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
        },
        image: {
            type: String,
        },
        upVote: {
            type: [mongoose.Schema.Types.ObjectID],
            required: true,
            default: 0,
        },
        downVote: {
            type: [mongoose.Schema.Types.ObjectID],
            required: true,
            default: 0,
        },
        comments: [commentSchema],
        numComments: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

const Post = mongoose.model("Post", postSchema);

export default Post;
