const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const { Server } = require("socket.io"); // Add this
// Add this
// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods

process.on("uncaughtException", (err) => {
  console.log(err);
  console.log("UNCAUGHT Exception! Shutting down ...");
  process.exit(1); // Exit Code 1 indicates that a container shut down, either because of an application failure.
});

// This is the entry point of the application
const app = require("./app");

// 
const http = require("http");
const server = http.createServer(app);

const User = require("./models/user");



// Implementation of the sockets module
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    // useNewUrlParser: true, // The underlying MongoDB driver has deprecated their current connection string parser. Because this is a major change, they added the useNewUrlParser flag to allow users to fall back to the old parser if they find a bug in the new parser.
    // useCreateIndex: true, // Again previously MongoDB used an ensureIndex function call to ensure that Indexes exist and, if they didn't, to create one. This too was deprecated in favour of createIndex . the useCreateIndex option ensures that you are using the new function calls.
    // useFindAndModify: false, // findAndModify is deprecated. Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead.
    // useUnifiedTopology: true, // Set to true to opt in to using the MongoDB driver's new connection management engine. You should set this option to true , except for the unlikely case that it prevents you from maintaining a stable connection.
  })
  .then((con) => {
    console.log("DB Connection successful");
  });

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});

io.on("connection", async (socket) => {
  console.log(JSON.stringify(socket.handshake.query))
  console.log(socket)
  const user_id = socket.handshake.query["user_id"];
  const socket_id = socket.id;

  console.log("User connected  ${socket_id}");


  if (Boolean(user_id)) {
    User.findByIdAndUpdate(user_id, { socket_id, })
  }
  // wrting my own socketes even listner 
  socket.on("friend_request", async (data) => {
    console.log(data.to);

    // data => { to, from}

    const to_user = await User.findById(data.to).select("socket_id");

    const from_user = await User.findById(data.to).select("socket_id");


    //  Creating a friend request model

    await FriendRequestModel.create({
      sender: data.from,
      recipient: data.to
    })

    // emit event => new_friend request

    //  Creating a friend request 
    io.to(to_user.socket_id).emit("friend_request", {
      message: "New friend request Received ",
    });
    // emit event => new_friend request sent 

    io.to(from_user.socket_id).emit("friend_request_sent", {
      message: "Request sent successfully!",
    });
  });


  socket.on("accepted_request", async (data) => {
    console.log(data);

    const request_doc = await FriendRequest.findById(data.recipient_id);
    console.log(request_doc);

    // unique request identifier

    const sender = await FriendById(request_doc.sender);
    const receiver = await FriendById(request_doc.recipient);

    sender.friends.push(request_doc.recipient);
    receiver.friends.push(request_doc.sender);


    await receiver.save({new: true, validateModifiedOnly: true});
    await sender.save({new: true, validateModifiedOnly: true});

    await FriendRequest.findByIdAndDelete(dara.request_id);

    io.to(sender.socket_id).emit("accepted_request", {
      message: "Request accepted successfully!",
    });
    io.to(receiver.socket_id).emit("accepted_request", {
      message: "Request accepted successfully!",
    });
  });


  socket.on("end", function () {
    console.log("Closing connection");
    socket.disconnect(0);
  })


});


process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  server.close(() => {
    process.exit(1); //  Exit Code 1 indicates that a container shut down, either because of an application failure.
  });
});