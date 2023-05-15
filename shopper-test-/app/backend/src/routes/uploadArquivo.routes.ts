import express, { Request, Response } from 'express';
import multer, { Multer } from 'multer';
import csvParser from 'csv-parser';
import fs from 'fs';
import connection from '../database/config/database';
import UpdateProduct from '../interface/UpdateProduct';

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

export const validatePrices = async (req: Request, res: Response) => {
  if (!req.files || !req.files.csvFile) {
    return res.status(400).json({ message: 'Arquivo CSV não encontrado' });
  }

  const csvFile = fs.createReadStream(__dirname+'/fs_read.csv').pipe(csvParser());
  console.log(csvFile);
 
  try {
    const productsFile = csvFile as unknown as Array<any>;

    const requiredFields = ['product_code', 'new_price'];
    const missingFields = requiredFields.filter(
      (field) => !productsFile[0]?.hasOwnProperty(field)
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Campos obrigatórios ausentes: ${missingFields.join(', ')}`,
      });
    }

    const validatedProducts = await Promise.all(
      (productsFile as unknown as Array<any>).map(async (data: any) => {
        const product: UpdateProduct = {
          product_code: data.product_code,
          new_price: parseFloat(data.new_price),
          currente_price: data.currente_price,
          name: data.name,
          valid: true,
        };

        if (isNaN(product.new_price)) {
          product.valid = false;
          product.error = 'Preço inválido';
          return product;
        }

        try {
          const [results] = (await connection.query(
            'SELECT cost_price, sales_price FROM products WHERE code = ?',
            [product.product_code]
          )) as any;

          if (results.length === 0) {
            product.valid = false;
            product.error = 'Produto não encontrado';
            return product;
          }

          const { cost_price, sales_price } = results[0];

          if (cost_price > product.new_price) {
            product.valid = false;
            product.error = 'Variação de preço inválida';
            return product;
          }

          const priceDifference = Math.abs(product.new_price - sales_price);
          const priceThreshold = sales_price * 0.1;
          if (
            priceDifference > priceThreshold ||
            priceThreshold < priceThreshold
          ) {
            product.valid = false;
            product.error = 'Variação de preço inválida';
            return product;
          }
        } catch (error) {
          console.error(
            `Erro ao consultar o preço do produto ${product.product_code}.`
          );
          product.valid = false;
          product.error = 'Erro ao consultar o preço do produto';
          return product;
        }

        return product;
      })
    );

    fs.unlinkSync(req.file.path);

    res.status(200).json({ products: validatedProducts });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Ocorreu um erro ao processar o arquivo CSV.' });
  }
};

router.post('/upload', upload.single('csvFile'), validatePrices);

export default router;
