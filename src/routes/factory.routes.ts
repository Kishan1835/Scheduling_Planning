import { Router } from 'express';
import { FactoryController } from '../controllers/factoryController';
import { validateRequest } from '../middleware/validateRequest';
import { createFactorySchema, updateFactorySchema, getFactoriesQuerySchema } from '../validators/factory.schema';

const router = Router();
const controller = new FactoryController();

router.get('/', validateRequest(getFactoriesQuerySchema), controller.getAll);
router.get('/:factoryId', controller.getById);
router.post('/', validateRequest(createFactorySchema), controller.create);
router.patch('/:factoryId', validateRequest(updateFactorySchema), controller.update);
router.delete('/:factoryId', controller.delete);

export default router;