import { ModelStatic } from "sequelize";
import Product from "../database/models/Products";
import UpdateProduct from "../interface/UpdateProduct";
import { DataValidated } from "../interface/DataValidated";
import { rulesValidations } from "../utils/validationsRules";

export default class ProductService {
    protected model: ModelStatic<Product> = Product;
    async readAll(): Promise<Product[]> {
        const result = await this.model.findAll()
        return result
    }

    async updateById(products: Product[]): Promise<Product[] | null | any[]> {
        products.map(async (product) => {
          await this.model.update({salesPrice: product.sales_price}, {where:{code: product.code}})
        })
        return null
    }

    async findProduct(code: number): Promise<Product | null> {
        const result = await this.model.findOne({ where: { code } });
        return result ? result.dataValues : null;
      }
      
    async validateCSV(products: UpdateProduct[]): Promise<DataValidated[]> {
        const result: DataValidated[] = [];
        for (const product of products) {
          const data = await this.findProduct(parseInt(product.product_code));
          if(data === null){
            result.push({code: parseInt(product.product_code), name: '',
              cost_price: 0, sales_price: 0, new_price: product.new_price,
              error: 'Produto não encontrado!'})
          }
          if (data) {
            const validation = await rulesValidations(data, product.new_price, products)
            result.push(validation)
          }
        }
      
        return result;
      }
      
}