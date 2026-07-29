const babel = require('@babel/standalone');
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

const testTab = (name, startStr, endLineStart) => {
    let startLine = lines.findIndex(l => l.includes(startStr));
    let endLine = startLine;
    let balance = 0;
    
    // Naive block extraction based on ')}'
    // Actually it's easier to just slice based on known line numbers.
};

const slices = [
    { name: 'listaA', start: 9467, end: 9481 },
    { name: 'declaracion', start: 9482, end: 9527 },
    { name: 'caratula', start: 9528, end: 9739 },
    { name: 'reclamaciones', start: 9740, end: 9805 },
    { name: 'detalle', start: 9806, end: 10122 }
];

for (const s of slices) {
    const tabCode = lines.slice(s.start, s.end + 1).join('\n');
    const code = `
    const Test = () => (
        <div>
            ${tabCode}
        </div>
    );
    `;
    try {
        babel.transform(code, { presets: ['env', 'react'] });
        console.log(`[PASS] ${s.name}`);
    } catch (err) {
        console.error(`[FAIL] ${s.name} at line ${err.loc ? err.loc.line : 'unknown'}: ${err.message}`);
    }
}
