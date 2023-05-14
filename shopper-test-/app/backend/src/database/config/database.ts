import mysql from 'mysql';

export const connection = mysql.createConnection({
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'senha-mysql',
  database: 'SHOPPERDB',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  timeout: 60000  
});

// Função para conectar ao banco de dados
export const connectToDatabase = () => {
  connection.connect((error) => {
    if (error) {
      console.error('Erro ao conectar ao banco de dados:', error);
    } else {
      console.log('Conexão com o banco de dados estabelecida.');
    }
  });
};

// Exporta a conexão para ser utilizada em outros arquivos
export default connection;