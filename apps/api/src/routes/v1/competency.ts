import { Router } from 'express';
import {
  getDomains,
  getCompetencyStats,
  getSkills,
  getRoles,
  getRoleById,
  createDomain,
  updateDomain,
  deleteDomain,
  createSkill,
  updateSkill,
  deleteSkill,
  createRole,
  updateRole,
  deleteRole
} from '../../controllers/competencyController';
import { authenticate } from '../../middleware/auth';
import { requireAdmin } from '../../middleware/rbac';
import { validateBody } from '../../middleware/validation';
import { createDomainSchema, createSkillSchema, createRoleSchema } from '@skill-setu/shared';

const router = Router();

// Public / Learner reads
router.get('/stats', getCompetencyStats);
router.get('/domains', getDomains);
router.get('/skills', getSkills);
router.get('/roles', getRoles);
router.get('/roles/:id', getRoleById);

// Admin operations
router.post('/domains', authenticate, requireAdmin, validateBody(createDomainSchema), createDomain);
router.put('/domains/:id', authenticate, requireAdmin, updateDomain);
router.delete('/domains/:id', authenticate, requireAdmin, deleteDomain);

router.post('/skills', authenticate, requireAdmin, validateBody(createSkillSchema), createSkill);
router.put('/skills/:id', authenticate, requireAdmin, updateSkill);
router.delete('/skills/:id', authenticate, requireAdmin, deleteSkill);

router.post('/roles', authenticate, requireAdmin, validateBody(createRoleSchema), createRole);
router.put('/roles/:id', authenticate, requireAdmin, updateRole);
router.delete('/roles/:id', authenticate, requireAdmin, deleteRole);

export default router;
