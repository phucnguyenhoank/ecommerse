import {Router } from 'express';
import { OrderPaymentController } from '../controllers/OrderPaymentController';   

const router = Router();

router.get('/', OrderPaymentController.getAllOrderPayment);
router.get('/:order_id/:payment_id', OrderPaymentController.getOrderPaymentById);
router.put('/:order_id/:payment_id', OrderPaymentController.updateOrderPayment);
router.post('/', OrderPaymentController.createOrderPayment);
router.delete('/:id', OrderPaymentController.deleteOrderPayment);

export default router;
