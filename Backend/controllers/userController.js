import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ======================================================
// CREATE JWT TOKEN
// ======================================================

const createToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ======================================================
// REGISTER USER
// POST /api/user/register
// ======================================================

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required.",
      });
    }

    // Check password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters.",
      });
    }

    // Clean email
    const cleanEmail = email
      .trim()
      .toLowerCase();

    // Check existing user
    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
    });

    // Create token
    const token = createToken(user._id);

    // User response without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user: userResponse,
    });

  } catch (error) {
    console.error(
      "Register Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error during registration.",
    });
  }
};

// ======================================================
// LOGIN USER
// POST /api/user/login
// ======================================================

export const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    // Clean email
    const cleanEmail = email
      .trim()
      .toLowerCase();

    // IMPORTANT:
    // password has select:false in userModel.js
    // so we must explicitly include it.
    const user = await User.findOne({
      email: cleanEmail,
    }).select("+password");

    // User not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // Compare password
    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // Create JWT
    const token = createToken(user._id);

    // User response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: userResponse,
    });

  } catch (error) {
    console.error(
      "Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error during login.",
    });
  }
};

// ======================================================
// GET CURRENT USER
// GET /api/user/me
// ======================================================

export const getCurrentUser = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error(
      "Get Current User Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching user.",
    });
  }
};

// ======================================================
// UPDATE PROFILE
// PUT /api/user/profile
// ======================================================

export const updateProfile = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
    } = req.body;

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (name) {
      user.name = name.trim();
    }

    if (email) {
      user.email = email
        .trim()
        .toLowerCase();
    }

    await user.save();

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully.",
      user: userResponse,
    });

  } catch (error) {
    console.error(
      "Update Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating profile.",
    });
  }
};

// ======================================================
// UPDATE PASSWORD
// PUT /api/user/password
// ======================================================

export const updatePassword = async (
  req,
  res
) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Current password and new password are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 8 characters.",
      });
    }

    // IMPORTANT:
    // Include password because model has select:false
    const user = await User.findById(
      req.user._id
    ).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check old password
    const passwordMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Current password is incorrect.",
      });
    }

    // Hash new password
    user.password =
      await bcrypt.hash(
        newPassword,
        10
      );

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password updated successfully.",
    });

  } catch (error) {
    console.error(
      "Update Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating password.",
    });
  }
};