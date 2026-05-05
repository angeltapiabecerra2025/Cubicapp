import sys
import os

file_path = r'c:\Users\atapiab\Desktop\APP CUBICACIONES\APLICACION\index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replacement 1: handleSaveGeneral
old_1 = """            const handleSaveGeneral = () => {
                if (!activeProject || !activeActivityFilter) {
                    alert('Debe seleccionar Obra y Actividad para guardar.');
                    return;
                }
                const rowsToSave = rows.filter(r => !isEmptyRow(r));
                
                // VALIDACIÓN DE CAMPOS OBLIGATORIOS
                const requiredFields = ['Item', 'Descripción', 'Ubicación', 'Elemento'];
                let hasErrors = false;
                for (let i = 0; i < rowsToSave.length; i++) {
                    const r = rowsToSave[i];
                    for (const req of requiredFields) {
                        const val = r.infoFields[req];
                        if (val === undefined || val === null || val.toString().trim() === '') {
                            const rowDisplayNum = rows.findIndex(row => row.id === r.id) + 1;
                            alert(`❌ Error al guardar.\\nFila N°${rowDisplayNum}: El campo obligatorio "${req}" está vacío.\\nDebe completarlo para continuar.`);
                            hasErrors = true;
                            break;
                        }
                    }
                    if (hasErrors) break;
                }
                if (hasErrors) return;

                const key = `cubicaciones_data_${activeProject}_${activeActivityFilter}`;
                localStorage.setItem(key, JSON.stringify(rowsToSave));
                alert('✔ Avance guardado exitosamente para la obra y actividad actual.');
            };"""

new_1 = """            const handleSaveGeneral = () => {
                if (!activeProject || !activeActivityFilter) {
                    alert('Debe seleccionar Obra y Actividad para guardar.');
                    return;
                }

                askConfirm(
                    'Confirmar Guardado General', 
                    '¿Desea sincronizar todos los cambios actuales con la base de datos? Esto actualizará el avance final para esta obra y actividad.', 
                    () => {
                        const rowsToSave = rows.filter(r => !isEmptyRow(r));
                        
                        // VALIDACIÓN DE CAMPOS OBLIGATORIOS
                        const requiredFields = ['Item', 'Descripción', 'Ubicación', 'Elemento'];
                        let hasErrors = false;
                        for (let i = 0; i < rowsToSave.length; i++) {
                            const r = rowsToSave[i];
                            for (const req of requiredFields) {
                                const val = r.infoFields[req];
                                if (val === undefined || val === null || val.toString().trim() === '') {
                                    const rowDisplayNum = rows.findIndex(row => row.id === r.id) + 1;
                                    alert(`❌ Error al guardar.\\nFila N°${rowDisplayNum}: El campo obligatorio "${req}" está vacío.\\nDebe completarlo para continuar.`);
                                    hasErrors = true;
                                    break;
                                }
                            }
                            if (hasErrors) break;
                        }
                        if (hasErrors) return;

                        const key = `cubicaciones_data_${activeProject}_${activeActivityFilter}`;
                        localStorage.setItem(key, JSON.stringify(rowsToSave));
                        showSuccess('✔ Avance guardado exitosamente');
                    }
                );
            };"""

content = content.replace(old_1, new_1)

# Replacement 2: handleAddSavedRow
# I'll use a more surgical approach for handleAddSavedRow
block_2_old = """                if (isEditing && formData.id) {
                    setRows(prevRows => prevRows.map(r => r.id === formData.id ? { ...formData } : r));
                } else {
                    const activeRows = rows.filter(r => {
                        const hasInfo = Object.values(r.infoFields || {}).some(v => v !== '');
                        const hasAtt = r.attachments && r.attachments.length > 0;
                        const hasSub = Object.values(r.subActivityProgress || {}).some(v => v !== '' && parseFloat(v) > 0);
                        const hasMath = Object.keys(r.mathParams || {}).filter(k => k !== 'cantidad').some(k => r.mathParams[k] !== '' && r.mathParams[k] !== undefined && r.mathParams[k] !== 0);
                        return hasInfo || hasAtt || hasSub || hasMath;
                    });
                    
                    activeRows.push({ ...formData, id: `row-${Date.now()}` });
                    
                    const actId = activeActivityFilter ? parseInt(activeActivityFilter) : '';
                    const actObj = actividades.find(a => a.id === actId);
                    const unitId = actObj ? actObj.unidadId : '';
                    setRows(activeRows);
                }
                resetForm();"""

block_2_new = """                const processAction = () => {
                    if (isEditing && formData.id) {
                        setRows(prevRows => prevRows.map(r => r.id === formData.id ? { ...formData } : r));
                        showSuccess('Registro actualizado correctamente');
                    } else {
                        const activeRows = rows.filter(r => {
                            const hasInfo = Object.values(r.infoFields || {}).some(v => v !== '');
                            const hasAtt = r.attachments && r.attachments.length > 0;
                            const hasSub = Object.values(r.subActivityProgress || {}).some(v => v !== '' && parseFloat(v) > 0);
                            const hasMath = Object.keys(r.mathParams || {}).filter(k => k !== 'cantidad').some(k => r.mathParams[k] !== '' && r.mathParams[k] !== undefined && r.mathParams[k] !== 0);
                            return hasInfo || hasAtt || hasSub || hasMath;
                        });
                        
                        activeRows.push({ ...formData, id: `row-${Date.now()}` });
                        setRows(activeRows);
                        showSuccess('Nuevo registro añadido con éxito');
                    }
                    resetForm();
                };

                askConfirm(
                    isEditing ? 'Confirmar Modificación' : 'Confirmar Adición',
                    isEditing ? '¿Estás seguro de que deseas actualizar los cambios en este registro?' : '¿Deseas añadir este nuevo registro de cubicación?',
                    processAction
                );"""

content = content.replace(block_2_old, block_2_new)

# Replacement 3: handleDeleteRow
content = content.replace("setRows(prevRows => prevRows.filter(r => r.id !== id));", """askConfirm(
                    'Confirmar Eliminación', 
                    '¿Estás seguro de que deseas eliminar este registro de cubicación? Esta acción no se puede deshacer.', 
                    () => {
                        setRows(prevRows => prevRows.filter(r => r.id !== id));
                        showSuccess('Registro eliminado correctamente');
                    }
                );""")

# Replacement 4: handleSaveProgramRow
content = content.replace("""const handleSaveProgramRow = () => {
                const updated = uploadedProgram.map(item => item.id === editProgramId ? tempProgramRow : item);
                setUploadedProgram(updated);
                setEditProgramId(null);
                showSuccess('Actividad del programa actualizada');
            };""", """const handleSaveProgramRow = () => {
                askConfirm(
                    'Confirmar Modificación', 
                    '¿Deseas guardar los cambios realizados en esta actividad del programa?', 
                    () => {
                        const updated = uploadedProgram.map(item => item.id === editProgramId ? tempProgramRow : item);
                        setUploadedProgram(updated);
                        setEditProgramId(null);
                        showSuccess('Actividad del programa actualizada');
                    }
                );
            };""")

# Replacement 5: setMapping
content = content.replace("""const setMapping = (taskId, itemId) => {
                                            setMatrizMCMappings(prev => ({
                                                ...prev,
                                                [projId]: {
                                                    ...prev[projId],
                                                    [taskId]: itemId
                                                }
                                            }));
                                        };""", """const setMapping = (taskId, itemId) => {
                                            const item = projectPartidas.find(p => p._id === itemId);
                                            const msg = itemId ? `¿Deseas vincular esta actividad con el ítem "${item?.Item}"?` : '¿Deseas desvincular esta actividad?';
                                            askConfirm('Confirmar Vinculación', msg, () => {
                                                setMatrizMCMappings(prev => ({
                                                    ...prev,
                                                    [projId]: {
                                                        ...prev[projId],
                                                        [taskId]: itemId
                                                    }
                                                }));
                                            });
                                        };""")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
