import React, { useState } from 'react';
import { Plus, Trash2, Save, ArrowLeft, Pencil, X, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Especialidades = () => {
    const [especialidades, setEspecialidades] = useState([
        { id: 1, nombre: 'Electricidad', descripcion: 'Instalaciones eléctricas de baja tensión' },
        { id: 2, nombre: 'Climatización', descripcion: 'HVAC y ventilación' },
    ]);

    const [modal, setModal] = useState({ show: false, type: '', data: null });
    const [confirmAction, setConfirmAction] = useState({ show: false, title: '', message: '', action: null });

    const openForm = (type, data = null) => {
        setModal({
            show: true,
            type,
            data: data ? { ...data } : { nombre: '', descripcion: '' }
        });
    };

    const closeForm = () => setModal({ show: false, type: '', data: null });

    const handleActionRequest = (title, message, action) => {
        setConfirmAction({ show: true, title, message, action });
    };

    const executeAction = () => {
        confirmAction.action();
        setConfirmAction({ show: false, title: '', message: '', action: null });
    };

    const handleSave = () => {
        if (!modal.data.nombre) return;

        const action = () => {
            if (modal.type === 'add') {
                setEspecialidades([...especialidades, { ...modal.data, id: Date.now() }]);
            } else {
                setEspecialidades(especialidades.map(e => e.id === modal.data.id ? modal.data : e));
            }
            closeForm();
        };

        handleActionRequest(
            modal.type === 'add' ? 'Confirmar Adición' : 'Confirmar Modificación',
            `¿Está seguro que desea ${modal.type === 'add' ? 'crear' : 'actualizar'} esta especialidad?`,
            action
        );
    };

    const handleDelete = (id) => {
        const action = () => {
            setEspecialidades(especialidades.filter(e => e.id !== id));
        };

        handleActionRequest(
            'Confirmar Eliminación',
            '¿Está seguro que desea eliminar esta especialidad? Esta acción no se puede deshacer.',
            action
        );
    };

    return (
        <div className="module-container">
            <div className="action-header">
                <Link to="/mantenedores" className="btn-back">
                    <ArrowLeft size={16} /> Volver a Mantenedores
                </Link>
                <button className="btn btn-primary" onClick={() => openForm('add')}>
                    <Plus size={16} /> Nueva Especialidad
                </button>
            </div>

            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th className="text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {especialidades.map(e => (
                            <tr key={e.id}>
                                <td className="font-bold">{e.nombre}</td>
                                <td>{e.descripcion}</td>
                                <td className="text-right">
                                    <div className="action-buttons">
                                        <button className="btn-icon edit" onClick={() => openForm('edit', e)}>
                                            <Pencil size={16} />
                                        </button>
                                        <button className="btn-icon delete" onClick={() => handleDelete(e.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Form */}
            {modal.show && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{modal.type === 'add' ? 'Nueva Especialidad' : 'Editar Especialidad'}</h3>
                            <button className="btn-close" onClick={closeForm}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nombre de Especialidad</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Gasfitería"
                                    value={modal.data.nombre}
                                    onChange={(ev) => setModal({ ...modal, data: { ...modal.data, nombre: ev.target.value } })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea
                                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    rows="3"
                                    placeholder="Ingrese una descripción si es necesario..."
                                    value={modal.data.descripcion}
                                    onChange={(ev) => setModal({ ...modal, data: { ...modal.data, descripcion: ev.target.value } })}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={closeForm}>Cancelar</button>
                            <button className="btn-primary" onClick={handleSave}>
                                <Save size={16} /> Guardar Especialidad
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Dialog */}
            {confirmAction.show && (
                <div className="modal-overlay z-max">
                    <div className="confirm-content">
                        <div className="confirm-icon" style={{ color: '#f59e0b', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                            <AlertCircle size={32} />
                        </div>
                        <h4>{confirmAction.title}</h4>
                        <p>{confirmAction.message}</p>
                        <div className="confirm-buttons">
                            <button className="btn-secondary" onClick={() => setConfirmAction({ ...confirmAction, show: false })}>Cancelar</button>
                            <button className="btn-primary" onClick={executeAction}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .module-container { padding: 0.5rem; animation: fadeIn 0.3s ease; }
                .action-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .btn-back { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; color: #64748b; font-size: 0.875rem; font-weight: 500; }
                .btn-back:hover { color: #2563eb; }
                
                .data-table-container { background: white; border-radius: 0.75rem; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); }
                .data-table { width: 100%; border-collapse: collapse; text-align: left; }
                .data-table th { background: #f8fafc; padding: 1rem 1.5rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; }
                .data-table td { padding: 1rem 1.5rem; border-top: 1px solid #f1f5f9; font-size: 0.875rem; }
                
                .font-bold { font-weight: 600; color: #1e293b; }
                .text-right { text-align: right; }
                .action-buttons { display: flex; justify-content: flex-end; gap: 0.5rem; }
                .btn-icon { padding: 0.5rem; border-radius: 0.375rem; border: 1px solid #e2e8f0; background: white; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
                .btn-icon.edit { color: #2563eb; }
                .btn-icon.edit:hover { background: #eff6ff; border-color: #bfdbfe; }
                .btn-icon.delete { color: #dc2626; }
                .btn-icon.delete:hover { background: #fef2f2; border-color: #fecaca; }

                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 1rem; z-index: 50; }
                .z-max { z-index: 100; }
                .modal-content { background: white; width: 100%; max-width: 500px; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
                .modal-header { padding: 1.5rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
                .modal-header h3 { margin: 0; font-size: 1.125rem; }
                .modal-body { padding: 1.5rem; }
                .modal-footer { padding: 1.25rem 1.5rem; background: #f8fafc; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 0.75rem; border-radius: 0 0 1rem 1rem; }
                
                .form-group { margin-bottom: 1.25rem; }
                .form-group label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 0.5rem; letter-spacing: 0.05em; }
                .form-group input { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.875rem; outline: none; transition: border-color 0.2s; }
                .form-group input:focus { border-color: #2563eb; }
                
                .confirm-content { background: white; padding: 2rem; border-radius: 1rem; text-align: center; max-width: 400px; width: 100%; }
                .confirm-buttons { display: flex; gap: 1rem; justify-content: center; }

                .btn-primary { background: #2563eb; color: white; padding: 0.625rem 1.25rem; border-radius: 0.5rem; border: none; font-weight: 600; font-size: 0.875rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
                .btn-primary:hover { background: #1d4ed8; }
                .btn-secondary { background: white; color: #475569; padding: 0.625rem 1.25rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; font-weight: 600; font-size: 0.875rem; cursor: pointer; }
                .btn-secondary:hover { background: #f8fafc; }
                .btn-close { background: none; border: none; color: #94a3b8; cursor: pointer; }
                
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default Especialidades;
