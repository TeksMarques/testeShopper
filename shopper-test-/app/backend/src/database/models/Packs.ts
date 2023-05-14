import { INTEGER, STRING, NUMBER, Model } from 'sequelize';
import db from '.';
import ProductModel from './Products';

class PackModel extends Model {
  declare id: number;
  declare name: string;
  declare cost_price: number;
  declare sales_price: number;
}

PackModel.init({
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  pack_id: {
    type: STRING,
    allowNull: false,
    references: {
        model: ProductModel,
        key: 'code',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  product_id: {
    type: NUMBER,
    allowNull: false,
    references: {
        model: ProductModel,
        key: 'code',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  qty: {
    type: NUMBER,
    allowNull: false,
  },  
}, {
  sequelize: db,
  underscored: true,
  timestamps: false,
  modelName: 'PackModel',
  tableName: 'packs',
});

PackModel.belongsTo(ProductModel, { as: 'code', foreignKey: 'pack_id' });
PackModel.belongsTo(ProductModel, { as: 'code', foreignKey: 'product_id' });

export default PackModel;
