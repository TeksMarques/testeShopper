import { Router } from 'express';

import { updatePrices, getProducts } from '../controllers/product.controller';

const priceRouter = Router();

priceRouter.get('/products', (req: any, res: any) => getProducts(req, res));

priceRouter.post('/update', (req: any, res: any) => updatePrices(req, res));

export default priceRouter;