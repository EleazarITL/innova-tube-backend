"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacionController_1 = __importDefault(require("../controllers/autenticacionController"));
class AutenticacionRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/login', autenticacionController_1.default.login);
        this.router.put('/actualizarPassword', autenticacionController_1.default.actualizarPassword);
        this.router.post('/registro', autenticacionController_1.default.registro);
        this.router.post('/validarCaptcha', autenticacionController_1.default.validarCaptcha);
    }
}
const autenticacionRoutes = new AutenticacionRoutes();
exports.default = autenticacionRoutes.router;
