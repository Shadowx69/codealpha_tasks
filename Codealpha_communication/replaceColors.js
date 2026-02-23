const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'client', 'src');

const replaceMap = {
    'bg-[#121212]': 'bg-bottle-dark',
    'bg-[#1e1e1e]': 'bg-bottle',
    'border-gray-800': 'border-bottle-light',
    'border-gray-700': 'border-bottle-light',
    'text-white': 'text-cream',
    'text-blue-500': 'text-emerald',
    'bg-blue-500': 'bg-emerald',
    "hover:bg-blue-600": "hover:bg-emerald-dark",
    "bg-blue-500/20": "bg-emerald/20",
    "bg-blue-500/30": "bg-emerald/30",
    'bg-gray-800': 'bg-bottle-light',
    'hover:bg-gray-700': 'hover:bg-sage',
    'bg-gray-700': 'bg-sage-dark',
    'bg-red-500': 'bg-sage',
    'hover:bg-red-600': 'hover:bg-sage-dark',
    'bg-red-500/10': 'bg-sage/10',
    'hover:bg-red-500/20': 'hover:bg-sage/20',
    'text-red-500': 'text-sage-dark',
    'text-gray-400': 'text-sage-light',
    'bg-green-500': 'bg-emerald',
    'hover:bg-green-600': 'hover:bg-emerald-dark',
    'shadow-green-500/30': 'shadow-emerald/30',
    // Hardcoded styles
    "'#121212'": "'#022c22'",
    '"#121212"': '"#022c22"',
    "'#1e1e1e'": "'#0f381c'",
    '"#1e1e1e"': '"#0f381c"',
    "'#3b82f6'": "'#10b981'",
    '"#3b82f6"': '"#10b981"',
    "'#333'": "'#134e4a'",
    '"#333"': '"#134e4a"',
    "'#aaa'": "'#8aa18c'",
    '"#aaa"': '"#8aa18c"',
    "'#ccc'": "'#8b9d83'",
    '"#ccc"': '"#8b9d83"',
    "'#111'": "'#022c22'",
    '"#111"': '"#022c22"',
    "'#000'": "'#022c22'",
    '"#000"': '"#022c22"',
    "rgba(0,0,0,0.5)": "rgba(2, 44, 34, 0.5)",
    "rgba(0,0,0,0.7)": "rgba(2, 44, 34, 0.7)"
};

function processDirectory(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            for (const [key, value] of Object.entries(replaceMap)) {
                // simple global replace
                const replaced = content.split(key).join(value);
                if (replaced !== content) {
                    content = replaced;
                    modified = true;
                }
            }
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    });
}

processDirectory(directoryPath);
console.log('Palette replacement complete.');
