import { Router } from 'express';
import { MachineTypeController } from '../controllers/machineTypeController';
import { validateRequest } from '../middleware/validateRequest';
import { createMachineTypeSchema, updateMachineTypeSchema } from '../validators/machineType.schema';

const router = Router();
const controller = new MachineTypeController();

// Create machine type in specific factory and bay
router.post(
    '/factories/:factoryId/bays/:bayId/machine-types',
    validateRequest(createMachineTypeSchema),
    controller.create
);

// Get all machine types (with optional filters)
router.get('/machine-types', controller.getAll);

// Get machine types for a specific factory
router.get('/factories/:factoryId/machine-types', controller.getByFactory);

// Get specific machine type by ID
router.get('/machine-types/:machineTypeId', controller.getById);

// Update machine type
router.patch(
    '/machine-types/:machineTypeId',
    validateRequest(updateMachineTypeSchema),
    controller.update
);

// Delete machine type
router.delete('/machine-types/:machineTypeId', controller.delete);

export default router;