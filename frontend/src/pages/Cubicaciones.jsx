import React from 'react';
import { Plus, Search, Filter } from 'lucide-react';

const Cubicaciones = () => (
  <div className="module-container">
    <div className="action-bar">
      <div className="search-box">
        <Search size={18} />
        <input type="text" placeholder="Buscar cubicación..." />
      </div>
      <div className="filters">
        <button className="btn-secondary"><Filter size={16} /> Filtros</button>
        <button className="btn-primary"><Plus size={16} /> Nueva Cubicación</button>
      </div>
    </div>

    <div className="data-card">
      <div className="empty-state">
        <h3>Módulo de Cubicaciones (Core)</h3>
        <p>Seleccione una obra y partida para comenzar el ingreso de datos.</p>
        <div className="placeholder-info">
          Aquí se implementará el motor de cálculo dinámico con las columnas: Eje, Tramo, Largo, Ancho, Alto y Cantidad.
        </div>
      </div>
    </div>

    <style>{`
      .module-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .action-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        border: 1px solid #e2e8f0;
      }
      .search-box {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #f1f5f9;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        width: 300px;
        color: #64748b;
      }
      .search-box input {
        background: none;
        border: none;
        outline: none;
        width: 100%;
        font-size: 0.875rem;
      }
      .filters {
        display: flex;
        gap: 0.75rem;
      }
      .btn-secondary {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1rem;
        border-radius: 0.375rem;
        border: 1px solid #e2e8f0;
        background: white;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
      }
      .btn-primary {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1rem;
        border-radius: 0.375rem;
        background: #2563eb;
        color: white;
        border: none;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
      }
      .data-card {
        background: white;
        padding: 3rem;
        border-radius: 0.75rem;
        border: 1px solid #e2e8f0;
        text-align: center;
      }
      .empty-state h3 {
        margin-bottom: 0.5rem;
        color: #1e293b;
      }
      .empty-state p {
        color: #64748b;
        margin-bottom: 2rem;
      }
      .placeholder-info {
        background: #f8fafc;
        border: 2px dashed #e2e8f0;
        padding: 2rem;
        border-radius: 0.5rem;
        color: #94a3b8;
        max-width: 500px;
        margin: 0 auto;
      }
    `}</style>
  </div>
);

export default Cubicaciones;
