const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const anchor = `        </div>
        {!isAdminMode && (`;

const switcher = `          <div className="flex flex-col md:flex-row items-center gap-4 text-sm font-medium">
            <button
              onClick={() => {
                setLang('de');
                const curr = window.location.pathname.replace(/^\\/nl/, '');
                window.history.pushState(null, '', curr || '/');
              }}
              className={\`\${lang === 'de' ? 'text-black font-bold' : 'text-black/60'} hover:text-black\`}
            >
              DE
            </button>
            <span className="text-black/20">|</span>
            <button
              onClick={() => {
                setLang('nl');
                const curr = window.location.pathname.replace(/^\\/nl/, '');
                window.history.pushState(null, '', '/nl' + (curr === '/' ? '' : curr));
              }}
              className={\`\${lang === 'nl' ? 'text-black font-bold' : 'text-black/60'} hover:text-black\`}
            >
              NL
            </button>
          </div>
`;

content = content.replace(anchor, switcher + anchor);
fs.writeFileSync('src/App.tsx', content);
