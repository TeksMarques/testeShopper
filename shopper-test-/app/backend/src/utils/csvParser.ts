import csv from 'csv-parser';
import fs from 'fs';

const csvParser = (filePath: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
  
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          // Processar cada linha do arquivo CSV
          results.push(data);
        })
        .on('end', () => {
          // Ao final do processamento, retornar os resultados
          resolve(results);
        })
        .on('error', (error) => {
          // Em caso de erro, rejeitar a Promise com o erro
          reject(error);
        });
    });
  };
  
export default csvParser;