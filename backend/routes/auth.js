const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const admin = require('../firebase');
const router = express.Router();


const verifyFirebaseToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("decoded------------",decodedToken)
    return decodedToken;
  } catch (error) {
    throw new Error(error);
  }
};

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name,email,password)
  let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcryptjs.hash(password, 10);
  const Newuser = new User({ name, email, password: hashedPassword });
  await Newuser.save();
  res.json({ message: 'User registered successfully' });
});




router.post('/register-google', async (req, res) => {
  const { firebaseToken } = req.body;
  console.log(firebaseToken);

  try {
    if (!firebaseToken) return res.status(400).json({ message: 'Firebase token is required' });
    const decodedFirebaseToken = await verifyFirebaseToken(firebaseToken);
    console.log(decodedFirebaseToken)
    let user = await User.findOne({ email: decodedFirebaseToken.email });

    if (!user) {
      user = new User({ email: decodedFirebaseToken.email,name: decodedFirebaseToken.name,password: null });
      await user.save();
    }
    else if(user){
      return res.status(400).json({ message: 'User already exists' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        name:decodedFirebaseToken.name,
        userId:user._id,
        email: user.email || "",
        
      },
    });
  } catch (error) {
    console.error('LoginWithGoogle Error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});


// Login
router.post('/login-google', async (req, res) => {

  const { firebaseToken } = req.body;
  console.log(firebaseToken);

  try {
    if (!firebaseToken) return res.status(400).json({ message: 'Firebase token is required' });
    const decodedFirebaseToken = await verifyFirebaseToken(firebaseToken);
    console.log(decodedFirebaseToken)
    let user = await User.findOne({ email: decodedFirebaseToken.email });

    if (!user) {
      user = new User({ email: decodedFirebaseToken.email, password: null });
      await user.save();
    }
    console.log(user)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, userId: user._id, isAdmin: user.isAdmin, name:user.name, email:user.email });
  } catch (error) {
    console.error('LoginWithGoogle Error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
 
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcryptjs.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
  res.json({ token, userId: user._id, isAdmin: user.isAdmin, name:user.name, email:user.email });
});


module.exports = router;