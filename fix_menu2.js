const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// Find the index of the start of the array
const startIndex = code.indexOf(`                                  {[
                                      { id: 'Dashboard', label: 'Dashboard', icon: 'dashboard' },
                                      { id: 'Cubicaciones', label: 'Cubicaciones', icon: 'cubicaciones' },`);
if (startIndex !== -1) {
    const endIndex = code.indexOf('].map(item => (', startIndex);
    if (endIndex !== -1) {
        // We found the exact block. Let's just slice it out and put the new one in.
        const before = code.substring(0, startIndex);
        const after = code.substring(endIndex);
        
        // I will dynamically construct the new block by moving the existing strings around!
        // Wait, it's easier to just paste the block and use the existing encoding for the other strings, or just re-add the strings.
        // Node can handle UTF-8 if I write it in utf-8.
        
        const newBlock = `                                  {[
                                      { id: 'Dashboard', label: 'Dashboard', icon: 'dashboard' },
                                      { id: 'Cubicaciones', label: 'Cubicaciones', icon: 'cubicaciones' },
                                      { id: 'HistoricoEDP', label: 'Histórico EDP', icon: 'status' },
                                      { id: 'EstadoDePago', label: 'Estado de Pago', icon: 'status' },
                                      { id: 'LogAdicionales', label: 'LOG de Adicionales', icon: 'planificacion' },
                                      { id: 'Planificacion', label: 'Planificación', icon: 'planificacion' },
                                      { id: 'BIM', label: 'BIM', icon: 'bim' },
                                      { id: 'Suministros', label: 'Suministros', icon: 'materiales' },
                                      { id: 'Mantenedores', label: 'Mantenedores', icon: 'mantenedores' },
                                      { id: 'MantenedorObra', label: 'Mantenedor por Obra', icon: 'obra' },
                                      { id: 'MatrizMC', label: 'Matriz MC', icon: 'dashboard' }
                                  `;
        code = before + newBlock + after;
        fs.writeFileSync('index.html', code, 'utf8');
        console.log('Replaced by exact string indexing!');
    }
}
