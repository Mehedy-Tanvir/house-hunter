const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const port = process.env.PORT || 3000;
const connectDB = require("./db/connectDB");
const User = require("./models/User");
const Booking = require("./models/Booking");

// middlewares
app.use(express.json());
app.use(
  cors({
    origin: ["https://polite-cobbler-dbd87a.netlify.app"],
    credentials: true,
  })
);
app.use(cookieParser());

// my middlewares
// verify admin
const verifyAdmin = async (req, res, next) => {
  const email = req.user.email;
  const query = { email: email };
  const user = await User.findOne(query);
  const isAdmin = user?.role === "Admin";
  if (!isAdmin) {
    return res.status(403).send({ message: "forbidden access" });
  }
  next();
};
// verify tour guide
const verifyTourGuide = async (req, res, next) => {
  const email = req.user.email;
  const query = { email: email };
  const user = await User.findOne(query);
  const isTourGuide = user?.role === "Tour Guide";
  if (!isTourGuide) {
    return res.status(403).send({ message: "forbidden access" });
  }
  next();
};

// auth middlewares
const verifyToken = async (req, res, next) => {
  const token = req?.cookies?.token;

  if (!token) {
    return res.status(401).send({ message: "Unauthorized Access" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.user = decoded;
    next();
  });
};

const main = async () => {
  await connectDB();

  // auth related api
  app.post("/jwt", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Assuming you have a User model and a findOne method to find a user by email
      const user = await User.findOne({ email });

      if (!user) {
        // User with the provided email not found
        return res
          .status(401)
          .send({ success: false, message: "Invalid credentials" });
      }

      // Check if the provided password matches the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        // Password doesn't match
        return res
          .status(401)
          .send({ success: false, message: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          email: user.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10h" }
      );
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production" ? true : false,
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  });
  app.post("/logout", async (req, res) => {
    try {
      res
        .clearCookie("token", {
          maxAge: 0,
          secure: process.env.NODE_ENV === "production" ? true : false,
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    } catch (error) {
      console.log(error);
    }
  });

  // user related apis
  // normal route
  app.post("/users", async (req, res) => {
    try {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await User.findOne(query);

      if (existingUser) {
        return res.send({ message: "User already exists", insertedId: null });
      }

      // Hash the user's password before storing it in the database
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Replace the plain text password with the hashed password
      user.password = hashedPassword;

      // Create the user in the database
      const result = await User.create(user);

      res.send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal server error" });
    }
  });

  app.get("/", async (req, res) => {
    res.send("Welcome to House Hunter server");
  });

  app.listen(port, () => {
    console.log(`House Hunter Server is running on port ${port}`);
  });
};

main();
