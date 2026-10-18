# nishandidi.github.io

Website von Nishan Didi – Wachstumspartner für KMU & Handwerk in der Schweiz.
Live: https://nishandidi.github.io · Inhalte bearbeiten: https://nishandidi.github.io/admin/

## Aufbau

| Pfad | Inhalt |
|---|---|
| `index.html` | Die Seite (statisch, enthält alle Inhalte als Fallback) |
| `cms.js` | Lädt die veröffentlichte „Startseite“ aus Sanity (Projekt `emuhnqj1`, Dataset `production`) und ersetzt die Texte |
| `admin/` | Gebautes Sanity Studio (wird von GitHub Pages ausgeliefert) |
| `404.html` | Lässt Unterseiten des Studios (z. B. `/admin/structure/...`) direkt aufrufbar sein |
| `studio/` | Quellcode des Sanity Studios (Schema in `studio/schemaTypes/`) |

## Einmalige Einrichtung in Sanity

1. **CORS freigeben:** https://www.sanity.io/manage/project/emuhnqj1 → API → CORS origins →
   `https://nishandidi.github.io` hinzufügen und **„Allow credentials“ aktivieren** (nötig für das Studio).
2. **Startinhalte importieren** (einmalig, lokal):
   ```bash
   cd studio
   npm install
   npx sanity login
   npm run import-seed
   ```
   Danach steht im Studio unter „Startseite“ der komplette aktuelle Inhalt.

## Inhalte bearbeiten

https://nishandidi.github.io/admin/ öffnen → mit Sanity anmelden → „Startseite“ → ändern → **Publish**.
Die Seite zeigt Änderungen nach wenigen Sekunden (Sanity-CDN).

Tipp: In Überschriften markierst du Wörter mit `*Sternchen*`, um den grünen Marker zu setzen.

## Schema ändern

```bash
cd studio
npm install
npm run dev      # lokal testen auf http://localhost:3333/admin
npm run build    # baut das Studio neu nach ../admin
```
Danach `admin/` committen und pushen.
