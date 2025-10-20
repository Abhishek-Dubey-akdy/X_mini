import mongoose from "mongoose";

const User = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
})

export const UserDataset = mongoose.model("UserDatasets", User);
