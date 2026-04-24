/* Break'Distrib — Parc machines (liste desktop) */

function ScreenParc() {
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("list"); // list | map
  const filtered = MACHINES.filter(m => filter === "all" || m.status === filter);

  return (
    <div className="fade-up" style={{ padding: "0 0 40px" }}>
      <PageHeader
        title="Parc distributeurs"
        subtitle="148 machines installées · 12 clients · Île-de-France"
        actions={<>
          <Button icon="download" size="sm" variant="secondary">Exporter</Button>
          <Button icon="plus" size="sm" variant="primary">Installer une machine</Button>
        </>}
        tabs={[
          { id: "all",  label: "Toutes",      count: MACHINES.length },
          { id: "ok",   label: "En ligne",    count: MACHINES.filter(m => m.status === "ok").length },
          { id: "warn", label: "À surveiller",count: MACHINES.filter(m => m.status === "warn").length },
          { id: "err",  label: "En panne",    count: MACHINES.filter(m => m.status === "err").length },
        ]}
        activeTab={filter}
        onTab={setFilter}
      />

      {/* Toolbar */}
      <div style={{ padding: "14px 32px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--elev)", border: "1px solid var(--border-strong)", padding: "5px 10px", borderRadius: 8, width: 280 }}>
          <Icon name="search" size={15} color="var(--text-3)"/>
          <span style={{ color: "var(--text-3)", fontSize: 12.5 }}>Rechercher ID, client, lieu…</span>
        </div>
        <Button size="sm" variant="secondary" icon="filter">Modèle</Button>
        <Button size="sm" variant="secondary" icon="filter">Client</Button>
        <Button size="sm" variant="secondary" icon="filter">Stock</Button>
        <div style={{ flex: 1 }}/>
        <div style={{ display: "inline-flex", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: 2 }}>
          <button onClick={() => setView("list")} style={{ background: view === "list" ? "var(--elev)" : "transparent", border: 0, padding: "4px 10px", borderRadius: 6, fontSize: 12.5, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, color: view === "list" ? "var(--text)" : "var(--text-3)", boxShadow: view === "list" ? "var(--shadow-xs)" : "none" }}>
            <Icon name="dashboard" size={13}/> Liste
          </button>
          <button onClick={() => setView("map")} style={{ background: view === "map" ? "var(--elev)" : "transparent", border: 0, padding: "4px 10px", borderRadius: 6, fontSize: 12.5, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, color: view === "map" ? "var(--text)" : "var(--text-3)", boxShadow: view === "map" ? "var(--shadow-xs)" : "none" }}>
            <Icon name="map" size={13}/> Carte
          </button>
        </div>
      </div>

      {/* List */}
      {view === "list" && (
        <div style={{ padding: "16px 32px" }}>
          <Card pad={0} style={{ overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                  {["ID", "Modèle", "Client & lieu", "Statut", "Stock", "Température", "Dernière sync", ""].map((h, i) => (
                    <th key={i} className="label" style={{ textAlign: "left", padding: "10px 14px", fontSize: 10, fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => {
                  const c = CLIENTS.find(x => x.id === m.client);
                  return (
                    <tr key={m.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        onClick={() => window.__nav?.("machine")}>
                      <td style={{ padding: "12px 14px" }}>
                        <span className="mono" style={{ fontSize: 12, color: "var(--text)", fontWeight: 500 }}>{m.id}</span>
                      </td>
                      <td style={{ padding: "12px 14px", color: "var(--text-2)" }}>{m.model}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ fontWeight: 500 }}>{c?.name}</div>
                        <div style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 2 }}>{m.place}</div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <Badge tone={m.status} dot>
                          {m.status === "ok" ? "En ligne" : m.status === "warn" ? "À surveiller" : "Panne"}
                        </Badge>
                      </td>
                      <td style={{ padding: "12px 14px", minWidth: 160 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ flex: 1 }}>
                            <Bar value={m.stock} tone={m.stock < 25 ? "err" : m.stock < 40 ? "warn" : "ok"}/>
                          </div>
                          <span className="mono tabular" style={{ fontSize: 11.5, color: "var(--text-2)", minWidth: 36, textAlign: "right" }}>{m.stock}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span className="mono tabular" style={{ fontSize: 12, color: m.temp > 7 ? "var(--err)" : "var(--text-2)" }}>{m.temp.toFixed(1)} °C</span>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--text-3)" }}>{m.sync}</td>
                      <td style={{ padding: "12px 14px", textAlign: "right" }}>
                        <Icon name="chevron" size={14} color="var(--text-3)"/>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, fontSize: 12, color: "var(--text-3)" }}>
            <span>{filtered.length} machines · Page 1 sur 13</span>
            <div style={{ display: "flex", gap: 6 }}>
              <Button size="sm" variant="secondary">Précédent</Button>
              <Button size="sm" variant="secondary">Suivant</Button>
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      {view === "map" && <ParcMapView machines={filtered}/>}
    </div>
  );
}

function ParcMapView({ machines }) {
  // Project IDF coords [lat, lng] into a simple SVG viewport
  const bounds = { latMin: 48.68, latMax: 48.96, lngMin: 2.10, lngMax: 2.48 };
  const project = (lat, lng) => ({
    x: ((lng - bounds.lngMin) / (bounds.lngMax - bounds.lngMin)) * 100,
    y: ((bounds.latMax - lat) / (bounds.latMax - bounds.latMin)) * 100,
  });
  return (
    <div style={{ padding: "16px 32px" }}>
      <Card pad={0} style={{ overflow: "hidden", height: 560 }}>
        <div style={{ position: "relative", height: "100%", background: "var(--surface-2)" }}>
          {/* Grid */}
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
            {/* Rough Seine path */}
            <path d="M 0,62 C 20,58 28,64 38,60 S 58,54 68,58 S 88,64 100,60" stroke="var(--info)" strokeWidth="1" fill="none" opacity="0.3" vectorEffect="non-scaling-stroke" transform="scale(10, 5.6)"/>
          </svg>
          {/* Zones labels */}
          {[
            { name: "Paris", lat: 48.8566, lng: 2.3522 },
            { name: "La Défense", lat: 48.8920, lng: 2.2380 },
            { name: "Saint-Denis", lat: 48.9362, lng: 2.3574 },
            { name: "Versailles", lat: 48.8014, lng: 2.1301 },
            { name: "Saclay", lat: 48.7107, lng: 2.1700 },
          ].map((z, i) => {
            const p = project(z.lat, z.lng);
            return (
              <div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)", color: "var(--text-3)", fontSize: 10, letterSpacing: 0.06, textTransform: "uppercase", fontWeight: 500, pointerEvents: "none" }}>
                {z.name}
              </div>
            );
          })}
          {/* Pins */}
          {machines.map((m, i) => {
            const p = project(m.coord[0], m.coord[1]);
            const color = m.status === "err" ? "var(--err)" : m.status === "warn" ? "var(--warn)" : "var(--ok)";
            return (
              <div key={m.id} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)" }}>
                <div style={{ position: "relative", width: 14, height: 14, borderRadius: "50%", background: color, border: "2px solid var(--elev)", boxShadow: "0 2px 4px rgba(0,0,0,0.15)", animation: `pulse-${m.status} 2s ease-out infinite` }}/>
              </div>
            );
          })}
          {/* Legend */}
          <div style={{ position: "absolute", bottom: 14, left: 14, background: "var(--elev)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", display: "flex", gap: 14, fontSize: 11.5, boxShadow: "var(--shadow-sm)" }}>
            {[
              { c: "var(--ok)",   l: `En ligne (${machines.filter(m => m.status === "ok").length})` },
              { c: "var(--warn)", l: `À surveiller (${machines.filter(m => m.status === "warn").length})` },
              { c: "var(--err)",  l: `Panne (${machines.filter(m => m.status === "err").length})` },
            ].map((x, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: x.c }}/>{x.l}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { ScreenParc });
