@echo off
echo ===================================================
echo Firebase Datenbank-Regeln Update
echo ===================================================
echo.
echo Schritt 1: Bei Google Firebase anmelden...
echo (Es oeffnet sich gleich ein Browser-Fenster. Bitte logge dich ein und schliesse das Fenster danach wieder.)
echo.
call npx -y firebase-tools@latest login

echo.
echo Schritt 2: Lade die neuen Berechtigungs-Regeln hoch...
call npx -y firebase-tools@latest deploy --only firestore:rules --project gen-lang-client-0671429103

echo.
echo ===================================================
echo Fertig! Wenn keine roten Fehler angezeigt wurden, 
echo funktioniert das Speichern auf der Webseite jetzt wieder!
echo Du kannst dieses Fenster schliessen.
echo ===================================================
pause
