@echo off
echo ===================================================
echo Code an Live-Server (Vercel) senden
echo ===================================================
echo.
echo Sende aktuelle Aenderungen an Vercel...
echo.

git add .
git commit -m "Update: Domain und Sitemap auf www.winterberg-verzeichnis.de umgestellt"
git push origin main

echo.
echo ===================================================
echo Fertig! Deine Aenderungen wurden an Vercel geschickt.
echo Bitte warte ca. 1-2 Minuten, dann lade deine Live-Seite
echo (www.winterberg-verzeichnis.de) im Browser neu!
echo ===================================================
pause
