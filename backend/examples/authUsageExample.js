/**
 * Example Usage of Authentication System
 * This file demonstrates how to use the authentication middleware
 * in your routes and protect endpoints
 */

import express from 'express';
import { protect } from './middleware/auth.js';
import { authorize, checkPermission } from './middleware/authorization.js';

const router = express.Router();

// ============================================
// PUBLIC ROUTE - No authentication required
// ============================================
router.get('/public', (req, res) => {
  res.json({
    success: true,
    message: 'This is a public route',
  });
});

// ============================================
// PROTECTED ROUTE - Authentication required
// ============================================
router.get('/protected', protect, (req, res) => {
  res.json({
    success: true,
    message: 'This is a protected route',
    user: req.user, // Access authenticated user
  });
});

// ============================================
// ROLE-BASED ROUTE - Admin only
// ============================================
router.get('/admin-only', protect, authorize('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'This route is only accessible by admins',
    user: req.user,
  });
});

// ============================================
// MULTIPLE ROLES - Admin or Moderator
// ============================================
router.get('/moderator-or-admin', protect, authorize('admin', 'moderator'), (req, res) => {
  res.json({
    success: true,
    message: 'This route is accessible by admins and moderators',
    user: req.user,
  });
});

// ============================================
// PERMISSION-BASED ROUTE
// ============================================
router.post('/create-content', protect, checkPermission('create:any'), (req, res) => {
  res.json({
    success: true,
    message: 'Content created successfully',
  });
});

// ============================================
// EXAMPLE: Creating AI Chat Routes with Auth
// ============================================

// Anyone can view chats (public)
router.get('/chats/public', (req, res) => {
  res.json({
    success: true,
    message: 'Public chats',
  });
});

// Only authenticated users can create chats
router.post('/chats', protect, async (req, res) => {
  try {
    // Access user info from req.user
    const userId = req.user.id;
    const { message } = req.body;

    // Your AI chat logic here
    // const response = await processAIChat(message, userId);

    res.json({
      success: true,
      message: 'Chat created',
      userId: userId,
      userRole: req.user.role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Users can only view their own chats (unless admin)
router.get('/chats/:id', protect, async (req, res) => {
  try {
    // Your logic to fetch chat
    // const chat = await Chat.findById(req.params.id);

    // Check ownership (example)
    // if (chat.userId !== req.user.id && req.user.role !== 'admin') {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Not authorized to access this chat',
    //   });
    // }

    res.json({
      success: true,
      message: 'Chat retrieved',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Only admins can delete any chat
router.delete('/chats/:id', protect, authorize('admin'), async (req, res) => {
  try {
    // Your logic to delete chat
    // await Chat.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Chat deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ============================================
// EXAMPLE: How to access user info in routes
// ============================================
router.get('/user-info', protect, (req, res) => {
  res.json({
    userId: req.user.id,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role,
    isEmailVerified: req.user.isEmailVerified,
    message: 'Access user information like this in any protected route',
  });
});

export default router;

// ============================================
// How to use in your main app.js:
// ============================================
/*

import exampleRoutes from './routes/exampleRoutes.js';

// Add to your app
app.use('/api/examples', exampleRoutes);

*/

// ============================================
// Testing the routes:
// ============================================
/*

1. Register a user:
   POST http://localhost:8080/api/auth/register
   Body: { "username": "test", "email": "test@example.com", "password": "Test123" }

2. Login:
   POST http://localhost:8080/api/auth/login
   Body: { "email": "test@example.com", "password": "Test123" }
   
   Response will include: accessToken and refreshToken

3. Use the access token in protected routes:
   GET http://localhost:8080/api/examples/protected
   Header: Authorization: Bearer YOUR_ACCESS_TOKEN

4. For admin routes, you need to manually set user role to 'admin' in database:
   - Connect to MongoDB
   - Find your user
   - Update role field to 'admin'
   - Then you can access admin routes

*/
