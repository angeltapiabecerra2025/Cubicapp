const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const regex = /\{\[\r?\n\s*\{\[\r?\n\s*\{\s*id:\s*'Dashboard'/;
if (regex.test(code)) {
    code = code.replace(regex, `{\n                                    { id: 'Dashboard'`);
    fs.writeFileSync('index.html', code, 'utf8');
    console.log("Syntax error fixed via regex");
} else {
    // If it was just one `{[`, wait, look at my previous script `fix_menu3.js`:
    // const newBlock = '{[\n' + newItems + '\n                                ]';
    // BUT the old block already had `{[`. So I did `{[` inside a block that already had `{[`.
    // Wait, let's just find exactly what is there now.
    
    // In the earlier output:
    // `                                {[
    //                                    {[
    //                                    { id: 'Dashboard', label: 'Dashboard', icon: 'dashboard' },`
    
    // Just replace the duplicate `{\[`:
    code = code.replace(/\{\[\s*\{\[\s*\{\s*id:\s*'Dashboard'/m, "{[\n                                    { id: 'Dashboard'");
    fs.writeFileSync('index.html', code, 'utf8');
    console.log("Replaced using second regex!");
}
