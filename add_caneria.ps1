$files = @("index.html", "vista_previa2.html")

foreach ($file in $files) {
    $content = Get-Content -Path $file -Raw -Encoding UTF8

    # 1. State Variables
    $stateAnchor = "const [itemizadosObraPorProyecto, setItemizadosObraPorProyecto] = useLocalStorageState('app_itemizados_obra', {});"
    $stateInject = "
            const [caneriasInternas, setCaneriasInternas] = useLocalStorageState('app_canerias', []);
            const [formCaneria, setFormCaneria] = useState({ id: null, nombre: '', desc: '' });"
    if ($content -notmatch "const \[caneriasInternas") {
        $content = $content.Replace($stateAnchor, $stateAnchor + $stateInject)
    }

    # 2. Handlers
    $handlerAnchor = "const handleSaveEsp = () => {"
    $handlerInject = "
            const handleSaveCaneria = () => {
                if (!formCaneria.nombre.trim()) return alert('El nombre es requerido');
                if (formCaneria.id) {
                    setCaneriasInternas(prev => prev.map(c => c.id === formCaneria.id ? formCaneria : c));
                } else {
                    setCaneriasInternas(prev => [...prev, { ...formCaneria, id: Date.now() }]);
                }
                setFormCaneria({ id: null, nombre: '', desc: '' });
                setShowForm(false);
            };

            const handleDeleteCaneria = (id) => {
                if (confirm('¿Seguro que deseas eliminar esta cañería?')) {
                    setCaneriasInternas(prev => prev.filter(c => c.id !== id));
                }
            };
            
            "
    if ($content -notmatch "const handleSaveCaneria") {
        $content = $content.Replace($handlerAnchor, $handlerInject + $handlerAnchor)
    }

    # 3. Navigation Tab
    $tabAnchor = "onClick={() => setMantenedoresTab('obra')}
                                        >MANTENEDORES POR OBRA</button>"
    $tabInject = "
                                        <button
                                            class={`px-6 py-2 rounded-lg text-xs font-black transition-all ${mantenedoresTab === 'caneria' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                                            onClick={() => setMantenedoresTab('caneria')}
                                        >MANTENEDOR CAÑERÍA</button>"
    
    # We replace only the first occurrence within the correct div
    if ($content -notmatch "MANTENEDOR CAÑERÍA") {
        $content = $content.Replace($tabAnchor, $tabAnchor + $tabInject)
    }

    # 4. UI View
    $viewAnchor = ") : (
                                        <div class=`"space-y-6 animate-in fade-in`">
                                            <div class=`"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`">
                                                {[
                                                    { title: 'Actividades por Obra'"
    
    $viewInject = ") : mantenedoresTab === 'caneria' ? (
                                        <div class=`"space-y-6 animate-in fade-in`">
                                            <div class=`"flex justify-between items-center`">
                                                <h2 class=`"text-xl font-bold text-slate-800`">Mantenedor de Cañerías</h2>
                                                {!showForm && (
                                                    <button class=`"bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2`" onClick={() => { setShowForm(true); setFormCaneria({ id: null, nombre: '', desc: '' }); }}>
                                                        <span>⊕</span> Nueva Cañería
                                                    </button>
                                                )}
                                            </div>
                                            {showForm ? (
                                                <div class=`"bg-white rounded-xl border border-blue-200 shadow-xl p-8 animate-in zoom-in-95 duration-200`">
                                                    <h3 class=`"font-bold text-lg mb-6 text-slate-800 border-b pb-4`">{formCaneria.id ? 'Editar Cañería' : 'Nueva Cañería'}</h3>
                                                    <div class=`"space-y-4 mb-8`">
                                                        <div>
                                                            <label class=`"block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2`">Nombre</label>
                                                            <input class=`"w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none`" value={formCaneria.nombre} onChange={e => setFormCaneria({ ...formCaneria, nombre: e.target.value })} placeholder=`"Ej: Cañería Acero Carbón 10''`" />
                                                        </div>
                                                        <div>
                                                            <label class=`"block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2`">Descripción</label>
                                                            <textarea class=`"w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none`" rows=`"3`" value={formCaneria.desc} onChange={e => setFormCaneria({ ...formCaneria, desc: e.target.value })} placeholder=`"Breve detalle...`" />
                                                        </div>
                                                    </div>
                                                    <div class=`"flex justify-end gap-3 pt-6 border-t border-slate-100`">
                                                        <button class=`"px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg`" onClick={() => setShowForm(false)}>Cancelar</button>
                                                        <button class=`"px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold`" onClick={handleSaveCaneria}>Guardar</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div class=`"bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden`">
                                                    <table class=`"w-full text-left`">
                                                        <thead class=`"bg-slate-50 border-b border-slate-100`">
                                                            <tr>
                                                                <th class=`"p-4 text-[10px] font-bold text-slate-500 uppercase px-6`">Cañería</th>
                                                                <th class=`"p-4 text-[10px] font-bold text-slate-500 uppercase px-6`">Descripción</th>
                                                                <th class=`"p-4 text-[10px] font-bold text-slate-500 uppercase px-6 text-right`">Acciones</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody class=`"divide-y divide-slate-50`">
                                                            {caneriasInternas.length === 0 ? (
                                                                <tr><td colSpan=`"3`" class=`"p-8 text-center text-slate-400`">No hay cañerías registradas.</td></tr>
                                                            ) : (
                                                                caneriasInternas.map(c => (
                                                                    <tr key={c.id} class=`"hover:bg-slate-50 transition-colors`">
                                                                        <td class=`"p-4 px-6 text-sm font-bold text-slate-800`">{c.nombre}</td>
                                                                        <td class=`"p-4 px-6 text-sm text-slate-500`">{c.desc}</td>
                                                                        <td class=`"p-4 px-6 text-right space-x-3`">
                                                                            <button class=`"text-blue-600 hover:text-blue-800 text-sm`" onClick={() => { setShowForm(true); setFormCaneria(c); }}>✏️</button>
                                                                            <button class=`"text-red-500 hover:text-red-700 text-sm`" onClick={() => handleDeleteCaneria(c.id)}>🗑️</button>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div class=`"space-y-6 animate-in fade-in`">
                                            <div class=`"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`">
                                                {[
                                                    { title: 'Actividades por Obra'"
    
    if ($content -notmatch "Mantenedor de Cañerías") {
        $content = $content.Replace($viewAnchor, $viewInject)
    }

    [IO.File]::WriteAllText("$PWD\$file", $content, [System.Text.Encoding]::UTF8)
}

Write-Output "Cañerías injected successfully."
