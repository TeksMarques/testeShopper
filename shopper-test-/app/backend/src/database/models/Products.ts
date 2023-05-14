import { INTEGER, STRING, NUMBER, Model } from 'sequelize';
import db from '.';

class ProductModel extends Model {
  declare code: number;
  declare name: string;
  declare cost_price: number;
  declare sales_price: number;
}

ProductModel.init({
  code: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  cost_price: {
    type: NUMBER,
    allowNull: false,
  },
  sales_price: {
    type: NUMBER,
    allowNull: false,
  },  
}, {
  sequelize: db,
  underscored: true,
  timestamps: false,
  modelName: 'ProductModel',
  tableName: 'products',
});

export default ProductModel;
