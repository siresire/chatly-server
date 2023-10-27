const mongoose = require("mongoose");

// mango schema for friend request handlers

// name of the schema object
const requestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const FriendRequest = new mongoose.model("FriendRequest", requestSchema);
module.exports = FriendRequest;
