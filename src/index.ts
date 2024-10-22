import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import indexRoutes from './routes/indexRoutes';
import autenticacionRoutes from './routes/autenticacionRoutes';
import videosRoutes from './routes/videosRoutes';

class Server {
    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config(): void {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(morgan("dev"));

        // Configuración de CORS
        const corsOptions = {
            origin: 'https://innova-tube-frontend-production.onrender.com',
            methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
            allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
        };
        this.app.use(cors(corsOptions));

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }

    routes(): void {
        this.app.use(indexRoutes);
        this.app.use('/api/videos', videosRoutes);
        this.app.use('/api/autenticacion', autenticacionRoutes);
    }

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();
