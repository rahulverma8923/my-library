const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    let { name, email, password, confirmPassword, preferredLanguage } = req.body;

    name = name ? String(name).trim() : '';
    email = email ? String(email).trim().toLowerCase() : '';
    password = password ? String(password).trim() : '';
    confirmPassword = confirmPassword ? String(confirmPassword).trim() : '';

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and password'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password confirmation does not match password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      preferredLanguage: preferredLanguage || 'English'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        preferredLanguage: user.preferredLanguage,
        readingGoal: user.readingGoal,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    email = email ? String(email).trim().toLowerCase() : '';
    password = password ? String(password).trim() : '';

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Find user by email and explicitly select password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        preferredLanguage: user.preferredLanguage,
        readingGoal: user.readingGoal,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile (name, avatar, preferredLanguage, readingGoal)
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (req.body.name) user.name = req.body.name.trim();
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
    if (req.body.preferredLanguage) user.preferredLanguage = req.body.preferredLanguage.trim();
    if (req.body.readingGoal !== undefined) {
      const goal = Number(req.body.readingGoal);
      if (isNaN(goal) || goal < 1) {
        return res.status(400).json({
          success: false,
          message: 'Reading goal must be at least 1 book'
        });
      }
      user.readingGoal = goal;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password'
      });
    }

    if (confirmNewPassword && newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password confirmation does not match'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect current password'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user (clear cookie / client state acknowledgment)
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  logoutUser
};
