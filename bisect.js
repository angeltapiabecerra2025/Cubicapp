const babel = require('@babel/standalone');
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

const testLines = (start, end) => {
    try {
        const code = '<>\n' + lines.slice(start, end).join('\n') + '\n</>';
        babel.transform(code, { presets: ['env', 'react'] });
        return true;
    } catch (e) {
        return false;
    }
}

// I will iteratively remove sections of the JSX to find what breaks it
let brokenCode = lines.slice(9844, 10121);
// Check which part of the IIFE return causes the issue
// The return starts at 9857 and ends at 10118.
for (let i = 9858; i < 10118; i++) {
    // try removing line i
    let temp = [...brokenCode];
    temp.splice(i - 9844, 1);
    try {
        babel.transform('<>\n' + temp.join('\n') + '\n</>', { presets: ['env', 'react'] });
        console.log("Removing line " + i + " fixes the error!");
    } catch (e) {
        // still broken
    }
}
