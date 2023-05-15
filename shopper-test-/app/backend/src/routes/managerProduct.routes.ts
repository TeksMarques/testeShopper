import { Router } from 'express';

import { validatePrices, updatePrices, getProducts } from '../controllers/product.controller';

const router = Router();

router.get('/products', (req: any, res: any) => getProducts(req, res));

router.post('/update', (req: any, res: any) => updatePrices(req, res));

export default router;