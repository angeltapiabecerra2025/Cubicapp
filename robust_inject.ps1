$files = @("index.html", "vista_previa2.html")

foreach ($file in $files) {
    $lines = Get-Content -Path $file -Encoding UTF8
    $newLines = @()
    
    $injected = $false
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if (-not $injected -and $lines[$i] -match "Actividades por Obra") {
            # Go back to find ") : ("
            $foundIndex = -1
            for ($j = $i; $j -ge ($i - 5); $j--) {
                if ($lines[$j] -match "\) : \(") {
                    $foundIndex = $j
                    break
                }
            }
            
            if ($foundIndex -ne -1) {
                # We need to replace $lines[$foundIndex]
                # It is currently something like: "                                    ) : ("
                # We will change it to the Caneria block + the original ") : ("
                
                $indent = $lines[$foundIndex] -replace "\S.*", ""
                
                $injection = @"
                                    ) : mantenedoresTab === 'caneria' ? (
                                        <div class="space-y-6 animate-in fade-in">
                                            <div class="flex justify-between items-center">
                                                <h2 class="text-xl font-bold text-slate-800">Mantenedor de Cañerías</h2>
                                                {!showForm && (
                                                    <button class="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2" onClick={() => { setShowForm(true); setFormCaneria({ id: null, nombre: '', desc: '' }); }}>
                                                        <span>⊕</span> Nueva Cañería
                                                    </button>
                                                )}
                                            </div>
                                            {showForm ? (
                                                <div class="bg-white rounded-xl border border-blue-200 shadow-xl p-8 animate-in zoom-in-95 duration-200">
                                                    <h3 class="font-bold text-lg mb-6 text-slate-800 border-b pb-4">{formCaneria.id ? 'Editar Cañería' : 'Nueva Cañería'}</h3>
                                                    <div class="space-y-4 mb-8">
                                                        <div>
                                                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nombre</label>
                                                            <input class="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={formCaneria.nombre} onChange={e => setFormCaneria({ ...formCaneria, nombre: e.target.value })} placeholder="Ej: Cañería Acero Carbón 10''" />
                                                        </div>
                                                        <div>
                                                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Descripción</label>
                                                            <textarea class="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" rows="3" value={formCaneria.desc} onChange={e => setFormCaneria({ ...formCaneria, desc: e.target.value })} placeholder="Breve detalle..." />
                                                        </div>
                                                    </div>
                                                    <div class="flex justify-end gap-3 pt-6 border-t border-slate-100">
                                                        <button class="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg" onClick={() => setShowForm(false)}>Cancelar</button>
                                                        <button class="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold" onClick={handleSaveCaneria}>Guardar</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                                    <table class="w-full text-left">
                                                        <thead class="bg-slate-50 border-b border-slate-100">
                                                            <tr>
                                                                <th class="p-4 text-[10px] font-bold text-slate-500 uppercase px-6">Cañería</th>
                                                                <th class="p-4 text-[10px] font-bold text-slate-500 uppercase px-6">Descripción</th>
                                                                <th class="p-4 text-[10px] font-bold text-slate-500 uppercase px-6 text-right">Acciones</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody class="divide-y divide-slate-50">
                                                            {caneriasInternas.length === 0 ? (
                                                                <tr><td colSpan="3" class="p-8 text-center text-slate-400">No hay cañerías registradas.</td></tr>
                                                            ) : (
                                                                caneriasInternas.map(c => (
                                                                    <tr key={c.id} class="hover:bg-slate-50 transition-colors">
                                                                        <td class="p-4 px-6 text-sm font-bold text-slate-800">{c.nombre}</td>
                                                                        <td class="p-4 px-6 text-sm text-slate-500">{c.desc}</td>
                                                                        <td class="p-4 px-6 text-right space-x-3">
                                                                            <button class="text-blue-600 hover:text-blue-800 text-sm" onClick={() => { setShowForm(true); setFormCaneria(c); }}>✏️ Editar</button>
                                                                            <button class="text-red-500 hover:text-red-700 text-sm" onClick={() => handleDeleteCaneria(c.id)}>🗑️ Eliminar</button>
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
"@
                # Rebuild $newLines from 0 to foundIndex-1
                $temp = @()
                for ($k = 0; $k -lt $foundIndex; $k++) {
                    $temp += $lines[$k]
                }
                
                # Split the injection block by newline and add
                $injectionLines = $injection -split "`n"
                foreach ($il in $injectionLines) {
                    $temp += $il.TrimEnd("`r")
                }
                
                # Now add the rest of the file
                for ($k = $foundIndex + 1; $k -lt $lines.Count; $k++) {
                    $temp += $lines[$k]
                }
                
                $newLines = $temp
                $injected = $true
                break # We rebuilt the file, skip the rest of the outer loop
            }
        }
    }
    
    if ($injected) {
        # Check if already injected (prevent duplicate)
        $raw = $newLines -join "`r`n"
        $oldRaw = Get-Content -Path $file -Raw -Encoding UTF8
        if ($oldRaw -notmatch "Mantenedor de Cañerías") {
            [IO.File]::WriteAllText("$PWD\$file", $raw, [System.Text.Encoding]::UTF8)
            Write-Output "Injected UI in $file"
        } else {
            Write-Output "UI already exists in $file"
        }
    } else {
        Write-Output "Failed to find injection point in $file"
    }
}
