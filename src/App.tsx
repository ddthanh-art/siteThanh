import { useState, useCallback, useRef } from "react";

/* ========== TYPES ========== */
interface Step {
  label: string;
  content: string;
  isHighlight?: boolean;
  isError?: boolean;
  isResult?: boolean;
}

interface HistoryEntry {
  a: number;
  b: number;
  c: number;
  equation: string;
  result: string;
}

/* ========== APP COMPONENT ========== */
function App() {
  const [a, setA] = useState<string>("");
  const [b, setB] = useState<string>("");
  const [c, setC] = useState<string>("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shakeInput, setShakeInput] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  /* ----- Format number for display ----- */
  const formatNumber = (n: number): string => {
    if (Number.isInteger(n)) return n.toString();
    const rounded = Math.round(n * 100000) / 100000;
    if (Number.isInteger(rounded)) return rounded.toString();
    return rounded.toString();
  };

  /* ----- Format equation string ----- */
  const formatEquation = (numA: number, numB: number, numC: number): string => {
    let parts: string[] = [];

    // ax²
    if (numA !== 0) {
      if (numA === 1) parts.push("x²");
      else if (numA === -1) parts.push("-x²");
      else parts.push(`${numA}x²`);
    }

    // bx
    if (numB !== 0) {
      if (numB === 1) parts.push("+ x");
      else if (numB === -1) parts.push("- x");
      else if (numB > 0) parts.push(`+ ${numB}x`);
      else parts.push(`- ${Math.abs(numB)}x`);
    }

    // c
    if (numC !== 0) {
      if (numC > 0) parts.push(`+ ${numC}`);
      else parts.push(`- ${Math.abs(numC)}`);
    }

    if (parts.length === 0) return "0 = 0";

    let eq = parts.join(" ");
    if (eq.startsWith("+ ")) eq = eq.substring(2);
    return eq + " = 0";
  };

  /* ----- Solve equation step by step ----- */
  const solveEquation = useCallback(async () => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);

    if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 600);
      setSteps([
        {
          label: "⚠️ CẢNH BÁO",
          content: "Hãy nhập đầy đủ các hệ số bằng chữ số, hỡi chiến binh! Các ô không được để trống.",
          isError: true,
        },
      ]);
      return;
    }

    if (numA === 0) {
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 600);
      setSteps([
        {
          label: "⚠️ CẢNH BÁO",
          content: "Hệ số a = 0 thì đây không còn là phương trình bậc hai nữa! Hãy thay đổi hệ số a.",
          isError: true,
        },
      ]);
      return;
    }

    setIsAnimating(true);
    setHasResult(false);
    const newSteps: Step[] = [];

    // ── STEP 1: The equation ──
    const eqStr = formatEquation(numA, numB, numC);
    newSteps.push({
      label: "📜 BƯỚC 1: BÀI TOÁN ĐƯỢC GIAO",
      content: `Bề trên đã trao cho ngươi phương trình:\n\n    ${eqStr}`,
    });
    setSteps([...newSteps]);
    await delay(700);

    // ── STEP 2: Identify coefficients ──
    newSteps.push({
      label: "🔍 BƯỚC 2: NHẬN DIỆN CÁC HỆ SỐ",
      content: `Ta có phương trình bậc 2 dạng: ax² + bx + c = 0\n\n  ► Hệ số a = ${numA}\n  ► Hệ số b = ${numB}\n  ► Hệ số c = ${numC}`,
    });
    setSteps([...newSteps]);
    await delay(700);

    // ── STEP 3: Calculate discriminant ──
    const bSquared = numB * numB;
    const fourAC = 4 * numA * numC;
    const delta = bSquared - fourAC;

    newSteps.push({
      label: "⚡ BƯỚC 3: TÍNH BIỂU THỨC PHÂN BIỆT Δ (DELTA)",
      content: `Δ = b² − 4ac\nΔ = (${numB})² − 4 × ${numA} × ${numC}\nΔ = ${bSquared} − ${fourAC}\nΔ = ${delta}`,
      isHighlight: true,
    });
    setSteps([...newSteps]);
    await delay(800);

    // ── STEP 4 & 5: Analyze and compute ──
    if (delta > 0) {
      newSteps.push({
        label: "🌟 BƯỚC 4: LỜI TIÊN TRI",
        content: `Δ = ${delta} > 0\n\n→ Phép thuật báo về HAI NGHIỆM THỰC PHÂN BIỆT!\n→ Phương trình có 2 nghiệm thực khác nhau.`,
      });
      setSteps([...newSteps]);
      await delay(700);

      const sqrtDelta = Math.sqrt(delta);
      const x1 = (-numB + sqrtDelta) / (2 * numA);
      const x2 = (-numB - sqrtDelta) / (2 * numA);

      newSteps.push({
        label: "🗡️ BƯỚC 5: TÍNH CĂN BẬC HAI CỦA Δ",
        content: `√Δ = √${delta} = ${formatNumber(sqrtDelta)}`,
      });
      setSteps([...newSteps]);
      await delay(600);

      newSteps.push({
        label: "⚔️ BƯỚC 6: TÍNH NGHIỆM THỨ NHẤT (x₁)",
        content: `x₁ = (−b + √Δ) / (2a)\nx₁ = (${formatNumber(-numB)} + ${formatNumber(sqrtDelta)}) / ${formatNumber(2 * numA)}\nx₁ = ${formatNumber(-numB + sqrtDelta)} / ${formatNumber(2 * numA)}\n\n★ x₁ = ${formatNumber(x1)}`,
      });
      setSteps([...newSteps]);
      await delay(600);

      newSteps.push({
        label: "⚔️ BƯỚC 7: TÍNH NGHIỆM THỨ HAI (x₂)",
        content: `x₂ = (−b − √Δ) / (2a)\nx₂ = (${formatNumber(-numB)} − ${formatNumber(sqrtDelta)}) / ${formatNumber(2 * numA)}\nx₂ = ${formatNumber(-numB - sqrtDelta)} / ${formatNumber(2 * numA)}\n\n★ x₂ = ${formatNumber(x2)}`,
      });
      setSteps([...newSteps]);
      await delay(600);

      newSteps.push({
        label: "🏆 KẾT QUẢ CUỐI CÙNG",
        content: `Phương trình ${eqStr}\n\n★ x₁ = ${formatNumber(x1)}\n★ x₂ = ${formatNumber(x2)}\n\n(Vì Δ > 0 nên phương trình có 2 nghiệm thực phân biệt)`,
        isResult: true,
      });

      // Save to history
      setHistory(prev => [{
        a: numA, b: numB, c: numC,
        equation: eqStr,
        result: `x₁ = ${formatNumber(x1)}, x₂ = ${formatNumber(x2)}`
      }, ...prev].slice(0, 5));

    } else if (delta === 0) {
      newSteps.push({
        label: "🌟 BƯỚC 4: LỜI TIÊN TRI",
        content: `Δ = 0\n\n→ Phép thuật báo về NGHIỆM KÉP!\n→ Phương trình có một nghiệm thực duy nhất (nghiệm kép).`,
      });
      setSteps([...newSteps]);
      await delay(700);

      const x = -numB / (2 * numA);

      newSteps.push({
        label: "🗡️ BƯỚC 5: TÍNH NGHIỆM KÉP",
        content: `x = −b / (2a)\nx = ${formatNumber(-numB)} / ${formatNumber(2 * numA)}\n\n★ x = ${formatNumber(x)}`,
      });
      setSteps([...newSteps]);
      await delay(600);

      newSteps.push({
        label: "🏆 KẾT QUẢ CUỐI CÙNG",
        content: `Phương trình ${eqStr}\n\n★ Nghiệm kép: x = ${formatNumber(x)}\n\n(Vì Δ = 0 nên phương trình có nghiệm kép)`,
        isResult: true,
      });

      setHistory(prev => [{
        a: numA, b: numB, c: numC,
        equation: eqStr,
        result: `x = ${formatNumber(x)} (kép)`
      }, ...prev].slice(0, 5));

    } else {
      newSteps.push({
        label: "🌟 BƯỚC 4: LỜI TIÊN TRI",
        content: `Δ = ${delta} < 0\n\n→ Phép thuật báo về HAI NGHIỆM PHỨC (số ảo)!\n→ Phương trình vô nghiệm thực, nhưng có nghiệm phức.`,
      });
      setSteps([...newSteps]);
      await delay(700);

      const absDelta = Math.abs(delta);
      const sqrtAbsDelta = Math.sqrt(absDelta);
      const realPart = -numB / (2 * numA);
      const imagPart = sqrtAbsDelta / (2 * numA);

      newSteps.push({
        label: "🗡️ BƯỚC 5: TÍNH NGHIỆM PHỨC",
        content: `Phần thực: −b/(2a) = ${formatNumber(-numB)}/${formatNumber(2 * numA)} = ${formatNumber(realPart)}\n\nPhần ảo: √|Δ|/(2a) = √${absDelta}/${formatNumber(2 * numA)} = ${formatNumber(sqrtAbsDelta)}/${formatNumber(2 * numA)} = ${formatNumber(imagPart)}`,
      });
      setSteps([...newSteps]);
      await delay(600);

      newSteps.push({
        label: "🏆 KẾT QUẢ CUỐI CÙNG",
        content: `Phương trình ${eqStr}\n\n★ x₁ = ${formatNumber(realPart)} + ${formatNumber(imagPart)}i\n★ x₂ = ${formatNumber(realPart)} − ${formatNumber(imagPart)}i\n\n(Vì Δ < 0 nên phương trình có 2 nghiệm phức liên hợp)`,
        isResult: true,
      });

      setHistory(prev => [{
        a: numA, b: numB, c: numC,
        equation: eqStr,
        result: `x₁ = ${formatNumber(realPart)} + ${formatNumber(imagPart)}i, x₂ = ${formatNumber(realPart)} − ${formatNumber(imagPart)}i`
      }, ...prev].slice(0, 5));
    }

    setSteps([...newSteps]);
    setHasResult(true);
    setIsAnimating(false);

    // Scroll to results
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);

  }, [a, b, c]);

  /* ----- Reset everything ----- */
  const resetAll = () => {
    setA("");
    setB("");
    setC("");
    setSteps([]);
    setHasResult(false);
    setIsAnimating(false);
  };

  /* ----- Load history entry ----- */
  const loadHistory = (entry: HistoryEntry) => {
    setA(entry.a.toString());
    setB(entry.b.toString());
    setC(entry.c.toString());
  };

  /* ----- Particles for background ----- */
  const particles = Array.from({ length: 16 }, () => ({
    top: `${Math.random() * 95}%`,
    left: `${Math.random() * 95}%`,
    delay: `${Math.random() * 4}s`,
    size: 2 + Math.random() * 3,
    duration: 3 + Math.random() * 3,
  }));

  /* ----- Live equation display ----- */
  const getDisplayCoeff = (val: string, fallback: string) => {
    if (!val) return fallback;
    const n = parseFloat(val);
    if (isNaN(n)) return fallback;
    return n.toString();
  };

  return (
    <div className="wood-bg min-h-screen flex flex-col items-center justify-start py-6 sm:py-10 px-4 relative overflow-hidden">
      {/* ===== BACKGROUND PARTICLES ===== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <div
            key={i}
            className="particle"
            style={{
              top: p.top,
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: p.delay,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* ===== HEADER ===== */}
      <div className="text-center mb-6 sm:mb-8 relative z-10">
        <div className="crest-float inline-block mb-3">
          <span className="text-4xl sm:text-5xl">🛡️</span>
        </div>
        <div className="flex items-center justify-center gap-3 mb-1">
          <span className="text-2xl sm:text-3xl sword-icon">⚔️</span>
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black header-glow"
            style={{
              fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
              color: "var(--gold)",
              letterSpacing: "0.1em",
            }}
          >
            PHÉP THUẬT GIẢI MÃ
          </h1>
          <span className="text-2xl sm:text-3xl sword-icon">⚔️</span>
        </div>
        <h2
          className="text-base sm:text-lg md:text-xl font-semibold mt-2"
          style={{
            fontFamily: "'MedievalSharp', cursive",
            color: "var(--parchment)",
            letterSpacing: "0.1em",
          }}
        >
          Phương Trình Bậc Hai · ax² + bx + c = 0
        </h2>
        <div className="border-pattern mt-4 mx-auto max-w-md" />
        <p
          className="text-xs sm:text-sm mt-3 italic"
          style={{
            color: "rgba(244, 228, 193, 0.45)",
            fontFamily: "'MedievalSharp', cursive",
          }}
        >
          "Hãy nhập các hệ số và để phép thuật vén bức màn bí ẩn..."
        </p>
      </div>

      {/* ===== MAIN CARD ===== */}
      <div
        className={`medieval-card rounded-lg w-full max-w-2xl p-5 sm:p-8 md:p-10 relative z-10 ${
          shakeInput ? "shake" : ""
        }`}
      >
        {/* Corner decorations */}
        <div className="corner-decoration corner-tl" />
        <div className="corner-decoration corner-tr" />
        <div className="corner-decoration corner-bl" />
        <div className="corner-decoration corner-br" />

        {/* ─── LIVE EQUATION DISPLAY ─── */}
        <div className="text-center mb-6 relative z-10">
          <div className="border-pattern mb-5" />
          <p
            className="text-xs uppercase tracking-widest mb-2 font-bold"
            style={{
              fontFamily: "'Cinzel', serif",
              color: "var(--brass-dark)",
            }}
          >
            ═══ Phương Trình Của Ngươi ═══
          </p>
          <p
            className="text-xl sm:text-2xl md:text-3xl font-bold magic-glow"
            style={{
              fontFamily: "'Cinzel', serif",
              color: "var(--blood-red)",
            }}
          >
            {getDisplayCoeff(a, "a")}x² + {getDisplayCoeff(b, "b")}x + {getDisplayCoeff(c, "c")} = 0
          </p>
          <div className="border-pattern mt-5" />
        </div>

        {/* ─── INPUT SECTION ─── */}
        <div className="mb-6 relative z-10">
          <p
            className="text-center mb-5 text-sm sm:text-base font-semibold"
            style={{
              fontFamily: "'MedievalSharp', cursive",
              color: "var(--wood-medium)",
            }}
          >
            📜 Hãy điền các hệ số vào ô trống bên dưới:
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6">
            {/* Coefficient a */}
            <div className="flex flex-col items-center gap-2">
              <label className="coeff-label">
                Hệ số a
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && solveEquation()}
                  placeholder="a"
                  className="medieval-input w-20 sm:w-24 rounded-lg"
                />
                <span
                  className="text-lg sm:text-xl font-bold"
                  style={{ color: "var(--wood-medium)", fontFamily: "'Cinzel', serif" }}
                >
                  x²
                </span>
              </div>
            </div>

            <span
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: "var(--brass)", fontFamily: "'Cinzel', serif" }}
            >
              +
            </span>

            {/* Coefficient b */}
            <div className="flex flex-col items-center gap-2">
              <label className="coeff-label">
                Hệ số b
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={b}
                  onChange={(e) => setB(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && solveEquation()}
                  placeholder="b"
                  className="medieval-input w-20 sm:w-24 rounded-lg"
                />
                <span
                  className="text-lg sm:text-xl font-bold"
                  style={{ color: "var(--wood-medium)", fontFamily: "'Cinzel', serif" }}
                >
                  x
                </span>
              </div>
            </div>

            <span
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: "var(--brass)", fontFamily: "'Cinzel', serif" }}
            >
              +
            </span>

            {/* Coefficient c */}
            <div className="flex flex-col items-center gap-2">
              <label className="coeff-label">
                Hệ số c
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={c}
                  onChange={(e) => setC(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && solveEquation()}
                  placeholder="c"
                  className="medieval-input w-20 sm:w-24 rounded-lg"
                />
              </div>
            </div>
          </div>

          <p
            className="text-center mt-3 text-xs italic"
            style={{
              color: "rgba(93, 64, 55, 0.5)",
              fontFamily: "'MedievalSharp', cursive",
            }}
          >
            (Nhấn Enter hoặc bấm nút bên dưới để giải)
          </p>
        </div>

        {/* ─── ORNAMENTAL DIVIDER ─── */}
        <div className="ornament-divider">
          <span style={{ color: "var(--brass)", fontSize: "1.3rem" }}>⚜️</span>
        </div>

        {/* ─── BUTTONS ─── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 relative z-10">
          <button
            onClick={solveEquation}
            disabled={isAnimating}
            className="medieval-button rounded-lg w-full sm:w-auto fire-glow"
            style={{
              fontFamily: "'Cinzel', serif",
              opacity: isAnimating ? 0.7 : 1,
              cursor: isAnimating ? "not-allowed" : "pointer",
              minWidth: "280px",
            }}
          >
            {isAnimating ? "🔄 ĐANG THỰC HIỆN PHÉP THUẬT..." : "⚔️ GIẢI MÃ PHƯƠNG TRÌNH ⚔️"}
          </button>

          <button
            onClick={resetAll}
            className="medieval-button rounded-lg w-full sm:w-auto"
            style={{
              fontFamily: "'Cinzel', serif",
              background:
                "linear-gradient(180deg, #5d4037 0%, #4e342e 40%, #3e2723 60%, #5d4037 100%)",
              borderColor: "var(--wood-light)",
              fontSize: "0.85rem",
              padding: "14px 28px",
              letterSpacing: "0.08em",
            }}
          >
            🔄 LÀM MỚI
          </button>
        </div>

        {/* ─── RESULT PANEL ─── */}
        {steps.length > 0 && (
          <div className="mt-8 relative z-10" ref={resultRef}>
            <div className="ornament-divider">
              <span style={{ color: "var(--brass)", fontSize: "1.1rem" }}>
                📜
              </span>
            </div>

            <h3
              className="text-center text-base sm:text-lg md:text-xl font-bold mb-4"
              style={{
                fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
                color: "var(--blood-red)",
                letterSpacing: "0.08em",
              }}
            >
              🏰 CUỘC HÀNH TRÌNH GIẢI MÃ 🏰
            </h3>

            <div className="result-panel rounded-lg p-4 sm:p-6 parchment-burn">
              <div className="result-scroll">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="step-item mb-5 last:mb-0"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Step label */}
                    <div
                      className="text-xs sm:text-sm font-bold mb-2 uppercase tracking-wider"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        color: step.isError
                          ? "var(--blood-red)"
                          : step.isResult
                          ? "var(--gold-dark)"
                          : "var(--brass-dark)",
                      }}
                    >
                      {step.label}
                    </div>

                    {/* Step content */}
                    <div
                      className={`text-sm sm:text-base p-3 sm:p-4 rounded-lg ${
                        step.isResult ? "magic-glow" : ""
                      }`}
                      style={{
                        fontFamily: "'MedievalSharp', cursive",
                        color: step.isError
                          ? "var(--blood-red)"
                          : step.isResult
                          ? "var(--blood-red)"
                          : "var(--ink)",
                        background: step.isResult
                          ? "linear-gradient(135deg, rgba(184, 134, 11, 0.15), rgba(255, 215, 0, 0.08), rgba(184, 134, 11, 0.12))"
                          : step.isHighlight
                          ? "rgba(184, 134, 11, 0.08)"
                          : step.isError
                          ? "rgba(139, 0, 0, 0.05)"
                          : "rgba(244, 228, 193, 0.3)",
                        border: step.isResult
                          ? "3px solid var(--brass)"
                          : step.isHighlight
                          ? "2px solid rgba(184, 134, 11, 0.4)"
                          : step.isError
                          ? "2px solid rgba(139, 0, 0, 0.3)"
                          : "1px solid rgba(184, 134, 11, 0.2)",
                        fontWeight: step.isResult ? 700 : 400,
                        fontSize: step.isResult ? "1.05rem" : undefined,
                        whiteSpace: "pre-line",
                        lineHeight: step.isResult ? "1.9" : "1.7",
                        boxShadow: step.isResult
                          ? "0 0 20px rgba(184, 134, 11, 0.15), inset 0 0 30px rgba(255, 215, 0, 0.05)"
                          : "none",
                      }}
                    >
                      {step.content}
                    </div>

                    {/* Divider between steps */}
                    {index < steps.length - 1 && (
                      <div
                        className="w-full h-px my-3"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, var(--brass), var(--brass-light), var(--brass), transparent)",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Final flourish */}
              {hasResult && (
                <div className="text-center mt-4 pt-3" style={{ borderTop: "1px solid rgba(184, 134, 11, 0.2)" }}>
                  <p
                    className="text-xs italic"
                    style={{
                      fontFamily: "'MedievalSharp', cursive",
                      color: "rgba(93, 64, 55, 0.5)",
                    }}
                  >
                    ✨ Phép thuật đã hoàn thành. Sự thật đã được vén bức màn bí ẩn! ✨
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── HISTORY PANEL ─── */}
        {history.length > 0 && (
          <div className="mt-6 relative z-10">
            <div className="tab-separator" />

            <h4
              className="text-center text-xs sm:text-sm font-bold mb-3 uppercase tracking-wider"
              style={{
                fontFamily: "'Cinzel', serif",
                color: "var(--brass-dark)",
              }}
            >
              📚 Lịch Sử Giải Mã
            </h4>

            <div className="space-y-2">
              {history.map((entry, index) => (
                <div
                  key={index}
                  className="history-entry"
                  onClick={() => loadHistory(entry)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold" style={{ fontFamily: "'Cinzel', serif", fontSize: "0.75rem" }}>
                      {entry.equation}
                    </span>
                    <span className="text-xs" style={{ color: "var(--brass-dark)" }}>
                      #{history.length - index}
                    </span>
                  </div>
                  <div className="text-xs mt-1" style={{ color: "var(--wood-medium)" }}>
                    → {entry.result}
                  </div>
                </div>
              ))}
            </div>

            <p
              className="text-center mt-2 text-xs italic"
              style={{
                color: "rgba(93, 64, 55, 0.4)",
                fontFamily: "'MedievalSharp', cursive",
              }}
            >
              (Bấm vào phương trình để nạp lại)
            </p>
          </div>
        )}
      </div>

      {/* ===== FOOTER ===== */}
      <div className="mt-8 sm:mt-10 text-center relative z-10">
        <div className="border-pattern mx-auto max-w-xs mb-3" />
        <p
          className="text-xs"
          style={{
            fontFamily: "'MedievalSharp', cursive",
            color: "rgba(244, 228, 193, 0.25)",
          }}
        >
          ⚔️ Được rèn trong lửa của Đại Số Số Học · Giải Mã Phương Trình Bậc 2.html ⚔️
        </p>
        <p
          className="text-xs mt-1"
          style={{
            fontFamily: "'MedievalSharp', cursive",
            color: "rgba(244, 228, 193, 0.15)",
          }}
        >
          ⟨ Forge Your Equations · Master The Ancient Art of Algebra ⟩
        </p>
      </div>
    </div>
  );
}

export default App;
