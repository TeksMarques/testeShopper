import { Request, Response, NextFunction } from 'express';
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

    const requiredFields = ['product_code','new_price'];
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
        new_price: parseFloat(data.new_price),
        valid: true,
      };

      if (isNaN(product.new_price)) {
        product.valid = false;
        product.error = 'Preço inválido';
        return product;
      }

      const validaCostPriceAndPorcetagem = new Promise<void>((resolve, reject) => {
        connection.query(
          'SELECT cost_price, sales_price FROM products WHERE code = ?',
          [product.product_code],
          (error, results) => {
            if (error) {
              reject(`Erro ao consultar o preço do produto ${product.product_code}.`);
            } else {
                if (results.cost_price > product.new_price) {
                    product.valid = false;
                    product.error = 'Variação de preço inválida';
                    return product;
                }
                const priceDifference = Math.abs(product.new_price - results.sales_price);
                const priceThreshold = results.sales_price * 0.1;
                if (priceDifference > priceThreshold || priceThreshold < priceThreshold) {
                    product.valid = false;
                    product.error = 'Variação de preço inválida';
                    return product;
                }

            }
          }
        );
      });

      

      
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
  const products = req.body;
  console.log(products);

  // Verificar se todos os produtos foram validados
  if (!products || products.length === 0) {
    return res
      .status(400)
      .json({ error: 'Nenhum produto válido para atualizar.' });
  }

  const updateValorPack = products.map((product: Product) => {
    return new Promise<void>((resolve, reject) => {
        connection.query(
        'UPDATE products SET sales_price = CASE WHEN code = ? THEN ? WHEN code = (SELECT product_id FROM packs WHERE packs.pack_id = ?) THEN ? / (SELECT qty FROM packs WHERE packs.pack_id = ?) END WHERE code IN (?, (SELECT product_id FROM packs WHERE packs.pack_id = ?));',
        [products.product_code, products.new_price, products.product_code, products.new_price, products.product_code,products.product_code, products.product_code],
        (error, results) => {
            if (error) {
                updateValorUnidade();
            } else {
                resolve();
            }
        }
        );
    });
}); 
    const updateValorUnidade = products.map((product: Product) => {
    return new Promise<void>((resolve, reject) => {
        connection.query(
        'UPDATE products SET sales_price = CASE WHEN code = ? THEN ? WHEN code = (SELECT product_id FROM packs WHERE packs.product_id = ?) THEN ? * (SELECT qty FROM packs WHERE packs.product_id = ?) END WHERE code IN ((SELECT product_id FROM packs WHERE packs.product_id = ?), ?);',
        [products.product_code, products.new_price, products.product_code, products.new_price, products.product_code,products.product_code, products.product_code],
        (error, results) => {
            if (error) {
                promises();
            } else {
                resolve();
            }
        }
        );
    });
    });

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
        }
      );
    });
  });

  Promise.all(updateValorPack)
    .then(() => {
      res.status(200).json({ message: 'Preços atualizados com sucesso.' });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });

};
export const getProducts =  async (req: Request, res: Response) => {
  const productsFileCsv =  await validatePrices(req, res);
  console.log(productsFileCsv);
  connection.query('SELECT * FROM products', (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(200).json({ products: results });
    }
  });
};

module.exports = { validatePrices, updatePrices, getProducts };
