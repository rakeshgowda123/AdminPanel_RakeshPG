import express from 'express';
import { 
  createAgent, 
  getAgents, 
  getAgentById,
  updateAgent,
  deleteAgent,
  getAgentWithAssignedItems 
} from '../controllers/agentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin-only routes
router.route('/')
  .post(admin, createAgent)
  .get(admin, getAgents);

router.route('/:id')
  .get(admin, getAgentById)
  .put(admin, updateAgent)
  .delete(admin, deleteAgent);

router.get('/:id/assigned-items', admin, getAgentWithAssignedItems);

export default router;