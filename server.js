require("dotenv").config();
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
// const port=3001;
const mongoose = require("mongoose");
const cors = require("cors");
app.use(express.json());
app.use(cors());
const Expense = require("./model/expense");
const User = require("./model/user");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo db server connected"))
  .catch((err) => console.log("mongo db connection error", err));

// app.get("/", (req, res) => {
//   res.send("API is running");
// });

//login

app.post("/login",async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "email doesn't exist",
      });
    }

    const existPassword = await bcrypt.compare(password, user.password );

    if (!existPassword) {
    return res.status(400).json({
        status: false,
        message: "password invalid",
      });
    }

   return res.status(200).json({
      status: true,
      message: "login successful",
      // data: user,//
    });
  } catch (error) {
   return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

//registration api

app.post("/register", async (req, res) => {
  try {
    const { username, email, password,fullName } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "email already exist",
      });
    }
    //bycrypt password
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashPassword,
      email,
      fullName,
    });
    res.status(200).json({
      status: true,
      data: user,
      message: "registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

app.get("/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json({
      status: true,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

app.get("/expenses/:id", async (req, res) => {
  try {
    const expenses = await Expense.findById(req.params.id);
    res.status(200).json({
      status: true,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

app.post("/expenses", async (req, res) => {
  try {
    const expenses = await Expense.create(req.body);
    res.status(201).json({
      status: true,
      data: expenses,
      message: "successfully inserted",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

app.patch("/expenses/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!expense) {
      res.status(404).json({
        status: false,
        message: "expense not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "edited successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

app.put("/expenses/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!expense) {
      res.status(404).json({
        status: false,
        message: "error",
      });
    }

    res.status(200).json({
      status: true,
      message: "updated successfully",
    });
  } catch (error) {
    res.status(401).json({
      status: false,
      message: error.message,
    });
  }
});

app.delete("/expenses/:id", async (req, res) => {
  try {
    const {id}=req.params;
    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      res.status(404).json({
        status: false,
        message: "error",
      });
    }

    res.status(200).json({
      status: true,
      message: "deleted successfully",
    });
  } catch (error) {
    res.status(401).json({
      status: false,
      message: error.message,
    });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
