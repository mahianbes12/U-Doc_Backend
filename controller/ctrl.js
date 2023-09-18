const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = express();
const User = require("../index");
const Patient = require("../config/patientModels");
const MedicalProfessional = require("../config/medicalProfessionalModel");
require('dotenv').config();


const createUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if user already exists
    const findUser = await User.findOne({ email });
    if (findUser) {
      return res.json({
        msg: "User already exists",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    if (role === 'patient') {
      // Create a new patient with hashed password
      newUser = await Patient.create({
        email,
        password: hashedPassword,
        // Include additional required fields specific to the patient
        name: req.body.name,
        age: req.body.age,
        // ...
      });
    } else if (role === 'medicalProfessional') {
      // Create a new medical professional with hashed password
      newUser = await MedicalProfessional.create({
        email,
        password: hashedPassword,
        // Include additional required fields specific to the medical professional
        name: req.body.name,
        specialty: req.body.specialty,
        // ...
      });
    } else {
      return res.json({
        msg: "Invalid role",
        success: false,
      });
    }

    res.json({ newUser });
  } catch (error) {
    throw new Error(error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const all = await User.find();
    res.json(all);
  } catch (error) {
    throw new Error(error);
  }
};

const getaUser = async (req, res) => {
  const { id } = req.params;
  try {
    const findUser = await User.findById(id);
    res.json({ findUser });
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  try {
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        name: req?.body.name,
        email: req?.body.email,
        mobile: req?.body.mobile,
      },
      { new: true }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const find = await User.findByIdAndDelete(id);
    res.json(find);
  } catch (error) {
    throw new Error(error);
  }
};

// Login endpoint
const secretKey = process.env.SECRET_KEY || 'defaultSecretKey'; // Access the secret key from environment variable or use a default value

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

    // Return the token to the client
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  });
}
module.exports = { createUser, getAllUsers, getaUser, update, deleteUser, login };
