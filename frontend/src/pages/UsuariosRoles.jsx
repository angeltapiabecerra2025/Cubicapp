import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, Search, AlertCircle, Shield, User, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const UsuariosRoles = () => {
    const [view, setView] = useState('usuarios'); // 'usuarios' or 'roles'
    const [usuarios, setUsuarios] = useState([
        { id: 1, nombre: 'Admin Sistema', email: 'admin@eimicub.cl', rol: 'Administrator' },
        { id: 2, nombre: 'Juan Pérez', email: 'jperez@constructora.cl', rol: 'Project Manager' },
    ]);
    const [roles, setRoles] = useState([
        { id: 1, nombre: 'Administrator', descripcion: 'Acceso total al sistema.' },
        { id: 2, nombre: 'Project Manager', descripcion: 'Gestión de proyectos y cubicaciones.' },
    ]);

    const [modal, setModal] = useState({ show: false, type: '', data: null });
    const [confirmAction, setConfirmAction] = useState({ show: false, title: '', message: '', action: null });
    const [searchTerm, setSearchTerm] = useState('');

    const openForm = (type, data = null) => {
        const defaultData = view === 'usuarios'
            ? { nombre: '', email: '', rol: roles[0]?.nombre || '' }
            : { nombre: '', descripcion: '' };

        setModal({
            show: true,
            type,
            data: data ? { ...data } : defaultData
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
        const action = () => {
            if (view === 'usuarios') {
                if (modal.type === 'add') {
                    setUsuarios([...usuarios, { ...modal.data, id: Date.now() }]);
                } else {
                    setUsuarios(usuarios.map(u => u.id === modal.data.id ? modal.data : u));
                }
            } else {
                if (modal.type === 'add') {
                    setRoles([...roles, { ...modal.data, id: Date.now() }]);
                } else {
                    setRoles(roles.map(r => r.id === modal.data.id ? modal.data : r));
                }
            }
            closeForm();
        };

        handleActionRequest(
            modal.type === 'add' ? 'Confirmar Creación' : 'Confirmar Modificación',
            `¿Desea ${modal.type === 'add' ? 'crear' : 'actualizar'} este ${view === 'usuarios' ? 'usuario' : 'rol'}?`,
            action
        );
    };

    const handleDelete = (id) => {
        const action = () => {
            if (view === 'usuarios') {
                setUsuarios(usuarios.filter(u => u.id !== id));
            } else {
                setRoles(roles.filter(r => r.id !== id));
            }
        };

        handleActionRequest(
            'Confirmar Eliminación',
            `¿Está seguro que desea eliminar este ${view === 'usuarios' ? 'usuario' : 'rol'}?`,
            action
        );
    };

    const filteredData = (view === 'usuarios' ? usuarios : roles).filter(item =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="users-roles-container">
            <div className="top-nav">
                <Link to="/mantenedores" className="btn-back">
                    <ArrowLeft size={16} /> Volver a Mantenedores
                </Link>
                <div className="tab-switcher">
                    <button className={view === 'usuarios' ? 'active' : ''} onClick={() => setView('usuarios')}>Usuarios</button>
                    <button className={view === 'roles' ? 'active' : ''} onClick={() => setView('roles')}>Roles</button>
                </div>
            </div>

            <div className="action-header">
                <div className="search-bar">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder={`Buscar ${view === 'usuarios' ? 'usuario' : 'rol'}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="btn-primary" onClick={() => openForm('add')}>
                    <Plus size={18} /> {view === 'usuarios' ? 'Nuevo Usuario' : 'Nuevo Rol'}
                </button>
            </div>

            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        {view === 'usuarios' ? (
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th className="text-right">Acciones</th>
                            </tr>
                        ) : (
                            <tr>
                                <th>Nombre del Rol</th>
                                <th>Descripción</th>
                                <th className="text-right">Acciones</th>
                            </tr>
                        )}
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? filteredData.map(item => (
                            <tr key={item.id}>
                                <td className="font-bold">
                                    <div className="flex items-center gap-2">
                                        {view === 'usuarios' ? <User size={16} className="text-slate-400" /> : <Shield size={16} className="text-blue-500" />}
                                        {item.nombre}
                                    </div>
                                </td>
                                {view === 'usuarios' ? (
                                    <>
                                        <td className="text-muted">{item.email}</td>
                                        <td><span className="badge-blue">{item.rol}</span></td>
                                    </>
                                ) : (
                                    <td className="text-muted">{item.descripcion}</td>
                                )}
                                <td className="text-right">
                                    <div className="action-buttons">
                                        <button className="btn-icon edit" onClick={() => openForm('edit', item)}>
                                            <Pencil size={16} />
                                        </button>
                                        <button className="btn-icon delete" onClick={() => handleDelete(item.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="empty-row">No se encontraron resultados</td>
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
                            <h3>{modal.type === 'add' ? 'Crear' : 'Editar'} {view === 'usuarios' ? 'Usuario' : 'Rol'}</h3>
                            <button className="btn-close" onClick={closeForm}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            {view === 'usuarios' ? (
                                <>
                                    <div className="form-group">
                                        <label>Nombre Completo</label>
                                        <input
                                            type="text"
                                            value={modal.data.nombre}
                                            onChange={(e) => setModal({ ...modal, data: { ...modal.data, nombre: e.target.value } })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={modal.data.email}
                                            onChange={(e) => setModal({ ...modal, data: { ...modal.data, email: e.target.value } })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Rol Asignado</label>
                                        <select
                                            value={modal.data.rol}
                                            onChange={(e) => setModal({ ...modal, data: { ...modal.data, rol: e.target.value } })}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                                        >
                                            {roles.map(r => <option key={r.id} value={r.nombre}>{r.nombre}</option>)}
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-group">
                                        <label>Nombre del Rol</label>
                                        <input
                                            type="text"
                                            value={modal.data.nombre}
                                            onChange={(e) => setModal({ ...modal, data: { ...modal.data, nombre: e.target.value } })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Descripción</label>
                                        <textarea
                                            rows="3"
                                            value={modal.data.descripcion}
                                            onChange={(e) => setModal({ ...modal, data: { ...modal.data, descripcion: e.target.value } })}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={closeForm}>Cancelar</button>
                            <button className="btn-primary" onClick={handleSave}>
                                <Save size={16} /> Guardar
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
                .users-roles-container { padding: 0.5rem; animation: fadeIn 0.3s ease; }
                .top-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .tab-switcher { display: flex; background: #f1f5f9; padding: 0.25rem; border-radius: 0.75rem; }
                .tab-switcher button { border: none; padding: 0.5rem 1.5rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s; color: #64748b; background: transparent; }
                .tab-switcher button.active { background: white; color: #0f172a; shadow: 0 1px 3px 0 rgba(0,0,0,0.1); }
                
                .action-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 1rem; }
                .search-bar { flex: 1; display: flex; align-items: center; gap: 0.75rem; background: white; padding: 0.5rem 1rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; max-width: 400px; }
                .search-bar input { border: none; outline: none; width: 100%; font-size: 0.875rem; }
                
                .data-table-container { background: white; border-radius: 0.75rem; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); }
                .data-table { width: 100%; border-collapse: collapse; text-align: left; }
                .data-table th { background: #f8fafc; padding: 1rem 1.5rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; }
                .data-table td { padding: 1rem 1.5rem; border-top: 1px solid #f1f5f9; font-size: 0.875rem; }
                
                .font-bold { font-weight: 600; color: #1e293b; }
                .text-muted { color: #64748b; }
                .badge-blue { background: #dbeafe; color: #1e40af; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.7rem; font-weight: 700; }
                .flex { display: flex; }
                .items-center { align-items: center; }
                .gap-2 { gap: 0.5rem; }
                
                .text-right { text-align: right; }
                .action-buttons { display: flex; justify-content: flex-end; gap: 0.5rem; }
                .btn-icon { padding: 0.5rem; border-radius: 0.375rem; border: 1px solid #e2e8f0; background: white; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
                .btn-icon.edit { color: #2563eb; }
                .btn-icon.edit:hover { background: #eff6ff; border-color: #bfdbfe; }
                .btn-icon.delete { color: #dc2626; }
                .btn-icon.delete:hover { background: #fef2f2; border-color: #fecaca; }

                /* Modal & Other common styles (Same as other modules for consistency) */
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 1rem; z-index: 50; }
                .z-max { z-index: 100; }
                .modal-content { background: white; width: 100%; max-width: 500px; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
                .modal-header { padding: 1.5rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
                .modal-header h3 { margin: 0; font-size: 1.125rem; }
                .modal-body { padding: 1.5rem; }
                .modal-footer { padding: 1.25rem 1.5rem; background: #f8fafc; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 0.75rem; border-radius: 0 0 1rem 1rem; }
                .form-group { margin-bottom: 1.25rem; }
                .form-group label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 0.5rem; }
                .form-group input, .form-group textarea { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.875rem; outline: none; }
                
                .confirm-content { background: white; padding: 2rem; border-radius: 1rem; text-align: center; max-width: 400px; width: 100%; }
                .confirm-icon { color: #f59e0b; margin-bottom: 1rem; display: flex; justify-content: center; }
                .confirm-buttons { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }
                
                .btn-primary { background: #2563eb; color: white; padding: 0.625rem 1.25rem; border-radius: 0.5rem; border: none; font-weight: 600; font-size: 0.875rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
                .btn-secondary { background: white; color: #475569; padding: 0.625rem 1.25rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; font-weight: 600; font-size: 0.875rem; cursor: pointer; }
                .btn-close { background: none; border: none; color: #94a3b8; cursor: pointer; }
                .btn-back { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; color: #64748b; font-size: 0.875rem; font-weight: 500; }
                
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default UsuariosRoles;
