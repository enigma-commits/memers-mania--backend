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
    },
    {
        timestamps: true,
    },
);
