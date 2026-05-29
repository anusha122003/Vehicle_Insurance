import { useState } from 'react';
import { 
  Wrench, 
  MapPin, 
  Camera, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Wifi, 
  LogOut, 
  RefreshCw,
  Edit3
} from 'lucide-react';
import { translations } from '../utils/translations.js';

function TechnicianDashboard({ user, onSignOut, currentLanguage }) {
  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations['English']?.[key] || key;
  };

  // Field claims job queue
  const [jobs, setJobs] = useState([
    {
      id: "JOB-4021",
      vehicle: "2023 Porsche 911 GT3",
      owner: "Richard Hendriks",
      address: "1482 Sand Hill Road, Menlo Park, CA",
      policy: "AS-COMP-4212",
      severity: "High",
      aiDamagePct: 42.4,
      aiEstimatedPayout: 46200,
      notes: "Heavy front hood dent, suspected structural carbon damage.",
      status: "pending",
      images: null,
      verificationNotes: ""
    },
    {
      id: "JOB-3908",
      vehicle: "2024 Mercedes G63 AMG",
      owner: "Erlich Bachman",
      address: "5230 Silicon Valley Blvd, Palo Alto, CA",
      policy: "AS-COMP-9011",
      severity: "Medium",
      aiDamagePct: 22.8,
      aiEstimatedPayout: 28400,
      notes: "Deep scratches on rear tail gate panel door.",
      status: "pending",
      images: null,
      verificationNotes: ""
    },
    {
      id: "JOB-3841",
      vehicle: "2022 Audi R8 V10 Performance",
      owner: "Laurie Bream",
      address: "900 Sand Hill Rd, Menlo Park, CA",
      policy: "AS-COMP-1920",
      severity: "Low",
      aiDamagePct: 9.5,
      aiEstimatedPayout: 12500,
      notes: "Front wind-shield glass shatter cluster.",
      status: "completed",
      images: "mock_image.jpg",
      verificationNotes: "AI assessment matches perfectly. Shatter limited to primary safety laminate glass layers. Structural safety holds."
    }
  ]);

  const [activeJobId, setActiveJobId] = useState("JOB-4021");
  const [fieldImage, setFieldImage] = useState(null);
  const [fieldImagePreview, setFieldImagePreview] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  
  // Edit variables
  const [customNotes, setCustomNotes] = useState("");
  const [customPct, setCustomPct] = useState(null);

  const activeJob = jobs.find(j => j.id === activeJobId) || jobs[0];

  const handleSelectJob = (job) => {
    setActiveJobId(job.id);
    setFieldImage(null);
    setFieldImagePreview(null);
    setCustomNotes(job.verificationNotes || "");
    setCustomPct(job.aiDamagePct);
  };

  const handleSimulatePhoto = () => {
    setCapturing(true);
    setTimeout(() => {
      setCapturing(false);
      setFieldImagePreview("mock_field_preview.jpg");
      setFieldImage(true);
      alert("Field image captured successfully! Running local contour assessment...");
    }, 1500);
  };

  const handleSyncClaim = () => {
    if (!fieldImage && activeJob.status === 'pending') {
      alert("Please capture/upload a field collision photo first before syncing.");
      return;
    }

    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      
      // Update jobs list state
      const updatedJobs = jobs.map(j => {
        if (j.id === activeJob.id) {
          return {
            ...j,
            status: "completed",
            aiDamagePct: customPct !== null ? customPct : j.aiDamagePct,
            verificationNotes: customNotes || "Field verified on-site. Contours aligned.",
            images: "synced_field_img.jpg"
          };
        }
        return j;
      });

      setJobs(updatedJobs);
      alert(`Job ${activeJob.id} has been fully synced and approved in the system backend databases!`);
    }, 2000);
  };

  // Stats summaries
  const pendingJobsCount = jobs.filter(j => j.status === 'pending').length;
  const completedJobsCount = jobs.filter(j => j.status === 'completed').length;

  return (
    <div className="technician-dashboard-shell">
      {/* Pinned dark navigation header */}
      <header className="technician-navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--autoshield-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wrench className="w-5 h-5" style={{ color: '#FFFFFF' }} />
          </div>
          <span className="autoshield-brand-text" style={{ color: '#FFFFFF' }}>AutoShield</span>
          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', backgroundColor: 'rgba(0,102,204,0.2)', color: 'var(--colors-primary-on-dark)', padding: '2px 8px', borderRadius: '4px', marginLeft: '12px' }}>
            {t('techScope')}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#4ade80' }}>
            <Wifi className="w-4 h-4 animate-pulse" /> Network Connection: Operational
          </div>
          <div style={{ height: '16px', width: '1px', backgroundColor: '#444448' }} />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#E4E4E7' }}>
            {user.fullName}
          </span>
          <button 
            onClick={onSignOut}
            className="autoshield-btn autoshield-btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px', borderColor: '#444448', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <LogOut className="w-3.5 h-3.5" /> {t('logout')}
          </button>
        </div>
      </header>

      {/* Content panel */}
      <main className="technician-content">
        {/* KPI panel deck row */}
        <div className="tech-kpis-grid">
          <div className="tech-kpi-card">
            <div className="tech-kpi-num">{jobs.length}</div>
            <div className="tech-kpi-title">{t('activeInspections')}</div>
          </div>
          <div className="tech-kpi-card" style={{ borderLeft: '4px solid #f59e0b' }}>
            <div className="tech-kpi-num" style={{ color: '#F59E0B' }}>{pendingJobsCount}</div>
            <div className="tech-kpi-title">{t('stepActuarial')}</div>
          </div>
          <div className="tech-kpi-card" style={{ borderLeft: '4px solid #22c55e' }}>
            <div className="tech-kpi-num" style={{ color: '#22C55E' }}>{completedJobsCount}</div>
            <div className="tech-kpi-title">{t('stepPayout')}</div>
          </div>
        </div>

        {/* 2-Column layout for inspection lists */}
        <div className="tech-grid">
          
          {/* Column 1: Job list index */}
          <div className="tech-list-panel">
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#FFFFFF' }}>{t('inspectionQueue')}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {jobs.map((job) => (
                <div 
                  key={job.id}
                  onClick={() => handleSelectJob(job)}
                  className={`tech-job-card ${activeJob.id === job.id ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: '700', color: 'var(--colors-body-muted)' }}>
                      {job.id}
                    </span>
                    <span className={`tech-badge ${
                      job.status === 'completed' ? 'tech-badge-completed' : 'tech-badge-pending'
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#FFFFFF', marginTop: '6px', marginBottom: '4px' }}>
                    {job.vehicle}
                  </h4>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--colors-body-muted)' }}>
                    <MapPin className="w-3 h-3" /> {job.owner}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Active Job details inspection workspace */}
          <div className="tech-detail-panel">
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--autoshield-blue)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {t('inspectionDetails')}
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#FFFFFF', margin: '4px 0 0 0' }}>
                  {activeJob.id}: {activeJob.vehicle}
                </h3>
              </div>
              <span style={{ fontSize: '13px', color: '#88888b' }}>
                {t('policyInfo')}: {activeJob.policy}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Dispatch Owner and Location */}
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--colors-body-muted)', textTransform: 'uppercase' }}>Dispatch Target</span>
                <div style={{ fontSize: '14px', color: '#E4E4E7' }}>
                  <strong>Client Entity:</strong> {activeJob.owner}
                </div>
                <div style={{ fontSize: '14px', color: '#E4E4E7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin className="w-4 h-4" /> {activeJob.address}
                </div>
              </div>

              {/* AI assessment result parameters */}
              <div style={{ padding: '16px', backgroundColor: '#242428', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)', textAlign: 'left' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--colors-body-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  AI Core Assessment
                </span>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: '#FFFFFF' }}>AI Calculated Severity:</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: activeJob.severity === 'High' ? '#EF4444' : '#F59E0B' }}>
                    {activeJob.severity}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: '#FFFFFF' }}>Geometric Damage Ratio:</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--colors-primary-on-dark)' }}>
                    {activeJob.aiDamagePct}%
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#FFFFFF' }}>Est. Claims Liability:</span>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#22C55E' }}>
                    ${activeJob.aiEstimatedPayout.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Photo Intakes simulator */}
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--colors-body-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                  {t('photoFeed')}
                </span>
                
                {fieldImagePreview || activeJob.images ? (
                  <div style={{ width: '100%', height: '180px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', backgroundColor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#88888b' }}>📷 Captured Field Audit Asset Loaded</span>
                    <div style={{ position: 'absolute', top: '12px', right: '12px', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'rgba(34,197,94,0.2)', color: '#4ade80', fontSize: '10px', fontWeight: '700' }}>
                      VERIFIED
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={handleSimulatePhoto}
                    style={{ width: '100%', height: '120px', borderRadius: '8px', border: '2px dashed rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  >
                    {capturing ? (
                      <div className="autoshield-spinner" style={{ borderTopColor: 'var(--colors-primary-on-dark)' }} />
                    ) : (
                      <>
                        <Camera className="w-8 h-8" style={{ color: 'var(--colors-body-muted)', marginBottom: '8px' }} />
                        <span style={{ fontSize: '13px', fontWeight: '600' }}>{t('uploadInspection')}</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* On-Site Verification Form input and notes */}
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--colors-body-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                  {t('verifyMapping')}
                </span>

                <div className="autoshield-form-group">
                  <label className="autoshield-label" style={{ color: '#E4E4E7' }} htmlFor="adjuster-notes">Field Adjuster Notes</label>
                  <textarea 
                    id="adjuster-notes"
                    className="autoshield-input"
                    style={{ height: '80px', backgroundColor: '#242428', border: '1px solid rgba(255,255,255,0.1)', color: '#FFFFFF', padding: '10px', width: '100%', outline: 'none', borderRadius: '6px', resize: 'none' }}
                    placeholder="Enter findings, carbon structural anomalies or verification details..."
                    value={customNotes}
                    disabled={activeJob.status === 'completed'}
                    onChange={(e) => setCustomNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* Action buttons sync backend */}
              <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                {activeJob.status === 'pending' ? (
                  <button 
                    onClick={handleSyncClaim}
                    className="autoshield-btn autoshield-btn-primary"
                    style={{ width: '100%', height: '48px', justifyContent: 'center', backgroundColor: 'var(--colors-primary-on-dark)' }}
                    disabled={syncing}
                  >
                    {syncing ? <div className="autoshield-spinner" /> : t('submitReport')}
                  </button>
                ) : (
                  <div style={{ width: '100%', padding: '12px', backgroundColor: 'rgba(34,197,94,0.1)', borderRadius: '6px', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#4ade80', fontSize: '13px', fontWeight: '700' }}>
                    <CheckCircle className="w-5 h-5" /> claim inspection verified &amp; synced
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default TechnicianDashboard;
