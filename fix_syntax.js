const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const targetStr = `                                {[
                                    {[
                                    { id: 'Dashboard', label: 'Dashboard', icon: 'dashboard' },`;

const replacementStr = `                                {[
                                    { id: 'Dashboard', label: 'Dashboard', icon: 'dashboard' },`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacementStr);
    fs.writeFileSync('index.html', code, 'utf8');
    console.log("Syntax error fixed successfully");
} else {
    console.log("Could not find exact target string");
}
