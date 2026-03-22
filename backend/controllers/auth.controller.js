import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// SIGN UP
export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if email already exists
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({
        message: "Email already exists!",
      });
    }

    // password validation
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters!",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // generate token
    const token = await genToken(user._id);

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false,
    });

    return res.status(201).json(user);
  } catch (error) {
    let message = "Signup failed";
    if (error.code === 8000 || error.message?.includes("bad auth")) {
      message = "Database connection failed. Check your MongoDB credentials in .env (MONGODB_URL).";
    } else if (error.message) {
      message = error.message;
    }
    return res.status(500).json({ message });
  }
};

// LOGIN
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email does not exist!",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials!",
      });
    }

    // generate token
    const token = await genToken(user._id);

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false,
    });

    return res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    let message = "Login failed";
    if (error.code === 8000 || error.message?.includes("bad auth")) {
      message = "Database connection failed. Check your MongoDB credentials in .env (MONGODB_URL).";
    } else if (error.message) {
      message = error.message;
    }
    return res.status(500).json({ message });
  }
};

// LOGOUT
export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      message: "log out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `logout error ${error}`,
    });
  }
};