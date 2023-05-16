import csv from 'csv-parser';
import fs from 'fs';
import UpdateProduct from '../interface/UpdateProduct';

const csvParser = (filePath: string): Promise<UpdateProduct[]> => {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
  
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => { 
          results.push(data);
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  };
  
export default csvParser;