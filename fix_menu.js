const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldMenuStr = `                                  {[
                                      { id: 'Dashboard', label: 'Dashboard', icon: 'dashboard' },
                                      { id: 'Cubicaciones', label: 'Cubicaciones', icon: 'cubicaciones' },
                                      { id: 'MatrizMC', label: 'Matriz MC', icon: 'dashboard' },
                                      { id: 'Planificacion', label: 'Planificacin', icon: 'planificacion' },
                                      { id: 'Mantenedores', label: 'Mantenedores', icon: 'mantenedores' },
                                      { id: 'MantenedorObra', label: 'Mantenedor por Obra', icon: 'obra' },
                                      { id: 'HistoricoEDP', label: 'Histrico EDP', icon: 'status' },
                                      { id: 'EstadoDePago', label: 'Estado de Pago', icon: 'status' },
                                      { id: 'LogAdicionales', label: 'LOG de Adicionales', icon: 'planificacion' },
                                      { id: 'Suministros', label: 'Suministros', icon: 'materiales' },
                                      { id: 'BIM', label: 'BIM', icon: 'bim' }
                                  ]`;

const oldMenu2 = oldMenuStr.replace(//g, 'ó'); // In case of encoding issues with string

const oldMenu3 = `                                  {[
                                      { id: 'Dashboard', label: 'Dashboard', icon: 'dashboard' },
                                      { id: 'Cubicaciones', label: 'Cubicaciones', icon: 'cubicaciones' },
                                      { id: 'MatrizMC', label: 'Matriz MC', icon: 'dashboard' },
                                      { id: 'Planificacion', label: 'Planificación', icon: 'planificacion' },
                                      { id: 'Mantenedores', label: 'Mantenedores', icon: 'mantenedores' },
                                      { id: 'MantenedorObra', label: 'Mantenedor por Obra', icon: 'obra' },
                                      { id: 'HistoricoEDP', label: 'Histórico EDP', icon: 'status' },
                                      { id: 'EstadoDePago', label: 'Estado de Pago', icon: 'status' },
                                      { id: 'LogAdicionales', label: 'LOG de Adicionales', icon: 'planificacion' },
                                      { id: 'Suministros', label: 'Suministros', icon: 'materiales' },
                                      { id: 'BIM', label: 'BIM', icon: 'bim' }
                                  ]`;

const newMenu = `                                  {[
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
                                  ]`;

let regexOldMenu = /\{\s*id:\s*'Dashboard'[\s\S]*?id:\s*'BIM'[^\]]*\}\s*\]/m;

const match = code.match(regexOldMenu);
if(match) {
    // Actually replace via regex
    let fullMatch = match[0];
    
    // Create new array string keeping original indentation
    let replacement = `{ id: 'Dashboard', label: 'Dashboard', icon: 'dashboard' },
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
                                  ]`;
    code = code.replace(fullMatch, replacement);
    fs.writeFileSync('index.html', code);
    console.log('Replaced via regex!');
} else {
    console.log('Menu block not found via regex!');
}
