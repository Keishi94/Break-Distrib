/* Break'Distrib — Fiche machine mobile (technicien terrain) */

function ScreenMachineMobile({ dark = false }) {
  const m = MACHINES.find(x => x.id === "BD-0167"); // the panne one
  const c = CLIENTS.find(x => x.id === m.client);
  const fg = dark ? "#F3ECE0" : "#0E0E0C";
  const fg2 = dark ? "rgba(243,236,224,0.65)" : "rgba(14,14,12,0.6)";
  const fg3 = dark ? "rgba(243,236,224,0.4)" : "rgba(14,14,12,0.4)";
  const surf = dark ? "#1C1B18" : "#FDFBF7";
  const surf2 = dark ? "#22201C" : "#F5EFE6";
  const bd = dark ? "#2B2925" : "#E3DBCC";

  const stocks = [
    { name: "Café grain",    pct: 12, icon: "coffee", qty: "0.6 / 5 kg" },
    { name: "Cappuccino",    pct: 8,  icon: "coffee", qty: "0.3 / 4 kg" },
    { name: "Snacks salés",  pct: 42, icon: "snack",  qty: "21 / 50" },
    { name: "Barres chocolat", pct: 28, icon: "snack", qty: "14 / 50" },
    { name: "Gobelets",      pct: 55, icon: "coffee", qty: "110 / 200" },
  ];

  return (
    <div style={{ background: surf2, minHeight: "100%", color: fg, fontFamily: "var(--ff-sans)" }}>
      {/* Hero */}
      <div style={{ padding: "16px 20px 20px", background: surf, borderBottom: `1px solid ${bd}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: surf2, border: `1px solid ${bd}`, display: "grid", placeItems: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div style={{ flex: 1, fontSize: 13, color: fg2 }}>Tournée · Arrêt 4 / 7</div>
          <button style={{ width: 32, height: 32, borderRadius: 8, background: surf2, border: `1px solid ${bd}`, display: "grid", placeItems: "center" }}>
            <Icon name="more" size={15} color={fg}/>
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: "var(--bd-orange)", color: "#fff", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <Icon name="machine" size={26} color="#fff"/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="mono" style={{ fontSize: 12, color: fg3, letterSpacing: 0.3 }}>{m.id}</div>
            <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.3, marginTop: 2 }}>{m.model}</div>
          </div>
        </div>

        {/* Alert banner */}
        <div style={{ marginTop: 14, padding: "10px 12px", background: dark ? "rgba(192,68,58,0.15)" : "var(--err-bg)", border: "1px solid rgba(192,68,58,0.3)", borderRadius: 10, display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ marginTop: 1 }}><StatusDot status="err" size={10}/></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--err)" }}>Panne détectée — température</div>
            <div style={{ fontSize: 12, color: fg2, marginTop: 2 }}>Capteur {'>'} 7 °C depuis 21 min. Groupe froid à contrôler.</div>
          </div>
        </div>
      </div>

      {/* Client + location card */}
      <div style={{ padding: "14px 20px 0" }}>
        <div style={{ background: surf, border: `1px solid ${bd}`, borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{c.name}</div>
          <div style={{ fontSize: 12.5, color: fg2, marginTop: 2 }}>{m.place}</div>
          <div style={{ fontSize: 12, color: fg3, marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="pin" size={12} color={fg3}/> {c.addr}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button style={{ flex: 1, height: 38, borderRadius: 10, background: surf2, border: `1px solid ${bd}`, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13, fontWeight: 500, color: fg }}>
              <Icon name="route" size={14}/> Itinéraire
            </button>
            <button style={{ flex: 1, height: 38, borderRadius: 10, background: surf2, border: `1px solid ${bd}`, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13, fontWeight: 500, color: fg }}>
              <Icon name="phone" size={14}/> Contact
            </button>
          </div>
        </div>
      </div>

      {/* Stocks */}
      <div style={{ padding: "18px 20px 4px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Niveaux de stock</div>
          <span className="label" style={{ color: fg3, fontSize: 10 }}>SYNC · 21 min</span>
        </div>
        <div style={{ background: surf, border: `1px solid ${bd}`, borderRadius: 14, overflow: "hidden" }}>
          {stocks.map((s, i) => {
            const tone = s.pct < 20 ? "err" : s.pct < 40 ? "warn" : "ok";
            const toneC = tone === "err" ? "var(--err)" : tone === "warn" ? "var(--warn)" : "var(--ok)";
            return (
              <div key={i} style={{ padding: "12px 14px", borderBottom: i < stocks.length - 1 ? `1px solid ${bd}` : "none", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: surf2, display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Icon name={s.icon} size={16} color={fg2}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{s.name}</div>
                    <div className="mono tabular" style={{ fontSize: 12, color: toneC, fontWeight: 500 }}>{s.pct}%</div>
                  </div>
                  <div style={{ height: 5, background: surf2, borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${s.pct}%`, height: "100%", background: toneC, borderRadius: 999 }}/>
                  </div>
                  <div className="mono" style={{ fontSize: 10.5, color: fg3, marginTop: 4 }}>{s.qty}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Last interventions */}
      <div style={{ padding: "18px 20px 0" }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Dernières interventions</div>
        <div style={{ background: surf, border: `1px solid ${bd}`, borderRadius: 14, overflow: "hidden" }}>
          {[
            { date: "18 mai", who: "T. Rossi", what: "Réassort café + snacks", ok: true },
            { date: "05 mai", who: "L. Bah",   what: "Nettoyage groupe froid", ok: true },
            { date: "22 avr.", who: "T. Rossi", what: "Remplacement buse vapeur", ok: true },
          ].map((h, i) => (
            <div key={i} style={{ padding: "11px 14px", borderBottom: i < 2 ? `1px solid ${bd}` : "none", display: "flex", alignItems: "center", gap: 10 }}>
              <StatusDot status="ok" size={6} pulse={false}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13 }}>{h.what}</div>
                <div style={{ fontSize: 11.5, color: fg3, marginTop: 2 }}>{h.who} · {h.date}</div>
              </div>
              <Icon name="chevron" size={13} color={fg3}/>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky action bar */}
      <div style={{ padding: "18px 20px 110px" }}>
        <button style={{ width: "100%", height: 48, borderRadius: 12, background: "var(--bd-orange)", border: 0, color: "#fff", fontSize: 15, fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 6px 16px rgba(243,112,33,0.35)" }}>
          <Icon name="alert" size={16} color="#fff"/> Déclarer une intervention
        </button>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button style={{ flex: 1, height: 42, borderRadius: 10, background: surf, border: `1px solid ${bd}`, color: fg, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13, fontWeight: 500 }}>
            <Icon name="camera" size={14}/> Photo
          </button>
          <button style={{ flex: 1, height: 42, borderRadius: 10, background: surf, border: `1px solid ${bd}`, color: fg, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13, fontWeight: 500 }}>
            <Icon name="check" size={14}/> Réassort fait
          </button>
        </div>
      </div>
    </div>
  );
}

/* Mobile tournée du jour */
function ScreenTourneeMobile() {
  const fg = "#0E0E0C", fg2 = "rgba(14,14,12,0.6)", fg3 = "rgba(14,14,12,0.4)";
  const surf = "#FDFBF7", surf2 = "#F5EFE6", bd = "#E3DBCC";

  return (
    <div style={{ background: surf2, minHeight: "100%", color: fg }}>
      <div style={{ padding: "16px 20px 16px", background: surf, borderBottom: `1px solid ${bd}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bd-orange)", color: "#fff", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 600 }}>TR</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: fg3 }}>Jeudi 21 mai</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Tournée Paris–La Défense</div>
          </div>
          <button style={{ width: 36, height: 36, borderRadius: 10, background: surf2, border: `1px solid ${bd}`, display: "grid", placeItems: "center" }}>
            <Icon name="scan" size={15} color={fg}/>
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {[
            { l: "Arrêts", v: "3/7", s: "" },
            { l: "Distance", v: "42", s: "km" },
            { l: "Fin prévue", v: "16:20", s: "" },
          ].map((k, i) => (
            <div key={i} style={{ background: surf2, borderRadius: 10, padding: "8px 10px" }}>
              <div className="label" style={{ fontSize: 9.5, color: fg3 }}>{k.l}</div>
              <div className="tabular" style={{ fontSize: 17, fontWeight: 600, marginTop: 2 }}>{k.v}<span style={{ fontSize: 11, color: fg3, marginLeft: 3, fontWeight: 400 }}>{k.s}</span></div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <Bar value={(3/7)*100} tone="ok"/>
        </div>
      </div>

      <div style={{ padding: "16px 20px" }}>
        <div style={{ position: "relative" }}>
          {/* Vertical timeline */}
          <div style={{ position: "absolute", left: 17, top: 16, bottom: 16, width: 2, background: bd }}/>
          {TOURNEE_TODAY.map((t, i) => {
            const done = t.status === "done";
            const cur = t.status === "current";
            const dotColor = done ? "var(--ok)" : cur ? "var(--bd-orange)" : t.pulse === "err" ? "var(--err)" : "var(--n-300)";
            return (
              <div key={t.seq} style={{ position: "relative", paddingLeft: 44, marginBottom: 10 }}>
                <div style={{ position: "absolute", left: 10, top: 14, width: 16, height: 16, borderRadius: "50%", background: surf2, border: `2px solid ${dotColor}`, display: "grid", placeItems: "center" }}>
                  {done && <Icon name="check" size={9} color="var(--ok)"/>}
                  {cur && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--bd-orange)" }}/>}
                </div>
                <div style={{
                  background: surf,
                  border: `1px solid ${cur ? "var(--bd-orange)" : bd}`,
                  borderRadius: 12, padding: 12,
                  opacity: done ? 0.7 : 1,
                  boxShadow: cur ? "0 4px 12px rgba(243,112,33,0.18)" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span className="mono tabular" style={{ fontSize: 12, fontWeight: 600, color: cur ? "var(--bd-orange)" : fg2 }}>{t.time}</span>
                    <span style={{ fontSize: 11, color: fg3 }}>·</span>
                    <span className="mono" style={{ fontSize: 10.5, color: fg3 }}>{t.machine}</span>
                    {t.pulse === "err" && <Badge tone="err" size="sm" dot>Panne</Badge>}
                    {cur && <Badge tone="brand" size="sm">En cours</Badge>}
                    <div style={{ flex: 1 }}/>
                    <span className="mono" style={{ fontSize: 10.5, color: fg3 }}>{t.duration} min</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 500, textDecoration: done ? "line-through" : "none", color: done ? fg3 : fg }}>
                    {t.client}
                  </div>
                  <div style={{ fontSize: 11.5, color: fg3, marginTop: 2 }}>{t.place} · {t.task}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenMachineMobile, ScreenTourneeMobile });
