import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, Search, AlertCircle } from 'lucide-react';

const Actividades = () => {
    const [actividades, setActividades] = useState([
        {
            id: 1,
            nombre: 'Hormigón',
            descripcion: 'Todo lo relacionado a concreto y fundaciones.',
            subActividades: [
                { id: 101, nombre: 'Excavaciones', descripcion: 'Excavación masiva y fundaciones' },
                { id: 102, nombre: 'Enfierradura', descripcion: 'Corte y doblado de fierro' }
            ]
        },
        {
            id: 2,
            nombre: 'Acero Estructural',
            descripcion: 'Perfiles, vigas y estructuras metálicas.',
            subActividades: [
                { id: 201, nombre: 'Montaje de Vigas', descripcion: 'Posicionamiento y nivelación' }
            ]
        },
        { id: 3, nombre: 'Instalaciones Sanitarias', descripcion: 'Redes de agua y alcantarillado.', subActividades: [] },
    ]);

    const [modal, setModal] = useState({ show: false, type: '', data: null });
    const [confirmAction, setConfirmAction] = useState({ show: false, title: '', message: '', action: null });
    const [successAlert, setSuccessAlert] = useState({ show: false, message: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [tempSub, setTempSub] = useState({ id: null, nombre: '', descripcion: '' });

    const openForm = (type, data = null) => {
        setModal({
            show: true,
            type,
            data: data ? JSON.parse(JSON.stringify(data)) : { nombre: '', descripcion: '', subActividades: [] }
        });
        setTempSub({ id: null, nombre: '', descripcion: '' });
    };

    const closeForm = () => setModal({ show: false, type: '', data: null });

    const handleActionRequest = (title, message, action) => {
        setConfirmAction({ show: true, title, message, action });
    };

    const executeAction = () => {
        confirmAction.action();
        const msg = confirmAction.title.includes('Eliminación') ? 'Eliminado con éxito' : 'Cambios guardados correctamente';
        setConfirmAction({ show: false, title: '', message: '', action: null });
        setSuccessAlert({ show: true, message: msg });
        setTimeout(() => setSuccessAlert({ show: false, message: '' }), 2500);
    };

    const handleSave = () => {
        const action = () => {
            if (modal.type === 'add') {
                const newId = actividades.length > 0 ? Math.max(...actividades.map(d => d.id)) + 1 : 1;
                setActividades([...actividades, { ...modal.data, id: newId }]);
            } else {
                setActividades(actividades.map(d => d.id === modal.data.id ? modal.data : d));
            }
            closeForm();
        };

        handleActionRequest(
            modal.type === 'add' ? 'Confirmar Adición' : 'Confirmar Modificación',
            `¿Está seguro que desea ${modal.type === 'add' ? 'crear' : 'actualizar'} esta actividad?`,
            action
        );
    };

    const handleDelete = (id) => {
        const actividad = actividades.find(d => d.id === id);
        const action = () => {
            setActividades(actividades.filter(d => d.id !== id));
        };

        handleActionRequest(
            'Confirmar Eliminación',
            `¿Está seguro que desea eliminar la actividad "${actividad.nombre}"? Esta acción no se puede deshacer.`,
            action
        );
    };

    const handleSaveSub = () => {
        if (!tempSub.nombre.trim()) return;
        const isEdit = tempSub.id !== null;

        const action = () => {
            let updatedSubs;
            if (isEdit) {
                updatedSubs = modal.data.subActividades.map(s => s.id === tempSub.id ? tempSub : s);
            } else {
                updatedSubs = [...modal.data.subActividades, { ...tempSub, id: Date.now() }];
            }
            setModal({ ...modal, data: { ...modal.data, subActividades: updatedSubs } });
            setTempSub({ id: null, nombre: '', descripcion: '' });
        };

        handleActionRequest(
            isEdit ? 'Confirmar Edición Sub-actividad' : 'Confirmar Nueva Sub-actividad',
            `¿Desea ${isEdit ? 'actualizar' : 'agregar'} la sub-actividad "${tempSub.nombre}"?`,
            action
        );
    };

    const handleDeleteSub = (id) => {
        const sub = modal.data.subActividades.find(s => s.id === id);
        const action = () => {
            setModal({
                ...modal,
                data: { ...modal.data, subActividades: modal.data.subActividades.filter(s => s.id !== id) }
            });
        };

        handleActionRequest(
            'Confirmar Eliminación',
            `¿Desea quitar la sub-actividad "${sub.nombre}"?`,
            action
        );
    };

    const filteredActividades = actividades.filter(d =>
        d.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="activities-container">
            <div className="action-header">
                <div className="search-bar">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Buscar actividad..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="btn-primary" onClick={() => openForm('add')}>
                    <Plus size={18} /> Nueva Actividad
                </button>
            </div>

            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th className="text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredActividades.length > 0 ? filteredActividades.map(d => (
                            <tr key={d.id}>
                                <td><span className="badge-id">#{d.id}</span></td>
                                <td className="font-bold">{d.nombre}</td>
                                <td className="text-muted">{d.descripcion}</td>
                                <td className="text-right">
                                    <div className="action-buttons">
                                        <button className="btn-icon edit" onClick={() => openForm('edit', d)}>
                                            <Pencil size={16} />
                                        </button>
                                        <button className="btn-icon delete" onClick={() => handleDelete(d.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="empty-row">No se encontraron actividades</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Form */}
            {modal.show && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{modal.type === 'add' ? 'Nueva Actividad' : 'Editar Actividad'}</h3>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <button className="btn-primary" onClick={handleSave}>Guardar</button>
                                <button className="btn-close" onClick={closeForm}><X size={20} /></button>
                            </div>
                        </div>
                        <div className="modal-body scrollable">
                            <div className="form-section">
                                <h4 className="section-title">Datos Principales</h4>
                                <div className="form-grid-3">
                                    <div className="form-group">
                                        <label>Nombre de la Actividad</label>
                                        <input
                                            type="text"
                                            value={modal.data.nombre}
                                            onChange={(e) => setModal({ ...modal, data: { ...modal.data, nombre: e.target.value } })}
                                            placeholder="Ej: Albañilería"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Descripción</label>
                                        <input
                                            type="text"
                                            value={modal.data.descripcion}
                                            onChange={(e) => setModal({ ...modal, data: { ...modal.data, descripcion: e.target.value } })}
                                            placeholder="Detalle breve..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Especialidad Correspondiente</label>
                                        <select
                                            className="custom-select"
                                            value={modal.data.especialidadId || ""}
                                            onChange={(e) => setModal({ ...modal, data: { ...modal.data, especialidadId: e.target.value } })}
                                        >
                                            <option value="">Seleccionar especialidad...</option>
                                            <option value="1">Electricidad</option>
                                            <option value="2">Climatización</option>
                                            <option value="3">Gasfitería</option>
                                            <option value="4">Obras Civiles</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {modal.type === 'edit' && (
                                <div className="form-section mt-6">
                                    <h4 className="section-title">Sub-Actividades Relacionadas</h4>
                                    <div className="sub-form-row">
                                        <div className="form-group flex-1">
                                            <label>Nombre Sub-actividad</label>
                                            <input
                                                type="text"
                                                placeholder="Ej: Excavación manual"
                                                value={tempSub.nombre}
                                                onChange={(e) => setTempSub({ ...tempSub, nombre: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group flex-1">
                                            <label>Descripción (Opcional)</label>
                                            <input
                                                type="text"
                                                placeholder="Detalle breve..."
                                                value={tempSub.descripcion}
                                                onChange={(e) => setTempSub({ ...tempSub, descripcion: e.target.value })}
                                            />
                                        </div>
                                        <button className="btn-add-inline" onClick={handleSaveSub} type="button">
                                            {tempSub.id ? <Check size={18} /> : <Plus size={18} />}
                                            {tempSub.id ? 'Actualizar' : 'Agregar'}
                                        </button>
                                    </div>

                                    <div className="sub-list">
                                        {modal.data.subActividades && modal.data.subActividades.length > 0 ? modal.data.subActividades.map(s => (
                                            <div key={s.id} className="sub-item">
                                                <div className="sub-info">
                                                    <span className="sub-name">{s.nombre}</span>
                                                    <span className="sub-desc">{s.descripcion}</span>
                                                </div>
                                                <div className="sub-actions">
                                                    <button className="btn-sub-edit" onClick={() => setTempSub(s)}><Pencil size={12} /></button>
                                                    <button className="btn-sub-delete" onClick={() => handleDeleteSub(s.id)}><Trash2 size={12} /></button>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="sub-empty">No hay sub-actividades definidas.</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={closeForm}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Dialog */}
            {confirmAction.show && (
                <div className="modal-overlay z-max">
                    <div className="confirm-content">
                        <div className="confirm-icon">
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

            {/* Success Alert Overlay */}
            {successAlert.show && (
                <div className="success-alert-overlay">
                    <div className="success-alert-card">
                        <div className="success-icon-bg">
                            <Check size={20} />
                        </div>
                        <p>{successAlert.message}</p>
                    </div>
                </div>
            )}

            <style>{`
                .activities-container {
                    padding: 0.5rem;
                }
                .action-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    gap: 1rem;
                }
                .search-bar {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: white;
                    padding: 0.5rem 1rem;
                    border-radius: 0.75rem;
                    border: 1px solid #e2e8f0;
                    max-width: 400px;
                }
                .search-bar input {
                    border: none;
                    outline: none;
                    width: 100%;
                    font-size: 0.875rem;
                }
                .data-table-container {
                    background: white;
                    border-radius: 0.75rem;
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
                }
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }
                .data-table th {
                    background: #f8fafc;
                    padding: 1rem 1.5rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: #64748b;
                    letter-spacing: 0.05em;
                }
                .data-table td {
                    padding: 1rem 1.5rem;
                    border-top: 1px solid #f1f5f9;
                    font-size: 0.875rem;
                }
                .badge-id {
                    background: #f1f5f9;
                    color: #475569;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.375rem;
                    font-family: monospace;
                    font-weight: 600;
                }
                .font-bold { font-weight: 600; color: #1e293b; }
                .text-muted { color: #64748b; }
                .text-right { text-align: right; }
                .action-buttons {
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.5rem;
                }
                .btn-icon {
                    padding: 0.5rem;
                    border-radius: 0.375rem;
                    border: 1px solid #e2e8f0;
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .btn-icon.edit { color: #2563eb; }
                .btn-icon.edit:hover { background: #eff6ff; border-color: #bfdbfe; }
                .btn-icon.delete { color: #dc2626; }
                .btn-icon.delete:hover { background: #fef2f2; border-color: #fecaca; }
                
                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(15, 23, 42, 0.5);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    z-index: 50;
                }
                .z-max { z-index: 100; }
                .modal-content {
                    background: white;
                    width: 100%;
                    max-width: 650px;
                    border-radius: 1rem;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }
                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid #f1f5f9;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-header h3 { margin: 0; font-size: 1.125rem; }
                .modal-body { padding: 1.5rem; }
                .modal-body.scrollable { max-height: 70vh; overflow-y: auto; }
                
                .section-title { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: #3b82f6; letter-spacing: 0.1em; margin-bottom: 1.25rem; padding-bottom: 0.5rem; border-bottom: 2px solid #eff6ff; }
                
                .sub-form-row { display: flex; gap: 1rem; align-items: flex-end; background: #f8fafc; padding: 1rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; margin-bottom: 1.5rem; }
                .btn-add-inline { background: #0f172a; color: white; border: none; padding: 0.625rem 1rem; border-radius: 0.5rem; font-weight: 700; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; }
                
                .sub-list { border: 1px solid #f1f5f9; border-radius: 0.75rem; overflow: hidden; }
                .sub-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; border-bottom: 1px solid #f1f5f9; background: white; }
                .sub-item:last-child { border-bottom: none; }
                .sub-info { display: flex; flex-direction: column; }
                .sub-name { font-size: 0.875rem; font-weight: 700; color: #1e293b; }
                .sub-desc { font-size: 0.75rem; color: #64748b; }
                .sub-actions { display: flex; gap: 0.5rem; }
                .btn-sub-edit { color: #2563eb; background: none; border: none; cursor: pointer; opacity: 0.6; }
                .btn-sub-delete { color: #ef4444; background: none; border: none; cursor: pointer; opacity: 0.6; }
                .btn-sub-edit:hover, .btn-sub-delete:hover { opacity: 1; }
                .sub-empty { padding: 1.5rem; text-align: center; color: #94a3b8; font-size: 0.875rem; font-style: italic; }

                .modal-footer {
                    padding: 1.25rem 1.5rem;
                    background: #f8fafc;
                    border-top: 1px solid #f1f5f9;
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem;
                    border-radius: 0 0 1rem 1rem;
                }
                .form-group { margin-bottom: 1.25rem; }
                .form-group label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: #64748b;
                    margin-bottom: 0.5rem;
                    letter-spacing: 0.05em;
                }
                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .form-group input:focus, .form-group textarea:focus {
                    border-color: #2563eb;
                    ring: 2px solid #bfdbfe;
                }
                
                .form-grid-3 {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                }

                .custom-select {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    outline: none;
                    background-color: white;
                    cursor: pointer;
                }
                
                /* Confirm Dialog Specific */
                .confirm-content {
                    background: white;
                    padding: 2rem;
                    border-radius: 1rem;
                    text-align: center;
                    max-width: 400px;
                    width: 100%;
                }
                .confirm-icon {
                    color: #f59e0b;
                    margin-bottom: 1rem;
                    display: flex;
                    justify-content: center;
                }
                .confirm-content h4 { margin: 0 0 0.5rem 0; font-size: 1.25rem; color: #0f172a; }
                .confirm-content p { color: #64748b; margin-bottom: 2rem; font-size: 0.875rem; }
                .confirm-buttons { display: flex; gap: 1rem; justify-content: center; }
                
                .success-alert-overlay { position: fixed; top: 2rem; right: 2rem; z-index: 200; animation: slideInRight 0.3s ease; }
                .success-alert-card { background: #0f172a; color: white; padding: 1rem 1.5rem; border-radius: 1rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); border-left: 4px solid #22c55e; }
                .success-icon-bg { background: #22c55e; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                
                @keyframes slideInRight { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
                
                /* Global Button Utils used in other files too */
                .btn-primary {
                    background: #2563eb;
                    color: white;
                    padding: 0.625rem 1.25rem;
                    border-radius: 0.5rem;
                    border: none;
                    font-weight: 600;
                    font-size: 0.875rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: background 0.2s;
                }
                .btn-primary:hover { background: #1d4ed8; }
                .btn-secondary {
                    background: white;
                    color: #475569;
                    padding: 0.625rem 1.25rem;
                    border-radius: 0.5rem;
                    border: 1px solid #e2e8f0;
                    font-weight: 600;
                    font-size: 0.875rem;
                    cursor: pointer;
                }
                .btn-secondary:hover { background: #f8fafc; }
                .btn-close {
                    background: none;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                }
                .btn-close:hover { color: #64748b; }
                .empty-row {
                    text-align: center;
                    padding: 3rem !important;
                    color: #94a3b8;
                    font-style: italic;
                }
            `}</style>
        </div>
    );
};

export default Actividades;
