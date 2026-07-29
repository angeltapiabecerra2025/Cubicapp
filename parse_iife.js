const babel = require('@babel/standalone');
const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

// The body of the IIFE starts around 9852 and ends around 10118.
// Let's just wrap the IIFE body in a function and try to parse it as raw JS (not JSX).
// Actually, it has JSX inside it, so we must parse it as JSX.
const code = `
function test() {
    ${lines.slice(9852, 10119).join('\n')}
}
`;
try {
    babel.transform(code, { presets: ['env', 'react'] });
    console.log("SUCCESS");
} catch (e) {
    console.log(e.message);
}
