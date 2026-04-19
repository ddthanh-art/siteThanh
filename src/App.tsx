import React, { useState } from 'react';
import './index.css';

interface Step {
  id: number;
  title: string;
  description: string;
  formula?: string;
}

interface ResultData {
  delta: number;
  x1?: number;
  x2?: number;
  message: string;
  steps: Step[];
}

export default function App() {
  const [a, setA] = useState<string>('');
  const [b, setB] = useState<string>('');
  const [c, setC] = useState<string>('');
  const [result, setResult] = useState<ResultData | null>(null);
  const [showSteps, setShowSteps] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const solveDelta = (aVal: number, bVal: number, cVal: number): ResultData => {
    const steps: Step[] = [];
    let stepId = 1;

    // Step 1: Validate equation format
    steps.push({
      id: stepId++,
      title: `⚔️ Bước 1: Xác nhận phương trình chuẩn`,
      description: `Phương trình bậc 2 có dạng: ax² + bx + c = 0`,
      formula: `${aVal}x² + (${bVal})x + ${c} = 0`,
    });

    // Step 2: Calculate Delta
    const deltaValue = bVal * bVal - 4 * aVal * cVal;
    steps.push({
      id: stepId++,
      title: `🔮 Bước 2: Tính biệt thức Delta (Δ)`,
      description: `Công thức tính Delta: Δ = b² - 4ac`,
      formula: `Δ = (${bVal})² - 4 × ${aVal} × ${c} = ${bVal * bVal} - ${4 * aVal * cVal} = ${deltaValue}`,
    });

    // Step 3: Analyze Delta
    let message = '';
    let x1: number | undefined;
    let x2: number | undefined;

    if (deltaValue > 0) {
      steps.push({
        id: stepId++,
        title: `⚡ Bước 3: Phân tích Δ = ${deltaValue}`,
        description: `Vì Δ > 0, phương trình có hai nghiệm phân biệt`,
        formula: `Δ = ${deltaValue} > 0 ✓`,
      });

      // Calculate x1 and x2
      const sqrtDelta = Math.sqrt(deltaValue);
      x1 = (-bVal + sqrtDelta) / (2 * aVal);
      x2 = (-bVal - sqrtDelta) / (2 * aVal);

      steps.push({
        id: stepId++,
        title: `🗡️ Bước 4: Áp dụng công thức nghiệm`,
        description: `Công thức: x = (-b ± √Δ) / (2a)`,
        formula: `x = (-${bVal} ± √${deltaValue}) / (2 × ${aVal}) = (-${bVal} ± ${sqrtDelta.toFixed(4)}) / ${2 * aVal}`,
      });

      steps.push({
        id: stepId++,
        title: `📌 Bước 5: Tính nghiệm x₁`,
        description: `Lấy dấu cộng (+):`,
        formula: `x₁ = (-${bVal} + ${sqrtDelta.toFixed(4)}) / ${2 * aVal} = ${x1.toFixed(4)}`,
      });

      steps.push({
        id: stepId++,
        title: `📌 Bước 6: Tính nghiệm x₂`,
        description: `Lấy dấu trừ (-):`,
        formula: `x₂ = (-${bVal} - ${sqrtDelta.toFixed(4)}) / ${2 * aVal} = ${x2.toFixed(4)}`,
      });

      message = `⚔️ PHƯƠNG TRÌNH CÓ HAI NGHIỆM PHÂN BIỆT ⚔️\nx₁ = ${x1.toFixed(4)}\nx₂ = ${x2.toFixed(4)}`;
    } else if (deltaValue === 0) {
      steps.push({
        id: stepId++,
        title: `⚡ Bước 3: Phân tích Δ = ${deltaValue}`,
        description: `Vì Δ = 0, phương trình có một nghiệm kép (hay hai nghiệm bằng nhau)`,
        formula: `Δ = ${deltaValue} = 0 ✓`,
      });

      x1 = -bVal / (2 * aVal);
      x2 = x1;

      steps.push({
        id: stepId++,
        title: `🗡️ Bước 4: Tính nghiệm kép`,
        description: `Công thức: x = -b / (2a)`,
        formula: `x = -${bVal} / (2 × ${aVal}) = ${x1.toFixed(4)}`,
      });

      message = `⚡ PHƯƠNG TRÌNH CÓ NGHIỆM KÉP ⚡\nx₁ = x₂ = ${x1.toFixed(4)}`;
    } else {
      steps.push({
        id: stepId++,
        title: `🌑 Bước 3: Phân tích Δ = ${deltaValue}`,
        description: `Vì Δ < 0, phương trình không có nghiệm thực (Vô nghiệm)`,
        formula: `Δ = ${deltaValue} < 0 ✓`,
      });

      steps.push({
        id: stepId++,
        title: `⚫ Bước 4: Kết luận`,
        description: `Trong tập hợp các số thực, phương trình này vô nghiệm`,
        formula: `Không tồn tại x ∈ ℝ thỏa mãn phương trình`,
      });

      message = `🌑 PHƯƠNG TRÌNH VÔ NGHIỆM 🌑\nKhông có giải pháp trong tập số thực`;
    }

    return {
      delta: deltaValue,
      x1,
      x2,
      message,
      steps,
    };
  };

  const handleSolve = () => {
    setError('');
    setShowSteps(false);

    // Validation
    if (!a.trim() || !b.trim() || !c.trim()) {
      setError('❌ Vui lòng điền đầy đủ các hệ số a, b, c');
      return;
    }

    const aVal = parseFloat(a);
    const bVal = parseFloat(b);
    const cVal = parseFloat(c);

    if (isNaN(aVal) || isNaN(bVal) || isNaN(cVal)) {
      setError('❌ Hệ số phải là số hợp lệ');
      return;
    }

    if (aVal === 0) {
      setError('❌ Hệ số a không được bằng 0 (đây không phải là phương trình bậc 2)');
      return;
    }

    try {
      const resultData = solveDelta(aVal, bVal, cVal);
      setResult(resultData);
    } catch (err) {
      setError('❌ Có lỗi xảy ra khi giải phương trình');
    }
  };

  const handleReset = () => {
    setA('');
    setB('');
    setC('');
    setResult(null);
    setShowSteps(false);
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSolve();
    }
  };

  return (
    <div className="medieval-card">
      <h1 className="medieval-title">⚔️ THẦN BÍ TOÁN HỌC ⚔️</h1>
      <p className="medieval-subtitle">~ Giải Mã Phương Trình Bậc 2 ~</p>

      <div className="input-section">
        <div className="input-group">
          <div className="input-field">
            <label className="input-label">Hệ số a</label>
            <input
              type="number"
              value={a}
              onChange={(e) => setA(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập a (a ≠ 0)"
              step="any"
            />
          </div>

          <div className="input-field">
            <label className="input-label">Hệ số b</label>
            <input
              type="number"
              value={b}
              onChange={(e) => setB(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập b"
              step="any"
            />
          </div>

          <div className="input-field">
            <label className="input-label">Hệ số c</label>
            <input
              type="number"
              value={c}
              onChange={(e) => setC(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập c"
              step="any"
            />
          </div>
        </div>

        <p style={{
          textAlign: 'center',
          fontSize: '1.1em',
          color: '#3d2817',
          fontFamily: 'Merriweather, serif',
          marginTop: '15px'
        }}>
          📜 Phương trình chuẩn: <strong>ax² + bx + c = 0</strong>
        </p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(139, 46, 46, 0.2)',
          border: '2px solid #8b2e2e',
          color: '#8b2e2e',
          padding: '15px',
          borderRadius: '3px',
          marginBottom: '20px',
          textAlign: 'center',
          fontFamily: 'Merriweather, serif',
          fontSize: '1.1em'
        }}>
          {error}
        </div>
      )}

      <button className="medieval-btn" onClick={handleSolve}>
        GIẢI MÃ PHƯƠNG TRÌNH
      </button>

      {result && (
        <div className="result-section">
          <div className="result-header">📖 Kết Quả Giải Pháp</div>

          <div className="result-banner">
            {result.message.split('\n').map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>

          <button
            className="toggle-btn"
            onClick={() => setShowSteps(!showSteps)}
          >
            {showSteps ? '▼ Ẩn Chi Tiết Bước' : '► Hiện Chi Tiết Bước'}
          </button>

          {showSteps && (
            <div style={{ marginTop: '20px' }}>
              {result.steps.map((step) => (
                <div key={step.id} className="step-container">
                  <div className="step-number">{step.title}</div>
                  <div className="step-content">{step.description}</div>
                  {step.formula && (
                    <div className="step-formula">{step.formula}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          <button className="secondary-btn" onClick={handleReset}>
            🔄 BẮT ĐẦU LẠI
          </button>
        </div>
      )}

      {!result && (
        <div className="empty-state">
          🔮 Hãy nhập các hệ số và nhấn nút "GIẢI MÃ PHƯƠNG TRÌNH" để bắt đầu...
        </div>
      )}
    </div>
  );
}
