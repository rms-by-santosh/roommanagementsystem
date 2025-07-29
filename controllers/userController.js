import { User } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

// Register new user (admin only)
export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: "Email already exists" });
    if (await User.findOne({ username })) return res.status(400).json({ message: "Username already exists" });
    const user = await User.create({ username, email, password, role: role || "user" });
    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    next(err);
  }
};

// Login (anyone)
export const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log("LOGIN ATTEMPT:", username, password);
    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const passwordMatch = await user.matchPassword(password);
    console.log("Password match:", passwordMatch);
    if (!passwordMatch) return res.status(401).json({ message: "Invalid credentials" });
    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    next(err);
  }
};


// Get all users (admin only)
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Update user (admin only)
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.username = username || user.username;
    user.email = email || user.email;
    if (password) user.password = password;
    await user.save();
    res.json({ message: "User updated", user });
  } catch (err) {
    next(err);
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
