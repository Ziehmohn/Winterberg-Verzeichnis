@echo off
echo ===================================================
echo Code an Live-Server (Vercel) senden
echo ===================================================
echo.
echo Sende aktuelle Reparaturen (Cookie-Banner, Weisser Bildschirm) an Vercel...
echo.

git add .
git commit -m "Fix: Cookie-Banner Endlosschleife und weisser Bildschirm"
git push origin main

echo.
echo ===================================================
echo Fertig! Deine Aenderungen wurden an Vercel geschickt.
echo Bitte warte ca. 1-2 Minuten, dann lade deine Live-Seite
echo (winterberg.sichtbar-online.com) im Browser neu!
echo ===================================================
pause
