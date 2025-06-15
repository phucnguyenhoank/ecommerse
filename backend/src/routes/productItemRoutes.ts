import {Router } from 'express';
import { ProductItemController } from '../controllers/ProductItemController';

const router = Router();
router.get("/paginated", ProductItemController.getPaginatedProductItems);

router.get('/', ProductItemController.getAllProductItems);
router.get('/:id', ProductItemController.getProductItemById);
router.get('/product/:productId', ProductItemController.getProductItemsByProductId);
router.post('/', ProductItemController.createProductItem);
router.put('/:id', ProductItemController.updateProductItem);
router.delete('/:id', ProductItemController.deleteProductItem);

export default router;