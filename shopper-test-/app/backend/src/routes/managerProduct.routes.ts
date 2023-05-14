import { Router } from 'express';

import { ManagerProductController } from '../controllers/managerProduct.controller';

const router = Router();

router.get('/products', ManagerProductController.getAllProducts);

router.get('/products/:code', ManagerProductController.getProductByCode);

router.post('/products', ManagerProductController.createProduct);

router.put('/products/:code', ManagerProductController.updateProduct);

export default router;