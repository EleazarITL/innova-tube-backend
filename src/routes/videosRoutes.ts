import  {Router} from 'express';

import videosController from '../controllers/videosController';


class VideosRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.post('/lista', videosController.getVideos);
        this.router.post('/listaFavoritos', videosController.getVideosFavoritos);
        this.router.post('/agregarFavoritos', videosController.agregarVideosFavoritos);
        this.router.post('/eliminarFavoritos', videosController.eliminarVideosFavoritos);
    }
    
}

const videosRoutes = new VideosRoutes();
export default videosRoutes.router;