const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", (err) => {
  console.error("JSDOM Error:", err);
});
virtualConsole.on("warn", (warn) => {
  console.warn("JSDOM Warn:", warn);
});
virtualConsole.on("info", (info) => {
  console.info("JSDOM Info:", info);
});
virtualConsole.on("log", (log) => {
  console.log("JSDOM Log:", log);
});

console.log("Initializing JSDOM...");

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable",
  virtualConsole
});

dom.window.addEventListener("error", (event) => {
  console.error("Window Error:", event.error);
});

dom.window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled Rejection:", event.reason);
});

setTimeout(() => {
    console.log("Checking if root has children...");
    const root = dom.window.document.getElementById('root');
    if (root) {
        console.log("Root innerHTML length:", root.innerHTML.length);
        if (root.innerHTML.length === 0) {
            console.error("ROOT IS EMPTY! React failed to render.");
        }
    } else {
        console.error("No root element found!");
    }
    console.log("Test finished.");
    process.exit(0);
}, 5000);
