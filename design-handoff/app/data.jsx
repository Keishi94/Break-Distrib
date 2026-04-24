/* Break'Distrib — Shared data (realistic Île-de-France) */

const CLIENTS = [
  { id: "C-1042", name: "Groupe Lumen",        addr: "12 rue de la Boétie, 75008 Paris",         sector: "Média",    seats: 180, machines: 3 },
  { id: "C-1047", name: "Atelier Moreau",      addr: "48 rue Oberkampf, 75011 Paris",            sector: "Agence",   seats: 42,  machines: 1 },
  { id: "C-1051", name: "Novatek Industries",  addr: "Parc d'activités, 92400 Courbevoie",       sector: "Industrie",seats: 320, machines: 5 },
  { id: "C-1063", name: "Clinique du Parc",    addr: "3 av. de l'Europe, 94300 Vincennes",       sector: "Santé",    seats: 110, machines: 2 },
  { id: "C-1068", name: "Sodexo La Défense",   addr: "Tour Coeur Défense, 92800 Puteaux",        sector: "Services", seats: 640, machines: 8 },
  { id: "C-1072", name: "Éditions Kairos",     addr: "18 quai de Jemmapes, 75010 Paris",         sector: "Média",    seats: 60,  machines: 1 },
  { id: "C-1079", name: "Lycée Saint-Exupéry", addr: "Bd Voltaire, 93100 Montreuil",             sector: "Éducation",seats: 1200,machines: 4 },
  { id: "C-1084", name: "Studio Orbite",       addr: "5 rue Bichat, 75010 Paris",                sector: "Agence",   seats: 28,  machines: 1 },
  { id: "C-1091", name: "BioPole Saclay",      addr: "Campus Paris-Saclay, 91190 Gif-sur-Yvette",sector: "R&D",      seats: 220, machines: 3 },
  { id: "C-1095", name: "Mairie de Versailles",addr: "4 av. de Paris, 78000 Versailles",         sector: "Public",   seats: 340, machines: 3 },
  { id: "C-1102", name: "Transports Véga",     addr: "ZI Nord, 93200 Saint-Denis",               sector: "Logistique",seats:210, machines: 4 },
  { id: "C-1108", name: "Cabinet Aldebert",    addr: "22 av. Victor Hugo, 75016 Paris",          sector: "Conseil",  seats: 34,  machines: 1 },
];

const MACHINES = [
  // id, model, clientId, location, status, stockPct, temp, lastSync, coord
  { id: "BD-0142", model: "Snack Compact S2",   client: "C-1047", place: "Accueil RDC",        status: "ok",   stock: 82, temp: 6.2, sync: "il y a 2 min",   coord: [48.8639, 2.3771] },
  { id: "BD-0155", model: "Café Pro X3",        client: "C-1042", place: "Étage 4 — Open Space", status: "warn", stock: 28, temp: 5.8, sync: "il y a 4 min", coord: [48.8719, 2.3130] },
  { id: "BD-0161", model: "Boissons Fresh F4",  client: "C-1068", place: "Tour Cœur Défense T1", status: "ok",   stock: 64, temp: 4.9, sync: "il y a 1 min", coord: [48.8918, 2.2390] },
  { id: "BD-0167", model: "Snack Compact S2",   client: "C-1068", place: "Cafétéria niv. -1",    status: "err",  stock: 18, temp: 7.8, sync: "il y a 21 min", coord: [48.8921, 2.2395] },
  { id: "BD-0173", model: "Café Pro X3",        client: "C-1051", place: "Hall d'accueil",       status: "ok",   stock: 91, temp: 5.4, sync: "il y a 3 min",  coord: [48.8969, 2.2528] },
  { id: "BD-0178", model: "Boissons Fresh F4",  client: "C-1063", place: "Salle pause 2e étage", status: "warn", stock: 34, temp: 5.1, sync: "il y a 6 min",  coord: [48.8457, 2.4391] },
  { id: "BD-0184", model: "Café Pro X3",        client: "C-1072", place: "Salle de réunion A",   status: "ok",   stock: 76, temp: 5.2, sync: "il y a 5 min",  coord: [48.8722, 2.3684] },
  { id: "BD-0189", model: "Snack Compact S2",   client: "C-1079", place: "Réfectoire",           status: "ok",   stock: 57, temp: 6.0, sync: "il y a 2 min",  coord: [48.8638, 2.4477] },
  { id: "BD-0194", model: "Boissons Fresh F4",  client: "C-1091", place: "Bâtiment C — RDC",     status: "ok",   stock: 68, temp: 4.7, sync: "il y a 4 min",  coord: [48.7107, 2.1700] },
  { id: "BD-0201", model: "Snack Compact S2",   client: "C-1095", place: "Annexe Montreuil",     status: "err",  stock: 12, temp: 9.4, sync: "il y a 47 min", coord: [48.8014, 2.1301] },
  { id: "BD-0208", model: "Café Pro X3",        client: "C-1102", place: "Quai de chargement",   status: "ok",   stock: 88, temp: 5.7, sync: "il y a 1 min",  coord: [48.9362, 2.3574] },
  { id: "BD-0214", model: "Boissons Fresh F4",  client: "C-1108", place: "Salle de pause",       status: "warn", stock: 31, temp: 6.1, sync: "il y a 8 min",  coord: [48.8722, 2.2809] },
];

const LOADER_SPARK = [22,24,23,26,28,27,30,29,33,35,34,38,37,41,40,44,46,48,47,52,55,58,60,63,66,70];
const MACHINES_SPARK = [125,127,128,130,131,133,134,135,137,138,139,140,140,141,142];
const PANNE_SPARK = [8,7,6,5,5,4,4,3,4,3,3,4,3,2,3];
const PIPELINE_SPARK = [45,48,50,53,55,58,62,60,64,68,72,70,74,78,82];

const TOURNEE_TODAY = [
  { seq: 1, time: "08:30", machine: "BD-0142", client: "Atelier Moreau",     place: "Paris 11e",   task: "Réassort café + snack",  duration: 18, status: "done",  coord: [48.8639, 2.3771] },
  { seq: 2, time: "09:10", machine: "BD-0184", client: "Éditions Kairos",    place: "Paris 10e",   task: "Réassort snack",          duration: 12, status: "done",  coord: [48.8722, 2.3684] },
  { seq: 3, time: "09:55", machine: "BD-0155", client: "Groupe Lumen",       place: "Paris 8e",    task: "Réassort + nettoyage",    duration: 22, status: "current", coord: [48.8719, 2.3130] },
  { seq: 4, time: "10:50", machine: "BD-0167", client: "Sodexo La Défense",  place: "Puteaux",     task: "Intervention panne",      duration: 45, status: "next", pulse: "err", coord: [48.8921, 2.2395] },
  { seq: 5, time: "12:15", machine: "BD-0161", client: "Sodexo La Défense",  place: "Puteaux",     task: "Réassort boissons",       duration: 15, status: "next", coord: [48.8918, 2.2390] },
  { seq: 6, time: "13:40", machine: "BD-0173", client: "Novatek",            place: "Courbevoie",  task: "Réassort café",           duration: 14, status: "next", coord: [48.8969, 2.2528] },
  { seq: 7, time: "15:00", machine: "BD-0214", client: "Cabinet Aldebert",   place: "Paris 16e",   task: "Réassort + contrôle temp.", duration: 18, status: "next", coord: [48.8722, 2.2809] },
];

const PIPELINE_STAGES = [
  { id: "prospect",  label: "Prospect",     count: 12, value: "142 k€", color: "var(--n-400)" },
  { id: "audit",     label: "Audit",        count: 8,  value: "96 k€",  color: "var(--info)" },
  { id: "proposition", label: "Proposition", count: 5, value: "78 k€",  color: "var(--warn)" },
  { id: "negociation", label: "Négociation", count: 3, value: "54 k€",  color: "var(--bd-orange)" },
  { id: "signe",     label: "Signé (mois)", count: 4, value: "62 k€",  color: "var(--ok)" },
];

Object.assign(window, {
  CLIENTS, MACHINES, LOADER_SPARK, MACHINES_SPARK, PANNE_SPARK, PIPELINE_SPARK,
  TOURNEE_TODAY, PIPELINE_STAGES,
});
