import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
  toggleUserStatus,
  getUserStats,
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/authorization.middleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllUsers);
router.get('/stats', getUserStats);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.put('/:id/role', updateUserRole);
router.put('/:id/status', toggleUserStatus);

export default router;
