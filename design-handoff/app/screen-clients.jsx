/* Break'Distrib — Pipeline Kanban + Fiche client */

function ScreenPipeline() {
  const [stage, setStage] = useState(null);

  const oppsByStage = {
    prospect: [
      { id: "OP-2041", client: "Éditions Kairos",   value: "12 k€",  contact: "C. Petit",   age: "3j",  next: "Audit à planifier", tags: ["Paris 10e"] },
      { id: "OP-2043", client: "Studio Orbite",     value: "8 k€",   contact: "M. Kane",    age: "5j",  next: "Relance cold mail", tags: ["Agence"] },
      { id: "OP-2047", client: "Cabinet Aldebert",  value: "14 k€",  contact: "H. Aldebert",age: "1j",  next: "Email retour", tags: ["Paris 16e"] },
      { id: "OP-2050", client: "Mairie de Montrouge",value: "32 k€", contact: "DAF",        age: "7j",  next: "Appel découverte", tags: ["Public"] },
    ],
    audit: [
      { id: "OP-2032", client: "Novatek Industries", value: "28 k€", contact: "R. Ichou",   age: "12j", next: "Audit éligibilité 23 mai", tags: ["Courbevoie"], hot: true },
      { id: "OP-2038", client: "Clinique du Parc",   value: "18 k€", contact: "Dr. Moreau", age: "9j",  next: "Devis post-audit", tags: ["Vincennes"] },
      { id: "OP-2042", client: "Transports Véga",    value: "22 k€", contact: "S. Odoul",   age: "6j",  next: "Retour audit", tags: ["Saint-Denis"] },
    ],
    proposition: [
      { id: "OP-2021", client: "BioPole Saclay",     value: "42 k€", contact: "L. Fong",    age: "18j", next: "Proposition LCD v2", tags: ["R&D"], hot: true },
      { id: "OP-2027", client: "Lycée Saint-Exupéry",value: "24 k€", contact: "Intendance", age: "14j", next: "Ajustement tarif",   tags: ["Montreuil"] },
    ],
    negociation: [
      { id: "OP-2012", client: "Sodexo La Défense",  value: "64 k€", contact: "P. Vignal",  age: "21j", next: "Signature contrat T2", tags: ["Puteaux"], hot: true },
      { id: "OP-2018", client: "Groupe Lumen",       value: "18 k€", contact: "I. Sabbah",  age: "16j", next: "Validation juridique", tags: ["Paris 8e"] },
    ],
    signe: [
      { id: "OP-2003", client: "Atelier Moreau",      value: "9 k€",  contact: "J. Moreau",  age: "Signé 12 mai", next: "Installation 28 mai", tags: ["Paris 11e"], won: true },
      { id: "OP-2006", client: "Mairie de Versailles",value: "36 k€", contact: "S. Baillot", age: "Signé 08 mai", next: "3 machines à livrer",  tags: ["Versailles"], won: true },
    ],
  };

  return (
    <div className="fade-up" style={{ padding: "0 0 40px" }}>
      <PageHeader
        title="Pipeline commercial"
        subtitle="32 opportunités · 432 k€ en cours · 62 k€ signés ce mois"
        actions={<>
          <Button size="sm" variant="secondary" icon="filter">Filtrer</Button>
          <Button size="sm" variant="secondary" icon="users">Tous commerciaux</Button>
          <Button size="sm" variant="primary" icon="plus">Nouveau prospect</Button>
        </>}
      />

      <div style={{ padding: "20px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, alignItems: "start" }}>
          {PIPELINE_STAGES.map(s => {
            const opps = oppsByStage[s.id] || [];
            return (
              <div key={s.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", minHeight: 500 }}>
                <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 2, background: s.color, display: "inline-block" }}/>
                    <span style={{ fontSize: 12.5, fontWeight: 600, flex: 1 }}>{s.label}</span>
                    <span className="mono tabular" style={{ fontSize: 11, color: "var(--text-3)" }}>{opps.length}</span>
                  </div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--text-3)", marginTop: 3 }}>{s.value}</div>
                </div>
                <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 8, background: "var(--surface-2)" }}>
                  {opps.map(o => (
                    <OppCard key={o.id} o={o} accent={s.color} onClick={() => window.__nav?.("clients")}/>
                  ))}
                  <button style={{
                    background: "transparent", border: "1px dashed var(--border-strong)", borderRadius: 10,
                    padding: "8px 10px", cursor: "pointer", color: "var(--text-3)", fontSize: 12,
                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit",
                  }}>
                    <Icon name="plus" size={13}/> Ajouter
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function OppCard({ o, accent, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: "var(--elev)", border: "1px solid var(--border)", borderLeft: `3px solid ${accent}`,
      borderRadius: 10, padding: "10px 12px", cursor: "pointer",
      boxShadow: "var(--shadow-xs)",
      transition: "transform var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <span className="mono" style={{ fontSize: 10.5, color: "var(--text-3)" }}>{o.id}</span>
        {o.hot && <Badge tone="brand" size="sm" dot>chaud</Badge>}
        {o.won && <Badge tone="ok" size="sm"><Icon name="check" size={10}/> gagné</Badge>}
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 500, letterSpacing: -0.1 }}>{o.client}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
        <span className="mono tabular" style={{ fontSize: 12, color: "var(--bd-orange-600)", fontWeight: 500 }}>{o.value}</span>
        <span style={{ fontSize: 11, color: "var(--text-3)" }}>·</span>
        <span style={{ fontSize: 11, color: "var(--text-3)" }}>{o.contact}</span>
      </div>
      <div style={{ fontSize: 11.5, color: "var(--text-2)", marginTop: 8, padding: "5px 8px", background: "var(--surface-2)", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="clock" size={11} color="var(--text-3)"/>
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.next}</span>
        <span className="mono" style={{ fontSize: 10.5, color: "var(--text-3)" }}>{o.age}</span>
      </div>
    </div>
  );
}

/* ====================== FICHE CLIENT ====================== */

function ScreenClient() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="fade-up" style={{ padding: "0 0 40px" }}>
      {/* Client header */}
      <div style={{ padding: "20px 32px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-3)", marginBottom: 14 }}>
          <span>Clients</span>
          <Icon name="chevron" size={11}/>
          <span>Secteur Services</span>
          <Icon name="chevron" size={11}/>
          <span style={{ color: "var(--text)" }}>Sodexo La Défense</span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, var(--bd-orange) 0%, var(--bd-orange-600) 100%)", color: "#fff", display: "grid", placeItems: "center", fontSize: 20, fontWeight: 600 }}>
            SD
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: -0.4 }}>Sodexo La Défense</h1>
              <Badge tone="ok" dot>Client actif</Badge>
              <Badge tone="brand">LCD</Badge>
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 8, fontSize: 12.5, color: "var(--text-3)" }}>
              <span className="mono">C-1068</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="pin" size={12}/> Tour Cœur Défense T1, 92800 Puteaux</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="users" size={12}/> 640 postes</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="machine" size={12}/> 8 machines</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button size="sm" variant="secondary" icon="mail">Email</Button>
            <Button size="sm" variant="secondary" icon="phone">Appeler</Button>
            <Button size="sm" variant="secondary" icon="more"/>
            <Button size="sm" variant="primary" icon="plus">Nouvelle opportunité</Button>
          </div>
        </div>

        {/* Quick stats strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0, marginTop: 20, border: "1px solid var(--border)", borderRadius: 12, background: "var(--surface)", overflow: "hidden" }}>
          {[
            { l: "CA mois", v: "24 820", u: "€", tone: "brand" },
            { l: "CA annuel", v: "254 k€", u: "", tone: "" },
            { l: "Contrat", v: "LCD 36 mois", u: "", tone: "" },
            { l: "Machines actives", v: "7", u: "/ 8", tone: "" },
            { l: "Satisfaction", v: "4.6", u: "/ 5", tone: "ok" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "14px 18px", borderRight: i < 4 ? "1px solid var(--border)" : "none" }}>
              <div className="label" style={{ fontSize: 10 }}>{s.l}</div>
              <div className="tabular" style={{ fontSize: 20, fontWeight: 600, marginTop: 4, letterSpacing: -0.4, color: s.tone === "brand" ? "var(--bd-orange-600)" : s.tone === "ok" ? "var(--ok)" : "var(--text)" }}>
                {s.v}<span style={{ fontSize: 12, color: "var(--text-3)", marginLeft: 3, fontWeight: 400 }}>{s.u}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, borderBottom: "1px solid var(--border)", marginTop: 18 }}>
          {[
            { id: "overview", label: "Vue d'ensemble" },
            { id: "machines", label: "Machines", count: 8 },
            { id: "contrats", label: "Contrats & factures" },
            { id: "historique", label: "Historique" },
            { id: "documents", label: "Documents" },
          ].map(t => {
            const on = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: "transparent", border: 0, padding: "10px 14px",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                color: on ? "var(--text)" : "var(--text-3)",
                borderBottom: `2px solid ${on ? "var(--bd-orange)" : "transparent"}`,
                marginBottom: -1, fontFamily: "inherit",
              }}>
                {t.label}
                {t.count !== undefined && <span className="mono tabular" style={{ marginLeft: 6, fontSize: 11, color: "var(--text-3)" }}>{t.count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body grid */}
      <div style={{ padding: "20px 32px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
        <div style={{ display: "grid", gap: 16 }}>
          <ClientTimeline/>
          <ClientMachines/>
          <ClientContrats/>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          <ClientContact/>
          <ClientRelances/>
          <ClientDrive/>
        </div>
      </div>
    </div>
  );
}

function ClientTimeline() {
  const items = [
    { t: "Aujourd'hui · 10:50", who: "T. Rossi",      ev: "Intervention panne BD-0167",     ic: "alert", tone: "err" },
    { t: "Hier · 14:20",        who: "I. Sabbah",     ev: "Email · relance signature T2",   ic: "mail",  tone: "neutral" },
    { t: "18 mai · 09:15",      who: "P. Vignal",     ev: "RDV téléphonique · 32 min",      ic: "phone", tone: "info" },
    { t: "12 mai",              who: "Système",       ev: "Facture FC-24812 émise — 8 640 €", ic: "euro", tone: "ok" },
    { t: "08 mai",              who: "C. Morel",      ev: "Proposition LCD v2 envoyée",     ic: "mail",  tone: "brand" },
    { t: "02 mai",              who: "T. Rossi",      ev: "Installation BD-0208 (quai)",    ic: "machine", tone: "ok" },
  ];
  return (
    <Card pad={0}>
      <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Historique d'échanges</div>
        <div style={{ display: "flex", gap: 6 }}>
          <Button size="sm" variant="ghost">Tout</Button>
          <Button size="sm" variant="ghost">Emails</Button>
          <Button size="sm" variant="ghost">Appels</Button>
          <Button size="sm" variant="ghost">Interventions</Button>
        </div>
      </div>
      <div style={{ padding: "14px 18px", position: "relative" }}>
        <div style={{ position: "absolute", left: 30, top: 20, bottom: 20, width: 2, background: "var(--border)" }}/>
        {items.map((it, i) => {
          const toneC = it.tone === "err" ? "var(--err)" : it.tone === "ok" ? "var(--ok)" : it.tone === "info" ? "var(--info)" : it.tone === "brand" ? "var(--bd-orange)" : "var(--n-400)";
          return (
            <div key={i} style={{ position: "relative", paddingLeft: 32, marginBottom: i < items.length - 1 ? 14 : 0 }}>
              <div style={{ position: "absolute", left: 14, top: 2, width: 18, height: 18, borderRadius: "50%", background: "var(--elev)", border: `2px solid ${toneC}`, display: "grid", placeItems: "center" }}>
                <Icon name={it.ic} size={9} color={toneC}/>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{it.ev}</span>
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 2 }}>{it.t} · {it.who}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function ClientMachines() {
  const list = [
    { id: "BD-0161", model: "Boissons Fresh F4", place: "Tour T1 · hall", status: "ok",   stock: 64 },
    { id: "BD-0167", model: "Snack Compact S2",  place: "Cafétéria niv. -1", status: "err",  stock: 18 },
    { id: "BD-0208", model: "Café Pro X3",       place: "Quai de chargement", status: "ok", stock: 88 },
    { id: "BD-0223", model: "Café Pro X3",       place: "Étage 12 · open space", status: "ok", stock: 72 },
  ];
  return (
    <Card pad={0}>
      <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Machines installées</div>
          <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>8 machines · 7 en ligne</div>
        </div>
        <Button size="sm" variant="ghost" iconRight="arrow-right">Voir le parc</Button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <tbody>
          {list.map((m, i) => (
            <tr key={m.id} style={{ borderBottom: i < list.length - 1 ? "1px solid var(--border)" : "none" }}>
              <td style={{ padding: "10px 18px" }}><span className="mono" style={{ fontSize: 12 }}>{m.id}</span></td>
              <td style={{ padding: "10px 0", color: "var(--text-2)" }}>{m.model}</td>
              <td style={{ padding: "10px 0", color: "var(--text-3)", fontSize: 12 }}>{m.place}</td>
              <td style={{ padding: "10px 0", width: 140 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1 }}><Bar value={m.stock} tone={m.stock < 25 ? "err" : m.stock < 40 ? "warn" : "ok"}/></div>
                  <span className="mono tabular" style={{ fontSize: 11.5, color: "var(--text-2)" }}>{m.stock}%</span>
                </div>
              </td>
              <td style={{ padding: "10px 18px", textAlign: "right" }}>
                <Badge tone={m.status} dot>{m.status === "ok" ? "En ligne" : m.status === "warn" ? "À surveiller" : "Panne"}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function ClientContrats() {
  return (
    <Card pad={0}>
      <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Contrats & factures</div>
        <Button size="sm" variant="secondary" icon="plus">Nouveau contrat</Button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        <div style={{ padding: "14px 18px", borderRight: "1px solid var(--border)" }}>
          <div className="label" style={{ marginBottom: 6 }}>Contrat en cours</div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>LCD 36 mois — avenant #2</div>
          <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>Signé le 14 mars 2025 · échéance 14 mars 2028</div>
          <div style={{ display: "flex", gap: 10, marginTop: 10, fontSize: 12 }}>
            <div><span className="label">Mensualité</span><div className="mono tabular" style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>8 640 €</div></div>
            <div style={{ marginLeft: 20 }}><span className="label">Reste dû</span><div className="mono tabular" style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>207 360 €</div></div>
          </div>
        </div>
        <div style={{ padding: "14px 18px" }}>
          <div className="label" style={{ marginBottom: 6 }}>Dernières factures</div>
          {[
            { n: "FC-24812", d: "12 mai", v: "8 640 €", s: "Payée" },
            { n: "FC-24615", d: "12 avr.", v: "8 640 €", s: "Payée" },
            { n: "FC-24402", d: "12 mars", v: "8 640 €", s: "Payée" },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", borderBottom: i < 2 ? "1px dashed var(--border)" : "none" }}>
              <span className="mono" style={{ fontSize: 11.5, color: "var(--text-3)" }}>{f.n}</span>
              <span style={{ flex: 1, fontSize: 12, color: "var(--text-3)" }}>{f.d}</span>
              <span className="mono tabular" style={{ fontSize: 12 }}>{f.v}</span>
              <Badge tone="ok" size="sm">{f.s}</Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function ClientContact() {
  return (
    <Card pad={16}>
      <div className="label" style={{ marginBottom: 10 }}>Contact principal</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--surface-3)", color: "var(--text-2)", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 600 }}>PV</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 500 }}>Pierre Vignal</div>
          <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>Directeur des services généraux</div>
        </div>
      </div>
      <div style={{ display: "grid", gap: 6, fontSize: 12.5, color: "var(--text-2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="mail" size={13} color="var(--text-3)"/> <span className="mono">p.vignal@sodexo-ld.fr</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="phone" size={13} color="var(--text-3)"/> <span className="mono tabular">+33 1 49 60 32 14</span></div>
      </div>
      <div style={{ height: 1, background: "var(--border)", margin: "14px 0" }}/>
      <div className="label" style={{ marginBottom: 8 }}>Autres contacts</div>
      {[
        { i: "AM", n: "Anne Marceau", r: "Responsable RSE" },
        { i: "LF", n: "Léo Fontaine", r: "Achats" },
      ].map((c, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--surface-3)", color: "var(--text-2)", display: "grid", placeItems: "center", fontSize: 10.5, fontWeight: 600 }}>{c.i}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5 }}>{c.n}</div>
            <div style={{ fontSize: 11, color: "var(--text-3)" }}>{c.r}</div>
          </div>
        </div>
      ))}
    </Card>
  );
}

function ClientRelances() {
  return (
    <Card pad={16}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div className="label">Prochaine relance</div>
        <Badge tone="warn" dot>dans 2 jours</Badge>
      </div>
      <div style={{ padding: 12, background: "var(--warn-bg)", borderRadius: 10, border: "1px solid rgba(198,136,30,0.25)" }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--warn)" }}>Validation proposition LCD v2</div>
        <div style={{ fontSize: 11.5, color: "var(--text-2)", marginTop: 4 }}>Envoyée le 08 mai · aucune réponse depuis</div>
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          <Button size="sm" variant="secondary" icon="mail" style={{ flex: 1 }}>Email</Button>
          <Button size="sm" variant="secondary" icon="phone" style={{ flex: 1 }}>Appel</Button>
        </div>
      </div>
      <div style={{ height: 1, background: "var(--border)", margin: "14px 0" }}/>
      <div className="label" style={{ marginBottom: 8 }}>Opportunité en cours</div>
      <OppCard
        o={{ id: "OP-2012", client: "Renouvellement LCD T2", value: "64 k€", contact: "P. Vignal", age: "21j", next: "Signature contrat T2", hot: true }}
        accent="var(--bd-orange)"
      />
    </Card>
  );
}

function ClientDrive() {
  const files = [
    { n: "Contrat-LCD-Sodexo-v2.pdf", s: "842 ko", d: "12 mars" },
    { n: "Audit-eligibilite-2024.pdf", s: "1.2 Mo", d: "04 févr." },
    { n: "Plan-implantation.pdf",      s: "520 ko", d: "18 févr." },
    { n: "Bilan-carbone-Q1.xlsx",      s: "96 ko",  d: "02 avr." },
  ];
  return (
    <Card pad={0}>
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--border)" }}>
        <svg width="14" height="14" viewBox="0 0 87 76"><path d="M22 0h43L87 38 65 76H22L0 38 22 0z" fill="var(--text-3)" opacity=".15"/><path d="M22 0h43L43 38 22 0z" fill="var(--bd-orange)"/></svg>
        <div style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>Google Drive</div>
        <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>/ sodexo-ld</span>
      </div>
      {files.map((f, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", borderBottom: i < files.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer" }}>
          <div style={{ width: 24, height: 28, borderRadius: 3, background: "var(--surface-3)", display: "grid", placeItems: "center" }}>
            <span className="mono" style={{ fontSize: 8, fontWeight: 700, color: "var(--text-3)" }}>{f.n.split(".").pop().toUpperCase().slice(0,3)}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.n}</div>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--text-3)", marginTop: 1 }}>{f.s} · {f.d}</div>
          </div>
        </div>
      ))}
    </Card>
  );
}

Object.assign(window, { ScreenPipeline, ScreenClient });
