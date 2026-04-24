# Handoff — Break'Distrib · Backoffice CRM

## Vue d'ensemble

Backoffice CRM pour **Break'Distrib**, opérateur franco-européen de distributeurs automatiques café/snacks/boissons (positionnement : « La pause, réinventée », flotte 100 % électrique, IoT, démarche RSE). L'outil couvre 3 métiers internes : **Direction** (pilotage), **Commercial** (prospection → signature), **Technique/Logistique** (tournées, interventions, stock).

7 écrans livrés dans le prototype :
1. **Dashboard Direction** (desktop) — vue consolidée CA / parc / alertes
2. **Pipeline commercial** (desktop) — Kanban 5 étapes
3. **Fiche client** (desktop) — Sodexo La Défense, onglets + timeline
4. **Parc distributeurs** (desktop) — liste + carte IDF
5. **Planification tournées** (desktop) — techniciens + itinéraire carto
6. **Reporting & KPI** (desktop) — CA, occupation, carbone, top clients
7. **Terrain technicien** (mobile) — fiche machine + tournée du jour + variant dark mode

## À propos des fichiers de design

Les fichiers HTML de ce bundle sont des **références de design créées en HTML/React inline via Babel**. Ce sont des prototypes qui montrent l'apparence et le comportement attendus — **pas du code de production à copier tel quel**.

La mission : **recréer ces maquettes HTML dans l'environnement cible du projet** (React + Tailwind, Next.js, Vue, etc.) en utilisant les patterns et librairies établis. Si aucun environnement n'existe encore, choisir le framework le plus approprié (recommandation : **Next.js + TypeScript + Tailwind + shadcn/ui**) et implémenter les designs là.

## Fidélité

**Hi-fi** — couleurs, typographie, espacements et interactions sont finalisés. Le développeur doit reproduire l'UI au pixel près en utilisant les composants et patterns du code cible.

## Design tokens

### Couleurs — palette Break'Distrib

**Marque**
- `bd-orange` (primaire) : `#F37021` — CTA, statuts actifs, accent
- `bd-orange-600` (hover) : `#DA5F14`
- `bd-orange-50` (fond) : `#FEF1E8`
- `bd-cream` (fond principal light) : `#F5EFE6`
- `bd-ink` (texte principal light) : `#0E0E0C`

**Neutres (warm, chauds — PAS de gris froid)**
- `n-25`  : `#FDFBF7`
- `n-50`  : `#F5EFE6`
- `n-100` : `#EDE6D6`
- `n-200` : `#E3DBCC`
- `n-300` : `#CFC5B3`
- `n-400` : `#A89F8D`
- `n-500` : `#7C7464`
- `n-700` : `#3D3932`
- `n-900` : `#1A1814`
- `n-950` : `#0E0E0C`

**Sémantique**
- `ok`    : `#2F7D4E` (vert olive) · fond `#EAF3EC`
- `warn`  : `#C6881E` (ambre) · fond `#F7ECD6`
- `err`   : `#C0443A` (rouge brique) · fond `#F6E2DE`
- `info`  : `#2E6DB4` (bleu encre) · fond `#E2EAF4`

**Dark mode** (Linear / Vercel warm)
- Fond principal : `#0E0D0B`
- Surface : `#17160F`
- Surface 2 : `#1C1B13`
- Bordure : `#2A2821`
- Texte : `#F3ECE0`
- Orange inchangé : `#F37021`

### Typographie

- **Sans** : `Geist` (400/500/600/700) — titres, UI, corps de texte
- **Mono** : `Geist Mono` (400/500/600) — IDs, valeurs numériques, timestamps, codes
- Fallbacks : `system-ui, -apple-system, sans-serif` / `ui-monospace, "SF Mono", Menlo`

**Échelle typographique**
- Display (titre page) : `24px / 600 / -0.5 letter-spacing`
- Heading : `18–20px / 600 / -0.3`
- Body : `13–14px / 400–500`
- Small : `12px`
- Caption / label : `10–11px / 500 / uppercase / 0.08em letter-spacing`
- Mono inline : même taille que voisin, `font-variant-numeric: tabular-nums`

**Label pattern** (très utilisé) :
```css
.label { font-family: mono; font-size: 10.5px; color: var(--text-3);
         text-transform: uppercase; letter-spacing: 0.08em; font-weight: 500; }
```

### Espacement

Échelle 4 pt — `4, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32`.
Padding carte standard : `14px 18px` (header) · `16–18px` (corps).
Padding page : `0 32px` horizontal, `20–24px` vertical.

### Radii

- Petit (badge, input) : `6–8px`
- Carte : `10–12px`
- Carte feature / mobile screen : `14–16px`
- Bouton : `8px`
- Pill / dot : `999px`

### Shadows

- `xs` : `0 1px 2px rgba(14,14,12,0.04)`
- `sm` : `0 2px 6px rgba(14,14,12,0.06)`
- `md` : `0 6px 16px rgba(14,14,12,0.08)`
- `lg` : `0 20px 40px rgba(14,14,12,0.12)`
- Accent orange (CTA) : `0 6px 16px rgba(243,112,33,0.35)`

### Animations

- `dur-fast` : `120ms`
- `dur-med` : `220ms`
- `dur-slow` : `400ms`
- `ease` : `cubic-bezier(0.22, 0.61, 0.36, 1)`
- Pulse statut (3 variantes : ok / warn / err) — keyframes `pulse-<tone>` 2s infinite

## Principes visuels

1. **Chaleur, pas corpo-froid** — neutres warm, crème, orange brûlé. JAMAIS de gris bleuté type Bootstrap.
2. **Mono en accent** — tous les IDs machines (`BD-0167`), opportunités (`OP-2012`), clients (`C-1068`), factures (`FC-24812`), timestamps, valeurs en € et km en **Geist Mono**.
3. **Densité mesurée** — le backoffice est dense (beaucoup d'infos) mais respire (espacement 14–18 dans les cartes, 32 en marge de page).
4. **Statuts sans icône parasite** — point coloré 6–8 px + texte. Les icônes servent les actions, pas les statuts.
5. **Loader de marque réutilisé** — le spinner orange (3 billes qui tombent en cadence) sert d'indicateur "live sync IoT" dans le dashboard et la carte tournées. Code dans `app/ui.jsx` (`BDLoader`).

## Écrans en détail

### 1. Dashboard Direction (`screen-dashboard.jsx`)

**Layout** : header page + 4 KPI full-width + grille 2 colonnes (`1.5fr 1fr`).

**Blocs**
- **4 KPI cards** : CA mois, Machines actives, Pipeline commercial, Taux de panne. Chaque KPI : label uppercase + grande valeur tabular + unité small + delta coloré (↑ vert / ↓ rouge) + sparkline SVG 60 px.
- **Carte Parc distributeurs** (col. gauche) : header avec `BDLoader` "Sync temps réel · il y a 12 s", ligne de 4 statuts (En ligne / Stock faible / Panne / À installer) avec gros chiffres tabular, puis sous-grille 2 col : barres par modèle (Café Pro X3 / Snack Compact S2 / etc.) + activité IoT récente (liste d'events avec dot statut).
- **Pipeline commercial** : 5 colonnes visuelles (Prospect → Audit → Proposition → Négociation → Signé) avec mini-barre verticale 44 px + compteur + valeur mono.
- **Alertes prioritaires** (col. droite) : liste de 4 items, chaque item = dot statut + ID mono + titre + CTA "Intervenir/Diagnostic/Relancer/Planifier".
- **Tournées** : 3 techniciens en cours/planifiés, avatar initiales + aire + badge état + barre progression + mono `3/7 arrêts · 42 km`.
- **Carte Bilan carbone** : gradient subtil + icône leaf en watermark + 2 stats (km élec. / CO₂ évités).

### 2. Pipeline commercial (`screen-clients.jsx` → `ScreenPipeline`)

**Kanban 5 colonnes**, même grille que dashboard mini-pipeline mais en version étalée.

Chaque carte opportunité :
- border-left 3px couleur de l'étape
- Mono ID en haut (`OP-2012`) + badge "chaud" si applicable
- Nom client en 13.5 px medium
- Valeur en orange mono tabular + contact + âge
- Ligne "prochaine action" sur fond surface-2 avec icône clock + texte + âge à droite

### 3. Fiche client (`ScreenClient`) — Sodexo La Défense

**Structure** :
1. Fil d'Ariane `Clients › Secteur Services › Sodexo La Défense`
2. Header : avatar gradient 56px + nom + badges (Client actif / LCD) + meta (C-1068, adresse Tour Cœur Défense T1 92800 Puteaux, 640 postes, 8 machines) + actions (Email, Appeler, Nouvelle opportunité)
3. Strip de 5 KPI : CA mois, CA annuel, Contrat, Machines actives, Satisfaction
4. Tabs (Vue d'ensemble, Machines [8], Contrats & factures, Historique, Documents)
5. Grille 2 col (`1fr 340px`) :
   - Gauche : Timeline échanges (6 events), Machines installées (table), Contrats & factures
   - Droite : Contact principal (Pierre Vignal, DSG), Prochaine relance (warn), Google Drive avec 4 fichiers

### 4. Parc distributeurs (`screen-parc.jsx`)

**Toolbar** : search + filtres (Modèle / Client / Stock) + switch Liste ↔ Carte.

**Vue liste** : table 8 colonnes — ID mono, Modèle, Client & lieu, Statut (badge dot), Stock (barre + %), Température (rouge si > 7 °C), Dernière sync, chevron.

**Vue carte** : viewport SVG 48.68–48.96 lat / 2.10–2.48 lng (IDF), grille quadrillée, tracé Seine fantôme, labels de villes uppercase, pins circulaires 14 px avec pulse animé selon statut, légende en bas gauche.

### 5. Planification tournées (`screen-tournees.jsx`)

**Layout** : 320px col techniciens + carte 620 px.

**Col techniciens** : 3 cartes (Thomas Rossi highlight border orange, Laila Bah, Julien Lefèvre) + carte dashed "Assigner un 4e".

**Carte** : même viewport IDF + tracé orange pointillé entre 7 arrêts numérotés. Pin `seq` 22–28 px, pin en cours orange + halo + pulse, pin panne rouge + pulse. Panneau info en haut-droite "Prochain arrêt" avec distance/ETA.

### 6. Reporting (`ScreenReporting`)

4 KPI + bloc CA par formule (barres empilées 12 mois, 3 segments Gratuit/Location/LCD) + Occupation par modèle (liste + barre) + Bilan carbone (4 chiffres 2×2) + Top clients (table 5 lignes).

### 7. Mobile technicien (`screen-mobile.jsx`)

**Fiche machine** — hero avec back + menu + icône machine 56 px orange + ID mono + modèle, bandeau d'alerte rouge si panne, carte client (adresse + Itinéraire / Contact), niveaux de stock (5 items barre tonale), dernières interventions, action bar sticky orange "Déclarer une intervention" + 2 actions secondaires (Photo / Réassort fait).

**Tournée du jour** — header avec avatar tech + 3 mini-stats (Arrêts 3/7, Distance, Fin prévue) + timeline verticale avec pastille done/current/à venir + carte par arrêt (mono horaire + ID + badges + client + lieu + tâche + durée).

**Dark variant** — mêmes structures, fonds `#151412` / `#1C1B18` / `#22201C`, texte `#F3ECE0`, orange inchangé. Optimisé lisibilité plein soleil.

## Interactions

- **Mode canvas** : 7 cartes d'écran empilées avec label, cliquables pour zoomer en prototype.
- **Mode prototype** : plein écran + barre flottante bas (navigation 7 écrans + bouton Canvas).
- **Sidebar** : nav persistante avec 6 items (dashboard, pipeline, parc, tournées, reporting, clients).
- **Topbar** : search global + cmd+K indice + bell + avatar.
- **Liens inter-écrans** : "Voir le parc" depuis dashboard, clic ligne machine → fiche, clic opportunité → fiche client, etc.
- **Light/Dark toggle** persistant en localStorage.
- **Active screen + mode** persistants en localStorage (`bd_mode`, `bd_active`, `bd_theme`).

## State à prévoir côté appli réelle

- `currentUser` (rôle : direction / commercial / technique — pour router les écrans par défaut)
- `theme` (light/dark)
- Listes paginées : machines, clients, opportunités, tournées, interventions, factures
- WebSocket / polling IoT pour statut machines en temps réel (le loader pulse pendant le refresh)
- Géoloc techniciens en temps réel pour la carte tournées
- Offline-first côté mobile technicien (déclaration intervention / photo / réassort fait doivent fonctionner sans réseau puis sync)

## Assets

- **Logo / wordmark** : SVG inline dans `BDMark` (`app/ui.jsx`). Cercle crème avec carré orange décalé 45° + wordmark "Break'Distrib" avec apostrophe orange.
- **Loader** : composant `BDLoader` animé (3 billes qui tombent). Utilisable en 3 tailles (12 / 16 / 24 px).
- **Icônes** : SVG inline stroke 2, système custom dans `Icon` (`app/ui.jsx`) — dashboard, machine, pipeline, route, chart, users, plus, download, calendar, search, filter, mail, phone, pin, clock, alert, check, chevron, arrow-up/down/right, bolt, leaf, moon, sun, x, more, camera, coffee, snack, euro, bell, scan. Si une librairie d'icônes est imposée côté appli (Lucide, Phosphor), mapper 1:1.
- **Pas d'images bitmap** dans le design actuel — tout est SVG.

## Fichiers livrés

```
design_handoff_breakdistrib_crm/
├── README.md                        # ce fichier
├── Backoffice CRM.html              # entrée principale du prototype
└── app/
    ├── tokens.css                   # tous les design tokens (CSS variables)
    ├── ui.jsx                       # composants partagés : Icon, Badge, Button, Card, KPI, SideNav, TopBar, BDLoader, BDMark, Bar, Sparkline, PageHeader, StatusDot, SectionHead
    ├── data.jsx                     # mock data : CLIENTS, MACHINES, TOURNEE_TODAY, PIPELINE_STAGES, sparklines
    ├── screen-dashboard.jsx
    ├── screen-parc.jsx
    ├── screen-tournees.jsx          # contient ScreenTournees ET ScreenReporting
    ├── screen-clients.jsx           # contient ScreenPipeline ET ScreenClient
    └── screen-mobile.jsx            # fiche machine + tournée du jour + dark variant
```

## Recommandation d'implémentation

**Stack suggérée** : Next.js 15 App Router + TypeScript + Tailwind + shadcn/ui + Recharts + lucide-react + Leaflet/MapLibre (cartes réelles) + Zustand (state client) + TanStack Query (server state).

**Ordre de migration** :
1. Tokens CSS → `globals.css` + `tailwind.config.ts` (étendre les couleurs avec `bd-orange`, `bd-cream`, `bd-ink`, neutrals warm, sémantique).
2. Polices Geist + Geist Mono via `next/font`.
3. Composants atomiques : Badge, Button, Card, KPI, Bar, Sparkline, StatusDot, BDLoader.
4. Shell : SideNav + TopBar + layout 2 colonnes.
5. Un écran à la fois en commençant par le Dashboard (plus atomique) puis Pipeline → Client → Parc → Tournées → Reporting → Mobile.
6. Remplacer les cartes SVG custom par Leaflet avec fond tuile clair neutral et marqueurs personnalisés.
7. Câbler mock → API réelle (OpenAPI ou tRPC) à la fin.

## Points d'attention

- **Accessibilité** : les hit-targets mobiles sont tous ≥ 44 px. Garder les contrastes AA (orange/blanc OK, orange/crème à revalider). Ajouter `aria-label` sur les boutons icon-only de la proto bar.
- **Performance** : les cartes en prototype utilisent du SVG viewport absolu — en prod, passer à une vraie carte (vectoriel + clustering si > 100 machines).
- **Responsive** : actuellement desktop (≥ 1280) + mobile (375). Les breakpoints tablette (768–1280) ne sont PAS traités ; à définir avec le PO.
- **i18n** : tout est en français. Prévoir `next-intl` si multi-langue (EN pour Allemagne / Espagne évoqués dans le brief).
