import { Request, Response, NextFunction } from 'express';
import connection from '../database/config/database';
import Product from '../database/models/Products';

export const updatePrices = (req: Request, res: Response) => {
  const products = req.body;  

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
  connection.query('SELECT * FROM products', (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(200).json({ products: results });
    }
  });
};

module.exports = { updatePrices, getProducts };
