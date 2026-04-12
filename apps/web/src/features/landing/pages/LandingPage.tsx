import React from "react";
import "./LandingPage.css";

// SVG Icons
const WandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 4V2" />
    <path d="M15 16v-2" />
    <path d="M8 9h2" />
    <path d="M20 9h2" />
    <path d="M17.8 11.8 19 13" />
    <path d="M15 9h0" />
    <path d="M17.8 6.2 19 5" />
    <path d="m3 21 9-9" />
    <path d="M12.2 6.2 11 5" />
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#0A66C2" stroke="#0A66C2" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);

const PenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const PaletteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5" fill="white" />
    <circle cx="17.5" cy="10.5" r=".5" fill="white" />
    <circle cx="8.5" cy="7.5" r=".5" fill="white" />
    <circle cx="6.5" cy="12.5" r=".5" fill="white" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const FigmaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F24E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
    <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
    <path d="M12 9H8.5a3.5 3.5 0 1 0 0 7H12V9z" />
    <path d="M12 16H8.5a3.5 3.5 0 1 0 3.5 3.5V16z" />
    <path d="M12 9h3.5a3.5 3.5 0 1 1 0 7H12V9z" />
  </svg>
);

const BoltIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

export function LandingPage() {
  return (
    <div className="landing-page-wrapper">
      <main className="landing-container">
        
        {/* Left Side: Value Prop & Actions */}
        <section className="auth-sidebar">
          <header className="landing-header">
            <div className="brand-row">
              <div className="brand-icon">
                <WandIcon />
              </div>
              <span className="brand-text">PortfoliAI</span>
            </div>
            
            <h1 className="landing-title">
              Bring your <br />
              <span className="text-gradient">career to life.</span>
            </h1>
            <p className="landing-subtitle">
              Import your LinkedIn or resume and generate a stunning, animated portfolio in seconds. No coding required.
            </p>
          </header>

          <div className="auth-form-wrapper">
            {/* Auth Options */}
            <div className="auth-buttons">
              <button className="btn-linkedin">
                <LinkedinIcon />
                Continue with LinkedIn
              </button>
              
              <button className="btn-upload">
                <span className="btn-upload-icon"><UploadIcon /></span>
                Upload Resume (PDF)
              </button>
            </div>

            <div className="divider">
              <div className="divider-line"></div>
              <span className="divider-text">OR</span>
              <div className="divider-line"></div>
            </div>

            <form>
              <input type="email" placeholder="Enter your email" className="email-input" />
              <button type="button" className="btn-primary">
                Sign Up with Email
              </button>
            </form>

            <p className="login-hint">
              Already have an account? <a href="#">Log in</a>
            </p>
          </div>

          <footer className="landing-footer">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </footer>
        </section>

        {/* Right Side: Animated Demo Visual */}
        <section className="demo-section">
          <div className="bg-blob-1"></div>
          <div className="bg-blob-2"></div>
          
          <div className="mockup-container">
            <div className="mockup-frame">
              {/* Mockup Header */}
              <div className="mockup-header">
                <div className="mockup-dots">
                  <div className="dot dot-red"></div>
                  <div className="dot dot-yellow"></div>
                  <div className="dot dot-green"></div>
                </div>
                <div className="mockup-url">
                  portfolio.dev/alex
                </div>
              </div>

              {/* Mockup Content */}
              <div className="mockup-content">
                
                {/* Simulated Hero */}
                <div className="simulated-hero">
                  <div className="sim-avatar"></div>
                  <div className="sim-lines">
                    <div className="sim-line-1"></div>
                    <div className="sim-line-2"></div>
                  </div>
                </div>

                {/* Simulated Grid */}
                <div className="sim-grid">
                  <div className="sim-card">
                    <div className="sim-card-hover hover-blue"></div>
                  </div>
                  <div className="sim-card">
                    <div className="sim-card-hover hover-purple"></div>
                  </div>
                  <div className="sim-card wide">
                    <div className="sim-card-hover hover-mixed"></div>
                  </div>
                </div>

                {/* Overlay UI Elements */}
                <div className="overlay-ui">
                  <div className="ui-btn"><PenIcon /></div>
                  <div className="ui-btn"><PaletteIcon /></div>
                  <div className="ui-btn active"><CheckIcon /></div>
                </div>

              </div>
            </div>
            
            {/* Decorative floating badges */}
            <div className="badge-float-1">
              <FigmaIcon />
              <span className="badge-text">Auto-layout</span>
            </div>
            <div className="badge-float-2">
              <BoltIcon />
              <span className="badge-text">99/100 Speed</span>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
