"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("../database"));
// Cargar las variables de entorno
dotenv_1.default.config();
class VideosController {
    // Metodo para obtener videos utilizando la api de youtube
    getVideos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Filtros para buscar videos
            const { part, maxResults, order, q, type, videoDuration } = req.body;
            const secretKey = process.env.YOUTUBE_SECRET_KEY;
            try {
                // Configurar la url para obtener videos
                const response = yield axios_1.default.get(`https://www.googleapis.com/youtube/v3/search?key=${secretKey}&q=${q}&type=${type}&part=${part}&maxResults=${maxResults}&order=${order}&videoDuration=${videoDuration}`);
                console.log("videos response", response.data);
                const data = response.data;
                if (data.length === 0) {
                    res.status(400).json({ message: 'Falló al obtener videos.', success: false, data: data });
                    return;
                }
                res.json({ message: 'Videos obtenidos correctamente.', success: true, data: data });
            }
            catch (error) {
                res.status(500).json({ message: 'Error al intentar obtener videos, favor de revisar conexión a internet', error, data: null });
            }
        });
    }
    // Metodo para obtener la lista de videos a favoritos por usuario
    getVideosFavoritos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { titulo, usuario_id } = req.body;
            try {
                // obtenemos los videos favoritos por usuario_id
                const { rows } = yield database_1.default.query('SELECT * FROM favoritos WHERE titulo ILIKE $1 AND usuario_id = $2', [`%${titulo}%`, usuario_id]);
                // Si no existen registros
                if (rows.length === 0) {
                    res.status(401).json({ message: 'No hay videos favoritos que coincidan con ese título', success: false, data: null });
                    return;
                }
                res.json({ message: 'Videos favoritos obtenidos correctamente.', success: true, data: rows });
            }
            catch (error) {
                res.status(500).json({ message: 'Error al intentar obtener videos favoritos, favor de revisar conexión a internet', error, data: null });
            }
        });
    }
    // Metodo para obtener la lista de videos a favoritos por usuario
    agregarVideosFavoritos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Parametros de entrada
            const { usuario_id, video_id, titulo, descripcion, url } = req.body;
            try {
                // Verificar si no existe ya el video agregado en favoritos
                const { rows } = yield database_1.default.query('SELECT * FROM favoritos where video_id = $1', [video_id]);
                // Si existe
                if (rows.length > 0) {
                    res.status(401).json({ message: 'Este video ya esta registrado como favorito.', success: false });
                    return;
                }
                // Insertar el nuevo video favorito
                yield database_1.default.query('INSERT INTO favoritos (usuario_id, video_id, titulo, descripcion, url) VALUES ($1, $2, $3, $4, $5)', [usuario_id, video_id, titulo, descripcion, url]);
                res.json({ message: 'Video registrado como favorito.', success: true });
            }
            catch (error) {
                res.status(500).json({ message: 'Error al intentar agregar videos a favoritos, favor de revisar conexión a internet', error });
            }
        });
    }
    // Metodo para eliminar videos de favoritos
    eliminarVideosFavoritos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { video_id, usuario_id } = req.body;
            try {
                // Eliminar el video de favoritos
                yield database_1.default.query('DELETE FROM favoritos WHERE video_id = $1 AND usuario_id = $2', [video_id, usuario_id]);
                // Verificar si se elimino correctamente
                const { rows } = yield database_1.default.query('SELECT * FROM favoritos where video_id = $1', [video_id]);
                // Si no se elimino
                if (rows.length > 0) {
                    res.status(401).json({ message: 'No se pudo eliminar el video de favoritos', success: false });
                    return;
                }
                res.json({ message: 'Video eliminado correctamente de favoritos.', success: true });
            }
            catch (error) {
                res.status(500).json({ message: 'Error al intentar eliminar videos a favoritos, favor de revisar conexión a internet', error });
            }
        });
    }
}
const videosController = new VideosController();
exports.default = videosController;
