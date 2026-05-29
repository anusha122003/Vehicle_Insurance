import { useState } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  Maximize2, 
  RotateCw, 
  Plus, 
  Filter, 
  Download, 
  ChevronRight,
  Loader2,
  Users
} from 'lucide-react';
import visualAiHud from '../assets/visual_ai_hud.png';
import heroCar from '../assets/hero_sports_car.png';

import { translations } from '../utils/translations.js';

function DashboardOverview({ onNavigate, currentLanguage }) {
  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations['English']?.[key] || key;
  };
  const [scanning, setScanning] = useState(false);

  const handleReScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
    }, 2000);
  };

  // Mock Active Claims Queue Data based on the user's mockup
  const queueData = [
    {
      claimId: "CL-0322",
      vehicle: "Mercedes-Benz G-Class",
      evidence: heroCar,
      severity: "High",
      fraudScore: "12% Risk",
      fraudVal: 12,
      received: "2 mins ago",
      status: "Processing"
    },
    {
      claimId: "CL-0323",
      vehicle: "Porsche 911 Carrera",
      evidence: visualAiHud,
      severity: "Medium",
      fraudScore: "88% Risk",
      fraudVal: 88,
      received: "15 mins ago",
      status: "Flagged"
    },
    {
      claimId: "CL-0324",
      vehicle: "BMW M5 Competition",
      evidence: heroCar,
      severity: "Low",
      fraudScore: "5% Risk",
      fraudVal: 5,
      received: "1 hour ago",
      status: "Verified"
    },
    {
      claimId: "CL-0325",
      vehicle: "Audi RS6 Avant",
      evidence: visualAiHud,
      severity: "High",
      fraudScore: "42% Risk",
      fraudVal: 42,
      received: "3 hours ago",
      status: "Processing"
    },
    {
      claimId: "CL-0326",
      vehicle: "Range Rover Sport",
      evidence: heroCar,
      severity: "Medium",
      fraudScore: "19% Risk",
      fraudVal: 19,
      received: "5 hours ago",
      status: "Processing"
    }
  ];

  return (
    <div className="page-fade-in dashboard-overview-pane" style={{ padding: '40px', backgroundColor: '#fcfcfd', minHeight: 'calc(100vh - 96px)' }}>
      
      {/* Dashboard Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', textAlign: 'left' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--colors-body-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', backgroundColor: '#f1f1f4', padding: '3px 8px', borderRadius: '4px' }}>
            System Online: Visual Engine v4.2
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.03em', color: '#111111', marginTop: '8px', marginBottom: '4px' }}>
            {t('techScope')} / {t('adminScope')}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--colors-body-muted)', margin: 0 }}>
            Real-time fraud detection and visual claim orchestration.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Avatar Stack Group */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', marginRight: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#0066cc', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', border: '2px solid #ffffff' }}>A</div>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', border: '2px solid #ffffff', marginLeft: '-8px' }}>B</div>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f59e0b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', border: '2px solid #ffffff', marginLeft: '-8px' }}>C</div>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--colors-body-muted)', fontWeight: '600' }}>+5</span>
          </div>

          <button 
            onClick={() => onNavigate('assessor')}
            className="btn btn-primary"
            style={{ fontSize: '13px', padding: '10px 20px', borderRadius: '8px', backgroundColor: '#18181b', color: '#ffffff', border: 'none', boxShadow: 'none' }}
          >
            <Plus className="w-4 h-4" /> New Manual Intake
          </button>
        </div>
      </div>

      {/* Outlined KPI metrics cards block */}
      <div className="metrics-card-deck" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        {/* Card 1: Active Claims */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'none' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--colors-body-muted)', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('myClaims')}</span>
              <TrendingUp className="w-4 h-4" style={{ color: '#0066cc' }} />
            </div>
            <h3 style={{ fontSize: '32px', fontWeight: '700', color: '#18181b', margin: 0, letterSpacing: '-0.02em' }}>1,284</h3>
          </div>
          <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600', marginTop: '12px', display: 'block' }}>
            +12% <span style={{ color: 'var(--colors-body-muted)', fontWeight: '500' }}>from last cycle</span>
          </span>
        </div>

        {/* Card 2: Avg Severity */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'none' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--colors-body-muted)', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('severity')}</span>
              <AlertTriangle className="w-4 h-4" style={{ color: '#f59e0b' }} />
            </div>
            <h3 style={{ fontSize: '32px', fontWeight: '700', color: '#18181b', margin: 0, letterSpacing: '-0.02em' }}>Med-High</h3>
          </div>
          <span style={{ fontSize: '12px', color: '#71717a', fontWeight: '600', marginTop: '12px', display: 'block' }}>
            Stable <span style={{ color: 'var(--colors-body-muted)', fontWeight: '500' }}>from last cycle</span>
          </span>
        </div>

        {/* Card 3: AI Confidence */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'none' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--colors-body-muted)', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI {t('severity')}</span>
              <CheckCircle className="w-4 h-4" style={{ color: '#10b981' }} />
            </div>
            <h3 style={{ fontSize: '32px', fontWeight: '700', color: '#18181b', margin: 0, letterSpacing: '-0.02em' }}>98.2%</h3>
          </div>
          <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600', marginTop: '12px', display: 'block' }}>
            +0.5% <span style={{ color: 'var(--colors-body-muted)', fontWeight: '500' }}>from last cycle</span>
          </span>
        </div>

        {/* Card 4: Fraud Alerts */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'none' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--colors-body-muted)', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('fraudRate')}</span>
              <ShieldAlert className="w-4 h-4" style={{ color: '#ef4444' }} />
            </div>
            <h3 style={{ fontSize: '32px', fontWeight: '700', color: '#18181b', margin: 0, letterSpacing: '-0.02em' }}>24</h3>
          </div>
          <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600', marginTop: '12px', display: 'block' }}>
            +2 <span style={{ color: 'var(--colors-body-muted)', fontWeight: '500' }}>from last cycle</span>
          </span>
        </div>

      </div>

      {/* Main Dashboard Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', marginBottom: '32px' }} className="dashboard-grid-columns">
        
        {/* Left Widget: Live Analysis Visual Engine (Tesla Model S) */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '16px', padding: '32px', textAlign: 'left' }} className="live-analysis-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--colors-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Visual Engine: Live Analysis</span>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#18181b', margin: '4px 0 0 0' }}>
                Claim #AS-9021 - Tesla Model S Plaid (2023)
              </h4>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #e4e4e7' }}>
                <Maximize2 className="w-3.5 h-3.5" /> Full Screen
              </button>
              <button 
                onClick={handleReScan}
                className="btn btn-primary" 
                style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '8px', backgroundColor: '#18181b', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {scanning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCw className="w-3.5 h-3.5" />} Re-Scan
              </button>
            </div>
          </div>

          {/* Visual HUD Container */}
          <div style={{ width: '100%', height: '360px', borderRadius: '12px', overflow: 'hidden', position: 'relative', backgroundColor: '#0c0c0e', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={visualAiHud} 
              alt="Neural diagnostics HUD overlay" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} 
            />

            {/* Glowing Segment Overlay Circles */}
            <div style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', textAlign: 'center' }}>
              
              {/* Highlight Target Overlay Circle in Red */}
              <div style={{ position: 'absolute', right: '28%', top: '22%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(239, 68, 68, 0.4)', animation: 'pulse 2s infinite' }}>
                  <span style={{ fontSize: '10px', color: '#ffffff', fontWeight: 'bold', backgroundColor: '#ef4444', padding: '2px 6px', borderRadius: '4px' }}>Segmented</span>
                </div>
                <div style={{ width: '2px', height: '32px', backgroundColor: '#ef4444' }} />
                <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: '600', backgroundColor: '#18181b', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.12)' }}>
                  Segmented Area: 98.4%
                </span>
              </div>
            </div>

            {/* Scanner overlay line if scanning */}
            {scanning && (
              <div style={{ position: 'absolute', inset: '0 0 auto 0', height: '4px', background: 'linear-gradient(to right, transparent, var(--colors-primary-on-dark), transparent)', boxShadow: '0 0 12px var(--colors-primary-on-dark)', animation: 'scan 2s linear infinite' }} />
            )}

            {/* Lower-Left Detected Components Badges */}
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', backgroundColor: 'rgba(24, 24, 27, 0.85)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 18px', textAlign: 'left', backdropFilter: 'blur(12px)' }}>
              <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Detected Components</span>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', marginTop: '4px', letterSpacing: '-0.01em' }}>
                Rear Quarter, Taillight, Bumper
              </div>
            </div>

            {/* Lower-Right AI Score Pill */}
            <div style={{ position: 'absolute', bottom: '20px', right: '20px', backgroundColor: 'rgba(24, 24, 27, 0.85)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 18px', textAlign: 'right', backdropFilter: 'blur(12px)' }}>
              <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confidence Score</span>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#10b981', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle className="w-3.5 h-3.5" /> 98.4%
              </div>
            </div>
          </div>
        </div>

        {/* Right Widget: AI Performance Line Graph */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '16px', padding: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="performance-chart-panel">
          <div>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--colors-body-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Metrics</span>
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#18181b', margin: '4px 0 0 0' }}>
              AI Performance
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--colors-body-muted)', marginTop: '4px', marginBottom: '24px' }}>
              Detections vs Flags (Last 7 Days)
            </p>
          </div>

          {/* Custom SVG Line Chart */}
          <div style={{ width: '100%', height: '220px', position: 'relative' }}>
            <svg viewBox="0 0 300 150" style={{ width: '100%', height: '100%' }}>
              {/* Grid Lines */}
              <line x1="20" y1="20" x2="280" y2="20" stroke="#f4f4f5" strokeWidth="1" />
              <line x1="20" y1="50" x2="280" y2="50" stroke="#f4f4f5" strokeWidth="1" />
              <line x1="20" y1="80" x2="280" y2="80" stroke="#f4f4f5" strokeWidth="1" />
              <line x1="20" y1="110" x2="280" y2="110" stroke="#f4f4f5" strokeWidth="1" />
              <line x1="20" y1="130" x2="280" y2="130" stroke="#e4e4e7" strokeWidth="1.5" />

              {/* Area Under the Line */}
              <path 
                d="M 20 130 L 20 80 Q 60 40 100 70 T 180 30 T 240 50 Q 260 80 280 60 L 280 130 Z" 
                fill="rgba(0, 102, 204, 0.04)" 
              />

              {/* Total Claims Line */}
              <path 
                d="M 20 80 Q 60 40 100 70 T 180 30 T 240 50 Q 260 80 280 60" 
                fill="none" 
                stroke="var(--colors-primary)" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              />

              {/* Red Flags Bars */}
              <rect x="52" y="110" width="10" height="20" rx="2" fill="#ef4444" />
              <rect x="92" y="100" width="10" height="30" rx="2" fill="#ef4444" />
              <rect x="132" y="115" width="10" height="15" rx="2" fill="#ef4444" />
              <rect x="172" y="90" width="10" height="40" rx="2" fill="#ef4444" />
              <rect x="212" y="105" width="10" height="25" rx="2" fill="#ef4444" />
              <rect x="252" y="120" width="10" height="10" rx="2" fill="#ef4444" />

              {/* X Axis Labels */}
              <text x="20" y="145" fontSize="8" fill="#a1a1aa" textAnchor="middle">Mon</text>
              <text x="60" y="145" fontSize="8" fill="#a1a1aa" textAnchor="middle">Tue</text>
              <text x="100" y="145" fontSize="8" fill="#a1a1aa" textAnchor="middle">Wed</text>
              <text x="140" y="145" fontSize="8" fill="#a1a1aa" textAnchor="middle">Thu</text>
              <text x="180" y="145" fontSize="8" fill="#a1a1aa" textAnchor="middle">Fri</text>
              <text x="220" y="145" fontSize="8" fill="#a1a1aa" textAnchor="middle">Sat</text>
              <text x="260" y="145" fontSize="8" fill="#a1a1aa" textAnchor="middle">Sun</text>
            </svg>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '11px', fontWeight: '600' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--colors-primary)' }} />
              <span style={{ color: 'var(--colors-body-muted)' }}>Total Claims</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#ef4444' }} />
              <span style={{ color: 'var(--colors-body-muted)' }}>Flagged Flags</span>
            </div>
          </div>
        </div>

      </div>

      {/* Active Claims Queue Table Section */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '16px', padding: '32px', textAlign: 'left', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#18181b', margin: 0 }}>
              Active Claims Queue
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--colors-body-muted)', margin: '4px 0 0 0' }}>
              Manage and review AI-processed insurance claims.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #e4e4e7', borderRadius: '8px' }}>
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #e4e4e7', borderRadius: '8px' }}>
              <Download className="w-4 h-4" /> Export Data
            </button>
          </div>
        </div>

        {/* Claims Table Grid */}
        <div className="table-responsive-wrapper" style={{ overflowX: 'auto' }}>
          <table className="claims-data-grid" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f4f4f5', textAlign: 'left', color: 'var(--colors-body-muted)', fontSize: '12px', fontWeight: '600' }}>
                <th style={{ padding: '16px 20px' }}>Evidence</th>
                <th>Claim ID</th>
                <th>Vehicle Entity</th>
                <th>AI Severity</th>
                <th>Fraud Score</th>
                <th>Received</th>
                <th>Status</th>
                <th style={{ textAlign: 'center', width: '80px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {queueData.map((row, idx) => (
                <tr key={row.claimId || idx} style={{ borderBottom: '1px solid #f4f4f5', fontSize: '13px', color: '#27272a' }}>
                  <td style={{ padding: '12px 20px' }}>
                    {/* Small thumbnail of evidence car */}
                    <div style={{ width: '48px', height: '32px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#000000', border: '1px solid #e4e4e7' }}>
                      <img src={row.evidence} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--colors-ink)' }}>{row.claimId}</td>
                  <td style={{ fontWeight: '600' }}>{row.vehicle}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ height: '4px', width: '40px', backgroundColor: '#e4e4e7', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: row.severity === 'High' ? '100%' : row.severity === 'Medium' ? '60%' : '25%', backgroundColor: row.severity === 'High' ? '#ef4444' : row.severity === 'Medium' ? '#f59e0b' : '#10b981' }} />
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: row.severity === 'High' ? '#ef4444' : row.severity === 'Medium' ? '#f59e0b' : '#10b981' }}>
                        {row.severity}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', 
                      backgroundColor: row.fraudVal > 50 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(24, 24, 27, 0.04)',
                      color: row.fraudVal > 50 ? '#ef4444' : '#18181b'
                    }}>
                      {row.fraudScore}
                    </span>
                  </td>
                  <td style={{ color: 'var(--colors-body-muted)' }}>{row.received}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600',
                      color: row.status === 'Flagged' ? '#ef4444' : row.status === 'Verified' ? '#10b981' : '#0066cc'
                    }}>
                      {row.status === 'Processing' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      {row.status === 'Verified' && <CheckCircle className="w-3.5 h-3.5" />}
                      {row.status === 'Flagged' && <AlertTriangle className="w-3.5 h-3.5" />}
                      {row.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      onClick={() => onNavigate('ledger')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--colors-body-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row Widgets Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', textAlign: 'left' }}>
        
        {/* Card 1: Automated Payouts (Dark Box) */}
        <div style={{ backgroundColor: '#18181b', color: '#ffffff', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>Efficiency Focus</span>
            <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>Automated Payouts</h4>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.5', margin: 0 }}>
              AI has successfully processed 84% of low-severity claims without human intervention this week.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('analytics')}
            className="btn btn-secondary" 
            style={{ width: '100%', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', backgroundColor: '#ffffff', color: '#18181b', border: 'none', marginTop: '24px', justifyContent: 'center' }}
          >
            View Efficiency Audit
          </button>
        </div>

        {/* Card 2: Training Engine (Trigger Workspace) */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--colors-primary)' }} />
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#18181b', marginBottom: '8px' }}>Training Engine</h4>
            <p style={{ fontSize: '13px', color: 'var(--colors-body-muted)', lineHeight: '1.4', maxWidth: '240px', margin: '0 auto 16px' }}>
              12 new damage samples marked for AI model reinforcement.
            </p>
          </div>
          <div style={{ textAlign: 'center', borderTop: '1px solid #f4f4f5', paddingTop: '16px' }}>
            <a 
              href="#training" 
              onClick={(e) => { e.preventDefault(); alert("Activating AutoShield neural custom classifier reinforcement cycle..."); }}
              style={{ fontSize: '13px', fontWeight: '700', color: 'var(--colors-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              Run Training Cycle <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Card 3: Regional Risk Heatmap progress bars */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '9px', fontWeight: '700', color: 'var(--colors-body-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '12px' }}>Incident Geography</span>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#18181b', marginBottom: '16px' }}>Regional Risk Heatmap</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>
                  <span style={{ color: '#18181b' }}>North East</span>
                  <span style={{ color: 'var(--colors-body-muted)' }}>89% Capacity</span>
                </div>
                <div style={{ height: '4px', backgroundColor: '#f4f4f5', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '89%', backgroundColor: '#18181b' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>
                  <span style={{ color: '#18181b' }}>Pacific Coast</span>
                  <span style={{ color: 'var(--colors-body-muted)' }}>42% Capacity</span>
                </div>
                <div style={{ height: '4px', backgroundColor: '#f4f4f5', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '42%', backgroundColor: '#18181b' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>
                  <span style={{ color: '#18181b' }}>Central Lakes</span>
                  <span style={{ color: 'var(--colors-body-muted)' }}>19% Capacity</span>
                </div>
                <div style={{ height: '4px', backgroundColor: '#f4f4f5', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '19%', backgroundColor: '#18181b' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default DashboardOverview;
