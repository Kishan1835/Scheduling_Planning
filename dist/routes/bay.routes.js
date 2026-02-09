"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bayController_1 = require("../controllers/bayController");
const validateRequest_1 = require("../middleware/validateRequest");
const bay_schema_1 = require("../validators/bay.schema");
const router = (0, express_1.Router)();
const controller = new bayController_1.BayController();
// /api/v1/bays
router.get('/bays', (0, validateRequest_1.validateRequest)(bay_schema_1.getBaysQuerySchema), controller.getAll);
// /api/v1/factories/:factoryId/bays
router.get('/factories/:factoryId/bays', controller.getByFactory);
// /api/v1/bays/:bayId
router.get('/bays/:bayId', controller.getById);
// /api/v1/factories/:factoryId/bays
router.post('/factories/:factoryId/bays', (0, validateRequest_1.validateRequest)(bay_schema_1.createBaySchema), controller.create);
// /api/v1/bays/:bayId
router.patch('/bays/:bayId', (0, validateRequest_1.validateRequest)(bay_schema_1.updateBaySchema), controller.update);
router.delete('/bays/:bayId', controller.delete);
exports.default = router;
//# sourceMappingURL=bay.routes.js.map