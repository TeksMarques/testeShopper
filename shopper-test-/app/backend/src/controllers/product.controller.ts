import { Request, Response } from 'express';
import csvParser from '../utils/csvParser';
import connection from '../database/config/database';
import fs from 'fs';
import Product from '../database/models/Products';
import UpdateProduct from '../interface/UpdateProduct';

const filePath = './src/data/price_att.csv';

declare module 'express' {
    export interface Request {
      files?: any; // Declare the files property on Request
    }
  }

// Função para validar o arquivo de precificação
export const validatePrices = async (req: Request, res: Response) => {
  if (!req.files || !req.files.csvFile) {
    return res.status(400).json({ message: 'Arquivo CSV não encontrado' });
  }

  const csvFile = req.files.csvFile.path as any;
  try {
    const productsFile = await csvParser(csvFile);

    const requiredFields = ['product_code', 'name', 'price', 'new_price'];
    const missingFields = requiredFields.filter(
      (field) => !productsFile[0]?.hasOwnProperty(field)
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Campos obrigatórios ausentes: ${missingFields.join(', ')}`,
      });
    }

    const validatedProducts = productsFile.map((data: any) => {
      const product: UpdateProduct = {
        product_code: data.code,
        name: data.name,
        new_price: parseFloat(data.new_price),
        price: parseFloat(data.price),
        valid: true,
      };

      if (isNaN(product.price) || isNaN(product.new_price)) {
        product.valid = false;
        product.error = 'Preço inválido';
        return product;
      }

      const priceDifference = Math.abs(product.new_price - product.price);
      const priceThreshold = product.price * 0.1;
      if (priceDifference > priceThreshold) {
        product.valid = false;
        product.error = 'Variação de preço inválida';
        return product;
      }

      product.valid = true;
      return product;
    });

    
    fs.unlinkSync(csvFile);

    // Retornar os produtos validados
    res.status(200).json({ products: validatedProducts });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar o arquivo CSV.' });
  }
};

export const updatePrices = (req: Request, res: Response) => {
    const { products } = req.body;
  
    // Verificar se todos os produtos foram validados
    if (!products || products.length === 0) {
      return res.status(400).json({ error: 'Nenhum produto válido para atualizar.' });
    }
  
    // Atualizar os preços no banco de dados
    const promises = products.map((product: Product) => {
      return new Promise<void>((resolve, reject) => {
        connection.query(
          'UPDATE products SET sales_price = ? WHERE code = ?',
          [product.sales_price, product.code],
          (error, results) => {
            if (error) {
              reject(`Erro ao atualizar o preço do produto ${product.code}.`);
            } else {
              resolve();
            }
        });
        });
      });
    
      Promise.all(promises)
        .then(() => {
          res.status(200).json({ message: 'Preços atualizados com sucesso.' });
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    };
export const getProducts = (req: Request, res: Response) => {
    connection.query('SELECT * FROM products', (error, results) => {
        if (error) {
            res.status(500).json({ error });
        } else {
            res.status(200).json({ products: results });
        }
    });
};   
    
module.exports = { validatePrices, updatePrices, getProducts };
