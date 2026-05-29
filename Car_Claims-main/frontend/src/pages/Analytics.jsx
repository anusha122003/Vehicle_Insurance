import { useState } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  BarChart3, 
  Activity 
} from 'lucide-react';
import { translations } from '../utils/translations.js';

function Analytics({ claims, filterOptions, metrics, currentLanguage }) {
  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations['English']?.[key] || key;
  };

  const [topCount, setTopCount] = useState(5);

  // Compute make densities dynamically
  const makeData = filterOptions.makes.map(m => {
    const count = claims.filter(c => c.Make === m).length;
    return { make: m, count };
  })
  .sort((a, b) => b.count - a.count); // Sort descending

  const displayedMakes = makeData.slice(0, topCount);
  const totalClaimsCount = claims.length || 1;

  // Let's compute some live statistical risk factors from active claims
  const unwitnessedClaims = claims.filter(c => c.Witnesses === 0 || c.NumberOfWitnesses === 0);
  const unwitnessedPct = Math.round((unwitnessedClaims.length / totalClaimsCount) * 100);

  const policeAbsentClaims = claims.filter(c => c.PoliceReportFiled === 'No');
  const policeAbsentPct = Math.round((policeAbsentClaims.length / totalClaimsCount) * 100);

  const highPayoutClaims = claims.filter(c => c.EstimatedPayout > 15000);
  const highPayoutPct = Math.round((highPayoutClaims.length / totalClaimsCount) * 100);

  return (
    <div className="page-fade-in tile-section tile-light" style={{ minHeight: 'calc(100vh - 96px)', paddingTop: '60px', paddingBottom: '80px' }}>
      <div className="analytics-header" style={{ maxWidth: '1100px', width: '100%', textAlign: 'center', marginBottom: '16px' }}>
        <span className="tagline-accent">{t('systemIntelligenceHub')}</span>
        <h2 className="hero-display-title" style={{ textAlign: 'center', marginBottom: '16px' }}>
          {t('actuarialRiskTitle')}
        </h2>
        <p className="hero-lead-text" style={{ fontSize: '18px', textAlign: 'center', marginBottom: '40px', color: 'var(--colors-body-muted)' }}>
          {t('actuarialRiskDesc')}
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: '1100px', display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
        {/* Double Row: Chart on Left, Risk correlation index on Right */}
        <div className="charts-double-row" style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
          
          {/* Chart 1: Vehicle Make Density */}
          <div className="chart-card-shell" style={{ width: '100%', height: '100%', backgroundColor: 'var(--colors-canvas-parchment)', padding: '32px', borderRadius: 'var(--rounded-md)', border: '1px solid var(--colors-hairline)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span className="chart-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '700' }}>
                <BarChart3 className="w-5 h-5" style={{ color: 'var(--colors-primary)' }} />
                {t('claimsDensity')}
              </span>
              
              <select 
                value={topCount} 
                onChange={(e) => setTopCount(Number(e.target.value))}
                style={{ padding: '6px 12px', border: '1px solid var(--colors-hairline)', borderRadius: 'var(--rounded-pill)', fontSize: '13px', backgroundColor: 'var(--colors-canvas)', outline: 'none', cursor: 'pointer' }}
              >
                <option value={5}>{t('topMakes')} 5</option>
                <option value={10}>{t('topMakes')} 10</option>
                <option value={20}>{t('topMakes')} 20</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {displayedMakes.map(({ make, count }) => {
                const pct = Math.round((count / totalClaimsCount) * 100);
                
                return (
                  <div key={make} className="density-row">
                     <div className="density-label-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px' }}>
                      <span style={{ textTransform: 'capitalize', fontWeight: '600' }}>{make.toLowerCase()}</span>
                      <span style={{ color: 'var(--colors-body-muted)', fontSize: '13px' }}>{count} {t('claims').toLowerCase()} ({pct}%)</span>
                    </div>
                    <div className="density-bar-track" style={{ height: '8px', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div 
                        className="density-bar-fill"
                        style={{ 
                          width: `${Math.max(pct, 2)}%`, 
                          height: '100%', 
                          backgroundColor: 'var(--colors-primary)', 
                          borderRadius: '9999px', 
                          transition: 'width 0.8s ease' 
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: Statistical Risk Indicators Correlation */}
          <div className="chart-card-shell" style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'var(--colors-canvas-parchment)', padding: '32px', borderRadius: 'var(--rounded-md)', border: '1px solid var(--colors-hairline)' }}>
            <div>
              <span className="chart-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
                <TrendingUp className="w-5 h-5" style={{ color: '#ef4444' }} />
                {t('actuarialRiskIndex')}
              </span>
              <p className="chart-subtitle" style={{ color: 'var(--colors-body-muted)', fontSize: '13px', lineHeight: '1.4', marginBottom: '24px' }}>
                {t('correlatesDataset')}
              </p>
            </div>
            
            <div className="indicator-grid-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div className="indicator-box" style={{ padding: '20px', backgroundColor: 'var(--colors-canvas)', borderRadius: 'var(--rounded-sm)', border: '1px solid var(--colors-hairline)', textAlign: 'left' }}>
                <span className="caption" style={{ color: 'var(--colors-body-muted)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  {t('unwitnessedIncidents')}
                </span>
                <div className="indicator-val" style={{ fontSize: '28px', fontWeight: '700', color: unwitnessedPct > 50 ? '#ef4444' : 'var(--colors-ink)' }}>
                  {unwitnessedPct}%
                </div>
                <span className="indicator-sub" style={{ fontSize: '12px', color: '#ef4444', fontWeight: '500', display: 'block', marginTop: '4px' }}>
                  {unwitnessedPct > 50 ? '▲ High Risk Factor' : '● Moderate Flag'}
                </span>
              </div>

              <div className="indicator-box" style={{ padding: '20px', backgroundColor: 'var(--colors-canvas)', borderRadius: 'var(--rounded-sm)', border: '1px solid var(--colors-hairline)', textAlign: 'left' }}>
                <span className="caption" style={{ color: 'var(--colors-body-muted)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  {t('policeReportAbsent')}
                </span>
                <div className="indicator-val" style={{ fontSize: '28px', fontWeight: '700', color: policeAbsentPct > 50 ? '#ef4444' : 'var(--colors-ink)' }}>
                  {policeAbsentPct}%
                </div>
                <span className="indicator-sub" style={{ fontSize: '12px', color: '#ef4444', fontWeight: '500', display: 'block', marginTop: '4px' }}>
                  {policeAbsentPct > 50 ? '▲ High Risk Factor' : '● Moderate Flag'}
                </span>
              </div>

              <div className="indicator-box" style={{ padding: '20px', backgroundColor: 'var(--colors-canvas)', borderRadius: 'var(--rounded-sm)', border: '1px solid var(--colors-hairline)', textAlign: 'left' }}>
                <span className="caption" style={{ color: 'var(--colors-body-muted)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  {t('severeClaims')}
                </span>
                <div className="indicator-val" style={{ fontSize: '28px', fontWeight: '700', color: 'var(--colors-primary)' }}>
                  {highPayoutPct}%
                </div>
                <span className="indicator-sub" style={{ fontSize: '12px', color: 'var(--colors-body-muted)', display: 'block', marginTop: '4px' }}>
                  {t('netCapitalExposure')}
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Dynamic risk score alert card */}
        {metrics.fraud_rate_pct > 10 && (
          <div style={{ display: 'flex', gap: '16px', backgroundColor: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '24px', borderRadius: 'var(--rounded-md)', marginTop: '8px', textAlign: 'left' }}>
            <AlertTriangle className="w-8 h-8" style={{ color: '#ef4444', flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#ef4444', marginBottom: '4px' }}>{t('highFraudRateDetected')}</h4>
              <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.6)', lineHeight: '1.4' }}>
                {t('cohortDescription')
                  .replace('{fraud_rate}', metrics.fraud_rate_pct)
                  .replace('{fraud_count}', metrics.fraud_count)}
              </p>
            </div>
          </div>
        )}

        {/* Detailed audit table: Top severe claim files */}
        <div style={{ backgroundColor: 'var(--colors-canvas)', borderRadius: 'var(--rounded-md)', border: '1px solid var(--colors-hairline)', padding: '24px', boxShadow: 'var(--shadow-premium)', textAlign: 'left' }}>
          <span style={{ fontSize: '15px', fontWeight: '700', display: 'block', marginBottom: '16px' }}>
            {t('topSevereActiveClaims')}
          </span>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--colors-divider-soft)', color: 'var(--colors-body-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px' }}>{t('policyNumShort')}</th>
                  <th>{t('make')}</th>
                  <th>{t('damageType')}</th>
                  <th>{t('cvDamagePct')}</th>
                  <th style={{ textAlign: 'right', paddingRight: '16px' }}>{t('payoutLiability')}</th>
                </tr>
              </thead>
              <tbody>
                {claims
                  .filter(c => c.EstimatedPayout > 0)
                  .sort((a, b) => b.EstimatedPayout - a.EstimatedPayout)
                  .slice(0, 5)
                  .map((claim, idx) => (
                    <tr key={claim.PolicyNumber || idx} style={{ borderBottom: '1px solid var(--colors-divider-soft)' }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 'bold' }}>{claim.PolicyNumber}</td>
                      <td style={{ textTransform: 'capitalize' }}>{claim.Make.toLowerCase()}</td>
                      <td style={{ textTransform: 'capitalize' }}>{claim.CV_Damage_Type.replace('_', ' ')}</td>
                      <td style={{ fontWeight: '600' }}>{claim.DamagePct || claim.CV_Damage_Pct}%</td>
                      <td style={{ textAlign: 'right', paddingRight: '16px', fontWeight: 'bold', color: 'var(--colors-primary)' }}>
                        ${Math.round(claim.EstimatedPayout).toLocaleString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Analytics;
