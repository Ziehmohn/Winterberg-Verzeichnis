const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Add User to lucide-react imports
if (!app.includes(', User } from \'lucide-react\'')) {
    app = app.replace("} from 'lucide-react';", ", User } from 'lucide-react';");
}

// Remove from footer
const footerLogin = `        {!isAdminMode && (
          <button 
            onClick={() => setIsAdminMode(true)}
            className={\`text-sm flex items-center gap-1 hover:underline \${theme.textMuted}\`}
          >
            <LogIn className="w-4 h-4" /> {currentUser ? 'Dashboard' : t("adminLogin")}
          </button>
        )}`;
app = app.replace(footerLogin, '');

// Add to header
const headerTarget = `<div className="flex flex-wrap items-center justify-center md:justify-end gap-4 w-full">`;
const headerAccount = `
                {!isAdminMode && (
                  <button 
                    onClick={() => setIsAdminMode(true)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors backdrop-blur-sm"
                    title={currentUser ? 'Dashboard' : t("adminLogin")}
                  >
                    <User className="w-5 h-5" />
                  </button>
                )}`;
app = app.replace(headerTarget, headerTarget + headerAccount);

fs.writeFileSync('src/App.tsx', app);
