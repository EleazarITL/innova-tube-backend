import  {Router} from 'express';

import autenticacionController from '../controllers/autenticacionController';


class AutenticacionRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.post('/login', autenticacionController.login);
        this.router.put('/actualizarPassword', autenticacionController.actualizarPassword)
        this.router.post('/registro', autenticacionController.registro)
        this.router.post('/validarCaptcha', autenticacionController.validarCaptcha)
    }
    
}

const autenticacionRoutes = new AutenticacionRoutes();
export default autenticacionRoutes.router;