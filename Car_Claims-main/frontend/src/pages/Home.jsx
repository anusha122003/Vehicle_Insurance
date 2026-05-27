import { 
  Camera,
  Cpu,
  Layers,
  Zap,
  AlertTriangle
} from 'lucide-react';
import heroCar from '../assets/hero_sports_car.png';
import visualAiHud from '../assets/visual_ai_hud.png';
import showroomFooter from '../assets/showroom_footer.png';

function Home({ onNavigate }) {
  return (
    <div className="page-fade-in">
      {/* 3. Immersive Hero Landing Grid (Light Canvas) */}
      <section className="hero-landing-grid">
        <div className="hero-text-pane">
          <span className="tagline-accent">Precision Insurance by AutoShield</span>
          <h1 className="hero-display-title">
            Where physical damage meets digital intelligence.
          </h1>
          <p className="hero-lead-text">
            AutoShield utilizes deep convolutional networks and adaptive OpenCV edge pipelines to quantify vehicle collision claims in seconds. True payout estimates, immediate fraud screenings, and verified diagnostic files.
          </p>
          <div className="button-row">
            <button onClick={() => onNavigate('assessor')} className="btn btn-primary">
              Run Visual Assessor
            </button>
            <button onClick={() => onNavigate('ledger')} className="btn btn-secondary">
              View Operations Ledger
            </button>
          </div>
        </div>
        <div className="hero-image-pane">
          <img src={heroCar} alt="Sleek White Lamborghini Sports Car Showcase" />
          <div className="hero-image-overlay" />
        </div>
      </section>

      {/* 4. Stats Banner Section */}
      <section className="stats-banner">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">3.2s</div>
            <div className="stat-title">Average Analysis Time</div>
            <div className="stat-desc">Instant cloud-based YOLOv8 diagnostics per damaged vehicle image.</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">99.8%</div>
            <div className="stat-title">Visual Accuracy</div>
            <div className="stat-desc">Highly calibrated geometric calculations using adaptive OpenCV contours.</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-title">Automated Processing</div>
            <div className="stat-desc">Self-service underwriting framework with built-in deductible computations.</div>
          </div>
        </div>
      </section>

      {/* 5. Feature AI Highlight Section (See the Unseen - Dark) */}
      <section className="ai-wireframe-banner">
        <div className="ai-wireframe-grid">
          <div className="ai-wireframe-text">
            <span className="tagline-accent tagline-accent-dark">Proprietary Computer Vision</span>
            <h2 className="hero-display-title hero-display-title-dark" style={{ fontSize: '42px', marginBottom: '20px' }}>
              See the unseen with proprietary Visual AI.
            </h2>
            <p className="hero-lead-text" style={{ color: 'var(--colors-body-muted)', fontSize: '18px', marginBottom: '32px' }}>
              AutoShield doesn't just guess damage severity. By applying localized contour mapping to visual frames, the engine identifies isolated structural cracks, deep scratches, windshield shatter density, and flat tire slopes with absolute precision.
            </p>
            <div className="button-row">
              <button onClick={() => onNavigate('assessor')} className="btn btn-primary" style={{ backgroundColor: 'var(--colors-primary-on-dark)' }}>
                Upload Collision Photo
              </button>
            </div>
          </div>
          <div className="ai-wireframe-visual">
            <img src={visualAiHud} alt="AI Neural Bounding Box and Mesh HUD Diagnostic" />
          </div>
        </div>
      </section>

      {/* 6. Features Matrix Grid (Light Canvas) */}
      <section className="tile-section tile-light" style={{ paddingBottom: '60px' }}>
        <span className="tagline-accent">System Architecture</span>
        <h2 className="hero-display-title" style={{ fontSize: '42px', textAlign: 'center', marginBottom: '16px' }}>
          Designed for modern underwriting.
        </h2>
        <p className="hero-lead-text" style={{ fontSize: '18px', textAlign: 'center', marginBottom: '0' }}>
          A unified engineering stack delivering visual intelligence, tabular integrity, and financial transparency.
        </p>

        <div className="features-matrix">
          <div className="feature-tile">
            <div className="feature-icon-wrapper">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="feature-tile-title">Deep Analysis</h3>
            <p className="feature-tile-desc">
              Custom-trained YOLOv8 neural network classifies damage into scratches, dents, flats, broken lamps, or glass shatters.
            </p>
          </div>

          <div className="feature-tile">
            <div className="feature-icon-wrapper">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="feature-tile-title">Actuarial Logic</h3>
            <p className="feature-tile-desc">
              Physical damage percentages mapped to vehicle base values with automated deductible deductions in real-time.
            </p>
          </div>

          <div className="feature-tile">
            <div className="feature-icon-wrapper">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="feature-tile-title">Real-Time Speed</h3>
            <p className="feature-tile-desc">
              FastAPI backend router processes incoming collision uploads and returns annotated assets in under 4 seconds.
            </p>
          </div>

          <div className="feature-tile">
            <div className="feature-icon-wrapper">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="feature-tile-title">Risk Mitigation</h3>
            <p className="feature-tile-desc">
              Cross-references claim reports against computer vision assessment to immediately highlight claims at high risk of fraud.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Photographs Over Paperwork split section (Light Parchment) */}
      <section className="tile-section tile-parchment" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="photographs-banner">
          <div className="photographs-image-wrap">
            <img src={heroCar} alt="Premium sports car in clean layout" />
          </div>
          <div className="photographs-text-wrap">
            <span className="tagline-accent">Efficient Claims Intake</span>
            <h3>Photographs over paperwork.</h3>
            <p>
              Say goodbye to endless claim forms and weeks of adjuster inspections. With AutoShield, claimants capture and submit clear collision photos. The visual engine handles the rest, building a digital profile containing geometric annotations and fair payout estimates instantly.
            </p>
            <div className="button-row">
              <button onClick={() => onNavigate('assessor')} className="btn btn-primary">
                Try AutoShield Assessor
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 13. Dark Elegant Showroom Footer CTA */}
      <section className="footer-cta-banner">
        <div className="footer-cta-container">
          <div className="footer-cta-text">
            <span className="tagline-accent tagline-accent-dark">Enterprise Scaling</span>
            <h2 className="hero-display-title hero-display-title-dark" style={{ fontSize: '42px', marginBottom: '20px' }}>
              Ready for the next generation of insurance?
            </h2>
            <p className="hero-lead-text" style={{ color: 'var(--colors-body-muted)', fontSize: '18px', marginBottom: '32px' }}>
              AutoShield fits seamlessly into global actuarial workflows, providing immediately integrable JSON endpoints for custom mobile intake hubs and databases.
            </p>
            <div className="button-row">
              <button onClick={() => onNavigate('assessor')} className="btn btn-primary" style={{ backgroundColor: 'var(--colors-primary-on-dark)' }}>
                Initialize System Intake
              </button>
            </div>
          </div>
          <div className="footer-cta-image">
            <img src={showroomFooter} alt="Moody supercar showroom footer" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
