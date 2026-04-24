/* Break'Distrib — Planification tournées (desktop) + Reporting */

function ScreenTournees() {
  const bounds = { latMin: 48.68, latMax: 48.96, lngMin: 2.10, lngMax: 2.48 };
  const project = (lat, lng) => ({
    x: ((lng - bounds.lngMin) / (bounds.lngMax - bounds.lngMin)) * 100,
    y: ((bounds.latMax - lat) / (bounds.latMax - bounds.latMin)) * 100,
  });
  const stops = TOURNEE_TODAY;
  const pathD = stops.map((s, i) => {
    const p = project(s.coord[0], s.coord[1]);
    return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
  }).join(" ");

  return (
    <div className="fade-up" style={{ padding: "0 0 40px" }}>
      <PageHeader
        title="Planification tournées"
        subtitle="Jeudi 21 mai 2026 · 3 techniciens · Île-de-France"
        actions={<>
          <Button icon="calendar" size="sm" variant="secondary">Jeudi 21 mai</Button>
          <Button icon="bolt" size="sm" variant="secondary">Optimiser itinéraires</Button>
          <Button icon="plus" size="sm" variant="primary">Nouvelle tournée</Button>
        </>}
      />

      <div style={{ padding: "20px 32px", display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
        {/* Techniciens */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionHead title="Techniciens" right={<span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>3 actifs</span>}/>
          {[
            { name: "Thomas Rossi",    init: "TR", area: "Paris centre · La Défense", stops: 7, done: 3, km: 42, state: "en cours", color: "var(--bd-orange)" },
            { name: "Laila Bah",        init: "LB", area: "Est parisien · Saint-Denis", stops: 6, done: 1, km: 38, state: "en cours", color: "var(--info)" },
            { name: "Julien Lefèvre",   init: "JL", area: "Versailles · Saclay",       stops: 5, done: 0, km: 58, state: "demain", color: "var(--n-500)" },
          ].map((t, i) => (
            <Card key={i} pad={14} interactive style={{ borderColor: i === 0 ? "var(--bd-orange)" : "var(--border)", borderWidth: i === 0 ? 1.5 : 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: t.color, color: "#fff", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600 }}>{t.init}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{t.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>{t.area}</div>
                </div>
                <Badge tone={t.state === "en cours" ? "brand" : "neutral"} dot>{t.state}</Badge>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginTop: 12 }}>
                <Mini v={`${t.done}/${t.stops}`} l="arrêts"/>
                <Mini v={`${t.km}`} l="km"/>
                <Mini v={`${Math.round((t.done / t.stops) * 100)}%`} l="avance"/>
              </div>
              <div style={{ marginTop: 10 }}>
                <Bar value={(t.done / t.stops) * 100} tone="ok"/>
              </div>
            </Card>
          ))}

          <Card pad={14} style={{ background: "var(--surface-2)", borderStyle: "dashed" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--surface-3)", display: "grid", placeItems: "center", color: "var(--text-3)" }}>
                <Icon name="plus" size={16}/>
              </div>
              <div style={{ flex: 1, fontSize: 13, color: "var(--text-2)" }}>Assigner un 4e technicien</div>
            </div>
          </Card>
        </div>

        {/* Carte */}
        <Card pad={0} style={{ overflow: "hidden", height: 620 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <BDLoader size={14} inline/>
              <span style={{ fontSize: 13, fontWeight: 500 }}>Tournée Thomas Rossi</span>
              <Badge tone="brand" size="sm" dot>En cours</Badge>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <Button size="sm" variant="secondary">Réassigner</Button>
              <Button size="sm" variant="secondary" icon="download">PDF</Button>
            </div>
          </div>

          <div style={{ position: "relative", height: "calc(100% - 50px)", background: "var(--surface-2)" }}>
            <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
              <defs>
                <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid2)"/>
              {/* Route path in percentage coords */}
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
                <path d={pathD} fill="none" stroke="var(--bd-orange)" strokeWidth="0.35" strokeDasharray="0.8 0.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity="0.75"/>
                <path d={pathD} fill="none" stroke="var(--bd-orange)" strokeWidth="2" strokeLinecap="round" style={{ strokeDasharray: 2, strokeDashoffset: 0 }} opacity="0"/>
              </svg>
            </svg>

            {/* Zone labels */}
            {[
              { name: "Paris", lat: 48.8566, lng: 2.3522 },
              { name: "La Défense", lat: 48.8920, lng: 2.2380 },
              { name: "Saint-Denis", lat: 48.9362, lng: 2.3574 },
              { name: "Versailles", lat: 48.8014, lng: 2.1301 },
              { name: "Saclay", lat: 48.7107, lng: 2.1700 },
            ].map((z, i) => {
              const p = project(z.lat, z.lng);
              return (
                <div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -140%)", color: "var(--text-3)", fontSize: 10, letterSpacing: 0.08, textTransform: "uppercase", fontWeight: 500, pointerEvents: "none" }}>
                  {z.name}
                </div>
              );
            })}

            {/* Stops */}
            {stops.map((s, i) => {
              const p = project(s.coord[0], s.coord[1]);
              const done = s.status === "done";
              const cur = s.status === "current";
              const alert = s.pulse === "err";
              const color = alert ? "var(--err)" : done ? "var(--ok)" : cur ? "var(--bd-orange)" : "var(--n-700)";
              return (
                <div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)" }}>
                  <div style={{
                    width: cur ? 28 : 22, height: cur ? 28 : 22, borderRadius: "50%",
                    background: color, color: "#fff",
                    display: "grid", placeItems: "center",
                    fontSize: 11, fontWeight: 700, fontFamily: "var(--ff-mono)",
                    border: "2px solid var(--elev)",
                    boxShadow: cur ? "0 6px 14px rgba(243,112,33,0.4)" : "0 2px 4px rgba(0,0,0,0.15)",
                    animation: alert ? "pulse-err 1.6s ease-out infinite" : cur ? "pulse-ok 2s ease-out infinite" : "none",
                  }}>
                    {s.seq}
                  </div>
                </div>
              );
            })}

            {/* Legend */}
            <div style={{ position: "absolute", bottom: 14, left: 14, background: "var(--elev)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", display: "flex", gap: 14, fontSize: 11.5, boxShadow: "var(--shadow-sm)" }}>
              {[
                { c: "var(--ok)",        l: "Terminé" },
                { c: "var(--bd-orange)", l: "En cours" },
                { c: "var(--err)",       l: "Intervention panne" },
                { c: "var(--n-700)",     l: "À venir" },
              ].map((x, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: x.c }}/>{x.l}
                </div>
              ))}
            </div>

            {/* Info panel bottom right */}
            <div style={{ position: "absolute", top: 14, right: 14, width: 260, background: "var(--elev)", border: "1px solid var(--border)", borderRadius: 10, padding: 12, boxShadow: "var(--shadow-md)" }}>
              <div className="label" style={{ marginBottom: 6 }}>Prochain arrêt · 10:50</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Sodexo La Défense</div>
              <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>BD-0167 · intervention panne</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 11.5, color: "var(--text-2)" }}>
                <span><span className="mono tabular">12</span> km</span>
                <span><span className="mono tabular">24</span> min</span>
                <span className="mono" style={{ color: "var(--ok)" }}>À l'heure</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Mini({ v, l }) {
  return (
    <div>
      <div className="tabular" style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
      <div className="label" style={{ fontSize: 9.5, marginTop: 1 }}>{l}</div>
    </div>
  );
}

/* ========================== REPORTING ========================== */

function ScreenReporting() {
  return (
    <div className="fade-up" style={{ padding: "0 0 40px" }}>
      <PageHeader
        title="Reporting & KPI"
        subtitle="Vue consolidée · mai 2026"
        actions={<>
          <Button size="sm" variant="secondary" icon="calendar">Mai 2026</Button>
          <Button size="sm" variant="secondary" icon="download">Exporter CSV</Button>
          <Button size="sm" variant="primary" icon="download">Export PDF</Button>
        </>}
      />
      <div style={{ padding: "20px 32px", display: "grid", gap: 16 }}>
        {/* Top row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <KPI label="CA annuel" value="1.84" unit="M€" delta={18.2} deltaLabel="YoY" spark={PIPELINE_SPARK} tone="brand"/>
          <KPI label="Taux d'occupation" value="74" unit="%" delta={3.1} deltaLabel="30j" spark={MACHINES_SPARK} tone="ok"/>
          <KPI label="NPS" value="62" delta={4} deltaLabel="vs Q1" spark={PIPELINE_SPARK} tone="ok"/>
          <KPI label="Taux panne" value="2.1" unit="%" delta={-1.3} deltaLabel="30j" spark={PANNE_SPARK} tone="ok"/>
        </div>

        {/* CA by formule + occupancy */}
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
          <Card pad={0}>
            <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>CA par formule commerciale</div>
                <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>12 derniers mois · € HT</div>
              </div>
              <div style={{ display: "flex", gap: 12, fontSize: 11.5 }}>
                {[
                  { c: "var(--bd-orange)", l: "Gratuit" },
                  { c: "var(--n-700)", l: "Location" },
                  { c: "var(--info)", l: "LCD" },
                ].map((x, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-2)" }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: x.c }}/>{x.l}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: "4px 18px 18px" }}>
              <StackedBars/>
            </div>
          </Card>

          <Card pad={18}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Taux d'occupation par modèle</div>
            </div>
            <div style={{ display: "grid", gap: 14 }}>
              {[
                { m: "Café Pro X3", pct: 82, fill: 58 },
                { m: "Snack Compact S2", pct: 71, fill: 42 },
                { m: "Boissons Fresh F4", pct: 68, fill: 36 },
                { m: "Combo Hub M1", pct: 59, fill: 6 },
              ].map((x, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13 }}>{x.m}</span>
                    <span className="mono tabular" style={{ fontSize: 12, color: "var(--text-2)" }}>{x.pct}%</span>
                  </div>
                  <div style={{ height: 6, background: "var(--surface-3)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${x.pct}%`, height: "100%", background: "var(--bd-orange)", borderRadius: 999 }}/>
                  </div>
                  <div className="mono" style={{ fontSize: 10.5, color: "var(--text-3)", marginTop: 3 }}>{x.fill} unités · ⌀ {(x.pct * 0.6).toFixed(0)} consommations/jour</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Eco + top clients */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 16 }}>
          <Card pad={0} style={{ overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="leaf" size={15} color="var(--ok)"/>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Bilan carbone & flotte électrique</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              {[
                { v: "28 470", u: "km", l: "Parcourus 100% élec.", c: "var(--text)" },
                { v: "4 182", u: "kg", l: "CO₂ évités vs thermique", c: "var(--ok)" },
                { v: "612", u: "kWh", l: "Consommés · recharge" },
                { v: "0.14", u: "kg/km", l: "Intensité carbone moyenne" },
              ].map((x, i) => (
                <div key={i} style={{ padding: "14px 18px", borderBottom: i < 2 ? "1px solid var(--border)" : "none", borderRight: i % 2 === 0 ? "1px solid var(--border)" : "none" }}>
                  <div className="tabular" style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.5, color: x.c || "var(--text)" }}>{x.v} <span style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 400 }}>{x.u}</span></div>
                  <div style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 4 }}>{x.l}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card pad={0}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Top clients · mai 2026</div>
              <Button size="sm" variant="ghost" iconRight="arrow-right">Voir tout</Button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                  {["Client", "Formule", "Machines", "CA mois", "Évolution"].map((h, i) => (
                    <th key={i} className="label" style={{ textAlign: "left", padding: "8px 14px", fontSize: 10 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { n: "Sodexo La Défense", f: "LCD", m: 8, ca: "24 820 €", d: 14.2 },
                  { n: "Novatek Industries", f: "Location", m: 5, ca: "18 410 €", d: 9.8 },
                  { n: "Lycée Saint-Exupéry", f: "Gratuit", m: 4, ca: "12 640 €", d: 2.3 },
                  { n: "Mairie de Versailles", f: "Location", m: 3, ca: "9 820 €", d: -1.4 },
                  { n: "BioPole Saclay", f: "LCD", m: 3, ca: "9 140 €", d: 22.6 },
                ].map((c, i) => (
                  <tr key={i} style={{ borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                    <td style={{ padding: "10px 14px", fontWeight: 500 }}>{c.n}</td>
                    <td style={{ padding: "10px 14px" }}><Badge tone="neutral" size="sm">{c.f}</Badge></td>
                    <td style={{ padding: "10px 14px" }}><span className="mono tabular">{c.m}</span></td>
                    <td style={{ padding: "10px 14px" }}><span className="mono tabular">{c.ca}</span></td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: c.d >= 0 ? "var(--ok)" : "var(--err)" }}>
                        <Icon name={c.d >= 0 ? "arrow-up" : "arrow-down"} size={11}/>
                        <span className="tabular">{Math.abs(c.d).toFixed(1)}%</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StackedBars() {
  const months = ["Juin","Juil.","Août","Sept.","Oct.","Nov.","Déc.","Janv.","Févr.","Mars","Avril","Mai"];
  const data = months.map((m, i) => {
    const base = 120 + i * 6 + (i % 3) * 8;
    return {
      m,
      a: Math.round(base * 0.45),
      b: Math.round(base * 0.35),
      c: Math.round(base * 0.28),
    };
  });
  const max = Math.max(...data.map(d => d.a + d.b + d.c));
  const H = 180;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${months.length}, 1fr)`, alignItems: "end", gap: 8, height: H + 28 }}>
      {data.map((d, i) => {
        const total = d.a + d.b + d.c;
        const h = (total / max) * H;
        const hA = (d.a / total) * h;
        const hB = (d.b / total) * h;
        const hC = (d.c / total) * h;
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: "100%", maxWidth: 32, display: "flex", flexDirection: "column", borderRadius: "4px 4px 2px 2px", overflow: "hidden" }}>
              <div style={{ height: hC, background: "var(--info)" }}/>
              <div style={{ height: hB, background: "var(--n-700)" }}/>
              <div style={{ height: hA, background: "var(--bd-orange)" }}/>
            </div>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--text-3)" }}>{d.m}</div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { ScreenTournees, ScreenReporting });
