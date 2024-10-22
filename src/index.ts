import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

import indexRoutes from './routes/indexRoutes';
import autenticacionRoutes from './routes/autenticacionRoutes';
import videosRoutes from './routes/videosRoutes';

class Server {
    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.handleAngularRoutes(); // Agregar manejo de rutas para Angular
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

        // Servir archivos estáticos
        this.app.use(express.static(path.join(__dirname, 'dist/innova-tube/browser')));
    }

    routes(): void {
        this.app.use(indexRoutes);
        this.app.use('/api/videos', videosRoutes);
        this.app.use('/api/autenticacion', autenticacionRoutes);
    }

    handleAngularRoutes(): void {
        // Manejo de rutas para Angular
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'dist/innova-tube/browser/index.html'));
        });
    }

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();
