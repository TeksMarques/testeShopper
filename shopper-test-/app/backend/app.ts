import express from 'express';
import priceRoutes from '../backend/src/routes/managerProduct.routes';
import router from './src/routes/uploadArquivo.routes';
import cors from 'cors';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();

    this.config();
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(cors({
      origin: '*', 
    }));
    this.app.use(accessControl);
    this.app.use(priceRoutes);
    this.app.use(router);
    
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export default App;
