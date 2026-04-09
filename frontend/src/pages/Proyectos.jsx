import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, Search, AlertCircle, Building2, User, Save, ArrowLeft, Users, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Proyectos = () => {
    const [proyectos, setProyectos] = useState([
        {
            id: 1, nombre: 'Edificio Horizonte', descripcion: 'Construcción habitacional 20 pisos',
            actividades: [1, 2],
            personal: [
                { id: 101, rol: 'Administrator', usuario: 'Admin Sistema', email: 'admin@constructora.cl' },
                { id: 102, rol: 'Project Manager', usuario: 'Juan Pérez', email: 'jperez@constructora.cl' }
            ]
        },
        {
            id: 2, nombre: 'Mall Plaza Norte', descripcion: 'Remodelación ala poniente',
            actividades: [2],
            personal: [
                { id: 103, rol: 'Project Manager', usuario: 'Ana López', email: 'alopez@constructora.cl' }
            ]
        }
    ]);

    const ACTIVIDADES_SISTEMA = [
        { id: 1, nombre: 'Hormigón' },
        { id: 2, nombre: 'Acero Estructural' },
        { id: 3, nombre: 'Instalaciones Sanitarias' }
    ];

    const ROLES_SISTEMA = ['Administrator', 'Project Manager'];

    const [modal, setModal] = useState({ show: false, type: '', data: null });
    const [confirmAction, setConfirmAction] = useState({ show: false, title: '', message: '', action: null });
    const [successAlert, setSuccessAlert] = useState({ show: false, message: '' });
    const [searchTerm, setSearchTerm] = useState('');

    // Form Temporary State for Personal
    const [tempPersonal, setTempPersonal] = useState({ rol: ROLES_SISTEMA[0], usuario: '', email: '' });

    const openForm = (type, data = null) => {
        setModal({
            show: true,
            type,
            data: data ? JSON.parse(JSON.stringify(data)) : { nombre: '', descripcion: '', personal: [], actividades: [] }
        });
    };

    const closeForm = () => {
        setModal({ show: false, type: '', data: null });
        setTempPersonal({ rol: ROLES_SISTEMA[0], usuario: '', email: '' });
    };

    const handleActionRequest = (title, message, action) => {
        setConfirmAction({ show: true, title, message, action });
    };

    const executeAction = () => {
        confirmAction.action();
        const msg = confirmAction.title.includes('Eliminación') ? 'Proyecto eliminado con éxito' : 'Cambios guardados correctamente';
        setConfirmAction({ show: false, title: '', message: '', action: null });
        setSuccessAlert({ show: true, message: msg });
        setTimeout(() => setSuccessAlert({ show: false, message: '' }), 2500);
    };

    const handleSaveProject = () => {
        const action = () => {
            if (modal.type === 'add') {
                setProyectos([...proyectos, { ...modal.data, id: Date.now() }]);
            } else {
                setProyectos(proyectos.map(p => p.id === modal.data.id ? modal.data : p));
            }
            closeForm();
        };

        handleActionRequest(
            modal.type === 'add' ? 'Confirmar Nuevo Proyecto' : 'Confirmar Cambios',
            `¿Desea ${modal.type === 'add' ? 'registrar' : 'actualizar'} la obra "${modal.data.nombre}"?`,
            action
        );
    };

    const handleDeleteProject = (id) => {
        const project = proyectos.find(p => p.id === id);
        const action = () => {
            setProyectos(proyectos.filter(p => p.id !== id));
        };

        handleActionRequest(
            'Confirmar Eliminación',
            `¿Está seguro que desea eliminar el proyecto "${project.nombre}"? Esta acción no se puede deshacer.`,
            action
        );
    };

    const addPersonalToProject = () => {
        if (!tempPersonal.usuario.trim() || !tempPersonal.email.trim()) return;
        const newEntry = { ...tempPersonal, id: Date.now() };
        setModal({
            ...modal,
            data: { ...modal.data, personal: [...modal.data.personal, newEntry] }
        });
        setTempPersonal({ rol: ROLES_SISTEMA[0], usuario: '', email: '' });
    };

    const removePersonalFromProject = (id) => {
        const personnel = modal.data.personal.find(p => p.id === id);
        const action = () => {
            setModal({
                ...modal,
                data: { ...modal.data, personal: modal.data.personal.filter(p => p.id !== id) }
            });
        };

        handleActionRequest(
            'Confirmar Quitar Personal',
            `¿Está seguro que desea quitar a "${personnel.usuario}" de este proyecto?`,
            action
        );
    };

    const toggleActividad = (actId) => {
        const currentActs = modal.data.actividades || [];
        const isSelected = currentActs.includes(actId);

        let updated;
        if (isSelected) {
            updated = currentActs.filter(id => id !== actId);
        } else {
            updated = [...currentActs, actId];
        }

        setModal({
            ...modal,
            data: { ...modal.data, actividades: updated }
        });
    };

    const filteredProjects = proyectos.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="proyectos-container">
            <div className="top-nav">
                <Link to="/mantenedores" className="btn-back">
                    <ArrowLeft size={16} /> Volver a Mantenedores
                </Link>
                <div className="page-title-badge">
                    <Building2 size={20} className="text-blue-600" />
                    <h2 className="text-xl font-extrabold text-slate-800">Mantenedor de Proyectos</h2>
                </div>
            </div>

            <div className="action-header">
                <div className="search-bar">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Buscar proyecto por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="btn-primary" onClick={() => openForm('add')}>
                    <Plus size={18} /> Nueva Obra / Proyecto
                </button>
            </div>

            <div className="grid-proyectos">
                {filteredProjects.length > 0 ? filteredProjects.map(proyecto => (
                    <div key={proyecto.id} className="project-card">
                        <div className="project-card-header">
                            <div>
                                <h3 className="project-name">{proyecto.nombre}</h3>
                                <p className="project-desc">{proyecto.descripcion}</p>
                                <div className="project-tags-mini">
                                    {proyecto.actividades && proyecto.actividades.map(aId => {
                                        const a = ACTIVIDADES_SISTEMA.find(x => x.id === aId);
                                        return a ? <span key={aId} className="tag-mini">{a.nombre}</span> : null;
                                    })}
                                </div>
                            </div>
                            <div className="project-actions">
                                <button className="btn-icon-sm edit" onClick={() => openForm('edit', proyecto)}>
                                    <Pencil size={14} />
                                </button>
                                <button className="btn-icon-sm delete" onClick={() => handleDeleteProject(proyecto.id)}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="project-card-footer">
                            <div className="personal-count">
                                <Users size={14} />
                                <span>{proyecto.personal.length} Personal asignado</span>
                            </div>
                            <div className="avatars-preview">
                                {proyecto.personal.slice(0, 3).map((p, i) => (
                                    <div key={p.id} className="avatar-circle" title={`${p.usuario} (${p.rol})`}>
                                        {p.usuario.charAt(0)}
                                    </div>
                                ))}
                                {proyecto.personal.length > 3 && (
                                    <div className="avatar-circle more">+{proyecto.personal.length - 3}</div>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="empty-state">No se encontraron proyectos</div>
                )}
            </div>

            {/* Modal Form */}
            {modal.show && (
                <div className="modal-overlay">
                    <div className="modal-content-lg">
                        <div className="modal-header">
                            <h3>{modal.type === 'add' ? 'Registrar Nueva Obra' : 'Editar Información de Obra'}</h3>
                            <button className="btn-close" onClick={closeForm}><X size={20} /></button>
                        </div>
                        <div className="modal-body-scroll">
                            <div className="form-section">
                                <h4 className="section-title">Datos Principales</h4>
                                <div className="grid-form">
                                    <div className="form-group">
                                        <label>Nombre de la Obra</label>
                                        <input
                                            type="text"
                                            value={modal.data.nombre}
                                            placeholder="Ej: Edificio Corporativo"
                                            onChange={(e) => setModal({ ...modal, data: { ...modal.data, nombre: e.target.value } })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Descripción / Ubicación</label>
                                        <input
                                            type="text"
                                            value={modal.data.descripcion}
                                            placeholder="Ej: Sector Las Condes, RM"
                                            onChange={(e) => setModal({ ...modal, data: { ...modal.data, descripcion: e.target.value } })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h4 className="section-title">Actividades a Ejecutar</h4>
                                <p className="section-subtitle">Seleccione las actividades que serán parte de este proyecto.</p>
                                <div className="activities-grid">
                                    {ACTIVIDADES_SISTEMA.map(a => {
                                        const isSelected = (modal.data.actividades || []).includes(a.id);
                                        return (
                                            <button
                                                key={a.id}
                                                type="button"
                                                className={`activity-chip ${isSelected ? 'active' : ''}`}
                                                onClick={() => toggleActividad(a.id)}
                                            >
                                                {isSelected && <Check size={14} />}
                                                {a.nombre}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="form-section mt-6">
                                <h4 className="section-title">Asignación de Personal y Roles</h4>
                                <div className="personal-form-row">
                                    <div className="form-group flex-1">
                                        <label>Usuario / Nombre</label>
                                        <input
                                            type="text"
                                            placeholder="Nombre del responsable"
                                            value={tempPersonal.usuario}
                                            onChange={(e) => setTempPersonal({ ...tempPersonal, usuario: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group flex-1">
                                        <label>Email Corporativo</label>
                                        <input
                                            type="email"
                                            placeholder="correo@empresa.cl"
                                            value={tempPersonal.email}
                                            onChange={(e) => setTempPersonal({ ...tempPersonal, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group" style={{ width: '200px' }}>
                                        <label>Rol en el Proyecto</label>
                                        <select
                                            value={tempPersonal.rol}
                                            onChange={(e) => setTempPersonal({ ...tempPersonal, rol: e.target.value })}
                                        >
                                            {ROLES_SISTEMA.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                    <button className="btn-add-inline" onClick={addPersonalToProject} type="button">
                                        <Plus size={18} /> Asignar
                                    </button>
                                </div>

                                <div className="assigned-table-wrapper">
                                    <table className="assigned-table">
                                        <thead>
                                            <tr>
                                                <th>Personal / Email</th>
                                                <th>Rol Asignado</th>
                                                <th className="text-right">Quitar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {modal.data.personal.length > 0 ? modal.data.personal.map(p => (
                                                <tr key={p.id}>
                                                    <td>
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <div className="user-icon-bg"><User size={12} /></div>
                                                                <span className="font-bold text-slate-800">{p.usuario}</span>
                                                            </div>
                                                            <span className="text-[10px] text-slate-400 ml-7">{p.email}</span>
                                                        </div>
                                                    </td>
                                                    <td><span className="role-chip">{p.rol}</span></td>
                                                    <td className="text-right">
                                                        <button className="btn-remove" onClick={() => removePersonalFromProject(p.id)}>
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="3" className="text-center py-4 text-slate-400 text-sm">No hay personal asignado a esta obra.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={closeForm}>Cancelar</button>
                            <button className="btn-primary" onClick={handleSaveProject}>
                                <Save size={16} /> Guardar Obra
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
                            <button className="btn-primary" onClick={executeAction}>Confirmar Acción</button>
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
                .proyectos-container { padding: 0.5rem; animation: fadeIn 0.3s ease; }
                .top-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .page-title-badge { display: flex; align-items: center; gap: 0.75rem; background: #eff6ff; padding: 0.5rem 1.25rem; border-radius: 1rem; border: 1px solid #bfdbfe; }
                
                .action-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; gap: 1rem; }
                .search-bar { flex: 1; display: flex; align-items: center; gap: 0.75rem; background: white; padding: 0.625rem 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; max-width: 500px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
                .search-bar input { border: none; outline: none; width: 100%; font-size: 0.875rem; font-weight: 500; }
                
                .grid-proyectos { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
                .project-card { background: white; border-radius: 1rem; border: 1px solid #e2e8f0; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: all 0.3s; }
                .project-card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border-color: #bfdbfe; }
                .project-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
                .project-name { font-size: 1.125rem; font-weight: 800; color: #1e293b; margin: 0; }
                .project-desc { font-size: 0.875rem; color: #64748b; margin-top: 0.25rem; }
                
                .project-card-footer { border-top: 1px solid #f1f5f9; pt: 1rem; margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; }
                .personal-count { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; }
                
                .avatars-preview { display: flex; align-items: center; }
                .avatar-circle { width: 28px; height: 28px; border-radius: 50%; background: #2563eb; color: white; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; border: 2px solid white; margin-left: -8px; }
                .avatar-circle:first-child { margin-left: 0; }
                .avatar-circle.more { background: #f1f5f9; color: #64748b; font-size: 0.7rem; border-color: #e2e8f0; }
                
                .modal-content-lg { background: white; width: 100%; max-width: 800px; border-radius: 1.25rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); overflow: hidden; }
                .modal-body-scroll { padding: 2rem; max-height: 70vh; overflow-y: auto; }
                
                .section-title { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #3b82f6; letter-spacing: 0.1em; margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 2px solid #eff6ff; }
                .section-subtitle { font-size: 0.75rem; color: #64748b; margin-bottom: 1.25rem; }
                
                .activities-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem; }
                .activity-chip { background: white; border: 1px solid #e2e8f0; color: #475569; padding: 0.5rem 1rem; border-radius: 2rem; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem; }
                .activity-chip.active { background: #eff6ff; border-color: #3b82f6; color: #1d4ed8; }
                .activity-chip:hover { border-color: #3b82f6; }

                .project-tags-mini { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.75rem; }
                .tag-mini { background: #f8fafc; color: #475569; font-size: 0.65rem; font-weight: 800; padding: 0.2rem 0.5rem; border-radius: 0.4rem; border: 1px solid #f1f5f9; text-transform: uppercase; }

                .grid-form { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                
                .personal-form-row { display: flex; gap: 1rem; align-items: flex-end; background: #f8fafc; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; margin-bottom: 1.5rem; }
                .btn-add-inline { background: #0f172a; color: white; border: none; padding: 0.75rem 1.25rem; border-radius: 0.5rem; font-weight: 700; font-size: 0.875rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
                .btn-add-inline:hover { background: #1e293b; }
                
                .assigned-table-wrapper { border: 1px solid #f1f5f9; border-radius: 0.75rem; overflow: hidden; }
                .assigned-table { width: 100%; border-collapse: collapse; }
                .assigned-table th { background: #f8fafc; padding: 0.75rem 1rem; text-align: left; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; }
                .assigned-table td { padding: 0.75rem 1rem; border-top: 1px solid #f1f5f9; font-size: 0.875rem; font-weight: 500; }
                
                .user-icon-bg { width: 20px; height: 20px; border-radius: 50%; background: #eff6ff; color: #3b82f6; display: flex; align-items: center; justify-content: center; }
                .role-chip { background: #f1f5f9; color: #1e293b; padding: 0.2rem 0.6rem; border-radius: 0.375rem; font-size: 0.7rem; font-weight: 700; border: 1px solid #e2e8f0; }
                .btn-remove { color: #94a3b8; background: none; border: none; cursor: pointer; padding: 0.25rem; }
                .btn-remove:hover { color: #ef4444; }

                .project-actions { display: flex; gap: 0.5rem; }
                .btn-icon-sm { width: 28px; height: 28px; border-radius: 0.375rem; border: 1px solid #e2e8f0; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
                .btn-icon-sm.edit { color: #2563eb; }
                .btn-icon-sm.edit:hover { background: #eff6ff; border-color: #bfdbfe; }
                .btn-icon-sm.delete { color: #dc2626; }
                .btn-icon-sm.delete:hover { background: #fef2f2; border-color: #fecaca; }

                .form-group label { display: block; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 0.5rem; letter-spacing: 0.05em; }
                .form-group input, .form-group select { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.875rem; outline: none; background: white; }
                .form-group input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
                
                .btn-primary { background: #2563eb; color: white; padding: 0.625rem 1.25rem; border-radius: 0.5rem; border: none; font-weight: 700; font-size: 0.875rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); transition: all 0.2s; }
                .btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3); }
                .btn-secondary { background: white; color: #475569; padding: 0.625rem 1.25rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; font-weight: 700; font-size: 0.875rem; cursor: pointer; }
                .btn-back { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; color: #64748b; font-size: 0.875rem; font-weight: 700; transition: color 0.2s; }
                .btn-back:hover { color: #1e293b; }
                
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

export default Proyectos;
