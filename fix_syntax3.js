const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const targetStr = `                                {
                                    { id: 'Dashboard'`;
const replacementStr = `                                {[
                                    { id: 'Dashboard'`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacementStr);
    fs.writeFileSync('index.html', code, 'utf8');
    console.log("Syntax error fixed successfully");
} else {
    // try with \r\n
    const regex = /\{\s*\{\s*id:\s*'Dashboard'/m;
    if (regex.test(code)) {
        code = code.replace(regex, `{[\n                                    { id: 'Dashboard'`);
        fs.writeFileSync('index.html', code, 'utf8');
        console.log("Replaced via regex!");
    } else {
        console.log("Could not find exact target string");
    }
}
