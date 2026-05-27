import { useState, useRef } from 'react';
import { 
  Upload, 
  CheckCircle, 
  DollarSign, 
  Activity, 
  Camera 
} from 'lucide-react';

function Assessor() {
  // Localized CV Assessor State
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [assessing, setAssessing] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Dynamic Actuarial Inputs for AI Assessor
  const [assessorPrice, setAssessorPrice] = useState(25000);
  const [assessorDeductible, setAssessorDeductible] = useState(500);

  const fileInputRef = useRef(null);

  // Handle Drag Over
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle Drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  // Handle File Select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file) => {
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setAssessmentResult(null);
    
    // Auto-trigger upload for smooth Apple experience
    triggerAssessment(file);
  };

  const triggerAssessment = (file) => {
    setAssessing(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("vehicle_price", assessorPrice);
    formData.append("deductible", assessorDeductible);

    fetch("http://localhost:8000/api/assess", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        setAssessing(false);
        if (data.error) {
          alert(`Analysis Error: ${data.error}`);
        } else {
          setAssessmentResult(data);
        }
      })
      .catch(err => {
        setAssessing(false);
        console.error("Error uploading image:", err);
      });
  };

  const resetAssessor = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAssessmentResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="page-fade-in tile-section tile-dark" style={{ minHeight: 'calc(100vh - 96px)', paddingTop: '60px', paddingBottom: '80px' }}>
      <div className="assessor-page-header-wrap" style={{ maxWidth: '1100px', width: '100%', textAlign: 'center', marginBottom: '16px' }}>
        <span className="tagline-accent tagline-accent-dark">Collision Visual Intelligence</span>
        <h2 className="hero-display-title hero-display-title-dark" style={{ fontSize: '42px', textAlign: 'center', marginBottom: '16px' }}>
          Real-Time Neural Damage Assessor
        </h2>
        <p className="hero-lead-text" style={{ fontSize: '18px', textAlign: 'center', color: 'var(--colors-body-muted)', margin: '0 auto 40px', maxWidth: '800px' }}>
          Upload a collision photograph to evaluate vehicle damage, identify the category, calculate physical surface percentages, and estimate claim liability.
        </p>
      </div>

      <div className="assessor-container">
        {/* File Upload Zone */}
        <div 
          className="assessor-upload-pane"
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <span className="assessor-pane-header">Claim Assessment Control</span>
          
          <div className="upload-core-container">
            {imagePreview ? (
              <div className="assessor-preview">
                <img src={imagePreview} alt="Preview" />
                {assessing && (
                  <div className="assessor-spinner-overlay">
                    <div className="spinner" />
                  </div>
                )}
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`assessor-dropzone ${dragActive ? 'drag-active' : ''}`}
                style={dragActive ? { borderColor: 'var(--colors-primary-on-dark)', backgroundColor: 'rgba(255, 255, 255, 0.05)' } : {}}
              >
                <Upload className="w-10 h-10" style={{ color: 'var(--colors-body-muted)', marginBottom: '12px' }} />
                <span className="body-strong" style={{ color: '#ffffff', fontWeight: '600' }}>
                  {dragActive ? 'Drop image here' : 'Drop claim image here or click to select'}
                </span>
                <span className="caption" style={{ color: 'var(--colors-body-muted)', marginTop: '4px', fontSize: '12px' }}>Supports PNG, JPG, or JPEG</span>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              className="hidden" 
              style={{ display: 'none' }}
              accept="image/*"
            />
          </div>

          {/* Dynamic Claims Actuarial Parameters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '8px', width: '100%', textAlign: 'left' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="caption" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Vehicle Value: ${assessorPrice.toLocaleString()}
                  </label>
                </div>
                <input 
                  type="range"
                  min="5000"
                  max="150000"
                  step="1000"
                  value={assessorPrice}
                  onChange={(e) => setAssessorPrice(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--colors-primary-on-dark)', marginBottom: '10px' }}
                />
                <input 
                  type="number" 
                  value={assessorPrice} 
                  onChange={(e) => setAssessorPrice(Number(e.target.value))}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#ffffff', padding: '10px 14px', borderRadius: '8px', outline: 'none', fontSize: '14px', fontWeight: '500' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="caption" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Policy Deductible: ${assessorDeductible.toLocaleString()}
                  </label>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={assessorDeductible}
                  onChange={(e) => setAssessorDeductible(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--colors-primary-on-dark)', marginBottom: '10px' }}
                />
                <input 
                  type="number" 
                  value={assessorDeductible} 
                  onChange={(e) => setAssessorDeductible(Number(e.target.value))}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#ffffff', padding: '10px 14px', borderRadius: '8px', outline: 'none', fontSize: '14px', fontWeight: '500' }}
                />
              </div>
            </div>
          </div>

          <div className="button-row" style={{ marginTop: '28px', width: '100%' }}>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-primary"
              style={{ backgroundColor: 'var(--colors-primary-on-dark)', flex: 1, justifyContent: 'center' }}
            >
              Select Image
            </button>
            {selectedImage && (
              <button 
                onClick={() => triggerAssessment(selectedImage)}
                className="btn btn-primary"
                style={{ backgroundColor: '#10b981', color: '#ffffff', flex: 1, justifyContent: 'center' }}
              >
                Recalculate Payout
              </button>
            )}
            {imagePreview && (
              <button 
                onClick={resetAssessor}
                className="btn btn-secondary btn-secondary-dark"
                style={{ padding: '12px 20px' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* AI Result HUD Zone */}
        <div className="assessor-results-pane">
          <div className="assessor-header-row">
            <span className="assessor-pane-header">AI HUD Diagnostics</span>
            {assessmentResult && (
              <span className={`severity-pill ${
                assessmentResult.severity === 'Total Loss' || assessmentResult.severity === 'Severe'
                  ? 'red' 
                  : 'green'
              }`}>
                {assessmentResult.severity}
              </span>
            )}
          </div>

          {assessmentResult ? (
            <div className="results-details">
              <div>
                <span className="result-label">Identified Damage Class</span>
                <div className="result-value-main" style={{ textTransform: 'capitalize' }}>
                  {assessmentResult.damage_type.replace('_', ' ')}
                </div>
              </div>

              <div>
                <span className="result-label">Geometric Damage Area</span>
                <div className="result-percentage-row">
                  <div className="result-pct-text">{assessmentResult.damage_pct}%</div>
                  <div className="progress-track">
                    <div 
                      className={`progress-fill ${
                        assessmentResult.damage_pct > 50 ? 'red' : assessmentResult.damage_pct > 25 ? 'orange' : 'green'
                      }`}
                      style={{ width: `${assessmentResult.damage_pct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
                <span className="result-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <DollarSign className="w-4 h-4" style={{ color: '#10b981' }} /> Estimated Payout Liability
                </span>
                <div className="result-value-main" style={{ color: '#10b981', fontSize: '2.2rem', fontWeight: '700', marginTop: '4px' }}>
                  ${assessmentResult.estimated_payout !== undefined ? Math.round(assessmentResult.estimated_payout).toLocaleString() : '0'}
                </div>
                <span className="caption" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '6px', display: 'block', lineHeight: '1.4' }}>
                  Formula: max(0, ({assessmentResult.damage_pct}% &times; ${Math.round(assessmentResult.vehicle_price || assessorPrice).toLocaleString()}) - ${assessmentResult.deductible || assessorDeductible})
                </span>
              </div>

              <div className="assessor-meta-grid">
                <div>
                  <span className="result-label">CV Status</span>
                  <div className="caption-strong" style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '13px', fontWeight: '600' }}>
                    <CheckCircle className="w-4 h-4" /> Assessment Saved
                  </div>
                </div>
                <div>
                  <span className="result-label">File Output</span>
                  <div className="caption" style={{ color: '#ffffff', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px' }}>
                    {assessmentResult.annotated_path.split('/').pop().split('\\').pop()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="assessor-empty-state">
              <Activity className="w-12 h-12" style={{ color: 'rgba(255,255,255,0.15)', marginBottom: '16px' }} />
              <span className="body-strong" style={{ color: 'var(--colors-body-muted)', fontWeight: '600' }}>Awaiting visual feed</span>
              <p className="caption" style={{ color: 'rgba(255, 255, 255, 0.4)', marginTop: '6px', maxWidth: '280px', fontSize: '13px', lineHeight: '1.4' }}>
                Upload a vehicle photograph on the left to start real-time damage analysis. You can also drag and drop your photo directly.
              </p>
            </div>
          )}

          <div className="assessor-footer-meta">
            <span>Model: YOLOv8n-cls</span>
            <span>Backend Server: 127.0.0.1:8000</span>
          </div>
        </div>
      </div>

      {assessmentResult && assessmentResult.annotated_b64 && (
        <div className="contour-overlay-box">
          <span className="caption" style={{ color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '12px', fontFamily: 'monospace', fontSize: '12px' }}>Real-Time OpenCV Contour overlay framework</span>
          <img 
            src={`data:image/png;base64,${assessmentResult.annotated_b64}`} 
            alt="Annotated Damage HUD" 
          />
        </div>
      )}
    </div>
  );
}

export default Assessor;
