import React, { useState, useEffect } from 'react';
import { Save, Search, Building2, LayoutGrid, Check, AlertCircle, ArrowLeft, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const Partidas = () => {
    // Mock Data (Ideally from a context or API)
    const [proyectos] = useState([
        { id: 1, nombre: 'Edificio Horizonte', actividades: [1, 2] },
        { id: 2, nombre: 'Mall Plaza Norte', actividades: [2] }
    ]);

    const [actividades] = useState([
        {
            id: 1,
            nombre: 'Hormigón',
            subActividades: [
                { id: 101, nombre: 'Excavaciones', descripcion: 'Fundaciones y pozos' },
                { id: 102, nombre: 'Enfierradura', descripcion: 'Armadura de acero' }
            ]
        },
        {
            id: 2,
            nombre: 'Acero Estructural',
            subActividades: [
                { id: 201, nombre: 'Montaje', descripcion: 'Izamiento de perfiles' }
            ]
        }
    ]);

    // Selection State
    const [selectedProj, setSelectedProj] = useState(null);
    const [selectedAct, setSelectedAct] = useState(null);

    // Weighting Data (ProjectID_ActID_SubID)
    const [ponderaciones, setPonderaciones] = useState({});
    const [confirmAction, setConfirmAction] = useState({ show: false, title: '', message: '', action: null });
    const [successAlert, setSuccessAlert] = useState({ show: false, message: '' });

    const handleWeightChange = (subId, field, value) => {
        const key = `${selectedProj?.id}_${selectedAct?.id}_${subId}`;
        // Allow empty string or numbers within 0-100
        let val = value;
        if (value !== '') {
            val = Math.min(100, Math.max(0, parseFloat(value) || 0));
        }

        setPonderaciones({
            ...ponderaciones,
            [key]: {
                ...(ponderaciones[key] || { subId, cubicador: '', planificador: '', edp: '' }),
                [field]: val
            }
        });
    };

    const getWeightValue = (subId, field) => {
        const key = `${selectedProj?.id}_${selectedAct?.id}_${subId}`;
        const val = ponderaciones[key]?.[field];
        return (val === undefined || val === '') ? '' : val;
    };

    const handleSave = () => {
        if (!selectedProj || !selectedAct) return;

        const action = () => {
            // In a real app, this would be an API call
            console.log('Saving weightings:', ponderaciones);
        };

        setConfirmAction({
            show: true,
            title: 'Confirmar Ponderaciones',
            message: `¿Desea guardar los valores de ponderación para las sub-actividades de "${selectedAct.nombre}" en la obra "${selectedProj.nombre}"?`,
            action
        });
    };

    const executeAction = () => {
        confirmAction.action();
        setConfirmAction({ show: false, title: '', message: '', action: null });
        setSuccessAlert({ show: true, message: 'Ponderaciones guardadas con éxito' });
        setTimeout(() => setSuccessAlert({ show: false, message: '' }), 2500);
    };

    const availableActivities = selectedProj
        ? actividades.filter(a => selectedProj.actividades.includes(a.id))
        : [];

    return (
        <div className="partidas-container">
            <div className="top-nav">
                <Link to="/mantenedores" className="btn-back">
                    <ArrowLeft size={16} /> Volver a Mantenedores
                </Link>
                <div className="page-title-badge">
                    <Layers size={20} className="text-blue-600" />
                    <h2 className="text-xl font-extrabold text-slate-800">Ponderación de Partidas</h2>
                </div>
            </div>

            <div className="selection-header">
                <div className="form-group flex-1">
                    <label>1. Seleccionar Obra / Proyecto</label>
                    <div className="select-wrapper">
                        <Building2 size={16} className="select-icon" />
                        <select
                            onChange={(e) => {
                                const p = proyectos.find(x => x.id === parseInt(e.target.value));
                                setSelectedProj(p);
                                setSelectedAct(null);
                            }}
                            value={selectedProj?.id || ''}
                        >
                            <option value="">-- Seleccione una obra --</option>
                            {proyectos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                        </select>
                    </div>
                </div>

                <div className="form-group flex-1">
                    <label>2. Seleccionar Actividad</label>
                    <div className="select-wrapper">
                        <LayoutGrid size={16} className="select-icon" />
                        <select
                            onChange={(e) => {
                                const a = actividades.find(x => x.id === parseInt(e.target.value));
                                setSelectedAct(a);
                            }}
                            value={selectedAct?.id || ''}
                            disabled={!selectedProj}
                        >
                            <option value="">-- Seleccione actividad --</option>
                            {availableActivities.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex items-end">
                    <button
                        className="btn-primary"
                        disabled={!selectedProj || !selectedAct}
                        onClick={handleSave}
                    >
                        <Save size={18} /> Guardar Cambios
                    </button>
                </div>
            </div>

            {selectedProj && selectedAct ? (
                <div className="weighting-section animate-in fade-in duration-300">
                    <div className="table-container">
                        <table className="weighting-table">
                            <thead>
                                <tr>
                                    <th className="text-left w-1/3">Sub-Actividad</th>
                                    <th>Pondera Cubicador (%)</th>
                                    <th>Pondera Planificador (%)</th>
                                    <th>Pondera EDP (%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedAct.subActividades.map(sub => (
                                    <tr key={sub.id}>
                                        <td className="sub-info">
                                            <div className="font-bold text-slate-800">{sub.nombre}</div>
                                            <div className="text-[10px] text-slate-400 uppercase tracking-tighter">{sub.descripcion}</div>
                                        </td>
                                        <td>
                                            <div className="input-percentage">
                                                <input
                                                    type="number"
                                                    min="0" max="100"
                                                    value={getWeightValue(sub.id, 'cubicador')}
                                                    onFocus={(e) => e.target.select()}
                                                    onChange={(e) => handleWeightChange(sub.id, 'cubicador', e.target.value)}
                                                />
                                                <span>%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="input-percentage">
                                                <input
                                                    type="number"
                                                    min="0" max="100"
                                                    value={getWeightValue(sub.id, 'planificador')}
                                                    onFocus={(e) => e.target.select()}
                                                    onChange={(e) => handleWeightChange(sub.id, 'planificador', e.target.value)}
                                                />
                                                <span>%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="input-percentage">
                                                <input
                                                    type="number"
                                                    min="0" max="100"
                                                    value={getWeightValue(sub.id, 'edp')}
                                                    onFocus={(e) => e.target.select()}
                                                    onChange={(e) => handleWeightChange(sub.id, 'edp', e.target.value)}
                                                />
                                                <span>%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="empty-state-large">
                    <Layers size={48} className="text-slate-200 mb-4" />
                    <h3>Seleccione una Obra y Actividad</h3>
                    <p>Debe seleccionar ambos parámetros para configurar las ponderaciones de avance.</p>
                </div>
            )}

            {/* Confirmation Dialog */}
            {confirmAction.show && (
                <div className="modal-overlay">
                    <div className="confirm-content">
                        <div className="confirm-icon">
                            <AlertCircle size={32} />
                        </div>
                        <h4>{confirmAction.title}</h4>
                        <p>{confirmAction.message}</p>
                        <div className="confirm-buttons">
                            <button className="btn-secondary" onClick={() => setConfirmAction({ ...confirmAction, show: false })}>Cancelar</button>
                            <button className="btn-primary" onClick={executeAction}>Confirmar Ponderaciones</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Alert */}
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
                .partidas-container { padding: 0.5rem; animation: fadeIn 0.3s ease; }
                .top-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .page-title-badge { display: flex; align-items: center; gap: 0.75rem; background: #eff6ff; padding: 0.5rem 1.25rem; border-radius: 1rem; border: 1px solid #bfdbfe; }
                
                .selection-header { display: flex; gap: 1.5rem; background: white; padding: 2rem; border-radius: 1rem; border: 1px solid #e2e8f0; margin-bottom: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
                
                .form-group label { display: block; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 0.75rem; letter-spacing: 0.05em; }
                .select-wrapper { position: relative; }
                .select-icon { position: absolute; left: 1rem; top: 1/2; transform: translateY(80%); color: #94a3b8; pointer-events: none; }
                .select-wrapper select { width: 100%; padding: 0.75rem 1rem 0.75rem 2.75rem; border: 1px solid #d1d5db; border-radius: 0.75rem; font-size: 0.875rem; outline: none; appearance: none; background: white; background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="%2394a3b8"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1rem; }
                .select-wrapper select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
                .select-wrapper select:disabled { background-color: #f8fafc; color: #94a3b8; cursor: not-allowed; }

                .table-container { background: white; border-radius: 1rem; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
                .weighting-table { width: 100%; border-collapse: collapse; }
                .weighting-table th { background: #f8fafc; padding: 1rem 1.5rem; text-align: center; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #f1f5f9; }
                .weighting-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; text-align: center; }
                
                .sub-info { text-align: left !important; }
                
                .input-percentage { display: inline-flex; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 0.25rem 0.75rem; width: 100px; transition: all 0.2s; }
                .input-percentage:focus-within { border-color: #3b82f6; background: white; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.05); }
                .input-percentage input { width: 100%; border: none; background: transparent; outline: none; font-size: 0.875rem; font-weight: 700; color: #1e293b; text-align: right; }
                .input-percentage span { font-size: 0.75rem; font-weight: 800; color: #94a3b8; margin-left: 0.35rem; }

                .empty-state-large { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 6rem 2rem; background: white; border-radius: 1rem; border: 2px dashed #e2e8f0; color: #94a3b8; text-align: center; }
                .empty-state-large h3 { color: #475569; font-weight: 800; margin-bottom: 0.5rem; }
                .empty-state-large p { font-size: 0.875rem; max-width: 300px; }

                .btn-primary { background: #2563eb; color: white; padding: 0.75rem 1.5rem; border-radius: 0.75rem; border: none; font-weight: 700; font-size: 0.875rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); transition: all 0.2s; }
                .btn-primary:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3); }
                .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(1); }
                
                .btn-secondary { background: white; color: #475569; padding: 0.75rem 1.5rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; font-weight: 700; font-size: 0.875rem; cursor: pointer; }
                .btn-back { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; color: #64748b; font-size: 0.875rem; font-weight: 700; }
                
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; }
                .confirm-content { background: white; padding: 2.5rem; border-radius: 1.5rem; text-align: center; max-width: 450px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
                .confirm-icon { color: #f59e0b; margin-bottom: 1.5rem; display: flex; justify-content: center; }
                .confirm-buttons { display: flex; gap: 1rem; justify-content: center; margin-top: 2.5rem; }
                
                .success-alert-overlay { position: fixed; top: 2rem; right: 2rem; z-index: 200; animation: slideInRight 0.3s ease; }
                .success-alert-card { background: #0f172a; color: white; padding: 1rem 1.5rem; border-radius: 1rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); border-left: 4px solid #22c55e; }
                .success-icon-bg { background: #22c55e; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                
                @keyframes slideInRight { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default Partidas;
