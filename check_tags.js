const fs = require('fs');
const code = fs.readFileSync('index.html', 'utf8').split('\n').slice(9857, 10121).join('\n');

// Strip JSX expressions first to avoid matching tags inside strings or comments
let stripped = code.replace(/\{[^{}]*\}/g, ''); // Naive strip of expressions without nested curlies
// Better: just match HTML tags
const regex = /<\/?([a-zA-Z0-9]+)\b[^>]*>/g;
let match;
const stack = [];

while ((match = regex.exec(code)) !== null) {
    const tagFull = match[0];
    const tagName = match[1].toLowerCase();
    
    // Ignore self-closing tags
    if (tagFull.endsWith('/>')) continue;
    // Ignore void elements
    const voidElements = ['input', 'br', 'hr', 'img', 'meta', 'link'];
    if (voidElements.includes(tagName)) continue;

    if (tagFull.startsWith('</')) {
        const top = stack.pop();
        if (!top || top.tagName !== tagName) {
            console.log(`Mismatch at index ${match.index}: found </${tagName}> but expected </${top ? top.tagName : 'nothing'}>`);
            const context = code.substring(Math.max(0, match.index - 50), match.index + 50);
            console.log(context);
            break;
        }
    } else {
        stack.push({ tagName, index: match.index });
    }
}

if (stack.length > 0) {
    console.log("Unclosed tags remaining:");
    stack.forEach(t => console.log(t.tagName, "at", code.substring(t.index, t.index+50)));
} else {
    console.log("All tags balanced!");
}
