import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import axios from 'axios';
import dotenv from 'dotenv';
import pool from '../database';
import bcrypt from 'bcrypt';

// Cargar las variables de entorno
dotenv.config();

class AutenticacionController {

    // Metodo login para autenticacion de usuarios
    public async login(req: Request, res: Response): Promise<void> {
        const { usuario, password } = req.body;

        try {
            // Validar que el usuario exista
            const { rows } = await pool.query('SELECT * FROM usuarios WHERE usuario = $1', [usuario]);

            // Si el usuario no existe
            if (rows.length === 0) {
                res.status(401).json({ message: 'El usuario que ingreso no existe.' });
                return;
            }

            const row = rows[0];

            // Comparar contraseña ingresada con la contraseña encriptada almacenada
            const isMatch = await bcrypt.compare(password, row.password);

            if (!isMatch) {
                res.status(401).json({ message: 'La contraseña es incorrecta, intente de nuevo o compruebe su conexión a internet.' });
                return;
            }

            const nombre_completo = row.nombre_completo;
            const id = row.usuario_id;

            const token = jwt.sign(
                { id: row.usuario_id, username: row.nombre_completo },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' }
            );

            res.json({ message: 'Inicio de sesión exitoso' , token, nombre_completo, id});
        } catch (error) {
            console.error('Error en el login:', error);
            res.status(500).json({ message: 'Error al iniciar sesión', error });
        }
    }

    // Metodo para actualizar contraseña
    public async actualizarPassword(req: Request, res: Response): Promise<void> { 
        const { email, password } = req.body; // Se recibe el correo y la nueva contraseña
        try {
            // Validar que el email exista
            const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

            // Si el usuario no existe
            if (rows.length === 0) {
                res.status(401).json({ message: 'El correo electrónico que ingreso no existe.' });
                return;
            }

            // Generar el hash de la nueva contraseña
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
    
            // Actualizar la contraseña encriptada en la base de datos
            await pool.query('UPDATE usuarios SET password = $1 WHERE email = $2', [hashedPassword, email]);
    
            res.json({ message: 'Contraseña actualizada correctamente.' });
        } catch (error) {
            console.error('Error al actualizar la contraseña:', error);
            res.status(500).json({ message: 'Error al actualizar la contraseña', error });
        }
    }
    // Metodo para registrar usuarios nuevos al sitio web
    public async registro(req: Request, res: Response): Promise<void> {
        const { usuario, password, nombre_completo, email } = req.body;
        console.log(req.body);
    
        try {
            // Verificar si el usuario ya existe
            const { rows } = await pool.query("SELECT * FROM usuarios WHERE usuario = $1", [usuario]);
    
            if (rows.length > 0) {
                res.status(400).json({ message: 'El usuario ya existe.' });
                return;
            }
    
            // Encriptar la contraseña
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
    
            // Insertar el nuevo usuario con la contraseña encriptada
            await pool.query(
                'INSERT INTO usuarios (usuario, password, nombre_completo, email) VALUES ($1, $2, $3, $4)',
                [usuario, hashedPassword, nombre_completo, email]
            );
    
            res.json({ message: 'Usuario registrado correctamente.' });
        } catch (error) {
            console.error('Error al registrar el usuario:', error); // Log del error
            res.status(500).json({ message: 'Error al registrar el usuario', error: error || 'Error desconocido' });
        }
    }
    
    // Metodo para validar el reCAPTCHA en el registro de usuarios
    public async validarCaptcha(req: Request, res: Response): Promise<void> {
        const { token } = req.body;
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;

        try {
            const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`);
            const data = response.data;

            if (!data.success) {
                res.status(400).json({ message: 'Captcha no válido.', success: false });
                return;
            }

            res.json({ message: 'Captcha validado correctamente.', success: true });
        } catch (error) {
            res.status(500).json({ message: 'Error al validar el captcha', error });
        }
    }
}

const autenticacionController = new AutenticacionController();

export default autenticacionController;
