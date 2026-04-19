import { Link, useNavigate } from "react-router-dom";
import { Linkedin, FileUp, Keyboard, Shield, X, UploadCloud, CheckCircle2 } from "lucide-react";
import "./ImportSourcePage.css";
import { useState, useRef } from "react";
import { useWizardControls } from "../components/WizardLayout";

export function ImportSourcePage() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<"linkedin" | "resume" | null>(null);
  
  // LinkedIn state
  const [isLinkedInConnecting, setIsLinkedInConnecting] = useState(false);
  const [linkedInSuccess, setLinkedInSuccess] = useState(false);

  // Resume state
  const [resumeParsingState, setResumeParsingState] = useState<"idle" | "parsing" | "success">("idle");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useWizardControls({
    continueDisabled: true, 
    hideContinue: true,
  });

  const handleLinkedInAuth = () => {
    setIsLinkedInConnecting(true);
    setTimeout(() => {
      setLinkedInSuccess(true);
      setIsLinkedInConnecting(false);
      setTimeout(() => {
        navigate("/onboarding/form");
      }, 1000);
    }, 2000);
  };

  const handleResumeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeParsingState("parsing");
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 15;
        if (currentProgress > 100) currentProgress = 100;
        setProgress(currentProgress);
        
        if (currentProgress >= 100) {
          clearInterval(interval);
          setResumeParsingState("success");
          setTimeout(() => {
            navigate("/onboarding/form");
          }, 1500);
        }
      }, 400);
    }
  };

  return (
    <div className="import-container" id="import-container">
      <div className="glow-background"></div>

      <div className="import-header">
        <h1>Import Your Data</h1>
        <p>Choose how you'd like to import your professional experience and details to generate your portfolio.</p>
      </div>

      <div className="import-methods" id="import-methods">
        
        {/* LinkedIn Import */}
        <div 
          className="import-method-card linkedin"
          onClick={() => setActiveModal("linkedin")}
        >
          <div className="card-hover-bg"></div>
          <div className="card-icon">
            <Linkedin size={28} />
          </div>
          <h3 className="card-title">LinkedIn Profile</h3>
          <p className="card-desc">Connect and import your experience directly.</p>
        </div>

        {/* Resume Upload */}
        <div 
          className="import-method-card resume"
          onClick={() => setActiveModal("resume")}
        >
          <div className="card-hover-bg"></div>
          <div className="card-icon">
            <FileUp size={28} />
          </div>
          <h3 className="card-title">Upload Resume</h3>
          <p className="card-desc">Upload a PDF or DOCX file to parse.</p>
        </div>

        {/* Manual Entry */}
        <div 
          className="import-method-card manual"
          onClick={() => navigate("/onboarding/form")}
        >
          <div className="card-hover-bg"></div>
          <div className="card-icon">
            <Keyboard size={28} />
          </div>
          <h3 className="card-title">Manual Entry</h3>
          <p className="card-desc">Start from scratch and enter details manually.</p>
        </div>
      </div>

      {/* Privacy Note */}
      <div className="privacy-note" id="privacy-note">
        <Shield size={18} className="privacy-icon" />
        <div className="privacy-text">
          <h4>Privacy & Permissions</h4>
          <p>
            We only access the data you explicitly choose to share. Your information is securely parsed and never sold to third parties. By importing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>

      {/* LinkedIn Modal */}
      {activeModal === "linkedin" && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveModal(null)}><X size={20} /></button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '4rem', height: '4rem', background: 'rgba(0,119,181,0.1)', color: '#0077b5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                {linkedInSuccess ? <CheckCircle2 size={32} color="#10B981" /> : <Linkedin size={32} />}
              </div>
              <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontFamily: 'var(--ar-font-family-heading)' }}>
                {linkedInSuccess ? 'Connected successfully!' : 'Auth with LinkedIn'}
              </h2>
              <p style={{ color: 'var(--ar-color-text-muted)', marginBottom: '2rem' }}>
                {linkedInSuccess 
                  ? 'Redirecting you to the form editor...' 
                  : 'We will securely extract your professional experience to pre-fill your portfolio template.'}
              </p>
              
              {!linkedInSuccess && (
                <button 
                  className="modal-btn" 
                  style={{ background: '#0077b5', boxShadow: '0 4px 15px rgba(0, 119, 181, 0.3)' }}
                  onClick={handleLinkedInAuth}
                  disabled={isLinkedInConnecting}
                >
                  {isLinkedInConnecting && <div className="radar-spinner small" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />}
                  {isLinkedInConnecting ? 'Connecting...' : 'Connect LinkedIn'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Resume Modal */}
      {activeModal === "resume" && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveModal(null)}><X size={20} /></button>
            
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontFamily: 'var(--ar-font-family-heading)' }}>Upload Resume</h2>
              <p style={{ color: 'var(--ar-color-text-muted)', marginBottom: '2rem' }}>Gemini API will parse your document and extract your information.</p>
              
              {resumeParsingState === "idle" && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: '2px dashed rgba(139, 92, 246, 0.4)', background: 'rgba(139, 92, 246, 0.05)', padding: '2.5rem', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '1.5rem' }}
                >
                  <input type="file" ref={fileInputRef} onChange={handleResumeFile} accept=".pdf,.doc,.docx" style={{ display: 'none' }} />
                  <UploadCloud size={32} color="#8B5CF6" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>Browse Resume</h3>
                  <span style={{ fontSize: '0.875rem', color: 'var(--ar-color-text-muted)' }}>PDF or DOCX (Max 10MB)</span>
                </div>
              )}

              {resumeParsingState === "parsing" && (
                <div style={{ padding: '2rem 0' }}>
                  <div className="radar-spinner" style={{ borderColor: 'rgba(139,92,246,0.2)', borderTopColor: '#8B5CF6', margin: '0 auto 1.5rem auto' }} />
                  <p style={{ marginBottom: '1rem', fontWeight: 500 }}>Parsing with Gemini API...</p>
                  <div style={{ width: '100%', height: '6px', background: 'var(--ar-color-border)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'linear-gradient(to right, #3B82F6, #8B5CF6)', width: `${progress}%`, transition: 'width 0.4s linear' }} />
                  </div>
                </div>
              )}

              {resumeParsingState === "success" && (
                <div style={{ padding: '2rem 0' }}>
                  <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#10B981' }}>Parsing Complete!</h3>
                  <p style={{ color: 'var(--ar-color-text-muted)' }}>Redirecting to manual form filling...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
