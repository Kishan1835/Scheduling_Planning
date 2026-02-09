import { Router } from 'express';
import { BayController } from '../controllers/bayController';
import { validateRequest } from '../middleware/validateRequest';
import {
  createBaySchema,
  updateBaySchema,
  getBaysQuerySchema,
} from '../validators/bay.schema';

const router = Router();
const controller = new BayController();

// /api/v1/bays
router.get('/bays', validateRequest(getBaysQuerySchema), controller.getAll);

// /api/v1/factories/:factoryId/bays
router.get('/factories/:factoryId/bays', controller.getByFactory);

// /api/v1/bays/:bayId
router.get('/bays/:bayId', controller.getById);

// /api/v1/factories/:factoryId/bays
router.post(
  '/factories/:factoryId/bays',
  validateRequest(createBaySchema),
  controller.create,
);

// /api/v1/bays/:bayId
router.patch(
  '/bays/:bayId',
  validateRequest(updateBaySchema),
  controller.update,
);

router.delete('/bays/:bayId', controller.delete);

export default router;

