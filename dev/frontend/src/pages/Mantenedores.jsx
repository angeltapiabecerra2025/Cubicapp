import { Link } from 'react-router-dom';

const Mantenedores = () => (
  <div className="grid-config">
    <div className="config-card">
      <h4>Usuarios y Roles</h4>
      <p>Gestión de accesos y permisos.</p>
      <Link to="/mantenedores/usuarios" className="btn-link">Gestionar Usuarios</Link>
    </div>
    <div className="config-card">
      <h4>Actividades</h4>
      <p>Hormigón, Acero, Cañerías, etc.</p>
      <Link to="/mantenedores/actividades" className="btn-link">Gestionar Actividades</Link>
    </div>
    <div className="config-card">
      <h4>Especialidades</h4>
      <p>Electricidad, Climatización, etc.</p>
      <Link to="/mantenedores/especialidades" className="btn-link">Gestionar Especialidades</Link>
    </div>
    <div className="config-card">
      <h4>Unidades de Medida</h4>
      <p>Definición de fórmulas y parámetros de cálculo.</p>
      <Link to="/mantenedores/unidades" className="btn-link">Gestionar Unidades</Link>
    </div>
    <div className="config-card">
      <h4>Partidas de Obra</h4>
      <p>Catálogo base y asociación con unidades.</p>
      <Link to="/mantenedores/partidas" className="btn-link">Gestionar Partidas</Link>
    </div>
    <div className="config-card">
      <h4>Proyectos</h4>
      <p>Configuración de nuevas obras.</p>
      <Link to="/mantenedores/proyectos" className="btn-link">Gestionar Proyectos</Link>
    </div>

    <style>{`
      .grid-config {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
      }
      .config-card {
        background: white;
        padding: 1.5rem;
        border-radius: 0.75rem;
        border: 1px solid #e2e8f0;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .config-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
      }
      .config-card h4 {
        margin-top: 0;
        margin-bottom: 0.5rem;
        color: #0f172a;
      }
      .config-card p {
        color: #64748b;
        font-size: 0.875rem;
        margin-bottom: 1.25rem;
      }
      .btn-link {
        color: #2563eb;
        background: none;
        border: none;
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
        padding: 0;
      }
      .btn-link:hover {
        text-decoration: underline;
      }
    `}</style>
  </div>
);

export default Mantenedores;
