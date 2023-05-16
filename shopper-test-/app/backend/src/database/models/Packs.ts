import { INTEGER, STRING, NUMBER, Model } from 'sequelize';
import db from '.';
import ProductModel from './Products';

class PackModel extends Model {
  declare id: number;
  declare pack_id: string;
  declare product_id: number;
  declare qty: number;
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


export default PackModel;
