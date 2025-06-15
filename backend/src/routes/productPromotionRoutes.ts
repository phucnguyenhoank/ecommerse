import {Router, Request, Response} from 'express';
import { ProductPromotionController, setDiscount } from '../controllers/ProductPromotionController';

const router = Router();

router.get('/', ProductPromotionController.getAllProductPromotions);
router.get('/:productId/:promotionId', ProductPromotionController.getProductPromotionByIds);
router.put('/:productId/:promotionId', ProductPromotionController.updateProductPromotion);
router.post('/', ProductPromotionController.createProductPromotion);
router.post('/set-discount', (req, res, next) => { setDiscount(req, res).catch(next); });
router.delete('/:id', ProductPromotionController.deleteProductPromotion);

export default router;
