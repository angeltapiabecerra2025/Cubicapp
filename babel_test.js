const fs = require('fs');
const babel = require('@babel/standalone');

const html = fs.readFileSync('index.html', 'utf8');
const match = html.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);

if (!match) {
    console.error("No Babel script found!");
    process.exit(1);
}

const code = match[1];
const lineOffset = html.substring(0, match.index).split('\n').length;

try {
    babel.transform(code, {
        presets: ['env', 'react']
    });
    console.log("SUCCESS! No Babel errors found.");
} catch (err) {
    if (err.loc) {
        const absLine = err.loc.line + lineOffset - 1;
        console.error(`SYNTAX ERROR at line ${absLine}, col ${err.loc.column}`);
        console.error(err.message);
    } else {
        console.error(err);
    }
}
