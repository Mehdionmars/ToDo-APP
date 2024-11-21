import express from 'express';
import User from '../models/User';

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const auth0Id = req.auth?.payload.sub;
    let user = await User.findOne({ auth0Id });
    
    if (!user) {
      user = new User({
        auth0Id,
        email: req.auth?.payload.email,
        name: req.auth?.payload.name,
        picture: req.auth?.payload.picture,
      });
      await user.save();
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update user profile
router.patch('/profile', async (req, res) => {
  try {
    const auth0Id = req.auth?.payload.sub;
    const user = await User.findOneAndUpdate(
      { auth0Id },
      { $set: req.body },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile' });
  }
});

export default router;