const fs = require('fs');
let authContext = fs.readFileSync('src/AuthContext.tsx', 'utf8');

authContext = authContext.replace(
  /setUserProfile\(\{\n\s*uid: user\.uid,\n\s*email: user\.email,\n\s*role: 'user',\n\s*\}\);/,
  `setUserProfile({
              uid: user.uid,
              email: user.email,
              role: user.email === 'simon.kraeling@gmail.com' ? 'admin' : 'user',
            });`
);

// Also make sure that if the document exists but role is user, we still override for simon
authContext = authContext.replace(
  /setUserProfile\(docSnap\.data\(\) as UserProfile\);/,
  `const data = docSnap.data() as UserProfile;
            if (user.email === 'simon.kraeling@gmail.com') {
              data.role = 'admin';
            }
            setUserProfile(data);`
);

fs.writeFileSync('src/AuthContext.tsx', authContext);
