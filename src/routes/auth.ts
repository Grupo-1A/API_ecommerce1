import express, { Request, Response } from 'express';
import { pool } from '../db';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const {
      nombres, apellidos, documento, telefono,
      direccion, correo, ciudad, fecha_nacimiento,
      usuario, contrasena
    } = req.body;

    // Insertar en usuarios
    const result = await pool.query(
      `INSERT INTO usuarios (nombres, apellidos, documento, telefono, direccion, correo, ciudad, fecha_nacimiento)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [nombres, apellidos, documento, telefono, direccion, correo, ciudad, fecha_nacimiento]
    );

    const usuarioId = result.rows[0].id;

    // Hashear la contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    // Insertar en login
    await pool.query(
      `INSERT INTO login (usuario, contrasena, usuario_id)
       VALUES ($1, $2, $3)`,
      [usuario, hash, usuarioId]
    );

    res.status(201).json({ message: 'Usuario registrado con éxito' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

export default router;
