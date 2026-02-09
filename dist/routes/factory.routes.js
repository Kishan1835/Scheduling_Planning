"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const factoryController_1 = require("../controllers/factoryController");
const validateRequest_1 = require("../middleware/validateRequest");
const factory_schema_1 = require("../validators/factory.schema");
const router = (0, express_1.Router)();
const controller = new factoryController_1.FactoryController();
router.get('/', (0, validateRequest_1.validateRequest)(factory_schema_1.getFactoriesQuerySchema), controller.getAll);
router.get('/:factoryId', controller.getById);
router.post('/', (0, validateRequest_1.validateRequest)(factory_schema_1.createFactorySchema), controller.create);
router.patch('/:factoryId', (0, validateRequest_1.validateRequest)(factory_schema_1.updateFactorySchema), controller.update);
router.delete('/:factoryId', controller.delete);
exports.default = router;
//# sourceMappingURL=factory.routes.js.map