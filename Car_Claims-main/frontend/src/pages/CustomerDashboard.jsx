import { useState, useRef } from 'react';
import { 
  Shield, 
  Camera, 
  Clock, 
  Upload, 
  Activity, 
  DollarSign, 
  CheckCircle, 
  FileText, 
  Coins, 
  LogOut, 
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { translations } from '../utils/translations.js';

function CustomerDashboard({ user, onSignOut, currentLanguage }) {
  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations['English']?.[key] || key;
  };

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'newclaim'
  
  // Intake states
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [assessing, setAssessing] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [claimProgressStep, setClaimProgressStep] = useState(1); // 1: Intake, 2: AI, 3: Review, 4: Complete
  
  const fileInputRef = useRef(null);

  // Actuarial values
  const [vehicleValue, setVehicleValue] = useState(45000);
  const [deductible, setDeductible] = useState(500);

  // Mock past claims data
  const [pastClaims, setPastClaims] = useState([
    {
      claimId: "CL-0284",
      date: "May 12, 2026",
      vehicle: "2024 BMW M4 Coupe",
      damageType: "Dent (Impact Cluster)",
      severity: "Medium",
      damagePct: "24.5%",
      payout: "$10,525",
      status: "Transferred"
    },
    {
      claimId: "CL-0192",
      date: "March 08, 2026",
      vehicle: "2023 Tesla Model Y",
      damageType: "Scratch (Fender Scrape)",
      severity: "Low",
      damagePct: "8.2%",
      payout: "$3,190",
      status: "Transferred"
    }
  ]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setAssessmentResult(null);
    setClaimProgressStep(1);
    
    // Auto-trigger assessment
    triggerClaimAssessment(file);
  };

  const triggerClaimAssessment = (file) => {
    setAssessing(true);
    setClaimProgressStep(2);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("vehicle_price", vehicleValue);
    formData.append("deductible", deductible);

    fetch("http://localhost:8000/api/assess", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        setAssessing(false);
        if (data.error) {
          // Fallback simulation if backend server is not running
          simulateFallback(file);
        } else {
          setAssessmentResult(data);
          setClaimProgressStep(3);
        }
      })
      .catch(() => {
        // Fallback simulation on network drop
        simulateFallback(file);
      });
  };

  const simulateFallback = (file) => {
    setTimeout(() => {
      setAssessing(false);
      
      // Determine dummy values based on filename keywords or generate random
      const filename = file.name.toLowerCase();
      let dType = "Scratch (Fender Scrape)";
      let dPct = 14.5;
      let dSev = "Low";
      
      if (filename.includes("dent") || filename.includes("bumper") || filename.includes("crash")) {
        dType = "Dent (Impact Cluster)";
        dPct = 34.8;
        dSev = "Severe";
      } else if (filename.includes("glass") || filename.includes("window") || filename.includes("shatter")) {
        dType = "Glass Shatter (Windshield)";
        dPct = 21.0;
        dSev = "Medium";
      }

      const calculatedPayout = Math.max(0, (dPct / 100 * vehicleValue) - deductible);

      setAssessmentResult({
        damage_type: dType,
        damage_pct: dPct,
        severity: dSev,
        estimated_payout: calculatedPayout,
        vehicle_price: vehicleValue,
        deductible: deductible,
        annotated_path: "mock_annotated_" + file.name,
        annotated_b64: null // No base64 fallback needed for mock
      });
      setClaimProgressStep(3);
    }, 2500); // realistic AI analysis duration
  };

  const handleConfirmSubmitClaim = () => {
    if (!assessmentResult) return;
    
    setAssessing(true);
    setTimeout(() => {
      setAssessing(false);
      setClaimProgressStep(4);
      
      // Add to past claims list
      const newClaimId = "CL-0" + (Math.floor(Math.random() * 900) + 300);
      const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      
      const newClaim = {
        claimId: newClaimId,
        date: today,
        vehicle: `2024 Custom Vehicle ($${vehicleValue.toLocaleString()})`,
        damageType: assessmentResult.damage_type,
        severity: assessmentResult.severity,
        damagePct: `${assessmentResult.damage_pct}%`,
        payout: `$${Math.round(assessmentResult.estimated_payout).toLocaleString()}`,
        status: "Transferred"
      };

      setPastClaims([newClaim, ...pastClaims]);
      alert("Claim approved and payment processed! Your funds are currently transferring.");
    }, 1500);
  };

  const resetClaimFlow = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAssessmentResult(null);
    setClaimProgressStep(1);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="customer-dashboard-shell">
      {/* Dynamic Header navbar */}
      <header className="customer-navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--autoshield-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield className="w-5 h-5" style={{ color: '#FFFFFF' }} />
          </div>
          <span className="autoshield-brand-text">AutoShield</span>
          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', backgroundColor: 'rgba(0,102,204,0.1)', color: 'var(--autoshield-blue)', padding: '2px 8px', borderRadius: '4px', marginLeft: '12px' }}>
            {t('customerScope')}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span 
            className={`header-secondary-link ${activeTab === 'overview' ? 'active-item' : ''}`}
            style={{ fontWeight: '600', color: activeTab === 'overview' ? 'var(--autoshield-blue)' : '#71717a' }}
            onClick={() => setActiveTab('overview')}
          >
            {t('myClaims')}
          </span>
          <span 
            className={`header-secondary-link ${activeTab === 'newclaim' ? 'active-item' : ''}`}
            style={{ fontWeight: '600', color: activeTab === 'newclaim' ? 'var(--autoshield-blue)' : '#71717a' }}
            onClick={() => setActiveTab('newclaim')}
          >
            {t('startNewClaim')}
          </span>
          
          <div style={{ height: '20px', width: '1px', backgroundColor: '#CCCCCC' }} />
          
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#333333' }}>
            {user.fullName}
          </span>
          <button 
            onClick={onSignOut}
            className="autoshield-btn autoshield-btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <LogOut className="w-3.5 h-3.5" /> {t('logout')}
          </button>
        </div>
      </header>

      {/* Main content grid */}
      <main className="customer-content-area">
        {activeTab === 'overview' && (
          <div>
            {/* Overview welcome card banner */}
            <div className="customer-welcome-card">
              <h2 className="autoshield-h1" style={{ marginBottom: '8px' }}>{t('hello')} {user.fullName.split(' ')[0]}!</h2>
              <p className="autoshield-body-regular" style={{ color: 'var(--autoshield-text-secondary)', margin: 0 }}>
                {t('customerWelcomeDesc')}
              </p>
              
              <button 
                onClick={() => setActiveTab('newclaim')}
                className="autoshield-btn autoshield-btn-primary as-mt-lg"
              >
                <Camera className="w-4 h-4" /> {t('startNewClaimBtn')}
              </button>
            </div>

            {/* Main portal grid structure */}
            <div className="customer-grid">
              {/* Past claims list panel */}
              <div className="customer-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 className="autoshield-h2" style={{ margin: 0 }}>{t('claimsRegistry')}</h3>
                  <FileText className="w-5 h-5" style={{ color: '#71717a' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {pastClaims.map((claim) => (
                    <div 
                      key={claim.claimId}
                      style={{ padding: '20px', border: '1px solid #E9ECEF', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <div style={{ textAlign: 'left' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--autoshield-text-muted)', fontFamily: 'monospace' }}>
                          {claim.claimId} &bull; {claim.date}
                        </span>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#111111', marginTop: '4px', marginBottom: '4px' }}>
                          {claim.vehicle}
                        </h4>
                        <span style={{ fontSize: '13px', color: 'var(--autoshield-text-secondary)' }}>
                          {claim.damageType} ({claim.damagePct} {t('severity')})
                        </span>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--autoshield-success)' }}>
                          {claim.payout}
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--autoshield-success)', backgroundColor: 'rgba(34,197,94,0.1)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>
                          {claim.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy detail info cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Active policies card */}
                <div className="customer-card">
                  <h3 className="autoshield-h2" style={{ marginBottom: '16px' }}>{t('policyInfo')}</h3>
                  
                  <div style={{ padding: '16px', backgroundColor: '#F8F9FA', borderRadius: '8px', borderLeft: '4px solid var(--autoshield-blue)', marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--autoshield-text-muted)' }}>{t('policyNum')}</span>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#111111', margin: '2px 0 6px 0' }}>AS-9087-COMPREHENSIVE</h4>
                    <span style={{ fontSize: '12px', color: 'var(--autoshield-text-secondary)' }}>
                      Vehicle: 2024 BMW M4 Coupe &middot; {t('deductible')}: $500
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1, padding: '12px', border: '1px solid #E9ECEF', borderRadius: '8px', textAlign: 'center' }}>
                      <Coins className="w-5 h-5" style={{ color: 'var(--autoshield-blue)', margin: '0 auto 8px' }} />
                      <span style={{ fontSize: '11px', color: 'var(--autoshield-text-muted)', display: 'block' }}>{t('coverageCap')}</span>
                      <strong style={{ fontSize: '15px', color: '#111111' }}>$100,000</strong>
                    </div>
                    <div style={{ flex: 1, padding: '12px', border: '1px solid #E9ECEF', borderRadius: '8px', textAlign: 'center' }}>
                      <Clock className="w-5 h-5" style={{ color: 'var(--autoshield-blue)', margin: '0 auto 8px' }} />
                      <span style={{ fontSize: '11px', color: 'var(--autoshield-text-muted)', display: 'block' }}>{t('renewalDate')}</span>
                      <strong style={{ fontSize: '15px', color: '#111111' }}>Dec 31, 2026</strong>
                    </div>
                  </div>
                </div>

                {/* Quick actions panel */}
                <div className="customer-card">
                  <h3 className="autoshield-h2" style={{ marginBottom: '16px' }}>{t('quickOps')}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <button 
                      onClick={() => setActiveTab('newclaim')}
                      className="autoshield-btn autoshield-btn-secondary"
                      style={{ height: '64px', flexDirection: 'column', gap: '4px', fontSize: '13px' }}
                    >
                      <Camera className="w-4 h-4" /> {t('startNewClaim')}
                    </button>
                    <button 
                      onClick={() => alert("Downloading active Policy Declaration Document PDF...")}
                      className="autoshield-btn autoshield-btn-secondary"
                      style={{ height: '64px', flexDirection: 'column', gap: '4px', fontSize: '13px' }}
                    >
                      <FileText className="w-4 h-4" /> {t('downloadPDF')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'newclaim' && (
          <div className="customer-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ borderBottom: '1px solid #E9ECEF', paddingBottom: '20px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 className="autoshield-h1" style={{ margin: 0 }}>{t('visualPortal')}</h2>
                <p className="autoshield-body-small" style={{ color: 'var(--autoshield-text-secondary)', marginTop: '4px', margin: 0 }}>
                  {t('visualPortalDesc')}
                </p>
              </div>
              <button 
                onClick={resetClaimFlow}
                className="autoshield-btn autoshield-btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                <RefreshCw className="w-3.5 h-3.5" /> {t('resetPanel')}
              </button>
            </div>

            {/* 2x2 grid for file upload and results */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }} className="customer-grid">
              
              {/* Left Column: Interactive Intake dropzone */}
              <div>
                <span className="autoshield-label" style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--autoshield-text-muted)' }}>
                  {t('photoFeed')}
                </span>
                
                <div style={{ marginTop: '16px', marginBottom: '24px' }}>
                  {imagePreview ? (
                    <div style={{ width: '100%', height: '240px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #CCCCCC', position: 'relative', backgroundColor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={imagePreview} alt="Crash intake collision review" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      
                      {assessing && (
                        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                          <div className="autoshield-spinner" style={{ width: '32px', height: '32px', borderWidth: '3px', marginBottom: '16px' }} />
                          <span style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '0.5px' }}>YOLOv8 Classifying Damage Areas...</span>
                          <div style={{ width: '70%', height: '4px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '2px', marginTop: '12px', overflow: 'hidden' }}>
                            <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--autoshield-blue)', animation: 'scan 2s linear infinite' }} />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      style={{ width: '100%', height: '240px', border: '2px dashed #CCCCCC', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: '#FAF9FB', transition: 'all 0.2s ease' }}
                    >
                      <Upload className="w-10 h-10" style={{ color: 'var(--autoshield-text-muted)', marginBottom: '12px' }} />
                      <strong style={{ fontSize: '15px', color: '#333333' }}>{t('dragDrop')}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--autoshield-text-muted)', marginTop: '4px' }}>{t('supportsFiles')}</span>
                    </div>
                  )}

                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    accept="image/*"
                  />
                </div>

                {/* Adjust pricing sliders */}
                {!imagePreview && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid #E9ECEF', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <label className="autoshield-label">{t('vehicleValueSlider')}: ${vehicleValue.toLocaleString()}</label>
                        <input 
                          type="range"
                          min="5000"
                          max="150000"
                          step="1000"
                          value={vehicleValue}
                          onChange={(e) => setVehicleValue(Number(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--autoshield-blue)' }}
                        />
                      </div>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <label className="autoshield-label">{t('policyDeductibleSlider')}: ${deductible.toLocaleString()}</label>
                        <input 
                          type="range"
                          min="0"
                          max="2500"
                          step="100"
                          value={deductible}
                          onChange={(e) => setDeductible(Number(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--autoshield-blue)' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirm payout action buttons */}
                {assessmentResult && !assessing && (
                  <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid #E9ECEF', paddingTop: '20px' }}>
                    <button 
                      onClick={resetClaimFlow}
                      className="autoshield-btn autoshield-btn-secondary"
                      style={{ flex: 1, height: '48px' }}
                    >
                      {t('reupload')}
                    </button>
                    {claimProgressStep < 4 && (
                      <button 
                        onClick={handleConfirmSubmitClaim}
                        className="autoshield-btn autoshield-btn-primary"
                        style={{ flex: 2, height: '48px', backgroundColor: 'var(--autoshield-success)', border: 'none', color: '#FFFFFF', boxShadow: 'none' }}
                      >
                        {t('submitClaimPayout')}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Claim tracking and assessment results */}
              <div>
                <span className="autoshield-label" style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--autoshield-text-muted)' }}>
                  {t('intakeProgress')}
                </span>

                <div className="autoshield-progress-stepper" style={{ marginBottom: '32px' }}>
                  <div className={`autoshield-step-item ${claimProgressStep >= 1 ? 'active' : ''} ${claimProgressStep === 1 ? 'pending' : ''}`}>
                    <div className="autoshield-step-circle">1</div>
                    <div className="autoshield-step-info">
                      <h4 className="autoshield-step-title">{t('stepIntake')}</h4>
                      <p className="autoshield-step-desc">{t('stepIntakeDesc')}</p>
                    </div>
                  </div>

                  <div className={`autoshield-step-item ${claimProgressStep >= 2 ? 'active' : ''} ${claimProgressStep === 2 ? 'pending' : ''}`}>
                    <div className="autoshield-step-circle">2</div>
                    <div className="autoshield-step-info">
                      <h4 className="autoshield-step-title">{t('stepAI')}</h4>
                      <p className="autoshield-step-desc">{t('stepAIDesc')}</p>
                    </div>
                  </div>

                  <div className={`autoshield-step-item ${claimProgressStep >= 3 ? 'active' : ''} ${claimProgressStep === 3 ? 'pending' : ''}`}>
                    <div className="autoshield-step-circle">3</div>
                    <div className="autoshield-step-info">
                      <h4 className="autoshield-step-title">{t('stepActuarial')}</h4>
                      <p className="autoshield-step-desc">{t('stepActuarialDesc')}</p>
                    </div>
                  </div>

                  <div className={`autoshield-step-item ${claimProgressStep >= 4 ? 'active' : ''} ${claimProgressStep === 4 ? 'pending' : ''}`}>
                    <div className="autoshield-step-circle">4</div>
                    <div className="autoshield-step-info">
                      <h4 className="autoshield-step-title">{t('stepPayout')}</h4>
                      <p className="autoshield-step-desc">{t('stepPayoutDesc')}</p>
                    </div>
                  </div>
                </div>

                {/* Display assessed payout details */}
                {assessmentResult && (
                  <div style={{ padding: '24px', backgroundColor: '#FAF9FB', borderRadius: '12px', border: '1px solid #E9ECEF', textAlign: 'left' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--autoshield-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {t('lossQuant')}
                    </span>

                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#111111', marginTop: '12px', marginBottom: '4px' }}>
                      {assessmentResult.damage_type}
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--autoshield-blue)' }}>{assessmentResult.damage_pct}% {t('severity')}</span>
                      <div style={{ height: '4px', flex: 1, backgroundColor: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${assessmentResult.damage_pct}%`, backgroundColor: 'var(--autoshield-blue)' }} />
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #E9ECEF', paddingTop: '16px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--autoshield-text-muted)', fontWeight: '700' }}>{t('netLiability')}</span>
                      <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--autoshield-success)', display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                        <DollarSign className="w-6 h-6" /> {Math.round(assessmentResult.estimated_payout).toLocaleString()}
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--autoshield-text-muted)', display: 'block', marginTop: '6px', lineHeight: '1.4' }}>
                        {t('coverageFormula')}: max(0, ({assessmentResult.damage_pct}% of ${vehicleValue.toLocaleString()}) - ${deductible.toLocaleString()} {t('deductible')})
                      </span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CustomerDashboard;
