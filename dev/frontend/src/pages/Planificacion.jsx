import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle, Trash2, Calendar, Search } from 'lucide-react';

const Planificacion = () => {
  const [selectedProject, setSelectedProject] = useState('');
  const [uploadedData, setUploadedData] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const mockupProjects = [
    { id: 1, nombre: 'Edificio Horizonte' },
    { id: 2, nombre: 'Centro Comercial Cordillera' },
    { id: 3, nombre: 'Planta Industrial Norte' }
  ];

  const generateTemplate = () => {
    const headers = "id task,nombre actividad,id task sub actividad,descripcion sub actividad,fecha inicio,fecha fin\n";
    const sampleData = "1,Instalaciones,1.1,Cableado Eléctrico,2026-03-01,2026-03-15\n1,Instalaciones,1.2,Tableros de control,2026-03-10,2026-03-20";
    const blob = new Blob([headers + sampleData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "plantilla_planificacion.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split('\n').filter(row => row.trim() !== '');
      const data = rows.slice(1).map((row, index) => {
        const columns = row.split(',');
        return {
          id: index + 1,
          taskId: columns[0] || '',
          actividad: columns[1] || '',
          subTaskId: columns[2] || '',
          descripcion: columns[3] || '',
          inicio: columns[4] || '',
          fin: columns[5] || ''
        };
      });
      setUploadedData(data);
      setSuccessMessage('Programa cargado con éxito.');
      setTimeout(() => setSuccessMessage(''), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="planning-wrapper">
      <div className="planning-header">
        <div>
          <h2 className="title">Programa de Obra (Carga Masiva)</h2>
          <p className="subtitle">Selecciona el proyecto y carga tu programa maestro desde Excel.</p>
        </div>
        <button className="btn-template" onClick={generateTemplate}>
          <Download size={18} /> Descargar Plantilla Modelo
        </button>
      </div>

      <div className="planning-grid">
        <div className="planning-sidebar">
          <div className="setup-card">
            <div className="form-group">
              <label>Seleccionar Obra / Proyecto</label>
              <select
                className="custom-select"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">-- Elige un proyecto --</option>
                {mockupProjects.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            {selectedProject ? (
              <div
                className={`upload-zone ${isDragging ? 'dragging' : ''} ${uploadedData.length > 0 ? 'has-data' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files[0];
                  if (file) processFile(file);
                }}
              >
                <Upload size={40} className="icon-upload" />
                <p className="upload-text">Arrastra tu archivo aquí o</p>
                <input
                  type="file"
                  id="fileInput"
                  className="hidden-input"
                  accept=".csv"
                  onChange={handleFileUpload}
                />
                <label htmlFor="fileInput" className="btn-browse">Explorar Archivo</label>
                <p className="file-hint">Formato aceptado: .csv</p>
              </div>
            ) : (
              <div className="upload-disabled">
                <AlertCircle size={24} />
                <p>Primero selecciona una obra para habilitar la carga.</p>
              </div>
            )}
          </div>

          {uploadedData.length > 0 && (
            <div className="status-card">
              <div className="status-header">
                <CheckCircle2 size={20} className="text-green" />
                <span>{uploadedData.length} actividades listas</span>
              </div>
              <button className="btn-reset" onClick={() => setUploadedData([])}>
                <Trash2 size={16} /> Limpiar Carga
              </button>
            </div>
          )}
        </div>

        <div className="planning-content">
          {uploadedData.length > 0 ? (
            <div className="preview-card">
              <div className="table-header">
                <h3>Vista Previa del Programa</h3>
              </div>
              <div className="table-wrapper">
                <table className="program-table">
                  <thead>
                    <tr>
                      <th>ID Task</th>
                      <th>Actividad</th>
                      <th>Sub-ID</th>
                      <th>Detalle</th>
                      <th>Inicio</th>
                      <th>Fin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedData.map((row) => (
                      <tr key={row.id}>
                        <td className="font-mono">{row.taskId}</td>
                        <td className="font-bold">{row.actividad}</td>
                        <td className="text-blue">{row.subTaskId}</td>
                        <td className="text-muted">{row.descripcion}</td>
                        <td><span className="badge-date"><Calendar size={12} /> {row.inicio}</span></td>
                        <td><span className="badge-date"><Calendar size={12} /> {row.fin}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <FileSpreadsheet size={60} className="bg-icon" />
              <h3>No hay datos cargados</h3>
              <p>Sigue los pasos de la izquierda para importar el programa de obra.</p>
            </div>
          )}
        </div>
      </div>

      {successMessage && (
        <div className="toast-success">
          <CheckCircle2 size={24} />
          <span>{successMessage}</span>
        </div>
      )}

      <style>{`
                .planning-wrapper { padding: 0.5rem; }
                .planning-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .title { font-size: 1.5rem; color: #1e293b; font-weight: 800; margin: 0; }
                .subtitle { color: #64748b; font-size: 0.875rem; margin: 0.25rem 0 0 0; }
                .btn-template { background: white; border: 1.5px solid #2563eb; color: #2563eb; padding: 0.75rem 1.25rem; border-radius: 0.75rem; font-weight: 700; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s; }
                .btn-template:hover { background: #eff6ff; }
                .planning-grid { display: grid; grid-template-columns: 320px 1fr; gap: 1.5rem; }
                .setup-card { background: white; border-radius: 1rem; border: 1px solid #e2e8f0; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                .custom-select { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.6rem; font-size: 0.875rem; background-color: #f8fafc; cursor: pointer; }
                .upload-zone { margin-top: 1.5rem; border: 2px dashed #cbd5e1; border-radius: 1rem; padding: 2rem 1.5rem; text-align: center; transition: all 0.3s; background: #fbfcfe; }
                .upload-zone.dragging { border-color: #2563eb; background: #f0f7ff; }
                .upload-zone.has-data { border-style: solid; border-color: #22c55e; background: #f0fdf4; }
                .icon-upload { color: #94a3b8; margin-bottom: 1rem; }
                .upload-text { font-size: 0.8rem; color: #64748b; margin-bottom: 1rem; }
                .hidden-input { display: none; }
                .btn-browse { background: #1e293b; color: white; padding: 0.6rem 1rem; border-radius: 0.5rem; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
                .file-hint { font-size: 0.7rem; color: #94a3b8; margin-top: 1.5rem; }
                .upload-disabled { margin-top: 1.5rem; background: #fef2f2; border: 1px solid #fee2e2; border-radius: 1rem; padding: 2rem 1.5rem; text-align: center; color: #dc2626; }
                .upload-disabled p { font-size: 0.8rem; margin-top: 0.5rem; font-weight: 600; }
                .status-card { margin-top: 1rem; background: white; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 1rem; display: flex; justify-content: space-between; align-items: center; }
                .status-header { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 600; color: #0f172a; }
                .text-green { color: #22c55e; }
                .btn-reset { background: none; border: none; color: #ef4444; font-size: 0.75rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.25rem; }
                .preview-card { background: white; border-radius: 1rem; border: 1px solid #e2e8f0; border-top: 4px solid #2563eb; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                .table-header { padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; }
                .table-header h3 { font-size: 1rem; margin: 0; color: #0f172a; }
                .table-wrapper { overflow-x: auto; max-height: 500px; }
                .program-table { width: 100%; border-collapse: collapse; text-align: left; }
                .program-table th { padding: 1rem 1.5rem; background: #f8fafc; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; }
                .program-table td { padding: 1rem 1.5rem; border-bottom: 1px solid #f1f5f9; font-size: 0.8rem; }
                .font-mono { font-family: monospace; font-weight: 700; color: #334155; }
                .font-bold { font-weight: 700; }
                .text-blue { color: #2563eb; font-weight: 700; }
                .text-muted { color: #64748b; }
                .badge-date { display: inline-flex; align-items: center; gap: 0.4rem; background: #f1f5f9; padding: 0.25rem 0.6rem; border-radius: 0.4rem; color: #475569; font-weight: 600; font-size: 0.75rem; }
                .empty-state { height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; border-radius: 1rem; border: 1px dashed #cbd5e1; }
                .bg-icon { color: #f1f5f9; margin-bottom: 1rem; }
                .empty-state h3 { color: #94a3b8; font-size: 1rem; margin-bottom: 0.5rem; }
                .empty-state p { color: #cbd5e1; font-size: 0.8rem; }
                .toast-success { position: fixed; bottom: 2rem; right: 2rem; background: #0f172a; color: white; padding: 1rem 2rem; border-radius: 1rem; display: flex; align-items: center; gap: 1rem; border-left: 5px solid #22c55e; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); }
            `}</style>
    </div>
  );
};

export default Planificacion;
