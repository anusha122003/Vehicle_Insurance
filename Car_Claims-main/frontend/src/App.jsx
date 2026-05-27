import { useState, useEffect } from 'react';
import { 
  Shield, 
  Camera, 
  Database, 
  TrendingUp, 
  Home as HomeIcon,
  Users
} from 'lucide-react';
import './App.css';

// Import subpages
import DashboardOverview from './pages/DashboardOverview.jsx';
import Assessor from './pages/Assessor.jsx';
import ClaimsLedger from './pages/ClaimsLedger.jsx';
import Analytics from './pages/Analytics.jsx';

function App() {
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
        return <DashboardOverview onNavigate={navigateTo} />;
      case 'assessor':
        return <Assessor />;
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
          />
        );
      case 'analytics':
        return (
          <Analytics 
            claims={claims}
            filterOptions={filterOptions}
            metrics={metrics}
          />
        );
      default:
        return <DashboardOverview onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="corporate-dashboard-shell">
      
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
            <HomeIcon className="w-4 h-4" /> Overview
          </span>
          <span 
            className={`sidebar-nav-item ${currentPage === 'ledger' ? 'active-item' : ''}`}
            onClick={() => navigateTo('ledger')}
          >
            <Database className="w-4 h-4" /> Claims Queue
          </span>
          <span 
            className={`sidebar-nav-item ${currentPage === 'assessor' ? 'active-item' : ''}`}
            onClick={() => navigateTo('assessor')}
          >
            <Camera className="w-4 h-4" /> Visual Engine
          </span>
          <span 
            className={`sidebar-nav-item ${currentPage === 'analytics' ? 'active-item' : ''}`}
            onClick={() => navigateTo('analytics')}
          >
            <TrendingUp className="w-4 h-4" /> Analytics
          </span>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <span className="sidebar-sign-out" onClick={() => alert("Signing out of Admin Scope...")}>
            Sign Out
          </span>
        </div>
      </aside>

      {/* 2. Main content viewpane scaffold */}
      <div className="main-content-area">
        
        {/* Top Header Row */}
        <header className="corporate-header">
          <div className="corporate-header-left">
            <span className="header-secondary-link" onClick={() => navigateTo('home')}>Explore</span>
            <span className="header-secondary-link" onClick={() => navigateTo('assessor')}>New Claim</span>
            <span className="header-secondary-link" onClick={() => navigateTo('analytics')}>Analytics</span>
          </div>

          <div className="corporate-header-center">
            <span className="corporate-brand" onClick={() => navigateTo('home')}>
              <Shield className="w-4 h-4" /> AutoShield
            </span>
          </div>

          <div className="corporate-header-right">
            <div className="admin-profile-badge">
              <span className="admin-text">Admin Portal</span>
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
          <span>© 2026 AutoShield Vehicle Insurance. Secure AI Processing Enabled.</span>
          <div className="simple-footer-right">
            <span>System Status</span>
            <span>Terms of Service</span>
          </div>
        </footer>
      </div>

    </div>
  );
}

export default App;
