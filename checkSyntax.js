const fs = require('fs');
const babel = require('@babel/core');

function checkFile(file) {
    try {
        const html = fs.readFileSync(file, 'utf8');
        const scriptMatch = html.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
        if (!scriptMatch) {
            console.log(file + ': No babel script found');
            return;
        }
        const script = scriptMatch[1];
        babel.transformSync(script, { presets: ['@babel/preset-react'] });
        console.log(file + ': OK');
    } catch(e) {
        console.error(file + ' ERROR:', e.message);
    }
}

checkFile('index.html');
checkFile('vista_previa2.html');
