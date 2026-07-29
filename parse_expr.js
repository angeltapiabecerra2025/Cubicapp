const babel = require('@babel/standalone');
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
const detalleTab = lines.slice(9806, 10123).join('\n'); // 9807 to 10123
try {
    babel.transform(detalleTab, { presets: ['env', 'react'] });
    console.log("SUCCESS");
} catch (err) {
    console.error(`ERROR at line ${err.loc ? err.loc.line : '?'}: ${err.message}`);
}
