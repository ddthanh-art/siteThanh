import { useState } from 'react';

interface SolutionStep {
  description: string;
  formula?: string;
  value?: string;
}

interface QuadraticResult {
  a: number;
  b: number;
  c: number;
  discriminant: number;
  steps: SolutionStep[];
  solution: string;
  roots?: { x1: number; x2: number } | { x: number };
}

export default function App() {
  const [a, setA] = useState<string>('1');
  const [b, setB] = useState<string>('-5');
  const [c, setC] = useState<string>('6');
  const [result, setResult] = useState<QuadraticResult | null>(null);
  const [showSteps, setShowSteps] = useState(false);

  const solveQuadratic = () => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);

    // Validation
    if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
      alert('❌ Vui lòng nhập các số hợp lệ!');
      return;
    }

    if (numA === 0) {
      alert('❌ Hệ số a phải khác 0 để là phương trình bậc 2!');
      return;
    }

    const steps: SolutionStep[] = [];
    const discriminant = numB * numB - 4 * numA * numC;

    // Bước 1: Công thức
    steps.push({
      description: '📜 Phương Trình Bậc Hai Chuẩn',
      formula: `ax² + bx + c = 0`,
      value: `${numA}x² + ${numB}x + ${numC} = 0`,
    });

    // Bước 2: Công thức Delta
    steps.push({
      description: '⚔️ Tính Biệt Thức Delta (Δ)',
      formula: `Δ = b² - 4ac`,
      value: `Δ = (${numB})² - 4(${numA})(${numC}) = ${numB * numB} - ${4 * numA * numC} = ${discriminant}`,
    });

    let solution = '';
    let roots: { x1: number; x2: number } | { x: number } | undefined;

    if (discriminant > 0) {
      // Hai nghiệm phân biệt
      const sqrt_delta = Math.sqrt(discriminant);
      const x1 = (-numB + sqrt_delta) / (2 * numA);
      const x2 = (-numB - sqrt_delta) / (2 * numA);

      steps.push({
        description: '✨ Δ > 0: Phương trình có 2 nghiệm phân biệt',
        formula: `x = (-b ± √Δ) / 2a`,
        value: `√Δ = √${discriminant} ≈ ${sqrt_delta.toFixed(4)}`,
      });

      steps.push({
        description: '🔥 Tính Nghiệm Thứ Nhất',
        formula: `x₁ = (-b + √Δ) / 2a`,
        value: `x₁ = (${-numB} + ${sqrt_delta.toFixed(4)}) / ${2 * numA} = ${x1.toFixed(4)}`,
      });

      steps.push({
        description: '🔥 Tính Nghiệm Thứ Hai',
        formula: `x₂ = (-b - √Δ) / 2a`,
        value: `x₂ = (${-numB} - ${sqrt_delta.toFixed(4)}) / ${2 * numA} = ${x2.toFixed(4)}`,
      });

      solution = `🎯 Hai Nghiệm: x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`;
      roots = { x1, x2 };
    } else if (discriminant === 0) {
      // Một nghiệm kép
      const x = -numB / (2 * numA);

      steps.push({
        description: '⚡ Δ = 0: Phương trình có 1 nghiệm kép',
        formula: `x = -b / 2a`,
        value: `x = ${-numB} / ${2 * numA} = ${x.toFixed(4)}`,
      });

      solution = `🎯 Nghiệm Kép: x = ${x.toFixed(4)}`;
      roots = { x };
    } else {
      // Vô nghiệm
      steps.push({
        description: '❌ Δ < 0: Phương trình vô nghiệm (không có nghiệm thực)',
        formula: `Không có nghiệm thực trong tập số thực`,
        value: `Δ = ${discriminant}`,
      });

      solution = `🌑 Vô Nghiệm: Phương trình không có nghiệm thực`;
    }

    setResult({
      a: numA,
      b: numB,
      c: numC,
      discriminant,
      steps,
      solution,
      roots,
    });

    setShowSteps(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      solveQuadratic();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 transition-all duration-300"
      style={{
        backgroundImage: 'linear-gradient(135deg, #2a1810 0%, #1a0f08 50%, #3d2817 100%)',
      }}
    >
      <style>{`
        * {
          font-family: 'Cinzel', 'MedievalSharp', serif;
        }

        .medieval-card {
          background: linear-gradient(135deg, #dcc7aa 0%, #e8dcc0 50%, #cdb599 100%);
          box-shadow: 
            0 0 20px rgba(0, 0, 0, 0.8),
            inset 0 0 10px rgba(255, 255, 255, 0.3),
            0 20px 40px rgba(0, 0, 0, 0.9);
          border: 6px solid #8b6f47;
          border-image: linear-gradient(135deg, #d4a574, #8b6f47, #6b5237) 1;
          position: relative;
        }

        .medieval-card::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          background: linear-gradient(135deg, #8b6f47, #5a4a2f);
          z-index: -1;
          border-radius: 2px;
        }

        .medieval-button {
          background: linear-gradient(135deg, #8b4513, #d2691e, #8b4513);
          color: #fef5e7;
          font-weight: 700;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          border: 3px solid #5a2a0a;
          box-shadow: 
            0 8px 0 #3a1a0a,
            0 15px 20px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 1px;
        }

        .medieval-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #a0522d, #e08a38, #a0522d);
          transform: translateY(-2px);
          box-shadow: 
            0 10px 0 #3a1a0a,
            0 20px 25px rgba(0, 0, 0, 0.7),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }

        .medieval-button:active:not(:disabled) {
          transform: translateY(6px);
          box-shadow: 
            0 2px 0 #3a1a0a,
            0 5px 10px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .medieval-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .input-field {
          background: linear-gradient(135deg, #f5e6d3, #e8dcc0);
          border: 3px solid #8b6f47;
          color: #2a1810;
          font-weight: 600;
          font-family: 'Cinzel', serif;
          padding: 12px;
          border-radius: 2px;
          transition: all 0.3s;
        }

        .input-field:focus {
          outline: none;
          border-color: #d2691e;
          box-shadow: 0 0 10px rgba(210, 105, 30, 0.5);
          background: #fef5e7;
        }

        .step-item {
          background: linear-gradient(135deg, #f9f1e3, #efe8db);
          border-left: 5px solid #d2691e;
          padding: 16px;
          margin: 12px 0;
          border-radius: 2px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          animation: slideIn 0.4s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .step-description {
          color: #2a1810;
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 8px;
        }

        .step-formula {
          color: #5a4a2f;
          font-style: italic;
          font-size: 14px;
          margin: 6px 0;
        }

        .step-value {
          color: #8b4513;
          font-weight: 600;
          font-size: 15px;
          background: linear-gradient(90deg, rgba(210, 105, 30, 0.1), transparent);
          padding: 8px 12px;
          border-radius: 2px;
        }

        .solution-banner {
          background: linear-gradient(135deg, #fff8e7 0%, #fef5e7 50%, #f9f1e3 100%);
          border: 3px solid #d2691e;
          padding: 20px;
          margin: 20px 0;
          border-radius: 2px;
          text-align: center;
          box-shadow: 
            0 8px 20px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
        }

        .solution-text {
          color: #2a1810;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .title-text {
          color: #fef5e7;
          text-shadow: 
            2px 2px 4px rgba(0, 0, 0, 0.8),
            0 0 10px rgba(210, 105, 30, 0.6);
          font-weight: 900;
          letter-spacing: 2px;
        }

        .label-text {
          color: #2a1810;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.5px;
        }

        .toggle-button {
          background: linear-gradient(135deg, #8b6f47, #d4a574, #8b6f47);
          color: #2a1810;
          border: 2px solid #5a4a2f;
          padding: 8px 16px;
          font-weight: 600;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 13px;
        }

        .toggle-button:hover {
          background: linear-gradient(135deg, #a0824f, #e8bb8a, #a0824f);
          transform: scale(1.05);
        }

        .divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, #8b6f47, transparent);
          margin: 20px 0;
        }
      `}</style>

      <div className="medieval-card w-full max-w-2xl p-8 rounded-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="title-text text-5xl mb-2">⚔️ THẦN BÍ TOÁN HỌC ⚔️</h1>
          <p className="text-2xl text-yellow-800 font-bold" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
            Bẻ Gẫy Phương Trình Bậc Hai
          </p>
          <div className="divider"></div>
        </div>

        {/* Input Section */}
        <div className="space-y-5 mb-8">
          <div>
            <label className="label-text block mb-2">
              🔮 Hệ Số a (a ≠ 0)
            </label>
            <input
              type="number"
              value={a}
              onChange={(e) => setA(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input-field w-full text-lg"
              placeholder="Nhập a"
            />
          </div>

          <div>
            <label className="label-text block mb-2">
              🔮 Hệ Số b
            </label>
            <input
              type="number"
              value={b}
              onChange={(e) => setB(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input-field w-full text-lg"
              placeholder="Nhập b"
            />
          </div>

          <div>
            <label className="label-text block mb-2">
              🔮 Hệ Số c
            </label>
            <input
              type="number"
              value={c}
              onChange={(e) => setC(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input-field w-full text-lg"
              placeholder="Nhập c"
            />
          </div>
        </div>

        {/* Main Button */}
        <button
          onClick={solveQuadratic}
          className="medieval-button w-full py-4 text-2xl mb-8"
        >
          🗡️ GIẢI MÃ PHƯƠNG TRÌNH 🗡️
        </button>

        {/* Result Section */}
        {result && (
          <div className="animate-fade-in">
            <div className="divider"></div>

            <div className="solution-banner">
              <p className="solution-text">{result.solution}</p>
            </div>

            <div className="text-center mb-4">
              <button
                onClick={() => setShowSteps(!showSteps)}
                className="toggle-button"
              >
                {showSteps ? '📖 Ẩn Các Bước' : '📖 Hiện Chi Tiết Bước'}
              </button>
            </div>

            {showSteps && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-yellow-900 mb-6 text-center">
                  ⚡ Quá Trình Giải Chi Tiết ⚡
                </h2>

                {result.steps.map((step, index) => (
                  <div key={index} className="step-item">
                    <div className="step-description">{step.description}</div>
                    {step.formula && (
                      <div className="step-formula">
                        {step.formula}
                      </div>
                    )}
                    {step.value && (
                      <div className="step-value">
                        {step.value}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Reset Button */}
            <button
              onClick={() => {
                setA('1');
                setB('-5');
                setC('6');
                setResult(null);
                setShowSteps(false);
              }}
              className="medieval-button w-full py-3 text-lg mt-8"
            >
              🔄 BẮT ĐẦU LẠI
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
