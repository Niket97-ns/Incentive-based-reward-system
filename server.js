const express = require("express");
const config = require("config");
const path = require("path");
const mongoose = require("mongoose");

// Require routes
const referralCode = require("./routes/referralCode");
const users = require("./routes/users");
const referralTransaction = require("./routes/referralTransaction");
const signIn = require("./routes/signIn");

// Config mongoose for URL parser
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useCreateIndex", true);

// Initialize the app
const app = express();

// BodyParser MiddleWare
app.use(express.json());

// Config MongoURI
const mongoURI = config.get("mongoURI");

// Connect Mongo Using Mongoose
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Use routes
app.use("/referralCode", referralCode);
app.use("/users", users);
app.use("/referralTransactions", referralTransaction);
app.use("/signIn", signIn);

// Set PORT and start server

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
