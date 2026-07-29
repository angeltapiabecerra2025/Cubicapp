const babel = require('@babel/standalone');
const fs = require('fs');

const html = fs.readFileSync('vista_previa2.html', 'utf8');

// Find the Babel block
let startIndex = html.indexOf('<script type="text/babel">');
let endIndex = html.indexOf('</script>', startIndex);
if (startIndex === -1 || endIndex === -1) {
    console.log("No Babel block found.");
    process.exit(1);
}

const babelCode = html.substring(startIndex + '<script type="text/babel">'.length, endIndex);
try {
    babel.transform(babelCode, { presets: ['env', 'react'] });
    console.log("SUCCESS! No Babel errors found in vista_previa2.html.");
} catch (err) {
    console.error("SYNTAX ERROR in vista_previa2.html at line", err.loc ? err.loc.line : "?", "col", err.loc ? err.loc.column : "?");
    console.error(err.message);
}
