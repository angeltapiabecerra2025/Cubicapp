import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Cubicaciones from './pages/Cubicaciones';
import Planificacion from './pages/Planificacion';
import Mantenedores from './pages/Mantenedores';
import UnidadMedida from './pages/UnidadMedida';
import Actividades from './pages/Actividades';
import UsuariosRoles from './pages/UsuariosRoles';
import Proyectos from './pages/Proyectos';
import Partidas from './pages/Partidas';
import Especialidades from './pages/Especialidades';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/cubicaciones" element={<Cubicaciones />} />
                    <Route path="/planificacion" element={<Planificacion />} />
                    <Route path="/mantenedores" element={<Mantenedores />} />
                    <Route path="/mantenedores/unidades" element={<UnidadMedida />} />
                    <Route path="/mantenedores/actividades" element={<Actividades />} />
                    <Route path="/mantenedores/usuarios" element={<UsuariosRoles />} />
                    <Route path="/mantenedores/proyectos" element={<Proyectos />} />
                    <Route path="/mantenedores/partidas" element={<Partidas />} />
                    <Route path="/mantenedores/especialidades" element={<Especialidades />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
