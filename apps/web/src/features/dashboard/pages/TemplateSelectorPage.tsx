import React, { useState } from 'react';
import { 
  Sparkles, Bell, Search, Code, PenTool, Camera, ChevronDown, 
  Zap, Heart, Play, Star, X, Maximize, Check, ArrowRight, Eye 
} from 'lucide-react';
import './TemplateSelectorPage.css';

export function TemplateSelectorPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="template-selector-container">
      {/* Main Content */}
      <main className="ts-main">
        
        {/* Gallery Header & Search */}
        <section className="ts-hero">
          <div>
            <h1 className="ts-hero-title">Choose a Template</h1>
            <p className="ts-hero-desc">Select a starting point for your animated portfolio. All templates are fully customizable in the next steps.</p>
          </div>
          
          <div className="ts-search-container">
            <div className="ts-search-icon">
              <Search size={16} />
            </div>
            <input type="text" placeholder="Search templates (e.g., Developer, Minimal)..." className="ts-search-input ts-glass-panel" />
          </div>
        </section>

        {/* Filter & Sorting Bar */}
        <section className="ts-filter-bar ts-glass-panel">
          <div className="ts-filters">
            <button className="ts-filter-btn active">All Categories</button>
            <button className="ts-filter-btn"><Code size={14} /> Developers</button>
            <button className="ts-filter-btn"><PenTool size={14} /> Designers</button>
            <button className="ts-filter-btn"><Camera size={14} /> Creatives</button>
            <div className="ts-divider"></div>
            
            <button className="ts-filter-btn">
              Style: Minimal <ChevronDown size={14} />
            </button>
            <button className="ts-filter-btn">
              Animation: High <ChevronDown size={14} />
            </button>
          </div>

          <div className="ts-sort">
            <span>Sort by:</span>
            <select>
              <option>Most Popular</option>
              <option>Newest</option>
              <option>Trending</option>
            </select>
            <ChevronDown size={14} className="ts-sort-icon" />
          </div>
        </section>

        {/* Template Grid Marketplace */}
        <section className="ts-grid">
          
          {/* Template Card 1 */}
          <div className="ts-card ts-glass-panel" onClick={openDrawer}>
            <div className="ts-card-img-container">
              <div className="ts-card-badges">
                <span className="ts-card-badge">
                  <Zap color="#3B82F6" size={12} /> Animated
                </span>
                <span className="ts-card-badge">Pro</span>
              </div>
              <div className="ts-card-actions">
                <button className="ts-card-action-btn">
                  <Heart size={16} />
                </button>
              </div>
              <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/7b322a4d-49-411a-8fc7-6a4d70a98f1f.png" alt="DevFolio Dark Template Preview" className="ts-card-img" />
              <div className="ts-card-video">
                <Play color="rgba(255,255,255,0.5)" size={40} fill="currentColor" />
              </div>
            </div>
            <div className="ts-card-content">
              <div className="ts-card-header">
                <div>
                  <h3 className="ts-card-title">DevFolio Dark</h3>
                  <p className="ts-card-subtitle">By PortfoliAI Team</p>
                </div>
                <div className="ts-card-rating">
                  <Star color="#FACC15" size={12} fill="currentColor" /> 4.9
                </div>
              </div>
              <div className="ts-card-tags">
                <span className="ts-card-tag">React</span>
                <span className="ts-card-tag">Framer Motion</span>
              </div>
              <div className="ts-card-use">
                <button className="ts-card-use-btn">Use Template</button>
              </div>
            </div>
          </div>

          {/* Template Card 2 */}
          <div className="ts-card ts-glass-panel" onClick={openDrawer}>
            <div className="ts-card-img-container">
              <div className="ts-card-badges">
                <span className="ts-card-badge">
                  <Zap color="#3B82F6" size={12} /> Animated
                </span>
              </div>
              <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/393144a9-2f-488b-a48e-28e461db939c.png" alt="Creative Canvas Template Preview" className="ts-card-img" />
              <div className="ts-card-video">
                <Play color="rgba(255,255,255,0.5)" size={40} fill="currentColor" />
              </div>
            </div>
            <div className="ts-card-content">
              <div className="ts-card-header">
                <div>
                  <h3 className="ts-card-title">Creative Canvas</h3>
                  <p className="ts-card-subtitle">By StudioX</p>
                </div>
                <div className="ts-card-rating">
                  <Star color="#FACC15" size={12} fill="currentColor" /> 4.7
                </div>
              </div>
              <div className="ts-card-tags">
                <span className="ts-card-tag">Design</span>
                <span className="ts-card-tag">GSAP</span>
              </div>
              <div className="ts-card-use">
                <button className="ts-card-use-btn">Use Template</button>
              </div>
            </div>
          </div>

          {/* Template Card 3 */}
          <div className="ts-card ts-glass-panel" onClick={openDrawer}>
            <div className="ts-card-img-container">
              <div className="ts-card-badges">
                <span className="ts-card-badge">
                  <Zap color="#3B82F6" size={12} /> Animated
                </span>
              </div>
              <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/a9c14c5b-9d-481d-bf55-6b5d9cdfc38d.png" alt="Minimalist Writer Template Preview" className="ts-card-img" />
              <div className="ts-card-video">
                <Play color="rgba(255,255,255,0.5)" size={40} fill="currentColor" />
              </div>
            </div>
            <div className="ts-card-content">
              <div className="ts-card-header">
                <div>
                  <h3 className="ts-card-title">Bento Grid Pro</h3>
                  <p className="ts-card-subtitle">By UI Masters</p>
                </div>
                <div className="ts-card-rating">
                  <Star color="#FACC15" size={12} fill="currentColor" /> 4.8
                </div>
              </div>
              <div className="ts-card-tags">
                <span className="ts-card-tag">Product</span>
                <span className="ts-card-tag">CSS Grid</span>
              </div>
              <div className="ts-card-use">
                <button className="ts-card-use-btn">Use Template</button>
              </div>
            </div>
          </div>

        </section>
      </main>

      {/* Drawer Overlay */}
      <div 
        className={`ts-drawer-overlay ${drawerOpen ? 'open' : ''}`}
        onClick={closeDrawer}
      ></div>
      
      {/* Template Detail Drawer */}
      <div className={`ts-drawer ts-glass-panel ${drawerOpen ? 'open' : ''}`}>
        <div className="ts-drawer-header">
          <h2>Template Details</h2>
          <button className="ts-drawer-close" onClick={closeDrawer}>
            <X size={16} />
          </button>
        </div>

        <div className="ts-drawer-content">
          {/* Large Preview */}
          <div className="ts-drawer-preview">
            <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/7b322a4d-49-411a-8fc7-6a4d70a98f1f.png" alt="DevFolio Dark Full Preview" />
            <div className="ts-drawer-preview-overlay">
              <button className="ts-fullscreen-btn">
                <Maximize size={16} /> Fullscreen Preview
              </button>
            </div>
          </div>

          <div className="ts-drawer-details">
            <div className="ts-drawer-title-row">
              <div>
                <h1 className="ts-drawer-title">DevFolio Dark</h1>
                <p className="ts-drawer-author">Created by <span>PortfoliAI Team</span></p>
              </div>
              <div className="ts-drawer-users">1.2k Users</div>
            </div>

            <p className="ts-drawer-desc">
              A sleek, dark-themed portfolio designed specifically for developers and software engineers. Features integrated GitHub stats, a terminal-style animated intro, and smooth page transitions powered by Framer Motion.
            </p>

            <div className="ts-drawer-grid">
              <div className="ts-drawer-grid-item">
                <span className="ts-dgi-label">Industry</span>
                <span className="ts-dgi-value">Software Development</span>
              </div>
              <div className="ts-drawer-grid-item">
                <span className="ts-dgi-label">Animation Level</span>
                <span className="ts-dgi-value"><Zap color="#3B82F6" size={14} /> High (Complex)</span>
              </div>
              <div className="ts-drawer-grid-item">
                <span className="ts-dgi-label">Color Scheme</span>
                <div className="ts-colors-gap">
                  <div className="ts-color-dot" style={{ backgroundColor: '#0F172A' }}></div>
                  <div className="ts-color-dot" style={{ backgroundColor: '#3B82F6' }}></div>
                  <div className="ts-color-dot" style={{ backgroundColor: '#10B981' }}></div>
                </div>
              </div>
              <div className="ts-drawer-grid-item">
                <span className="ts-dgi-label">Layout Type</span>
                <span className="ts-dgi-value">Single Page Scroll</span>
              </div>
            </div>
            
            <div className="ts-features">
              <h3>Key Features</h3>
              <ul>
                <li><Check color="#3B82F6" size={14} /> Auto-fetches GitHub repositories</li>
                <li><Check color="#3B82F6" size={14} /> Terminal typing animation effect</li>
                <li><Check color="#3B82F6" size={14} /> Interactive tech stack grid</li>
                <li><Check color="#3B82F6" size={14} /> Dark mode optimized</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="ts-drawer-footer">
          <button className="ts-btn-primary">
            Use this template <ArrowRight size={16} />
          </button>
          <button className="ts-btn-secondary">
            <Eye size={16} /> Preview in new tab
          </button>
        </div>
      </div>
    </div>
  );
}
