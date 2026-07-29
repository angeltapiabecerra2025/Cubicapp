const fs = require('fs');
const code = fs.readFileSync('index.html', 'utf8').split('\n').slice(9852, 10119).join('\n');

// We will use a simple scanner to find matching tags.
// Since we only care about JSX, we can use a basic regex but carefully skipping `{...}` blocks.
// Actually, it's easier to just use babel to parse growing prefixes!
// If we parse `<div>`, it throws "Unterminated JSX contents".
// If we parse `<div></div>`, it succeeds.
// Let's do a binary search on the string length to find where it first fails!

let stripped = code.replace(/\{[^{}]*\}/g, 'X');
let stack = [];
let regex = /<\/?([a-zA-Z0-9]+)\b[^>]*>/g;
let match;
while ((match = regex.exec(stripped)) !== null) {
    let tagFull = match[0];
    let tagName = match[1].toLowerCase();
    
    // Ignore self-closing tags
    if (tagFull.endsWith('/>')) continue;

    if (tagFull.startsWith('</')) {
        let top = stack.pop();
        if (!top || top.tagName !== tagName) {
            console.log(`Mismatch! Found </${tagName}> but expected ${top ? top.tagName : 'nothing'}`);
            break;
        }
    } else {
        stack.push({ tagName, full: tagFull, index: match.index });
    }
}

if (stack.length > 0) {
    console.log("Unclosed tags:");
    stack.forEach(t => console.log(t.tagName, "at index", t.index));
} else {
    console.log("All tags balanced in stripped version!");
}
