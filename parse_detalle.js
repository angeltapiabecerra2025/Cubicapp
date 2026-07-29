const babel = require('@babel/standalone');
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
const detalleTab = lines.slice(9806, 10122).join('\n'); // 9807 to 10122

const code = `
const DetalleTab = () => (
    <div>
        ${detalleTab}
    </div>
);
`;

try {
    babel.transform(code, {
        presets: ['env', 'react']
    });
    console.log("SUCCESS");
} catch (err) {
    console.error(err.message);
}
