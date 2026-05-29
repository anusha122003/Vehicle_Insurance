import { useState } from 'react';
import { 
  RotateCcw, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';
import heroCar from '../assets/hero_sports_car.png';
import visualAiHud from '../assets/visual_ai_hud.png';
import { translations } from '../utils/translations.js';

function ClaimsLedger({ 
  filterOptions,
  selectedYears,
  setSelectedYears,
  selectedMakes,
  setSelectedMakes,
  selectedFraud,
  setSelectedFraud,
  claims,
  metrics,
  onResetFilters,
  currentLanguage
}) {
  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations['English']?.[key] || key;
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Multi-select helper
  const handleMultiSelect = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(x => x !== item));
    } else {
      setList([...list, item]);
    }
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  // Filter claims based on local text search
  const filteredClaimsBySearch = claims.filter(c => {
    const q = searchQuery.toLowerCase();
    const policyMatch = c.PolicyNumber ? String(c.PolicyNumber).toLowerCase().includes(q) : false;
    const makeMatch = c.Make ? c.Make.toLowerCase().includes(q) : false;
    const typeMatch = c.CV_Damage_Type ? c.CV_Damage_Type.toLowerCase().includes(q) : false;
    return policyMatch || makeMatch || typeMatch;
  });

  // Pagination calculation
  const totalItems = filteredClaimsBySearch.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClaims = filteredClaimsBySearch.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="page-fade-in tile-section tile-parchment" style={{ minHeight: 'calc(100vh - 96px)', paddingTop: '60px', paddingBottom: '80px', backgroundColor: '#fcfcfd' }}>
      <div className="ledger-header" style={{ maxWidth: '1100px', width: '100%', textAlign: 'center', marginBottom: '16px' }}>
        <span className="tagline-accent">{t('adminScope')}</span>
        <h2 className="hero-display-title" style={{ textAlign: 'center', marginBottom: '16px', color: '#111111' }}>
          {t('claimsRegistryTitle')}
        </h2>
        <p className="hero-lead-text" style={{ fontSize: '18px', textAlign: 'center', marginBottom: '40px', color: 'var(--colors-body-muted)' }}>
          {t('claimsRegistryDesc')}
        </p>
      </div>

      {/* Control Panel: Filters & Search bar */}
      <div className="filter-row-container" style={{ width: '100%', maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e4e4e7', boxShadow: 'none' }}>
        
        {/* Search input bar */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search className="w-5 h-5" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--colors-body-muted)' }} />
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: '100%', padding: '14px 20px 14px 48px', border: '1px solid #e4e4e7', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'var(--transition-smooth)' }}
            className="ledger-search-input"
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', borderTop: '1px solid #f4f4f5', paddingTop: '20px' }}>
          {/* Year Selector */}
          <div className="filter-group">
            <span className="filter-group-label">{t('claimYear')}</span>
            <div className="filter-button-cluster">
              {filterOptions.years.map(y => (
                <button
                  key={y}
                  onClick={() => handleMultiSelect(y, selectedYears, setSelectedYears)}
                  className={`chip-filter-btn ${selectedYears.includes(y) ? 'active' : ''}`}
                  style={{ borderRadius: '6px' }}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Fraud Status */}
          <div className="filter-group">
            <span className="filter-group-label">{t('fraudClassification')}</span>
            <div className="filter-button-cluster">
              {[
                { key: "All", label: t('all') },
                { key: "Fraudulent Only", label: t('fraudulentOnly') },
                { key: "Legitimate Only", label: t('legitimateOnly') }
              ].map(status => (
                <button
                  key={status.key}
                  onClick={() => {
                    setSelectedFraud(status.key);
                    setCurrentPage(1);
                  }}
                  className={`chip-filter-btn ${selectedFraud === status.key ? 'active-blue' : ''}`}
                  style={{ borderRadius: '6px' }}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Reset */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            <button 
              onClick={() => {
                onResetFilters();
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="chip-filter-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '6px' }}
            >
              <RotateCcw className="w-3.5 h-3.5" /> {t('resetFilters')}
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Operations Metrics banner */}
      <div className="metrics-card-deck" style={{ width: '100%', maxWidth: '1100px', marginTop: '32px' }}>
        {/* Card 1: Total Claims */}
        <div className="museum-kpi-card" style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', boxShadow: 'none', borderRadius: '12px' }}>
          <div>
            <span className="kpi-card-header">{t('totalClaimsLedger')}</span>
            <h3 className="kpi-card-value" style={{ color: '#18181b' }}>{metrics.total_claims.toLocaleString()}</h3>
          </div>
          <div className="kpi-card-footer">{t('auditedActive')}</div>
        </div>

        {/* Card 2: Fraud Rate */}
        <div className={`museum-kpi-card ${metrics.fraud_rate_pct > 10 ? 'alert-kpi' : ''}`} style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', boxShadow: 'none', borderRadius: '12px' }}>
          <div>
            <span className="kpi-card-header">{t('identifiedFraudRate')}</span>
            <h3 className={`kpi-card-value ${metrics.fraud_rate_pct > 10 ? 'red' : ''}`}>
              {metrics.fraud_rate_pct}%
            </h3>
          </div>
          <div className="kpi-card-footer">
            {metrics.fraud_count} {t('flagsRaised')}
          </div>
        </div>

        {/* Card 3: Aggregate Payout */}
        <div className="museum-kpi-card" style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', boxShadow: 'none', borderRadius: '12px' }}>
          <div>
            <span className="kpi-card-header">{t('netPayout')}</span>
            <h3 className="kpi-card-value" style={{ color: '#18181b' }}>${(metrics.total_payout / 1000000).toFixed(2)}M</h3>
          </div>
          <div className="kpi-card-footer">
            Avg: ${Math.round(metrics.avg_payout).toLocaleString()}
          </div>
        </div>

        {/* Card 4: Avg Damage % */}
        <div className="museum-kpi-card" style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', boxShadow: 'none', borderRadius: '12px' }}>
          <div>
            <span className="kpi-card-header">{t('meanCollision')}</span>
            <h3 className="kpi-card-value blue">{metrics.avg_damage_pct}%</h3>
          </div>
          <div className="kpi-card-footer">{t('quantifiedOpenCV')}</div>
        </div>
      </div>

      {/* Raw Claims Ledger Table panel with evidence column */}
      <div className="table-panel-shell" style={{ width: '100%', maxWidth: '1100px', marginTop: '32px', backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '12px', boxShadow: 'none' }}>
        <div className="table-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="table-title" style={{ color: '#18181b' }}>{t('activeClaimsRegistryQueue')}</span>
          <span className="table-counter-meta">
            {totalItems > 0 ? (
              <>{t('showingClaims')} {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}</>
            ) : (
              <>{t('noMatchingClaims')}</>
            )}
          </span>
        </div>
        
        <div className="table-responsive-wrapper">
          <table className="claims-data-grid">
            <thead>
              <tr style={{ color: 'var(--colors-body-muted)' }}>
                <th style={{ paddingLeft: '32px' }}>{t('evidence')}</th>
                <th>{t('policyNumShort')}</th>
                <th>{t('make')}</th>
                <th>{t('damageType')}</th>
                <th style={{ textAlign: 'right' }}>{t('cvDamagePct')}</th>
                <th style={{ textAlign: 'right' }}>{t('payoutLiability')}</th>
                <th style={{ textAlign: 'center', paddingRight: '32px' }}>{t('fraudStatus')}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClaims.length > 0 ? (
                paginatedClaims.map((claim, idx) => (
                  <tr key={claim.PolicyNumber || idx} className={claim.FraudFound === 'Yes' ? 'flagged-claim-row' : ''}>
                    <td style={{ paddingLeft: '32px' }}>
                      <div style={{ width: '48px', height: '32px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#000000', border: '1px solid #e4e4e7' }}>
                        <img src={idx % 2 === 0 ? heroCar : visualAiHud} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{claim.PolicyNumber}</td>
                    <td style={{ textTransform: 'capitalize' }}>{claim.Make.toLowerCase()}</td>
                    <td style={{ textTransform: 'capitalize' }}>{claim.CV_Damage_Type.replace('_', ' ')}</td>
                    <td style={{ textAlign: 'right', fontWeight: '600', color: 'var(--colors-primary)' }}>
                      {claim.DamagePct || claim.CV_Damage_Pct}%
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      ${Math.round(claim.EstimatedPayout).toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'center', paddingRight: '32px' }}>
                      <span className={`badge-claim ${claim.FraudFound === 'Yes' ? 'red' : 'green'}`}>
                        {claim.FraudFound === 'Yes' ? t('fraudulentOnly') : t('legitimateOnly')}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '48px', color: 'var(--colors-body-muted)' }}>
                    {t('noMatchingClaims')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination navigation controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderTop: '1px solid #f4f4f5', backgroundColor: '#ffffff' }}>
            <span style={{ fontSize: '13px', color: 'var(--colors-body-muted)' }}>
              Page <strong>{currentPage}</strong> of {totalPages}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={handlePrevPage} 
                disabled={currentPage === 1}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', border: '1px solid #e4e4e7', borderRadius: '6px' }}
              >
                <ChevronLeft className="w-4 h-4" /> {t('previous')}
              </button>
              <button 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', border: '1px solid #e4e4e7', borderRadius: '6px' }}
              >
                {t('next')} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClaimsLedger;
