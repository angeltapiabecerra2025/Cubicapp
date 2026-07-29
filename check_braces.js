const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
const detalleTab = lines.slice(9806, 10123).join('\n'); // 9807 to 10123

// Strip strings, regex, and comments
let stripped = detalleTab;
stripped = stripped.replace(/\/\*[\s\S]*?\*\//g, '');
stripped = stripped.replace(/\/\/.*$/gm, '');
stripped = stripped.replace(/'(?:\\'|[^'])*'/g, "''");
stripped = stripped.replace(/"(?:\\"|[^"])*"/g, '""');
stripped = stripped.replace(/`(?:\\`|[^`])*`/g, '``');

let stack = [];
for (let i = 0; i < stripped.length; i++) {
    const c = stripped[i];
    if (c === '{' || c === '(' || c === '[') {
        stack.push(c);
    } else if (c === '}' || c === ')' || c === ']') {
        const top = stack[stack.length - 1];
        if ((c === '}' && top === '{') ||
            (c === ')' && top === '(') ||
            (c === ']' && top === '[')) {
            stack.pop();
        } else {
            console.log("Mismatch at char " + i + ": " + c + " with top " + top);
            console.log(stripped.substring(Math.max(0, i-50), i+50));
            break;
        }
    }
}
console.log("Remaining stack:", stack.join(''));
