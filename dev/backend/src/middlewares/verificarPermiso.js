const db = require('../config/db');

/**
 * Middleware para verificar permisos dinámicos basados en la base de datos
 * @param {string} moduloNombre - Nombre del módulo (Mantenedores, Cubicaciones, Planificacion)
 * @param {string} accion - Acción requerida (leer, escribir, editar, eliminar)
 */
const verificarPermiso = (moduloNombre) => {
    return async (req, res, next) => {
        try {
            // El usuario debe estar autenticado (inyectado por un middleware de auth previo)
            const rolId = req.usuario.rol_id;

            // Buscar permisos en la base de datos
            const query = `
        SELECT rp.* 
        FROM rol_permisos rp
        JOIN modulos m ON rp.modulo_id = m.id
        WHERE rp.rol_id = $1 AND m.nombre = $2
      `;

            const { rows } = await db.query(query, [rolId, moduloNombre]);

            if (rows.length === 0) {
                return res.status(403).json({ mensaje: "No tienes permisos para este módulo." });
            }

            const permiso = rows[0];

            // Mapeo de métodos HTTP a columnas de la tabla rol_permisos
            const mapeoAccion = {
                'GET': 'puede_leer',
                'POST': 'puede_escribir',
                'PUT': 'puede_editar',
                'PATCH': 'puede_editar',
                'DELETE': 'puede_eliminar'
            };

            const columnaPermiso = mapeoAccion[req.method];

            if (permiso && permiso[columnaPermiso]) {
                return next();
            }

            return res.status(403).json({ mensaje: "Acceso denegado: permisos insuficientes para esta acción." });

        } catch (error) {
            console.error('Error en verificarPermiso:', error);
            res.status(500).json({ mensaje: "Error interno verificando permisos." });
        }
    };
};

module.exports = verificarPermiso;
