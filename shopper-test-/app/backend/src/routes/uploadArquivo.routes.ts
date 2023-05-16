import express, { Request, Response } from 'express';
import multer, { Multer } from 'multer';
import csvParser from '../utils/csvParser';
import fs from 'fs';
import UpdateProduct from '../interface/UpdateProduct';
import ProductService from '../services/productService';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

declare global {
  namespace Express {
    export interface Request {
      file?: Multer.File;
    }
  }
}

declare module 'express' {
  export interface Request {
    files?: any; // Declare the files property on Request
  }
}

router.post('/upload', upload.single('csvFile'),async (req: Request, res: Response) => {
  
  if (!req.file) {
    return res.status(400).json({ message: 'Arquivo CSV não encontrado' });
  }

  const csvFile = req.file.path;
  try {
    const productsFile = csvParser(csvFile);

    const requiredFields = ['product_code', 'new_price'];
    const missingFields = requiredFields.filter(
      (field) => productsFile[0]?.hasOwnProperty(field)
    );
   
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Campos obrigatórios ausentes: ${missingFields.join(', ')}`,
      });
    }

    try {
      req.body = await productsFile;
      const service: ProductService = new ProductService();
      const products = await service.validateCSV(req.body);
      res.status(200).json({ products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ocorreu um erro ao processar o arquivo CSV.' });
    }

    fs.unlinkSync(req.file.path);

    //res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Ocorreu um erro ao processar o arquivo CSV.' });
  }
});

export default router;
