# Lindenhof Hausverwaltung GbR — Website

Statische Website für eine (fiktive) Hausverwaltung in Düsseldorf.
Rechtsform: GbR, Gesellschafter **Markus Dutzbach** und **Katharina Reimers**.

## Starten

Einfach `index.html` im Browser öffnen. Für saubere Pfade alternativ:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

Kein Build-Schritt, keine Abhängigkeiten — reines HTML, CSS und JavaScript.

## Dateien

```
index.html          Startseite (alle Abschnitte)
impressum.html      Impressum (Beispieldaten)
datenschutz.html    Datenschutzerklärung (Mustertext)
assets/css/style.css
assets/js/main.js
assets/img/         19 Platzhalterfotos
BILDNACHWEISE.md    Herkunft jedes Fotos
netlify.toml        Deploy-Konfiguration (Publish-Verzeichnis, Header)
build/artifact.html Vorschau-Kopie ohne <head>-Hülle (nur für die
                    Artifact-Veröffentlichung, nicht im Repo)
```

## Abschnitte der Startseite

Topbar · Hero · Objektregister-Laufband · Leistungen (6) · Kennzahlen ·
Unternehmen · Referenzobjekte (11, filterbar, mit Lightbox) · Ablauf (4 Schritte) ·
Portal · Team (4) · Kundenstimmen (Slider) · FAQ (Akkordeon) · Kontaktformular · Footer

## Animationen

Scroll-Reveal mit gestaffeltem Versatz, Zählwerk für die Kennzahlen, Ken-Burns-Zoom
im Hero, Parallaxe im Kennzahlen-Band, Laufband, Filter-Übergänge, Lightbox,
Stimmen-Slider mit Autoplay, Akkordeon, Lesefortschritt im Header, Scrollspy.
Alles respektiert `prefers-reduced-motion`.

## Gestaltung

Weißer Grund, Akzent Marineblau `#1B3A6B`, Anthrazit-Bänder `#131A26` für Topbar,
Objektregister, Kennzahlen, Portal und Footer. Schriften: Libre Franklin (Überschriften),
Source Sans 3 (Fließtext). Der Footer trägt auf allen Seiten den Hinweis
„Webseite erstellt von Manke Websolutions".

## Hell und Dunkel

Die Seite folgt dem System-Theme. Zum Erzwingen:
`<html lang="de" data-theme="light">` bzw. `data-theme="dark"`.

## Vor dem Livegang zu ersetzen

1. **Fotos** in `assets/img/` — siehe `BILDNACHWEISE.md`. Gleiche Dateinamen
   behalten, dann ist keine Änderung am HTML nötig. Seitenverhältnisse:
   Hero 5:3, Objekte 4:3, Team 4:4.6, Über uns 4:3.4.
2. **Kontaktformular** — läuft über Netlify Forms (`data-netlify="true"`, Formularname
   `anfrage`). Eingänge stehen im Netlify-Dashboard unter *Forms*; für E-Mail-Benachrichtigungen
   dort eine Notification anlegen. Lokal geöffnet schlägt der Versand fehl — das ist erwartbar,
   den POST nimmt erst die Netlify-Domain an.
3. **Impressum und Datenschutz** — sämtliche Angaben sind Beispieldaten
   (USt-IdNr., Steuernummer, Anschrift, Rufnummern, Versicherung).
4. **Zahlen und Objektdaten** — Einheiten, Baujahre, Kennzahlen und Kundenstimmen
   sind erfunden (412 Einheiten, 27 Objekte, 5 Mitarbeitende, gegründet 2011).
5. **Google Fonts** — für DSGVO-Konformität besser lokal einbinden
   (Libre Franklin, Source Sans 3).
6. **Portal-Login** — der Button verweist aktuell auf den Kontaktabschnitt.
