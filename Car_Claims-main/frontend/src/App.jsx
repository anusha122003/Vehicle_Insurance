import { useState, useEffect } from 'react';
import { 
  Shield, 
  Camera, 
  Database, 
  TrendingUp, 
  Home as HomeIcon,
  Users,
  ChevronDown
} from 'lucide-react';
import './App.css';

// Import subpages
import DashboardOverview from './pages/DashboardOverview.jsx';
import Assessor from './pages/Assessor.jsx';
import ClaimsLedger from './pages/ClaimsLedger.jsx';
import Analytics from './pages/Analytics.jsx';

// Import newly created premium landing page & role environments
import LandingPage from './pages/LandingPage.jsx';
import AuthModal from './pages/AuthModal.jsx';
import CustomerDashboard from './pages/CustomerDashboard.jsx';
import TechnicianDashboard from './pages/TechnicianDashboard.jsx';
import { translations } from './utils/translations.js';

function App() {
  // Global Language State
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [adminLangDropdownOpen, setAdminLangDropdownOpen] = useState(false);

  // Session Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Modal Trigger States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signin');
  const [preselectedRole, setPreselectedRole] = useState('');

  // Page Router State (Matches Sidebar Navigation Items)
  const [currentPage, setCurrentPage] = useState('home');

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

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations['English']?.[key] || key;
  };

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

  // Session Handlers
  const handleOpenAuth = (modeType = 'signin', selectedRole = '') => {
    setAuthModalMode(modeType);
    setPreselectedRole(selectedRole);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    setIsAuthenticated(true);
    // If technician or customer, we automatically route. If admin, route to overview home
    setCurrentPage('home');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUser(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Navigation transition helper
  const navigateTo = (pageName) => {
    setCurrentPage(pageName);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Reset Filters helper
  const resetFilters = () => {
    setSelectedYears(filterOptions.years);
    setSelectedMakes(filterOptions.makes.slice(0, 5));
    setSelectedFraud("All");
  };

  // Render current workspace view
  const renderView = () => {
    switch (currentPage) {
      case 'home':
        return <DashboardOverview onNavigate={navigateTo} currentLanguage={currentLanguage} />;
      case 'assessor':
        return <Assessor currentLanguage={currentLanguage} />;
      case 'ledger':
        return (
          <ClaimsLedger 
            filterOptions={filterOptions}
            selectedYears={selectedYears}
            setSelectedYears={setSelectedYears}
            selectedMakes={selectedMakes}
            setSelectedMakes={setSelectedMakes}
            selectedFraud={selectedFraud}
            setSelectedFraud={setSelectedFraud}
            claims={claims}
            metrics={metrics}
            onResetFilters={resetFilters}
            currentLanguage={currentLanguage}
          />
        );
      case 'analytics':
        return (
          <Analytics 
            claims={claims}
            filterOptions={filterOptions}
            metrics={metrics}
            currentLanguage={currentLanguage}
          />
        );
      default:
        return <DashboardOverview onNavigate={navigateTo} currentLanguage={currentLanguage} />;
    }
  };

  // 1. Unauthenticated Page layout (Premium Landing page)
  if (!isAuthenticated) {
    return (
      <div className={`app-root-shell lang-${currentLanguage.toLowerCase()}`}>
        <LandingPage 
          onOpenAuth={handleOpenAuth} 
          currentLanguage={currentLanguage} 
          onChangeLanguage={setCurrentLanguage} 
        />
        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)} 
          initialMode={authModalMode}
          onAuthSuccess={handleAuthSuccess}
          currentLanguage={currentLanguage}
        />
      </div>
    );
  }

  // 2. Individual Customer dashboard routing
  if (user.role === 'customer') {
    return (
      <div className={`lang-${currentLanguage.toLowerCase()}`}>
        <CustomerDashboard user={user} onSignOut={handleSignOut} currentLanguage={currentLanguage} />
      </div>
    );
  }

  // 3. Field Technician dashboard routing
  if (user.role === 'technician') {
    return (
      <div className={`lang-${currentLanguage.toLowerCase()}`}>
        <TechnicianDashboard user={user} onSignOut={handleSignOut} currentLanguage={currentLanguage} />
      </div>
    );
  }

  // 4. Admin Corporate Dashboard Shell (Preserved entire previous workspace)
  return (
    <div className={`corporate-dashboard-shell lang-${currentLanguage.toLowerCase()}`}>
      
      {/* 1. Global Left Navigation Sidebar */}
      <aside className="app-sidebar">
        {/* Sidebar brand header */}
        <div className="sidebar-logo-container" onClick={() => navigateTo('home')}>
          <Shield className="w-5 h-5" style={{ color: 'var(--colors-primary-on-dark)' }} />
          <span className="sidebar-brand-name">AutoShield</span>
        </div>

        {/* Dynamic navigation item menu lists */}
        <nav className="sidebar-nav">
          <span 
            className={`sidebar-nav-item ${currentPage === 'home' ? 'active-item' : ''}`}
            onClick={() => navigateTo('home')}
          >
            <HomeIcon className="w-4 h-4" /> {t('overview')}
          </span>
          <span 
            className={`sidebar-nav-item ${currentPage === 'ledger' ? 'active-item' : ''}`}
            onClick={() => navigateTo('ledger')}
          >
            <Database className="w-4 h-4" /> {t('claimsQueue')}
          </span>
          <span 
            className={`sidebar-nav-item ${currentPage === 'assessor' ? 'active-item' : ''}`}
            onClick={() => navigateTo('assessor')}
          >
            <Camera className="w-4 h-4" /> {t('visualEngine')}
          </span>
          <span 
            className={`sidebar-nav-item ${currentPage === 'analytics' ? 'active-item' : ''}`}
            onClick={() => navigateTo('analytics')}
          >
            <TrendingUp className="w-4 h-4" /> {t('analytics')}
          </span>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <span className="sidebar-sign-out" onClick={handleSignOut}>
            {t('logout')}
          </span>
        </div>
      </aside>

      {/* 2. Main content viewpane scaffold */}
      <div className="main-content-area">
        
        {/* Top Header Row */}
        <header className="corporate-header" style={{ position: 'relative' }}>
          <div className="corporate-header-left">
            <span className="header-secondary-link" onClick={() => navigateTo('home')}>{t('explore')}</span>
            <span className="header-secondary-link" onClick={() => navigateTo('assessor')}>{t('newClaim')}</span>
            <span className="header-secondary-link" onClick={() => navigateTo('analytics')}>{t('analytics')}</span>
          </div>

          <div className="corporate-header-center">
            <span className="corporate-brand" onClick={() => navigateTo('home')}>
              <Shield className="w-4 h-4" /> AutoShield
            </span>
          </div>

          <div className="corporate-header-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Language Selector Dropdown inside Admin Portal Header */}
            <div 
              style={{ position: 'relative', display: 'inline-block' }}
              onMouseEnter={() => setAdminLangDropdownOpen(true)}
              onMouseLeave={() => setAdminLangDropdownOpen(false)}
            >
              <button 
                className="acko-lang-btn"
                style={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e4e4e7', 
                  borderRadius: '20px', 
                  padding: '6px 14px', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: '#27272a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  boxShadow: 'none'
                }}
                onClick={() => setAdminLangDropdownOpen(!adminLangDropdownOpen)}
              >
                {currentLanguage === 'English' ? 'EN' : currentLanguage === 'Hindi' ? 'HI' : currentLanguage === 'Kannada' ? 'KN' : 'TM'} 
                <span style={{ fontSize: '13px', fontWeight: '700', marginLeft: '2px', borderLeft: '1px solid #e4e4e7', paddingLeft: '6px', color: '#71717a' }}>A/अ</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {adminLangDropdownOpen && (
                <div 
                  className="acko-dropdown-panel acko-dropdown-lang"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '36px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e4e4e7',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    zIndex: 1000,
                    minWidth: '120px',
                    padding: '4px 0',
                    textAlign: 'left'
                  }}
                >
                  {['English', 'Hindi', 'Kannada', 'Tamil'].map(lang => (
                    <div 
                      key={lang}
                      className={`acko-dropdown-item ${currentLanguage === lang ? 'active' : ''}`}
                      style={{
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: currentLanguage === lang ? '600' : '500',
                        color: currentLanguage === lang ? '#0066cc' : '#27272a',
                        backgroundColor: currentLanguage === lang ? '#f4f4f5' : 'transparent',
                        cursor: 'pointer'
                      }}
                      onClick={() => { setCurrentLanguage(lang); setAdminLangDropdownOpen(false); }}
                    >
                      {lang}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-profile-badge">
              <span className="admin-text">{t('adminScope')}</span>
              <div className="admin-avatar">
                <Users className="w-3.5 h-3.5" style={{ color: '#0066cc' }} />
              </div>
            </div>
          </div>
        </header>

        {/* Content render zone */}
        <main className="content-workspace">
          {renderView()}
        </main>

        {/* Custom Corporate Footer */}
        <footer className="simple-footer">
          <span>{t('secureAiFooter')}</span>
          <div className="simple-footer-right">
            <span>{t('systemStatus')}</span>
            <span>{t('termsOfService')}</span>
          </div>
        </footer>
      </div>

    </div>
  );
}

export default App;
