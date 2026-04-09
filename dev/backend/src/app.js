const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importar Rutas (Por crear)
// const authRoutes = require('./routes/auth');
// const usuarioRoutes = require('./routes/usuarios');
// const cubicacionRoutes = require('./routes/cubicaciones');

// app.use('/api/auth', authRoutes);
// app.use('/api/usuarios', usuarioRoutes);
// app.use('/api/cubicaciones', cubicacionRoutes);

app.get('/', (req, res) => {
  res.send('API de Sistema de Cubicaciones v1.0');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
