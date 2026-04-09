import React from 'react';

const Dashboard = () => (
  <div className="dashboard">
    <div className="card-stats">
      <div className="stat-card">
        <span className="stat-label">Proyectos Activos</span>
        <span className="stat-value">12</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Cubicaciones Pendientes</span>
        <span className="stat-value">45</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Planificaciones del Mes</span>
        <span className="stat-value">8</span>
      </div>
    </div>

    <div className="data-section">
      <h3>Resumen Reciente de Actividad</h3>
      <div className="table-container">
        <table className="formal-table">
          <thead>
            <tr>
              <th>Proyecto</th>
              <th>Actividad</th>
              <th>Cubicador</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Edificio Horizonte</td>
              <td>Estructuras</td>
              <td>Juan Pérez</td>
              <td><span className="badge badge-success">Aprobado</span></td>
              <td>23/02/2026</td>
            </tr>
            <tr>
              <td>Mall Plaza Norte</td>
              <td>Instalaciones</td>
              <td>María Silva</td>
              <td><span className="badge badge-warning">En Revisión</span></td>
              <td>22/02/2026</td>
            </tr>
            <tr>
              <td>Remodelación Central</td>
              <td>Arquitectura</td>
              <td>Pedro Soto</td>
              <td><span className="badge badge-info">En Proceso</span></td>
              <td>21/02/2026</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <style>{`
      .dashboard {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }
      .card-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.5rem;
      }
      .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 0.75rem;
        border: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      }
      .stat-label {
        display: block;
        color: #64748b;
        font-size: 0.875rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.025em;
      }
      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        color: #0f172a;
      }
      .data-section {
        background: white;
        padding: 1.5rem;
        border-radius: 0.75rem;
        border: 1px solid #e2e8f0;
      }
      .data-section h3 {
        margin-top: 0;
        margin-bottom: 1.25rem;
        font-size: 1.125rem;
        color: #1e293b;
      }
      .table-container {
        overflow-x: auto;
      }
      .formal-table {
        width: 100%;
        border-collapse: collapse;
      }
      .formal-table th {
        text-align: left;
        padding: 1rem;
        background: #f8fafc;
        border-bottom: 2px solid #e2e8f0;
        color: #475569;
        font-size: 0.875rem;
        font-weight: 600;
      }
      .formal-table td {
        padding: 1rem;
        border-bottom: 1px solid #f1f5f9;
        font-size: 0.875rem;
        color: #334155;
      }
      .badge {
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
      }
      .badge-success { background: #dcfce7; color: #166534; }
      .badge-warning { background: #fef9c3; color: #854d0e; }
      .badge-info { background: #e0f2fe; color: #0369a1; }
    `}</style>
  </div>
);

export default Dashboard;
