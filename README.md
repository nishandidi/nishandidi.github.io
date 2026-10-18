# nishandidi.github.io

Website von Nishan Didi – Wachstumspartner für KMU & Handwerk in der Schweiz.
Live: https://nishandidi.github.io · Inhalte bearbeiten: https://nishandidi.github.io/admin/

## Aufbau

| Pfad | Inhalt |
|---|---|
| `index.html` | Die Seite (statisch, enthält alle Inhalte als Fallback) |
| `didi-marketing/` | Eigenständige Landingpage im neuen Design (ohne CMS), live unter /didi-marketing/ |
| `vorlagen/` | Übersicht der Website-Entwürfe für Leads (noindex), je Kunde ein Unterordner, z. B. `vorlagen/at-brandschutz/` |
| `cms.js` | Lädt die veröffentlichte „Startseite“ aus Sanity (Projekt `emuhnqj1`, Dataset `production`) und ersetzt die Texte |
| `admin/` | Gebautes Sanity Studio (wird von GitHub Pages ausgeliefert) |
| `404.html` | Lässt Unterseiten des Studios (z. B. `/admin/structure/...`) direkt aufrufbar sein |
| `studio/` | Quellcode des Sanity Studios (Schema in `studio/schemaTypes/`) |

## Einmalige Einrichtung in Sanity

**CORS freigeben:** https://www.sanity.io/manage/project/emuhnqj1 → API → CORS origins →
`https://nishandidi.github.io` hinzufügen und **„Allow credentials“ aktivieren**.

Ein Import ist nicht nötig: Beim ersten Öffnen der „Startseite“ im Studio ist sie mit dem aktuellen
Website-Inhalt vorausgefüllt. Einmal **Publish** klicken – fertig.

## Inhalte bearbeiten (Baukasten)

https://nishandidi.github.io/admin/ öffnen → mit Sanity anmelden → „Startseite“.

- **Abschnitte**: Klick auf einen Abschnitt öffnet seine Texte. Über das Menü (⋮) duplizieren oder löschen,
  mit dem Griff links per Drag & Drop verschieben, mit „+ Element hinzufügen“ neue Bausteine einfügen
  (z. B. „Freier Textabschnitt“).
- **Kontakt, Footer & SEO**: zweiter Reiter oben.
- Danach **Publish** – die Seite zeigt Änderungen nach wenigen Sekunden.
- Wörter in `*Sternchen*` bekommen in Überschriften den grünen Marker.
- Zurücksetzen auf den Ausgangsinhalt: Dokument über ⋮ → Delete löschen und „Startseite“ neu öffnen.

## Schema ändern

```bash
cd studio
npm install
npm run dev      # lokal testen auf http://localhost:3333/admin
npm run build    # baut das Studio neu nach ../admin
```
Danach `admin/` committen und pushen.
