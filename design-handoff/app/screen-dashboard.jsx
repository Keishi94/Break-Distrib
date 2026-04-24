/* Break'Distrib — Dashboard Direction */

function ScreenDashboard() {
  return (
    <div className="fade-up" style={{ padding: "0 0 40px" }}>
      <PageHeader
        title="Bonjour Camille"
        subtitle="Jeudi 21 mai 2026 · 4 alertes prioritaires, 2 tournées en cours"
        actions={<>
          <Button icon="calendar" size="sm" variant="secondary">Mois en cours</Button>
          <Button icon="download" size="sm" variant="secondary">Exporter</Button>
          <Button icon="plus" size="sm" variant="primary">Nouveau prospect</Button>
        </>}
      />

      <div style={{ padding: "20px 32px 0", display: "grid", gap: 16 }}>
        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <KPI label="CA mois en cours" value="184 620" unit="€" delta={12.4} deltaLabel="vs N-1" spark={LOADER_SPARK} tone="brand"/>
          <KPI label="Machines actives" value="142" unit="/ 148" delta={2.1} deltaLabel="30j" spark={MACHINES_SPARK} tone="ok"/>
          <KPI label="Pipeline commercial" value="432" unit="k€" delta={8.7} deltaLabel="30j" spark={PIPELINE_SPARK} tone="brand"/>
          <KPI label="Taux de panne" value="2.1" unit="%" delta={-1.3} deltaLabel="30j" spark={PANNE_SPARK} tone="ok"/>
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
          {/* Left column */}
          <div style={{ display: "grid", gap: 16 }}>
            <CardParcStatus/>
            <CardPipeline/>
          </div>
          {/* Right column */}
          <div style={{ display: "grid", gap: 16 }}>
            <CardAlertes/>
            <CardTournees/>
            <CardEco/>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardParcStatus() {
  const [hover, setHover] = useState(null);
  return (
    <Card pad={0}>
      <div style={{ padding: "14px 18px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Parc distributeurs</div>
          <div style={{ color: "var(--text-3)", fontSize: 12, marginTop: 2, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <BDLoader size={12} inline/> <span>Synchronisation temps réel · il y a 12 s</span>
          </div>
        </div>
        <Button size="sm" variant="ghost" iconRight="arrow-right" onClick={() => window.__nav?.("parc")}>Voir le parc</Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid var(--border)" }}>
        {[
          { k: "En ligne", v: 134, tone: "ok",   pct: "94.3%" },
          { k: "Stock faible", v: 6, tone: "warn", pct: "4.2%" },
          { k: "En panne", v: 2, tone: "err", pct: "1.4%" },
          { k: "À installer", v: 6, tone: "info", pct: "—" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "14px 18px", borderRight: i < 3 ? "1px solid var(--border)" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <StatusDot status={s.tone} size={7}/>
              <span className="label" style={{ fontSize: 10 }}>{s.k}</span>
            </div>
            <div className="tabular" style={{ fontSize: 24, fontWeight: 600, marginTop: 6, letterSpacing: -0.6 }}>{s.v}</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{s.pct}</div>
          </div>
        ))}
      </div>

      {/* Bars + recent */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid var(--border)" }}>
        <div style={{ padding: "14px 18px", borderRight: "1px solid var(--border)" }}>
          <div className="label" style={{ marginBottom: 10 }}>Répartition par modèle</div>
          {[
            { k: "Café Pro X3",       v: 58, c: "var(--bd-orange)" },
            { k: "Snack Compact S2",  v: 42, c: "var(--n-700)" },
            { k: "Boissons Fresh F4", v: 36, c: "var(--info)" },
            { k: "Combo Hub M1",      v: 6,  c: "var(--n-400)" },
          ].map((m, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr 30px", gap: 10, alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 12.5 }}>{m.k}</div>
              <div style={{ height: 6, background: "var(--surface-3)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ width: `${(m.v / 58) * 100}%`, height: "100%", background: m.c }}/>
              </div>
              <div className="mono tabular" style={{ fontSize: 12, color: "var(--text-2)", textAlign: "right" }}>{m.v}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 18px" }}>
          <div className="label" style={{ marginBottom: 10 }}>Dernière activité IoT</div>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              { id: "BD-0155", ev: "Stock café en baisse",  ago: "2 min", tone: "warn" },
              { id: "BD-0167", ev: "Panne détectée (temp.)",  ago: "21 min", tone: "err" },
              { id: "BD-0201", ev: "Perte de signal",         ago: "47 min", tone: "err" },
              { id: "BD-0142", ev: "Réassort validé",         ago: "1 h",    tone: "ok" },
            ].map((e, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <StatusDot status={e.tone} size={6}/>
                <span className="mono" style={{ fontSize: 11.5, color: "var(--text-2)" }}>{e.id}</span>
                <span style={{ fontSize: 12.5, flex: 1 }}>{e.ev}</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{e.ago}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function CardPipeline() {
  return (
    <Card pad={0}>
      <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Pipeline commercial</div>
          <div style={{ color: "var(--text-3)", fontSize: 12, marginTop: 2 }}>32 opportunités actives · valeur totale 432 k€</div>
        </div>
        <Button size="sm" variant="ghost" iconRight="arrow-right">Voir pipeline</Button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0, borderTop: "1px solid var(--border)" }}>
        {PIPELINE_STAGES.map((s, i) => {
          const maxCount = 12;
          return (
            <div key={s.id} style={{ padding: "14px 14px 16px", borderRight: i < 4 ? "1px solid var(--border)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: 2, background: s.color, display: "inline-block" }}/>
                <span className="label" style={{ fontSize: 10 }}>{s.label}</span>
              </div>
              <div style={{ height: 44, display: "flex", alignItems: "flex-end", gap: 2 }}>
                <div style={{ width: "100%", height: `${(s.count / maxCount) * 100}%`, background: s.color, opacity: 0.22, borderRadius: "3px 3px 0 0" }}/>
              </div>
              <div className="tabular" style={{ fontSize: 18, fontWeight: 600, marginTop: 8 }}>{s.count}</div>
              <div className="mono" style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{s.value}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function CardAlertes() {
  const items = [
    { tone: "err",  id: "BD-0167", title: "Panne — Sodexo La Défense", time: "il y a 21 min", cta: "Intervenir" },
    { tone: "err",  id: "BD-0201", title: "Hors ligne — Versailles",   time: "47 min",        cta: "Diagnostic" },
    { tone: "warn", id: "C-1051", title: "Relance Novatek (48h)",      time: "due demain",    cta: "Relancer" },
    { tone: "warn", id: "BD-0155", title: "Stock café < 30 % — Lumen", time: "2 h",           cta: "Planifier" },
  ];
  return (
    <Card pad={0}>
      <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Alertes prioritaires</div>
        <Badge tone="err">{items.filter(i => i.tone === "err").length} urgent</Badge>
      </div>
      <div style={{ borderTop: "1px solid var(--border)" }}>
        {items.map((a, i) => (
          <div key={i} style={{
            padding: "12px 18px", display: "flex", alignItems: "center", gap: 12,
            borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none",
            cursor: "pointer",
          }}>
            <StatusDot status={a.tone} size={8}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
                <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{a.id}</span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</span>
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 2 }}>{a.time}</div>
            </div>
            <Button size="sm" variant="secondary">{a.cta}</Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function CardTournees() {
  return (
    <Card pad={0}>
      <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Tournées</div>
          <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>2 en cours · 3 planifiées demain</div>
        </div>
        <Button size="sm" variant="ghost" iconRight="arrow-right" onClick={() => window.__nav?.("tournees")}>Planning</Button>
      </div>

      <div style={{ borderTop: "1px solid var(--border)" }}>
        {[
          { tech: "T. Rossi",   area: "Paris centre · La Défense", stops: 7, done: 3, km: 42, state: "en cours" },
          { tech: "L. Bah",     area: "Est parisien · Saint-Denis", stops: 6, done: 1, km: 38, state: "en cours" },
          { tech: "J. Lefèvre", area: "Versailles · Saclay",         stops: 5, done: 0, km: 58, state: "demain 08:30" },
        ].map((t, i) => (
          <div key={i} style={{ padding: "12px 18px", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--surface-3)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 600, color: "var(--text-2)" }}>
                {t.tech.split(" ")[1][0]}{t.tech.split(" ")[0][0].replace(".","")}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{t.tech}</div>
                <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>{t.area}</div>
              </div>
              <Badge tone={t.state === "en cours" ? "brand" : "neutral"} dot>{t.state}</Badge>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center", marginTop: 10 }}>
              <div>
                <Bar value={(t.done / t.stops) * 100} tone="ok"/>
              </div>
              <div className="mono tabular" style={{ fontSize: 11, color: "var(--text-3)" }}>
                {t.done}/{t.stops} arrêts · {t.km} km
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function CardEco() {
  return (
    <Card pad={18} style={{
      background: "linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -30, right: -30, opacity: 0.06 }}>
        <Icon name="leaf" size={180} color="var(--ok)"/>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Icon name="leaf" size={15} color="var(--ok)"/>
        <div className="label" style={{ color: "var(--ok)", fontSize: 10 }}>Bilan carbone · mai 2026</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <div className="tabular" style={{ fontSize: 24, fontWeight: 600, letterSpacing: -0.6 }}>2 847 <span style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 400 }}>km élec.</span></div>
          <div style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 4 }}>Tournées effectuées</div>
        </div>
        <div>
          <div className="tabular" style={{ fontSize: 24, fontWeight: 600, letterSpacing: -0.6, color: "var(--ok)" }}>418 <span style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 400 }}>kg CO₂</span></div>
          <div style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 4 }}>Évités vs thermique</div>
        </div>
      </div>
    </Card>
  );
}

Object.assign(window, { ScreenDashboard });
