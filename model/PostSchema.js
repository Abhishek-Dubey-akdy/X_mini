import mongoose from "mongoose";

const TweetSchema = new mongoose.Schema({
    username: String,
    post: String,
    date: String,
    createdAt: Date, 
})

export const Tweets = mongoose.model("tweets", TweetSchema);
