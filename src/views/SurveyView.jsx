import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const preguntas = [
    {
        id: 1,
        tipo: "texto",
        icono: "🌆",
        pregunta: "¿De qué ciudad nos escribes?",
        placeholder: "Ej: Quito, Guayaquil...",
        campo: "ciudad",
    },
    {
        id: 2,
        tipo: "opciones",
        icono: "👤",
        pregunta: "¿Cuál es tu rango de edad?",
        campo: "edad",
        opciones: ["18-24 años", "25-34 años", "35-44 años", "45+ años"],
    },
    {
        id: 3,
        tipo: "opciones",
        icono: "💼",
        pregunta: "¿Cuál es tu ocupación?",
        campo: "ocupacion",
        opciones: ["Empleado Privado", "Independiente / Freelance", "Estudiante", "Sector Público"],
    },
    {
        id: 4,
        tipo: "multiple",
        icono: "📌",
        pregunta: "¿Cuáles son tus principales intereses?",
        campo: "intereses",
        opciones: ["Tecnología", "Salud", "Educación", "Finanzas", "Entretenimiento", "Emprendimiento"],
    },
];

const ACCENT = "#00F5C4";

export default function EncuestaVivo() {
    const [paso, setPaso] = useState(0);
    const [respuestas, setRespuestas] = useState({});
    const [completado, setCompletado] = useState(false);
    const [dir, setDir] = useState(1);

    const pregunta = preguntas[paso];
    const progreso = Math.round(((paso) / preguntas.length) * 100);
    const valor = respuestas[pregunta?.campo];

    const handleSiguiente = () => {
        if (paso < preguntas.length - 1) {
            setDir(1);
            setPaso(p => p + 1);
        } else {
            setCompletado(true);
        }
    };

    const handleAnterior = () => {
        if (paso > 0) {
            setDir(-1);
            setPaso(p => p - 1);
        }
    };

    const handleTexto = (e) => {
        setRespuestas(r => ({ ...r, [pregunta.campo]: e.target.value }));
    };

    const handleOpcion = (op) => {
        setRespuestas(r => ({ ...r, [pregunta.campo]: op }));
    };

    const handleMultiple = (op) => {
        const actual = respuestas[pregunta.campo] || [];
        const existe = actual.includes(op);
        setRespuestas(r => ({
            ...r,
            [pregunta.campo]: existe ? actual.filter(x => x !== op) : [...actual, op],
        }));
    };

    const puedeAvanzar = () => {
        if (!valor) return false;
        if (Array.isArray(valor)) return valor.length > 0;
        return valor.trim() !== "";
    };

    if (completado) {
        return (
            <div style={styles.container}>
                <div style={{ ...styles.card, textAlign: "center", padding: "60px 40px" }}>
                    <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 12 }}>
                        ¡Gracias por participar!
                    </h2>
                    <p style={{ color: "#aaa", fontSize: 15, marginBottom: 32 }}>
                        Tus respuestas han sido registradas en tiempo real.
                    </p>
                    <div style={{
                        background: "rgba(0,245,196,0.08)", border: "1px solid rgba(0,245,196,0.2)",
                        borderRadius: 12, padding: "16px 24px", display: "inline-block"
                    }}>
                        <span style={{ color: ACCENT, fontSize: 13, fontWeight: 600 }}>✓ Respuesta guardada exitosamente</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,245,196,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(0,245,196,0); }
        }
        .opcion-btn:hover {
          border-color: rgba(0,245,196,0.5) !important;
          background: rgba(0,245,196,0.06) !important;
          transform: translateX(4px);
        }
        .opcion-btn {
          transition: all 0.2s ease !important;
        }
        .siguiente-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,245,196,0.35) !important;
        }
        .siguiente-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .input-survey:focus {
          border-color: rgba(0,245,196,0.6) !important;
          box-shadow: 0 0 0 3px rgba(0,245,196,0.1) !important;
          outline: none;
        }
      `}</style>

            {/* Header */}
            <div style={styles.header}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: "linear-gradient(135deg, #00F5C4, #4CC9F0)",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
                    }}>📋</div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: "clamp(16px, 2.5vw, 22px)", fontWeight: 800 }}>
                            FUNDEL
                        </h1>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                            <span style={{
                                width: 7, height: 7, borderRadius: "50%", background: ACCENT,
                                display: "inline-block", animation: "pulseGlow 1.5s infinite"
                            }} />
                            <span style={{ fontSize: 11, color: ACCENT, letterSpacing: 1 }}>EN VIVO</span>
                        </div>
                    </div>
                </div>

                <div style={{
                    fontSize: 13, color: "#888",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8, padding: "6px 14px"
                }}>
                    Paso {paso + 1} de {preguntas.length}
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "#666" }}>Progreso</span>
                    <span style={{ fontSize: 12, color: ACCENT, fontWeight: 600 }}>{progreso}% completado</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 999 }}>
                    <div style={{
                        height: "100%", borderRadius: 999,
                        background: `linear-gradient(90deg, ${ACCENT}, #4CC9F0)`,
                        width: `${progreso}%`,
                        transition: "width 0.5s ease",
                        boxShadow: `0 0 10px ${ACCENT}66`
                    }} />
                </div>

                {/* Steps dots */}
                <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "center" }}>
                    {preguntas.map((_, i) => (
                        <div key={i} style={{
                            width: i === paso ? 20 : 8,
                            height: 8, borderRadius: 999,
                            background: i < paso ? ACCENT : i === paso ? ACCENT : "rgba(255,255,255,0.1)",
                            transition: "all 0.3s ease",
                            opacity: i <= paso ? 1 : 0.4
                        }} />
                    ))}
                </div>
            </div>

            {/* Card de Pregunta */}
            <div key={paso} style={{
                ...styles.card,
                animation: "fadeSlideIn 0.4s ease both"
            }}>
                {/* Icono pregunta */}
                <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: "rgba(0,245,196,0.1)",
                    border: "1px solid rgba(0,245,196,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24, marginBottom: 20
                }}>
                    {pregunta.icono}
                </div>

                <h2 style={{
                    fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 800,
                    color: "#fff", marginBottom: 28, lineHeight: 1.3
                }}>
                    {pregunta.pregunta}
                </h2>

                {/* Input texto */}
                {pregunta.tipo === "texto" && (
                    <input
                        className="input-survey"
                        type="text"
                        value={valor || ""}
                        onChange={handleTexto}
                        placeholder={pregunta.placeholder}
                        style={{
                            width: "100%", boxSizing: "border-box",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: 12, padding: "14px 18px",
                            color: "#fff", fontSize: 15,
                            transition: "all 0.2s",
                        }}
                    />
                )}

                {/* Opciones únicas */}
                {pregunta.tipo === "opciones" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {pregunta.opciones.map((op) => {
                            const sel = valor === op;
                            return (
                                <button
                                    key={op}
                                    className="opcion-btn"
                                    onClick={() => handleOpcion(op)}
                                    style={{
                                        background: sel ? "rgba(0,245,196,0.1)" : "rgba(255,255,255,0.03)",
                                        border: `1px solid ${sel ? ACCENT : "rgba(255,255,255,0.1)"}`,
                                        borderRadius: 12, padding: "14px 20px",
                                        color: sel ? ACCENT : "#ccc",
                                        fontSize: 14, fontWeight: sel ? 600 : 400,
                                        textAlign: "left", cursor: "pointer",
                                        display: "flex", alignItems: "center", gap: 12,
                                        boxShadow: sel ? `0 0 16px rgba(0,245,196,0.15)` : "none"
                                    }}
                                >
                                    <span style={{
                                        width: 18, height: 18, borderRadius: "50%",
                                        border: `2px solid ${sel ? ACCENT : "rgba(255,255,255,0.2)"}`,
                                        background: sel ? ACCENT : "transparent",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        flexShrink: 0, transition: "all 0.2s"
                                    }}>
                                        {sel && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#080d14", display: "block" }} />}
                                    </span>
                                    {op}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Múltiple selección */}
                {pregunta.tipo === "multiple" && (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                        gap: 10
                    }}>
                        {pregunta.opciones.map((op) => {
                            const sel = (valor || []).includes(op);
                            return (
                                <button
                                    key={op}
                                    className="opcion-btn"
                                    onClick={() => handleMultiple(op)}
                                    style={{
                                        background: sel ? "rgba(0,245,196,0.1)" : "rgba(255,255,255,0.03)",
                                        border: `1px solid ${sel ? ACCENT : "rgba(255,255,255,0.1)"}`,
                                        borderRadius: 12, padding: "14px 16px",
                                        color: sel ? ACCENT : "#ccc",
                                        fontSize: 13, fontWeight: sel ? 600 : 400,
                                        cursor: "pointer", textAlign: "center",
                                        boxShadow: sel ? `0 0 16px rgba(0,245,196,0.15)` : "none"
                                    }}
                                >
                                    {sel && <span style={{ marginRight: 6 }}>✓</span>}
                                    {op}
                                </button>
                            );
                        })}
                    </div>
                )}

                {pregunta.tipo === "multiple" && (
                    <p style={{ fontSize: 12, color: "#666", marginTop: 12 }}>
                        Puedes seleccionar múltiples opciones
                    </p>
                )}
            </div>

            {/* Navegación */}
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                {paso > 0 && (
                    <button
                        onClick={handleAnterior}
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 12, padding: "14px 24px",
                            color: "#aaa", fontSize: 14, cursor: "pointer",
                            transition: "all 0.2s"
                        }}
                    >
                        ← Anterior
                    </button>
                )}

                <button
                    className="siguiente-btn"
                    onClick={handleSiguiente}
                    disabled={!puedeAvanzar()}
                    style={{
                        flex: 1,
                        background: `linear-gradient(135deg, ${ACCENT}, #4CC9F0)`,
                        border: "none", borderRadius: 12,
                        padding: "14px 32px",
                        color: "#080d14", fontSize: 15, fontWeight: 700,
                        cursor: "pointer", transition: "all 0.2s",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                    }}
                >
                    {paso === preguntas.length - 1 ? "Enviar respuestas ✓" : "Siguiente →"}
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        background: "#080d14",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        color: "#fff",
        padding: "clamp(20px, 5vw, 60px) clamp(16px, 5vw, 40px)",
        maxWidth: 640,
        margin: "0 auto",
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 32,
        flexWrap: "wrap",
        gap: 12,
        animation: "fadeSlideIn 0.4s ease both",
    },
    card: {
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        padding: "clamp(20px, 4vw, 36px)",
    },
};
