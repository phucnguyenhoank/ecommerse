import {Router } from 'express';
import { OrderStatusController } from '../controllers/OrderStatusController';

const router = Router();

router.get('/', OrderStatusController.getAll);
router.get('/:id', OrderStatusController.getById);
router.post('/', OrderStatusController.create);
router.put('/:id', OrderStatusController.update);
router.delete('/:id', OrderStatusController.delete);

export default router;

