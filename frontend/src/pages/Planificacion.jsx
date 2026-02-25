import React from 'react';

const Planificacion = () => (
    <div className="card">
        <h3>Módulo de Planificación</h3>
        <p>Este módulo permite importar partidas aprobadas y asignarles fechas y rendimientos.</p>

        <div className="info-box">
            <h4>Próximas Funcionalidades:</h4>
            <ul>
                <li>Importación desde Módulo B (Aprobadas)</li>
                <li>Asignación de Fechas de Inicio y Fin</li>
                <li>Diagrama de Gantt simplificado</li>
                <li>Cálculo de rendimientos diarios esperados</li>
            </ul>
        </div>

        <style>{`
      .card {
        background: white;
        padding: 2rem;
        border-radius: 0.75rem;
        border: 1px solid #e2e8f0;
      }
      .info-box {
        margin-top: 2rem;
        background: #f0f9ff;
        border-left: 4px solid #0ea5e9;
        padding: 1.5rem;
      }
      .info-box h4 {
        margin-top: 0;
        color: #0369a1;
      }
      .info-box ul {
        margin-bottom: 0;
        color: #0c4a6e;
      }
      .info-box li {
        margin-bottom: 0.5rem;
      }
    `}</style>
    </div>
);

export default Planificacion;
