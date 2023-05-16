import { Sequelize } from 'sequelize';
import { Options } from 'sequelize/types';

const config: Options = {
  username: 'root',
  password: 'senha-mysql',
  database: 'SHOPPERDB',
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  dialectOptions: {
    timezone: 'Z',
  },
  logging: false,
};

const sequelize = new Sequelize(config);

export default sequelize;
