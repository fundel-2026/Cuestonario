import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";

const COLORS = ["#00F5C4", "#FF6B6B", "#4CC9F0", "#F7B731", "#A29BFE", "#fd79a8"];

const edadData = [
    { name: "18-24", value: 32, fill: "#00F5C4" },
    { name: "25-34", value: 45, fill: "#4CC9F0" },
    { name: "35-44", value: 18, fill: "#A29BFE" },
    { name: "45+", value: 5, fill: "#F7B731" },
];

const ciudadesData = [
    { ciudad: "Ambato", respuestas: 1, fill: "#00F5C4" },
    { ciudad: "Quito", respuestas: 0, fill: "#4CC9F0" },
    { ciudad: "Guayaquil", respuestas: 0, fill: "#A29BFE" },
];

const ocupacionData = [
    { name: "Empleado Privado", value: 1, fill: "#00F5C4" },
    { name: "Independiente", value: 0, fill: "#4CC9F0" },
    { name: "Estudiante", value: 0, fill: "#A29BFE" },
    { name: "Público", value: 0, fill: "#F7B731" },
];

const interesesData = [
    { name: "Tecnología", value: 0, fill: "#00F5C4" },
    { name: "Salud", value: 0, fill: "#4CC9F0" },
    { name: "Educación", value: 0, fill: "#A29BFE" },
    { name: "Finanzas", value: 0, fill: "#F7B731" },
];

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
        @keyframes countUp {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
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
    const [respuestas, setRespuestas] = useState(1);
    const [tiempo, setTiempo] = useState(0);

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
                    <div style={{
                        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 10, padding: "8px 16px", fontSize: 13, color: "#aaa"
                    }}>
                        🔴 Sesión activa
                    </div>
                </div>
            </div>

            {/* Top Stats */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 16, marginBottom: 28
            }}>
                <StatCard icon="📥" label="Total Respuestas" value={respuestas} accent="#00F5C4" delay={0.1} />
                <StatCard icon="🌆" label="Top Ciudad" value="Ambato" accent="#4CC9F0" delay={0.15} />
                <StatCard icon="💼" label="Top Ocupación" value="Emp. Privado" accent="#A29BFE" delay={0.2} />
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
                        <BarChart data={ciudadesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <XAxis dataKey="ciudad" tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                            <Bar dataKey="respuestas" radius={[6, 6, 0, 0]}>
                                {ciudadesData.map((entry, i) => (
                                    <Cell key={i} fill={entry.fill} fillOpacity={entry.respuestas > 0 ? 1 : 0.2} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </SectionCard>

                {/* Rangos de Edad */}
                <SectionCard title="Rangos de Edad" icon="👥" delay={0.35}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                        <ResponsiveContainer width="50%" height={160}>
                            <PieChart>
                                <Pie
                                    data={edadData}
                                    cx="50%" cy="50%"
                                    innerRadius={45} outerRadius={70}
                                    paddingAngle={3} dataKey="value"
                                    stroke="none"
                                >
                                    {edadData.map((entry, i) => (
                                        <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ flex: 1, minWidth: 100 }}>
                            {edadData.map((item, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: 3, background: item.fill, flexShrink: 0 }} />
                                    <span style={{ fontSize: 12, color: "#aaa" }}>{item.name}</span>
                                    <span style={{ fontSize: 12, color: "#fff", marginLeft: "auto", fontWeight: 600 }}>{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </SectionCard>

                {/* Ocupación */}
                <SectionCard title="Ocupación" icon="💼" delay={0.4}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {ocupacionData.map((item, i) => (
                            <div key={i}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                                    <span style={{ fontSize: 13, color: "#ccc" }}>{item.name}</span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: item.fill }}>{item.value}</span>
                                </div>
                                <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 999 }}>
                                    <div style={{
                                        height: "100%", borderRadius: 999,
                                        background: item.fill,
                                        width: `${item.value > 0 ? Math.max(item.value * 100, 8) : 0}%`,
                                        opacity: item.value > 0 ? 1 : 0,
                                        transition: "width 1s ease",
                                        boxShadow: `0 0 8px ${item.fill}88`
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* Intereses */}
                <SectionCard title="Intereses" icon="📌" delay={0.45}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {interesesData.map((item, i) => (
                            <div key={i}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                                    <span style={{ fontSize: 13, color: "#ccc" }}>{item.name}</span>
                                    <span style={{ fontSize: 12, color: "#666" }}>Esperando datos...</span>
                                </div>
                                <div style={{
                                    height: 6, borderRadius: 999,
                                    background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 75%)",
                                    backgroundSize: "200% 100%",
                                    animation: "shimmer 2s infinite"
                                }} />
                            </div>
                        ))}
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
            </div>
        </div>
    );
}
