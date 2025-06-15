import {Router } from 'express';
import { OrderItemController } from '../controllers/OrderItemController';

const router = Router();

router.get('/', OrderItemController.getAllOrderItems);
router.post('/', OrderItemController.createOrderItem);
router.delete('/:id', OrderItemController.deleteOrderItem);

export default router;