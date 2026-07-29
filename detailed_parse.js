const babel = require('@babel/standalone');
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
const detalleTab = lines.slice(9844, 10121).join('\n');

try {
    babel.transform('<>\n' + detalleTab + '\n</>', { presets: ['env', 'react'] });
} catch (err) {
    if (err.loc) {
        console.log(`Error at line ${err.loc.line}, column ${err.loc.column}`);
        console.log("Message:", err.message);
        
        // Let's print the actual line from detalleTab
        const errLine = err.loc.line - 1; // 0-indexed in array
        const tabLines = ('<>\n' + detalleTab + '\n</>').split('\n');
        console.log("Context:");
        for (let i = Math.max(0, errLine - 5); i <= Math.min(tabLines.length - 1, errLine + 5); i++) {
            if (i === errLine) {
                console.log(`> ${tabLines[i]}`);
                console.log(`  ${' '.repeat(err.loc.column)}^`);
            } else {
                console.log(`  ${tabLines[i]}`);
            }
        }
    } else {
        console.log(err);
    }
}
