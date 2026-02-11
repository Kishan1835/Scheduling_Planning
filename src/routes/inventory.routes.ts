import { Router } from 'express';
import { InventoryController } from '../controllers/inventoryController';
import { validateRequest } from '../middleware/validateRequest';
import { createInventorySchema, updateInventorySchema, getInventoryQuerySchema } from '../validators/inventory.schema';

const router = Router();
const controller = new InventoryController();

// Create inventory item in a specific factory
router.post(
    '/factories/:factoryId/inventory',
    validateRequest(createInventorySchema),
    controller.create
);

// Get all inventory items (with optional filters)
router.get(
    '/inventory',
    validateRequest(getInventoryQuerySchema),
    controller.getAll
);

// Get inventory items for a specific factory
router.get('/factories/:factoryId/inventory', controller.getByFactory);

// Get specific inventory item by ID
router.get('/inventory/:inventoryId', controller.getById);

// Update inventory item
router.patch(
    '/inventory/:inventoryId',
    validateRequest(updateInventorySchema),
    controller.update
);

// Delete inventory item
router.delete('/inventory/:inventoryId', controller.delete);

export default router;