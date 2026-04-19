import { useState, useRef } from "react";
import { useWizardControls } from "../components/WizardLayout";
import { User, Briefcase, Code, GraduationCap, Languages, Mail, Phone, Link as LinkIcon, Plus, Trash2, ChevronDown, ChevronUp, Image as ImageIcon, MapPin, X } from "lucide-react";
import "./ManualFormPage.css";

const MonthYearPicker = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 50}, (_, i) => currentYear - i);

  return (
    <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
      <select className="form-select" style={{ flex: 1, minWidth: '4.5rem' }}>
        <option value="">Month</option>
        {months.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <select className="form-select" style={{ flex: 1, minWidth: '4.5rem' }}>
        <option value="">Year</option>
        {years.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
    </div>
  );
};

const AccordionSection = ({ 
  title, 
  description,
  step,
  icon: Icon, 
  id, 
  expanded, 
  setExpanded, 
  children 
}: { 
  title: string; 
  description: string;
  step: number;
  icon: any; 
  id: string; 
  expanded: string; 
  setExpanded: (id: string) => void; 
  children: React.ReactNode; 
}) => {
  const isExpanded = expanded === id;
  return (
    <div className={`accordion-section ${isExpanded ? 'expanded' : ''}`}>
      <div className="accordion-header" onClick={() => setExpanded(isExpanded ? '' : id)}>
        <div className="accordion-title-container">
          <div className="accordion-title-wrapper">
            <div className="accordion-icon-box">
              <Icon size={18} className="accordion-icon" />
            </div>
            <h3 className="accordion-title">{title}</h3>
          </div>
          <p className="accordion-subtitle">{description}</p>
        </div>
        <div className="accordion-right">
          <span className="step-badge">Step {step}</span>
          {isExpanded ? <ChevronUp size={20} color="var(--ar-color-text-muted)" /> : <ChevronDown size={20} color="var(--ar-color-text-muted)" />}
        </div>
      </div>
      {isExpanded && <div className="accordion-content">{children}</div>}
    </div>
  );
};

export function ManualFormPage() {
  const [expanded, setExpanded] = useState<string>("about");
  
  // Image Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setAvatarUrl(url);
    }
  };

  // Arrays
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  
  const [languages, setLanguages] = useState<string[]>([]);
  const [newLang, setNewLang] = useState("");

  const [emails, setEmails] = useState<string[]>([""]);
  const [phones, setPhones] = useState<string[]>([""]);
  const [websites, setWebsites] = useState<string[]>([""]);

  const [experiences, setExperiences] = useState([1]);
  const [projects, setProjects] = useState([1]);
  const [education, setEducation] = useState([1]);

  useWizardControls({
    continueDisabled: false,
    continueTo: "/app/dashboard",
    continueLabel: "Preview",
  });

  const validateEmail = (email: string) => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const validatePhone = (phone: string) => {
    if (!phone) return true;
    return /^[0-9+\s\-()]{7,20}$/.test(phone);
  };

  const setItemInArray = (setter: any, array: string[], index: number, value: string) => {
    const newArr = [...array];
    newArr[index] = value;
    setter(newArr);
  };
  const removeFromArray = (setter: any, array: string[], index: number) => {
    setter(array.filter((_, i) => i !== index));
  };
  const addToArray = (setter: any, array: string[]) => {
    setter([...array, ""]);
  };

  return (
    <div className="form-page-container">
      <div className="form-page-header">
        <h1>Complete Your Profile</h1>
        <p>Review extracted data or enter your details manually.</p>
      </div>

      {/* 1. About Section */}
      <AccordionSection 
        title="About Section" 
        description="Personalize how recruiters and clients see you first. A clear profile picture and strong headlines make a profound impact."
        step={1}
        icon={User} 
        id="about" 
        expanded={expanded} 
        setExpanded={setExpanded}
      >
        <div className="form-group" style={{ alignItems: 'center', marginBottom: '1rem' }}>
          <div className="image-upload-circle" title="Upload Image (512x512 recommended)" onClick={() => fileInputRef.current?.click()}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar Preview" />
            ) : (
              <>
                <ImageIcon size={24} />
                <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Upload</span>
              </>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Full Name <span className="char-count">Required (3-100 chars)</span></label>
            <input className="form-input" placeholder="e.g. Jane Doe" minLength={3} maxLength={100} required />
          </div>
          <div className="form-group">
            <label className="form-label">Professional Title <span className="char-count">Required (3-200 chars)</span></label>
            <input className="form-input" placeholder="e.g. Senior Software Engineer" minLength={3} maxLength={200} required />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">About <span className="char-count">Required (100-500 chars)</span></label>
          <textarea className="form-textarea" placeholder="Write a short professional bio..." minLength={100} maxLength={500} required />
        </div>

        <div className="form-group">
          <label className="form-label">Tag Lines <span className="char-count">Max 200 chars</span></label>
          <input className="form-input" placeholder="e.g. specialized in scalable web apps" maxLength={200} />
        </div>

        <label className="checkbox-label" style={{ marginTop: '0.5rem' }}>
          <input type="checkbox" />
          I am openly looking for new opportunities (Open to work)
        </label>
      </AccordionSection>

      {/* 2. Skills & Languages */}
      <AccordionSection 
        title="Skills & Languages" 
        description="Add professional core competencies, soft skills, and languages you are fluent in to boost your discoverability."
        step={2}
        icon={Languages} 
        id="skills" 
        expanded={expanded} 
        setExpanded={setExpanded}
      >
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Skills</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input className="form-input" placeholder="Add a skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && newSkill) { setSkills([...skills, newSkill]); setNewSkill(''); } }} />
              <button type="button" className="add-btn" style={{ padding: '0 1rem' }} onClick={() => { if(newSkill) { setSkills([...skills, newSkill]); setNewSkill(''); } }}>Add</button>
            </div>
            {skills.length > 0 && (
              <div className="chip-container">
                {skills.map((s, i) => (
                  <div key={i} className="chip">
                    {s} <button onClick={() => setSkills(skills.filter((_, idx) => idx !== i))}><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Languages</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input className="form-input" placeholder="Add a language..." value={newLang} onChange={e => setNewLang(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && newLang) { setLanguages([...languages, newLang]); setNewLang(''); } }} />
              <button type="button" className="add-btn" style={{ padding: '0 1rem' }} onClick={() => { if(newLang) { setLanguages([...languages, newLang]); setNewLang(''); } }}>Add</button>
            </div>
            {languages.length > 0 && (
              <div className="chip-container">
                {languages.map((l, i) => (
                  <div key={i} className="chip">
                    {l} <button onClick={() => setLanguages(languages.filter((_, idx) => idx !== i))}><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </AccordionSection>

      {/* 3. Contact Information */}
      <AccordionSection 
        title="Contact Information" 
        description="Let potential clients and recruiters know where to find you and how to get in touch effectively."
        step={3}
        icon={Mail} 
        id="contact" 
        expanded={expanded} 
        setExpanded={setExpanded}
      >
        <div className="form-group">
          <label className="form-label">Primary Address <span className="char-count">Required (Max 500)</span></label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <MapPin size={20} color="var(--ar-color-text-muted)" />
            <input className="form-input" placeholder="City, State, Country" maxLength={500} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Email Address(es)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {emails.map((email, idx) => (
                <div key={`email-${idx}`} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    className={`form-input ${!validateEmail(email) ? 'invalid-input' : ''}`} 
                    type="email" 
                    placeholder="primary@example.com"
                    value={email}
                    onChange={(e) => setItemInArray(setEmails, emails, idx, e.target.value)}
                    required={idx === 0} 
                  />
                  {emails.length > 1 && (
                    <button type="button" onClick={() => removeFromArray(setEmails, emails, idx)} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  )}
                </div>
              ))}
              <button type="button" className="add-btn" onClick={() => addToArray(setEmails, emails)}><Plus size={16} /> Add another Email</button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number(s)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {phones.map((phone, idx) => (
                <div key={`phone-${idx}`} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    className={`form-input ${!validatePhone(phone) ? 'invalid-input' : ''}`} 
                    type="tel" 
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setItemInArray(setPhones, phones, idx, e.target.value)}
                  />
                  {phones.length > 1 && (
                    <button type="button" onClick={() => removeFromArray(setPhones, phones, idx)} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  )}
                </div>
              ))}
              <button type="button" className="add-btn" onClick={() => addToArray(setPhones, phones)}><Plus size={16} /> Add another Phone</button>
            </div>
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '0.5rem' }}>
          <label className="form-label">Websites & Links</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input className="form-input" type="url" placeholder="LinkedIn URL" />
              <input className="form-input" type="url" placeholder="GitHub URL" />
            </div>
            
            {websites.map((website, idx) => (
              <div key={`web-${idx}`} style={{ display: 'flex', gap: '0.5rem' }}>
                 <input className="form-input" type="url" placeholder="Personal Website URL" value={website} onChange={(e) => setItemInArray(setWebsites, websites, idx, e.target.value)} />
                 <button type="button" onClick={() => removeFromArray(setWebsites, websites, idx)} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0 0.5rem' }}><Trash2 size={18} /></button>
              </div>
            ))}
            
            <button 
              type="button" 
              className="add-btn" 
              onClick={() => addToArray(setWebsites, websites)}
              disabled={websites.length >= 3}
            >
              <Plus size={16} /> Add Personal Website {websites.length >= 3 ? '(Max 3)' : ''}
            </button>
          </div>
        </div>
      </AccordionSection>

      {/* 4. Experience */}
      <AccordionSection 
        title="Experience" 
        description="Showcase your professional growth, highlighting responsibilities and impactful contributions at every company."
        step={4}
        icon={Briefcase} 
        id="experience" 
        expanded={expanded} 
        setExpanded={setExpanded}
      >
        {experiences.map((exp, idx) => (
          <div key={idx} className="dynamic-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--ar-color-text-primary)' }}>Experience {idx + 1}</h4>
              <button className="remove-item-btn" onClick={() => setExperiences(experiences.filter((_, i) => i !== idx))}><Trash2 size={16} /></button>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Company <span className="char-count">Required (Max 200)</span></label>
                <input className="form-input" placeholder="Company Name" maxLength={200} required />
              </div>
              <div className="form-group">
                <label className="form-label">Role <span className="char-count">Required (Max 200)</span></label>
                <input className="form-input" placeholder="Job Title" maxLength={200} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <MonthYearPicker />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <MonthYearPicker />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <label className="checkbox-label"><input type="checkbox" /> Currently Working Here</label>
                  <label className="checkbox-label"><input type="checkbox" /> On Notice Period</label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description <span className="char-count">Required (100-500 chars)</span></label>
              <textarea className="form-textarea" placeholder="Describe your responsibilities and impact..." minLength={100} maxLength={500} required />
            </div>

            <div className="form-group">
              <label className="form-label">Experience Certificate Link <span className="char-count">URL / Drive Link</span></label>
              <input className="form-input" type="url" placeholder="https://" />
            </div>
          </div>
        ))}
        <button type="button" className="add-btn" onClick={() => setExperiences([...experiences, Date.now()])}>
          <Plus size={16} /> Add Experience
        </button>
      </AccordionSection>

      {/* 5. Projects */}
      <AccordionSection 
        title="Projects" 
        description="Feature the projects you're most proud of. These could be self-led endeavors, open-source contributions, or major company epics."
        step={5}
        icon={Code} 
        id="projects" 
        expanded={expanded} 
        setExpanded={setExpanded}
      >
        {projects.map((proj, idx) => (
          <div key={idx} className="dynamic-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--ar-color-text-primary)' }}>Project {idx + 1}</h4>
              <button className="remove-item-btn" onClick={() => setProjects(projects.filter((_, i) => i !== idx))}><Trash2 size={16} /></button>
            </div>
            
            <div className="form-group">
              <label className="form-label">Project Name <span className="char-count">Required (Max 200)</span></label>
              <input className="form-input" placeholder="e.g. E-Commerce Platform Rewrite" maxLength={200} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <MonthYearPicker />
              </div>
              <div className="form-group">
                  <label className="form-label">End Date</label>
                  <MonthYearPicker />
                  <div style={{ marginTop: '0.5rem' }}>
                    <label className="checkbox-label"><input type="checkbox" /> Ongoing</label>
                  </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Worked Under</label>
              <select className="form-select">
                <option value="">Select company context...</option>
                <option value="freelance">Freelancing</option>
                <option value="self">Self-Project</option>
                <option value="acme">Acme Corp (from Experience)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description <span className="char-count">Max 500 chars</span></label>
              <textarea className="form-textarea" placeholder="Project details and tech stack used..." maxLength={500} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Project Link</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <LinkIcon size={18} color="var(--ar-color-text-muted)" />
                  <input className="form-input" type="url" placeholder="Live Demo URL" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">GitHub Repository</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Code size={18} color="var(--ar-color-text-muted)" />
                  <input className="form-input" type="url" placeholder="GitHub URL" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Video Demo <span className="char-count">YouTube Recommended</span></label>
              <input className="form-input" type="url" placeholder="https://youtube.com/watch?v=..." />
            </div>
          </div>
        ))}
        <button type="button" className="add-btn" onClick={() => setProjects([...projects, Date.now()])}>
          <Plus size={16} /> Add Project
        </button>
      </AccordionSection>

      {/* 6. Education */}
      <AccordionSection 
        title="Education" 
        description="Enumerate your formal academic records, certifications, or major continuing education milestones."
        step={6}
        icon={GraduationCap} 
        id="education" 
        expanded={expanded} 
        setExpanded={setExpanded}
      >
        {education.map((edu, idx) => (
          <div key={idx} className="dynamic-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--ar-color-text-primary)' }}>Education {idx + 1}</h4>
              <button className="remove-item-btn" onClick={() => setEducation(education.filter((_, i) => i !== idx))}><Trash2 size={16} /></button>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Course / Degree <span className="char-count">Required (Max 200)</span></label>
                <input className="form-input" placeholder="e.g. Bachelor of Science" maxLength={200} required />
              </div>
              <div className="form-group">
                <label className="form-label">Department / Major <span className="char-count">Required (Max 200)</span></label>
                <input className="form-input" placeholder="e.g. Computer Science" maxLength={200} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Institute / College <span className="char-count">Required (Max 200)</span></label>
              <input className="form-input" placeholder="University Name" maxLength={200} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                  <label className="form-label">Duration (Start & End)</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', width: '2.5rem', color: 'var(--ar-color-text-muted)'}}>Start:</span>
                      <MonthYearPicker />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', width: '2.5rem', color: 'var(--ar-color-text-muted)'}}>End:</span>
                      <MonthYearPicker />
                    </div>
                  </div>
                  <label className="checkbox-label" style={{ marginTop: '0.5rem' }}><input type="checkbox" /> Currently Pursuing</label>
              </div>
              <div className="form-group">
                  <label className="form-label">Percentage / Score / GPA</label>
                  <input className="form-input" type="number" step="0.01" placeholder="e.g. 3.8 or 92.5" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Certificate Link</label>
              <input className="form-input" type="url" placeholder="Google Drive Link (PDF/Image)" />
            </div>
          </div>
        ))}
        <button type="button" className="add-btn" onClick={() => setEducation([...education, Date.now()])}>
          <Plus size={16} /> Add Education
        </button>
      </AccordionSection>

    </div>
  );
}
