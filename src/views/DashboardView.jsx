import { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useSurvey } from "../context/SurveyContext";

const COLORS = ["#00F5C4", "#FF6B6B", "#4CC9F0", "#F7B731", "#A29BFE", "#fd79a8"];

function Pulse() {
    return (
        <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
            <span style={{
                width: 8, height: 8, borderRadius: "50%", background: "#00F5C4",
                display: "inline-block", animation: "pulseGlow 1.5s infinite"
            }} />
            <style>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,245,196,0.5); }
          50% { box-shadow: 0 0 0 6px rgba(0,245,196,0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
        </span>
    );
}

function StatCard({ icon, label, value, accent, delay = 0 }) {
    return (
        <div style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${accent}33`,
            borderRadius: 16,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            animation: `fadeIn 0.6s ease ${delay}s both`,
            boxShadow: `0 0 24px ${accent}11`,
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "default",
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 8px 32px ${accent}33`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 0 24px ${accent}11`;
            }}>
            <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `${accent}22`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, flexShrink: 0
            }}>{icon}</div>
            <div>
                <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{value}</div>
            </div>
        </div>
    );
}

function SectionCard({ title, icon, children, delay = 0 }) {
    return (
        <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 20,
            padding: 24,
            animation: `fadeIn 0.6s ease ${delay}s both`,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#fff", letterSpacing: 0.5 }}>{title}</span>
            </div>
            {children}
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: "#0d1117", border: "1px solid rgba(0,245,196,0.3)",
                borderRadius: 10, padding: "10px 14px", fontSize: 13
            }}>
                <div style={{ color: "#aaa" }}>{label || payload[0].name}</div>
                <div style={{ color: "#00F5C4", fontWeight: 700 }}>{payload[0].value} respuesta{payload[0].value !== 1 ? "s" : ""}</div>
            </div>
        );
    }
    return null;
};

export default function ResultadosVivo() {
    const { responses, resetResponses } = useSurvey(); // Conexión real a datos
    const [tiempo, setTiempo] = useState(0);

    // --- PROCESAMIENTO DE DATOS EN VIVO ---
    const stats = useMemo(() => {
        const total = responses.length;

        const countBy = (field) => {
            const counts = {};
            responses.forEach(r => {
                // Manejar arrays (intereses) y strings
                const val = r[field];
                if (Array.isArray(val)) {
                    val.forEach(v => counts[v] = (counts[v] || 0) + 1);
                } else if (val) {
                    counts[val] = (counts[val] || 0) + 1;
                }
            });
            return Object.entries(counts)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value);
        };

        const cities = countBy('ciudad');
        const ages = countBy('edad');
        const jobs = countBy('ocupacion');
        const interests = countBy('intereses');

        // Top Item Helpers
        const getTop = (arr) => arr.length > 0 ? arr[0].name : "---";

        // Formatear para gráficas
        return {
            total,
            topCity: getTop(cities),
            topJob: getTop(jobs),
            ciudadesData: cities.slice(0, 5).map((c, i) => ({ ...c, fill: COLORS[i % COLORS.length], ciudad: c.name, respuestas: c.value })),
            edadData: ages.map((a, i) => ({ ...a, fill: COLORS[i % COLORS.length] })),
            ocupacionData: jobs.map((j, i) => ({ ...j, fill: COLORS[i % COLORS.length] })),
            interesesData: interests.map((inItem, i) => ({ ...inItem, fill: COLORS[i % COLORS.length] })),
        };
    }, [responses]);

    useEffect(() => {
        const interval = setInterval(() => setTiempo(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const mins = Math.floor(tiempo / 60).toString().padStart(2, "0");
    const secs = (tiempo % 60).toString().padStart(2, "0");

    return (
        <div style={{
            minHeight: "100vh",
            background: "#080d14",
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            color: "#fff",
            padding: "clamp(16px, 4vw, 40px)",
        }}>
            {/* Header */}
            <div style={{
                display: "flex", flexWrap: "wrap", alignItems: "center",
                justifyContent: "space-between", gap: 16,
                marginBottom: 32, animation: "fadeIn 0.5s ease both"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: "linear-gradient(135deg, #00F5C4, #4CC9F0)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 20
                    }}>📊</div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 800, letterSpacing: -0.5 }}>
                            FUNDEL
                        </h1>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                            <Pulse />
                            <span style={{ fontSize: 11, color: "#00F5C4", letterSpacing: 1 }}>ACTUALIZACIÓN EN TIEMPO REAL</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <div style={{
                        background: "rgba(0,245,196,0.08)", border: "1px solid rgba(0,245,196,0.2)",
                        borderRadius: 10, padding: "8px 16px", fontSize: 13, color: "#00F5C4"
                    }}>
                        ⏱ {mins}:{secs}
                    </div>
                </div>
            </div>

            {/* Top Stats */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 16, marginBottom: 28
            }}>
                <StatCard icon="📥" label="Total Respuestas" value={stats.total} accent="#00F5C4" delay={0.1} />
                <StatCard icon="🌆" label="Top Ciudad" value={stats.topCity} accent="#4CC9F0" delay={0.15} />
                <StatCard icon="💼" label="Top Ocupación" value={stats.topJob} accent="#A29BFE" delay={0.2} />
                <StatCard icon="📈" label="Tasa Completación" value="100%" accent="#F7B731" delay={0.25} />
            </div>

            {/* Main Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 20
            }}>
                {/* Ciudades */}
                <SectionCard title="Top Ciudades" icon="🌆" delay={0.3}>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={stats.ciudadesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <XAxis dataKey="ciudad" tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                            <Bar dataKey="respuestas" radius={[6, 6, 0, 0]}>
                                {stats.ciudadesData.map((entry, i) => (
                                    <Cell key={i} fill={entry.fill} fillOpacity={entry.respuestas > 0 ? 1 : 0.2} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    {stats.ciudadesData.length === 0 && <p style={{ textAlign: "center", color: "#666", fontSize: 13 }}>Esperando datos...</p>}
                </SectionCard>

                {/* Rangos de Edad */}
                <SectionCard title="Rangos de Edad" icon="👥" delay={0.35}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                        <ResponsiveContainer width="50%" height={160}>
                            <PieChart>
                                <Pie
                                    data={stats.edadData}
                                    cx="50%" cy="50%"
                                    innerRadius={45} outerRadius={70}
                                    paddingAngle={3} dataKey="value"
                                    stroke="none"
                                >
                                    {stats.edadData.map((entry, i) => (
                                        <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ flex: 1, minWidth: 100 }}>
                            {stats.edadData.map((item, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: 3, background: item.fill, flexShrink: 0 }} />
                                    <span style={{ fontSize: 12, color: "#aaa" }}>{item.name}</span>
                                    <span style={{ fontSize: 12, color: "#fff", marginLeft: "auto", fontWeight: 600 }}>
                                        {Math.round((item.value / stats.total) * 100)}%
                                    </span>
                                </div>
                            ))}
                            {stats.edadData.length === 0 && <p style={{ color: "#666", fontSize: 13 }}>Sin datos aún</p>}
                        </div>
                    </div>
                </SectionCard>

                {/* Ocupación */}
                <SectionCard title="Ocupación" icon="💼" delay={0.4}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {stats.ocupacionData.map((item, i) => (
                            <div key={i}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                                    <span style={{ fontSize: 13, color: "#ccc" }}>{item.name}</span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: item.fill }}>{item.value}</span>
                                </div>
                                <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 999 }}>
                                    <div style={{
                                        height: "100%", borderRadius: 999,
                                        background: item.fill,
                                        width: `${item.value > 0 ? Math.max((item.value / stats.total) * 100, 8) : 0}%`,
                                        opacity: item.value > 0 ? 1 : 0,
                                        transition: "width 1s ease",
                                        boxShadow: `0 0 8px ${item.fill}88`
                                    }} />
                                </div>
                            </div>
                        ))}
                        {stats.ocupacionData.length === 0 && <p style={{ textAlign: "center", color: "#666", fontSize: 13 }}>Esperando datos...</p>}
                    </div>
                </SectionCard>

                {/* Intereses */}
                <SectionCard title="Intereses" icon="📌" delay={0.45}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {stats.interesesData.map((item, i) => (
                            <div key={i}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                                    <span style={{ fontSize: 13, color: "#ccc" }}>{item.name}</span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: item.fill }}>{item.value}</span>
                                </div>
                                <div style={{
                                    height: 6, borderRadius: 999,
                                    background: item.fill,
                                    width: `${item.value > 0 ? Math.max((item.value / stats.total) * 100, 8) : 0}%`,
                                    transition: "width 1s ease",
                                }} />
                            </div>
                        ))}
                        {stats.interesesData.length === 0 && (
                            <div style={{ textAlign: 'center', padding: 20 }}>
                                <p style={{ fontSize: 12, color: "#666" }}>Esperando datos...</p>
                                <div style={{
                                    height: 6, borderRadius: 999, marginTop: 10,
                                    background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 75%)",
                                    backgroundSize: "200% 100%",
                                    animation: "shimmer 2s infinite"
                                }} />
                            </div>
                        )}
                    </div>
                </SectionCard>
            </div>

            {/* Footer */}
            <div style={{
                marginTop: 28, textAlign: "center",
                fontSize: 12, color: "#444",
                animation: "fadeIn 0.6s ease 0.6s both"
            }}>
                Dashboard actualizado automáticamente · Última actualización hace <span style={{ color: "#00F5C4" }}>0s</span>
                <div style={{ marginTop: 12 }}>
                    <button
                        onClick={() => {
                            if (window.confirm("¿Estás seguro de que quieres borrar todos los datos?")) {
                                resetResponses();
                            }
                        }}
                        style={{
                            background: "transparent",
                            border: "1px solid #333",
                            borderRadius: 6,
                            color: "#666",
                            padding: "4px 10px",
                            fontSize: 11,
                            cursor: "pointer",
                            transition: "all 0.2s"
                        }}
                        onMouseEnter={e => {
                            e.target.style.borderColor = "#FF6B6B";
                            e.target.style.color = "#FF6B6B";
                        }}
                        onMouseLeave={e => {
                            e.target.style.borderColor = "#333";
                            e.target.style.color = "#666";
                        }}
                    >
                        🗑️ Resetear Datos
                    </button>
                </div>
            </div>
        </div>
    );
}
