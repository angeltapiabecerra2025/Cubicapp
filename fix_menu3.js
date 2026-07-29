const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const regex = /(\{\s*id:\s*'Dashboard'[\s\S]*?\{\s*id:\s*'BIM'[^}]*\}\s*\])/m;
const match = code.match(regex);
if (match) {
    let original = match[1];
    
    // We will extract each object string using a regex
    const itemRegex = /\{\s*id:\s*'([^']+)'[\s\S]*?\}/g;
    const items = {};
    let m;
    while ((m = itemRegex.exec(original)) !== null) {
        items[m[1]] = m[0];
    }
    
    const desiredOrder = [
        'Dashboard',
        'Cubicaciones',
        'HistoricoEDP',
        'EstadoDePago',
        'LogAdicionales',
        'Planificacion',
        'BIM',
        'Suministros',
        'Mantenedores',
        'MantenedorObra',
        'MatrizMC'
    ];
    
    const newItems = desiredOrder.map(id => '                                    ' + items[id]).join(',\n');
    const newBlock = '{[\n' + newItems + '\n                                ]';
    
    code = code.replace(original, newBlock);
    fs.writeFileSync('index.html', code);
    console.log("Replaced successfully!");
} else {
    console.log("Not found!");
}
