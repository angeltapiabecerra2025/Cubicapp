import React, { useState } from 'react';
import { Plus, Trash2, Save, Calculator, ArrowLeft, Pencil, X, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const UnidadMedida = () => {
    const [unidades, setUnidades] = useState([
        { id: 1, nombre: 'Metro Cúbico', abreviatura: 'm3', formula: 'largo * ancho * alto', parametros: ['largo', 'ancho', 'alto'] },
        { id: 2, nombre: 'Metro Cuadrado', abreviatura: 'm2', formula: 'largo * ancho', parametros: ['largo', 'ancho'] },
    ]);

    const [modal, setModal] = useState({ show: false, type: '', data: null });
    const [confirmAction, setConfirmAction] = useState({ show: false, title: '', message: '', action: null });
    const [currentParam, setCurrentParam] = useState('');

    const openForm = (type, data = null) => {
        setModal({
            show: true,
            type,
            data: data ? { ...data } : { nombre: '', abreviatura: '', formula: '', parametros: [] }
        });
        setCurrentParam('');
    };

    const closeForm = () => setModal({ show: false, type: '', data: null });

    const handleActionRequest = (title, message, action) => {
        setConfirmAction({ show: true, title, message, action });
    };

    const executeAction = () => {
        confirmAction.action();
        setConfirmAction({ show: false, title: '', message: '', action: null });
    };

    const addParam = () => {
        if (currentParam && !modal.data.parametros.includes(currentParam.toLowerCase())) {
            setModal({
                ...modal,
                data: { ...modal.data, parametros: [...modal.data.parametros, currentParam.toLowerCase()] }
            });
            setCurrentParam('');
        }
    };

    const removeParam = (param) => {
        setModal({
            ...modal,
            data: { ...modal.data, parametros: modal.data.parametros.filter(p => p !== param) }
        });
    };

    const handleSave = () => {
        const action = () => {
            if (modal.type === 'add') {
                setUnidades([...unidades, { ...modal.data, id: Date.now() }]);
            } else {
                setUnidades(unidades.map(u => u.id === modal.data.id ? modal.data : u));
            }
            closeForm();
        };

        handleActionRequest(
            modal.type === 'add' ? 'Confirmar Adición' : 'Confirmar Modificación',
            `¿Está seguro que desea ${modal.type === 'add' ? 'crear' : 'actualizar'} esta unidad de medida?`,
            action
        );
    };

    const handleDelete = (id) => {
        const action = () => {
            setUnidades(unidades.filter(u => u.id !== id));
        };

        handleActionRequest(
            'Confirmar Eliminación',
            '¿Está seguro que desea eliminar esta unidad de medida? Esta acción no se puede deshacer.',
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
                    <Plus size={16} /> Nueva Unidad
                </button>
            </div>

            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Abrev.</th>
                            <th>Parámetros</th>
                            <th>Fórmula</th>
                            <th className="text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unidades.map(u => (
                            <tr key={u.id}>
                                <td className="font-bold">{u.nombre}</td>
                                <td><span className="badge-blue">{u.abreviatura}</span></td>
                                <td>
                                    <div className="params-list">
                                        {u.parametros.map(p => <span key={p} className="mini-tag">{p}</span>)}
                                    </div>
                                </td>
                                <td className="formula-code"><code>{u.formula}</code></td>
                                <td className="text-right">
                                    <div className="action-buttons">
                                        <button className="btn-icon edit" onClick={() => openForm('edit', u)}>
                                            <Pencil size={16} />
                                        </button>
                                        <button className="btn-icon delete" onClick={() => handleDelete(u.id)}>
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
                    <div className="modal-content wide">
                        <div className="modal-header">
                            <h3>{modal.type === 'add' ? 'Nueva Unidad de Medida' : 'Editar Unidad de Medida'}</h3>
                            <button className="btn-close" onClick={closeForm}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Nombre de Unidad</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Kilogramos"
                                        value={modal.data.nombre}
                                        onChange={(e) => setModal({ ...modal, data: { ...modal.data, nombre: e.target.value } })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Abreviatura</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: kg"
                                        value={modal.data.abreviatura}
                                        onChange={(e) => setModal({ ...modal, data: { ...modal.data, abreviatura: e.target.value } })}
                                    />
                                </div>
                            </div>

                            <div className="params-section">
                                <label>Parámetros Requeridos (Variables)</label>
                                <div className="param-input-group">
                                    <input
                                        type="text"
                                        placeholder="Ej: peso_unitario"
                                        value={currentParam}
                                        onChange={(e) => setCurrentParam(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addParam()}
                                    />
                                    <button className="btn-add-param" onClick={addParam}>Añadir</button>
                                </div>
                                <div className="params-tags">
                                    {modal.data.parametros.map(p => (
                                        <span key={p} className="param-tag">
                                            {p} <X size={12} onClick={() => removeParam(p)} />
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group mt-4">
                                <label>Fórmula Matemática</label>
                                <div className="formula-input-wrapper">
                                    <Calculator size={18} />
                                    <input
                                        type="text"
                                        placeholder="Ej: cantidad * peso_unitario"
                                        value={modal.data.formula}
                                        onChange={(e) => setModal({ ...modal, data: { ...modal.data, formula: e.target.value } })}
                                    />
                                </div>
                                <p className="helper-text">Use los nombres de los parámetros definidos arriba en la fórmula.</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={closeForm}>Cancelar</button>
                            <button className="btn-primary" onClick={handleSave}>
                                <Save size={16} /> Guardar Unidad
                            </button>
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
                .badge-blue { background: #dbeafe; color: #1e40af; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.7rem; font-weight: 700; }
                .mini-tag { background: #f1f5f9; padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.65rem; color: #475569; margin-right: 0.25rem; border: 1px solid #e2e8f0; }
                .formula-code code { background: #f1f5f9; padding: 0.25rem 0.5rem; border-radius: 0.375rem; font-family: monospace; color: #1e293b; font-weight: 500; }
                
                .text-right { text-align: right; }
                .action-buttons { display: flex; justify-content: flex-end; gap: 0.5rem; }
                .btn-icon { padding: 0.5rem; border-radius: 0.375rem; border: 1px solid #e2e8f0; background: white; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
                .btn-icon.edit { color: #2563eb; }
                .btn-icon.edit:hover { background: #eff6ff; border-color: #bfdbfe; }
                .btn-icon.delete { color: #dc2626; }
                .btn-icon.delete:hover { background: #fef2f2; border-color: #fecaca; }

                /* Modal Styles */
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 1rem; z-index: 50; }
                .z-max { z-index: 100; }
                .modal-content { background: white; width: 100%; max-width: 500px; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
                .modal-content.wide { max-width: 600px; }
                .modal-header { padding: 1.5rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
                .modal-header h3 { margin: 0; font-size: 1.125rem; }
                .modal-body { padding: 1.5rem; }
                .modal-footer { padding: 1.25rem 1.5rem; background: #f8fafc; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 0.75rem; border-radius: 0 0 1rem 1rem; }
                
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
                .form-group { margin-bottom: 1.25rem; }
                .form-group label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 0.5rem; letter-spacing: 0.05em; }
                .form-group input { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.875rem; outline: none; transition: border-color 0.2s; }
                .form-group input:focus { border-color: #2563eb; }
                
                .param-input-group { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
                .btn-add-param { background: #0f172a; color: white; border: none; padding: 0 1rem; border-radius: 0.375rem; cursor: pointer; font-weight: 600; font-size: 0.75rem; }
                .params-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
                .param-tag { background: #f1f5f9; padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; border: 1px solid #e2e8f0; }
                .param-tag svg { cursor: pointer; color: #64748b; }
                .param-tag svg:hover { color: #ef4444; }

                .formula-input-wrapper { position: relative; display: flex; align-items: center; }
                .formula-input-wrapper svg { position: absolute; left: 0.75rem; color: #94a3b8; }
                .formula-input-wrapper input { padding-left: 2.5rem; font-family: monospace; background: #f8fafc; color: #2563eb; font-weight: 600; }
                .helper-text { font-size: 0.7rem; color: #94a3b8; margin-top: 0.5rem; }

                /* Confirm Dialog */
                .confirm-content { background: white; padding: 2rem; border-radius: 1rem; text-align: center; max-width: 400px; width: 100%; }
                .confirm-icon { color: #f59e0b; margin-bottom: 1rem; display: flex; justify-content: center; }
                .confirm-content h4 { margin: 0 0 0.5rem 0; font-size: 1.25rem; color: #0f172a; }
                .confirm-content p { color: #64748b; margin-bottom: 2rem; font-size: 0.875rem; }
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

export default UnidadMedida;
