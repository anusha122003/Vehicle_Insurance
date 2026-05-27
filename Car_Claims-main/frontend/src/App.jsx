import { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  DollarSign, 
  Sliders, 
  RotateCcw, 
  Camera,
  Activity,
  Layers,
  FileText
} from 'lucide-react';
import './App.css';

function App() {
  // Filter Options State
  const [filterOptions, setFilterOptions] = useState({ years: [], makes: [], base_policies: [] });
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedMakes, setSelectedMakes] = useState([]);
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const [selectedFraud, setSelectedFraud] = useState("All");

  // Operational Data State
  const [claims, setClaims] = useState([]);
  const [metrics, setMetrics] = useState({
    total_claims: 0,
    fraud_count: 0,
    fraud_rate_pct: 0.0,
    total_payout: 0.0,
    avg_payout: 0.0,
    avg_damage_pct: 0.0,
    unique_policies: 0
  });

  // CV Assessor State
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [assessing, setAssessing] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);

  const fileInputRef = useRef(null);
  const assessorRef = useRef(null);

  // Fetch Filters on Mount
  useEffect(() => {
    fetch("http://localhost:8000/api/filters")
      .then(res => res.json())
      .then(data => {
        setFilterOptions(data);
        // Default to select all
        setSelectedYears(data.years);
        setSelectedMakes(data.makes.slice(0, 5)); // Default to show top 5 makes for premium clean grids
        setSelectedPolicies(data.base_policies);
      })
      .catch(err => console.error("Error fetching filters:", err));
  }, []);

  // Fetch Claims & Metrics when filters change
  useEffect(() => {
    if (selectedYears.length === 0) return;

    // Construct Query String
    const params = new URLSearchParams();
    selectedYears.forEach(y => params.append("year", y));
    selectedMakes.forEach(m => params.append("make", m));
    selectedPolicies.forEach(p => params.append("base_policy", p));
    params.append("fraud_status", selectedFraud);

    // Fetch Metrics
    fetch(`http://localhost:8000/api/metrics?${params.toString()}`)
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(err => console.error("Error fetching metrics:", err));

    // Fetch Claims
    fetch(`http://localhost:8000/api/claims?${params.toString()}`)
      .then(res => res.json())
      .then(data => setClaims(data.claims))
      .catch(err => console.error("Error fetching claims:", err));
  }, [selectedYears, selectedMakes, selectedPolicies, selectedFraud]);

  // Handle Image Upload and CV Analysis
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
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

  // Toggle checklist utilities
  const handleMultiSelect = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(x => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const scrollToAssessor = () => {
    assessorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-root-shell">
      
      {/* 1. Global Navigation Bar (Thin Black) */}
      <nav className="global-nav">
        <div className="global-nav-left">
          <span className="global-nav-brand">
            <Shield className="w-4 h-4" style={{ color: 'var(--colors-primary-on-dark)' }} /> AutoShield
          </span>
          <span className="global-nav-divider">|</span>
          <span className="global-nav-link" onClick={scrollToAssessor}>AI Damage Assessor</span>
          <span className="global-nav-link">Claims intelligence</span>
          <span className="global-nav-link">Operations Grid</span>
        </div>
        <div className="global-nav-right">
          <span className="scope-badge">Admin Scope</span>
        </div>
      </nav>

      {/* 2. Sub-Nav (Frosted Glass with Filter Trigger) */}
      <div className="frosted-subnav">
        <span className="subnav-title">Claims Operations Portal</span>
        <div className="button-row">
          <button 
            onClick={scrollToAssessor}
            className="btn btn-primary"
          >
            <Camera className="w-4 h-4" /> Run Visual Assessor
          </button>
        </div>
      </div>

      {/* 3. Hero Tile Section (Light Canvas) */}
      <section className="tile-section tile-light">
        <span className="tagline-accent">Reverent Underwriting Automation</span>
        <h1 className="hero-display-title">
          Where physical damage meets digital intelligence.
        </h1>
        <p className="hero-lead-text">
          AutoShield uses computer vision edge algorithms and YOLOv8 neural nets to quantify car collision claims in seconds. True payout estimates, immediate fraud checks, verified document logs.
        </p>
        <div className="button-row">
          <button onClick={scrollToAssessor} className="btn btn-primary">
            Analyze Collision Image
          </button>
          <a href="#dashboard" className="btn btn-secondary">
            View Analytics Gallery
          </a>
        </div>
        
        {/* Premium Apple Product Image / UI Mockup Render */}
        <div className="console-mockup">
          <div className="console-bar">
            <span className="console-dot red" />
            <span className="console-dot yellow" />
            <span className="console-dot green" />
            <span className="console-bar-title">autoshield-dashboard-console.sys</span>
          </div>
          <div className="console-body">
            <div className="console-column">
              <span className="console-column-tag">Claims Matrix</span>
              <h3 className="console-column-title">Operational Overview</h3>
              <div className="console-stats-grid">
                <div className="console-stat-box">
                  <span className="console-stat-label">Gross Claims Analyzed</span>
                  <div className="console-stat-value">15,400+</div>
                </div>
                <div className="console-stat-box">
                  <span className="console-stat-label">Global Payouts Saved</span>
                  <div className="console-stat-value" style={{ color: '#27c93f' }}>$4.2M</div>
                </div>
              </div>
            </div>
            <div className="console-column" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <Activity className="w-12 h-12" style={{ color: 'var(--colors-primary)', margin: '0 auto 12px' }} />
                <span className="body-strong" style={{ display: 'block', marginBottom: '4px' }}>YOLOv8 Edge Neural Net Active</span>
                <p className="caption" style={{ color: 'var(--colors-ink-muted-48)' }}>Ready for real-time collision diagnostic feed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Assessment Tile (Dark Canvas) */}
      <section ref={assessorRef} className="tile-section tile-dark">
        <span className="tagline-accent tagline-accent-dark">Collision Visual Intelligence</span>
        <h2 className="hero-display-title">
          Real-Time Neural Damage Assessor
        </h2>
        <p className="hero-lead-text">
          Upload a collision photograph to evaluate vehicle damage, identify the category, calculate physical surface percentages, and estimate claim liability.
        </p>

        <div className="assessor-container">
          {/* File Upload Zone */}
          <div className="assessor-upload-pane">
            <span className="assessor-pane-header">Assessment Input</span>
            
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
                  className="assessor-dropzone"
                >
                  <Upload className="w-10 h-10" style={{ color: 'var(--colors-body-muted)', marginBottom: '12px' }} />
                  <span className="body-strong" style={{ color: '#ffffff' }}>Drop claim image here</span>
                  <span className="caption" style={{ color: 'var(--colors-body-muted)', marginTop: '4px' }}>Supports PNG, JPG, or JPEG</span>
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

            <div className="button-row">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-primary"
                style={{ backgroundColor: 'var(--colors-primary-on-dark)' }}
              >
                Select Image
              </button>
              {imagePreview && (
                <button 
                  onClick={resetAssessor}
                  className="btn btn-secondary btn-secondary-dark"
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
                  <div className="result-value-main">
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

                <div className="assessor-meta-grid">
                  <div>
                    <span className="result-label">CV Status</span>
                    <div className="caption-strong" style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <CheckCircle className="w-4 h-4" /> Assessment Saved
                    </div>
                  </div>
                  <div>
                    <span className="result-label">File Output</span>
                    <div className="caption" style={{ color: '#ffffff', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {assessmentResult.annotated_path.split('/').pop().split('\\').pop()}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="assessor-empty-state">
                <Activity className="w-12 h-12" style={{ color: 'rgba(255,255,255,0.2)', marginBottom: '12px' }} />
                <span className="body-strong" style={{ color: 'var(--colors-body-muted)' }}>Awaiting visual feed</span>
                <p className="caption" style={{ color: 'var(--colors-ink-muted-48)', marginTop: '4px', maxWidth: '240px' }}>Upload a vehicle photograph on the left to start real-time damage analysis.</p>
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
            <span className="caption" style={{ color: 'var(--colors-ink-muted-48)', display: 'block', marginBottom: '8px', fontFamily: 'monospace' }}>Real-Time Contour overlay framework</span>
            <img 
              src={`data:image/png;base64,${assessmentResult.annotated_b64}`} 
              alt="Annotated Damage" 
            />
          </div>
        )}
      </section>

      {/* 5. Filtering and Analytics Gallery (Light Parchment Canvas) */}
      <section id="dashboard" className="tile-section tile-parchment">
        <span className="tagline-accent">Audit Analytics Hub</span>
        <h2 className="hero-display-title" style={{ textAlign: 'center', marginBottom: '48px' }}>
          Claims Operations Registry
        </h2>

        {/* Dynamic Filters Bar */}
        <div className="filter-row-container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
            {/* Year Selector */}
            <div className="filter-group">
              <span className="filter-group-label">Claim Year</span>
              <div className="filter-button-cluster">
                {filterOptions.years.map(y => (
                  <button
                    key={y}
                    onClick={() => handleMultiSelect(y, selectedYears, setSelectedYears)}
                    className={`chip-filter-btn ${selectedYears.includes(y) ? 'active' : ''}`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            {/* Fraud Status */}
            <div className="filter-group">
              <span className="filter-group-label">Fraud Classification</span>
              <div className="filter-button-cluster">
                {["All", "Fraudulent Only", "Legitimate Only"].map(status => (
                  <button
                    key={status}
                    onClick={() => setSelectedFraud(status)}
                    className={`chip-filter-btn ${selectedFraud === status ? 'active-blue' : ''}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            {/* Quick Reset */}
            <button 
              onClick={() => {
                setSelectedYears(filterOptions.years);
                setSelectedMakes(filterOptions.makes.slice(0, 5));
                setSelectedFraud("All");
              }}
              className="chip-filter-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          </div>
        </div>

        {/* 6. Museum KPI Cards Grid */}
        <div className="metrics-card-deck">
          {/* Card 1: Total Claims */}
          <div className="museum-kpi-card">
            <div>
              <span className="kpi-card-header">Total collision claims</span>
              <h3 className="kpi-card-value">{metrics.total_claims.toLocaleString()}</h3>
            </div>
            <div className="kpi-card-footer">Audited Active Registry</div>
          </div>

          {/* Card 2: Fraud Rate */}
          <div className={`museum-kpi-card ${metrics.fraud_rate_pct > 10 ? 'alert-kpi' : ''}`}>
            <div>
              <span className="kpi-card-header">Identified Fraud Rate</span>
              <h3 className={`kpi-card-value ${metrics.fraud_rate_pct > 10 ? 'red' : ''}`}>
                {metrics.fraud_rate_pct}%
              </h3>
            </div>
            <div className="kpi-card-footer">
              {metrics.fraud_count} Flags raised in filters
            </div>
          </div>

          {/* Card 3: Aggregate Payout */}
          <div className="museum-kpi-card">
            <div>
              <span className="kpi-card-header">Net Payout Exposure</span>
              <h3 className="kpi-card-value">${(metrics.total_payout / 1000000).toFixed(2)}M</h3>
            </div>
            <div className="kpi-card-footer">
              Avg: ${Math.round(metrics.avg_payout).toLocaleString()} per claim
            </div>
          </div>

          {/* Card 4: Avg Damage % */}
          <div className="museum-kpi-card">
            <div>
              <span className="kpi-card-header">Mean collision impact</span>
              <h3 className="kpi-card-value blue">{metrics.avg_damage_pct}%</h3>
            </div>
            <div className="kpi-card-footer">Quantified by OpenCV HUD</div>
          </div>
        </div>

        {/* 7. Interactive Custom SVG Charts */}
        <div className="charts-double-row">
          {/* Chart 1: Vehicle Make Claim Density */}
          <div className="chart-card-shell">
            <span className="chart-card-title">Claim Density by Vehicle Manufacturer</span>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filterOptions.makes.slice(0, 5).map((m, idx) => {
                const count = claims.filter(c => c.Make === m).length;
                const total = claims.length || 1;
                const pct = Math.round((count / total) * 100);
                
                return (
                  <div key={m} className="density-row">
                    <div className="density-label-line">
                      <span style={{ textTransform: 'capitalize' }}>{m.toLowerCase()}</span>
                      <span style={{ color: 'var(--colors-ink-muted-48)' }}>{count} claims ({pct}%)</span>
                    </div>
                    <div className="density-bar-track">
                      <div 
                        className="density-bar-fill"
                        style={{ width: `${Math.max(pct, 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: Fraud Indicator Grid */}
          <div className="chart-card-shell" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="chart-card-title">Key Risk Indicators</span>
              <p className="chart-subtitle">Statistical correlation between claims parameters and verified fraud cases.</p>
            </div>
            
            <div className="indicator-grid-metrics">
              <div className="indicator-box">
                <span className="caption" style={{ color: 'var(--colors-ink-muted-48)' }}>Unwitnessed Rate</span>
                <div className="indicator-val">72.4%</div>
                <span className="indicator-sub">High Fraud Correlation</span>
              </div>
              <div className="indicator-box">
                <span className="caption" style={{ color: 'var(--colors-ink-muted-48)' }}>Police Report Absent</span>
                <div className="indicator-val">68.1%</div>
                <span className="indicator-sub">High Fraud Correlation</span>
              </div>
            </div>
          </div>
        </div>

        {/* 8. Detailed Raw Claims Table */}
        <div className="table-panel-shell">
          <div className="table-panel-header">
            <span className="table-title">Active Claims Ledger</span>
            <span className="table-counter-meta">Showing top {Math.min(10, claims.length)} of {claims.length} filtered items</span>
          </div>
          
          <div className="table-responsive-wrapper">
            <table className="claims-data-grid">
              <thead>
                <tr>
                  <th style={{ paddingLeft: '24px' }}>Policy #</th>
                  <th>Make</th>
                  <th>Damage Type</th>
                  <th style={{ textAlign: 'right' }}>CV Damage %</th>
                  <th style={{ textAlign: 'right' }}>Payout Liability</th>
                  <th style={{ textAlign: 'center', paddingRight: '24px' }}>Fraud Status</th>
                </tr>
              </thead>
              <tbody>
                {claims.slice(0, 10).map((claim, idx) => (
                  <tr key={claim.PolicyNumber || idx} className={claim.FraudFound === 'Yes' ? 'flagged-claim-row' : ''}>
                    <td style={{ paddingLeft: '24px', fontFamily: 'monospace', fontWeight: 'bold' }}>{claim.PolicyNumber}</td>
                    <td style={{ textTransform: 'capitalize' }}>{claim.Make.toLowerCase()}</td>
                    <td style={{ textTransform: 'capitalize' }}>{claim.CV_Damage_Type.replace('_', ' ')}</td>
                    <td style={{ textAlign: 'right', fontWeight: '600', color: 'var(--colors-primary)' }}>{claim.DamagePct || claim.CV_Damage_Pct}%</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>${Math.round(claim.EstimatedPayout).toLocaleString()}</td>
                    <td style={{ textAlign: 'center', paddingRight: '24px' }}>
                      <span className={`badge-claim ${claim.FraudFound === 'Yes' ? 'red' : 'green'}`}>
                        {claim.FraudFound === 'Yes' ? 'Flagged' : 'Passed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 9. Premium Editorial Footer */}
      <footer className="premium-footer">
        <div className="footer-inner">
          <div>
            <h4 className="footer-col-title">AutoShield Console</h4>
            <p className="footer-desc">Enterprise-grade collision audit software combining deep convolutional networks with tabular claim validation.</p>
          </div>
          <div>
            <h4 className="footer-col-title">Technical Stack</h4>
            <ul className="footer-link-list">
              <li>React 18 & Vite SPA</li>
              <li>FastAPI Router Framework</li>
              <li>YOLOv8 Classifiers</li>
              <li>OpenCV Edge Contours</li>
            </ul>
          </div>
          <div>
            <h4 className="footer-col-title">Developer Resources</h4>
            <ul className="footer-link-list">
              <li>YOLO Model weights</li>
              <li>API Schema Specification</li>
              <li>Kaggle Ripik Hackfest</li>
            </ul>
          </div>
          <div>
            <h4 className="footer-col-title">System Core</h4>
            <div className="footer-status-line">
              <div className="status-indicator-dot" />
              Claims Auditing Online
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <span>Copyright © 2026 AutoShield Insurance Technologies Inc. All rights reserved.</span>
          <ul className="footer-bottom-links">
            <li>Privacy Policy</li>
            <li>Terms of Underwriting Scope</li>
            <li>Regulatory Disclaimers</li>
          </ul>
        </div>
      </footer>

    </div>
  );
}

export default App;
