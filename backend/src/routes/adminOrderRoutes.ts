import { Router } from 'express';
import { AdminOrderController } from '../controllers/AdminOrderController';

const router = Router();

router.get('/count', AdminOrderController.getOrdersCount);
router.get('/', AdminOrderController.getAllOrders);
router.get('/:id', AdminOrderController.getOrderById);
router.post('/', AdminOrderController.createOrderWithItems); 
router.put('/:id', AdminOrderController.updateOrder);
router.delete('/:id', AdminOrderController.deleteOrder);

export default router;
