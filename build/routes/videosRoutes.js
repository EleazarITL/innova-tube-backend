"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const videosController_1 = __importDefault(require("../controllers/videosController"));
class VideosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/lista', videosController_1.default.getVideos);
        this.router.post('/listaFavoritos', videosController_1.default.getVideosFavoritos);
        this.router.post('/agregarFavoritos', videosController_1.default.agregarVideosFavoritos);
        this.router.post('/eliminarFavoritos', videosController_1.default.eliminarVideosFavoritos);
    }
}
const videosRoutes = new VideosRoutes();
exports.default = videosRoutes.router;
