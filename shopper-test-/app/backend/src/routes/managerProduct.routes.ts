import { Router } from 'express';

import { validatePrices, updatePrices, getProducts } from '../controllers/product.controller';

const router = Router();

router.get('/products', (req: any, res: any) => getProducts(req, res));

router.post('/products', (req: any, res: any) => validatePrices(req, res));

export default router;