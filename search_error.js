const babel = require('@babel/standalone');
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

function tryParse(len) {
    const tabCode = lines.slice(9806, 9806 + len).join('\n');
    const code = `
    const Test = () => (
        <div>
            ${tabCode}
        </div>
    );
    `;
    try {
        babel.transform(code, { presets: ['env', 'react'] });
        return true;
    } catch (err) {
        return false;
    }
}

// Binary search to find the shortest length that causes the error to NOT be "Unterminated JSX"
// Actually, if we just want to know where it breaks:
for (let i = 100; i < 317; i++) {
    const tabCode = lines.slice(9806, 9806 + i).join('\n');
    const code = `
    const Test = () => (
        <div>
            ${tabCode}
        </div>
    );
    `;
    try {
        babel.transform(code, { presets: ['env', 'react'] });
        console.log("Success at " + i);
    } catch (err) {
        if (!err.message.includes('Unterminated JSX contents') && !err.message.includes('Unexpected token (')) {
            console.log("Error at " + i + ": " + err.message);
        }
    }
}
