$files = @("index.html", "vista_previa2.html")

foreach ($file in $files) {
    $content = Get-Content -Path $file -Raw -Encoding UTF8
    
    $idx1 = $content.IndexOf("{ title: 'Usuarios'")
    $idx2 = $content.IndexOf(") : mantenedoresTab === 'caneria' ? (", $idx1)
    
    if ($idx1 -ne -1 -and $idx2 -ne -1) {
        $before = $content.Substring(0, $idx1)
        $after = $content.Substring($idx2)
        
        $missing = @"
                                                { title: 'Usuarios', desc: 'Gestión de cuentas', special: 'Usuarios' },
                                                { title: 'Roles', desc: 'Permisos dinámicos', special: 'Roles' },
                                                { title: 'Actividades', desc: 'Estructuras, Acero, etc.', special: 'Actividades' },
                                                { title: 'Especialidades', desc: 'Electricidad, Clima, etc.', special: 'Especialidades' },
                                                { title: 'Unidades de Medida', desc: 'Fórmulas y Parámetros', special: 'Unidades' },
                                                { title: 'Partidas de Obra', desc: 'Configuración inicial de obras.', special: 'Partidas' },
                                                { title: 'Proyectos', desc: 'Configuración inicial de obras.', special: 'Proyectos' }
                                            ].map(item => (
                                                <div key={item.title} class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                                    <h4 class="font-bold text-slate-800">{item.title}</h4>
                                                    <p class="text-sm text-slate-500 mt-1 mb-4">{item.desc}</p>
                                                    <button class="text-blue-600 text-xs font-bold uppercase tracking-wider hover:underline" onClick={() => { if (item.special) { setPage(item.special); setShowForm(false); } }}>
                                                        Gestionar
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
"@
        
        $newContent = $before + $missing + "`r`n                                    " + $after
        
        [IO.File]::WriteAllText("$PWD\$file", $newContent, [System.Text.Encoding]::UTF8)
        Write-Output "Restored missing Estandar block in $file"
    } else {
        Write-Output "Could not find the target indices in $file"
    }
}
