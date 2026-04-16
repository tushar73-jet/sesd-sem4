import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import { validate } from '../middlewares/validate.middleware';
import { createProductSchema, updateProductSchema, queryProductSchema } from '../validators/product.validator';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', validate(queryProductSchema), getProducts);
router.get('/:id', getProductById);

router.use(authenticate); // Require auth for all routes below

router.post('/', validate(createProductSchema), createProduct);
router.put('/:id', validate(updateProductSchema), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
