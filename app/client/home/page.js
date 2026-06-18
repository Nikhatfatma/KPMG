"use client";
import { useRouter } from "next/navigation";
import { showToast, openModal, closeModal } from "@/lib/store";

export default function C_homePage() {
  const router = useRouter();
  const routerPush = (path) => {
    const map = {
      "login": "/login", "otp": "/otp", "role": "/role",
      "c-home": "/client/home", "c-apps": "/client/apps", "c-project": "/client/project", "c-upload": "/client/upload",
      "s-overview": "/staff/overview", "s-projects": "/staff/projects", "s-clients": "/staff/clients",
      "s-templates-list": "/staff/templates", "s-templates": "/staff/template", "s-services": "/staff/services",
      "s-request": "/staff/request", "s-project-review": "/staff/project-review", "s-review": "/staff/review", "s-zoho": "/staff/zoho",
    };
    router.push(map[path] || path);
  };
  // Legacy helper aliases used in inline handlers within the JSX
  const navigate = routerPush;

  return (
    <>
        <div className="ph">
          <div className="lhs">
            <h1>Hello James, welcome to our documents portal.</h1>
            <div className="sub" style={{maxWidth: '600px'}}>My name is Julie, and I am your dedicated Account Manager. I am here to ensure a seamless experience throughout your application journey. Should you require any assistance, please feel free to reach out via the secure messaging tool at any time.</div>
          </div>
          <div className="actions">
            <button className="btn ghost sm" onClick={() => showToast("Export started", "Your application summary will download as a PDF in a moment")}><i className="ti ti-download"></i> Export</button>
          </div>
        </div>

        <div className="card" style={{marginBottom: '24px', background: 'linear-gradient(135deg, #f8faff 0%, #ffffff 100%)', border: '1px solid #e0e7ff'}}>
          <div className="card-h" style={{borderBottom: 'none', paddingBottom: '0'}}>
            <h3 style={{fontSize: '16px', fontWeight: '700', color: 'var(--navy)'}}>How to Use the System</h3>
          </div>
          <div className="card-b">
            <div style={{width: '100%', aspectRatio: '32/9', background: '#f0f2f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1', cursor: 'pointer', transition: 'all 0.2s hover'}} onClick={() => showToast("Video Player", "Tutorial video will be integrated here.")}>
              <div style={{textAlign: 'center'}}>
                <div style={{width: '48px', height: '48px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}>
                  <i className="ti ti-player-play" style={{fontSize: '24px', color: 'var(--blue)', marginLeft: '3px'}}></i>
                </div>
                <div style={{fontSize: '12px', fontWeight: '600', color: 'var(--gray-600)'}}>Click to play tutorial</div>
              </div>
            </div>
          </div>
        </div>

        <div className="metrics-grid">
          <div className="metric">
            <div className="ml">Active</div>
            <div className="mv">2</div>
            <div className="mt"><i className="ti ti-arrow-up-right"></i> +1 this month</div>
          </div>
          <div className="metric">
            <div className="ml">Docs uploaded</div>
            <div className="mv">15<span style={{fontSize: '18px', opacity: '0.7'}}>/33</span></div>
            <div className="mt">45% of total</div>
          </div>
          <div className="metric">
            <div className="ml">Days to deadline</div>
            <div className="mv">60</div>
            <div className="mt">Fast Track · Jul 11</div>
          </div>
          <div className="metric">
            <div className="ml">Completion</div>
            <div className="mv">68%</div>
            <div className="mt"><i className="ti ti-trending-up"></i> +14% this week</div>
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px'}}>
          <div className="label-stripe" style={{margin: '0'}}>Your applications</div>
          <a onClick={() => { routerPush('c-apps') }} style={{fontSize: '12px', color: 'var(--blue)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer'}}>View all 3 <i className="ti ti-arrow-right"></i></a>
        </div>

        <div className="app-card" onClick={() => { routerPush('c-project') }}>
          <div className="ring">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="#E8E8EC" stroke-width="5"/>
              <circle cx="32" cy="32" r="26" fill="none" stroke="#1E49E2" stroke-width="5" stroke-dasharray="163.4" stroke-dashoffset="98" stroke-linecap="round"/>
            </svg>
            <div className="v">40%</div>
          </div>
          <div className="info">
            <div className="info-top">
              <div>
                <h4>Fast Track (Permanent Residence)</h4>
                <div className="meta">Owner: Anjali Mehta · Due Jul 11 · 4 of 15 docs uploaded, 4 of 8 questions answered</div>
              </div>
              <span className="badge warn dot lg">Action needed</span>
            </div>
            <div className="chips">
              <span className="chip"><i className="ti ti-upload"></i> Upload proof of fund transfer</span>
              <span className="chip"><i className="ti ti-help-octagon"></i> 3 questions left</span>
            </div>
          </div>
        </div>

        <div className="app-card" onClick={() => { routerPush('c-project') }}>
          <div className="ring">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="#E8E8EC" stroke-width="5"/>
              <circle cx="32" cy="32" r="26" fill="none" stroke="#00B8A0" stroke-width="5" stroke-dasharray="163.4" stroke-dashoffset="16" stroke-linecap="round"/>
            </svg>
            <div className="v">90%</div>
          </div>
          <div className="info">
            <div className="info-top">
              <div>
                <h4>Pink Slip 2026 renewal (Temporary Residence)</h4>
                <div className="meta">Owner: Rohan Kapoor · Due Jul 02 · All docs uploaded, awaiting verification</div>
              </div>
              <span className="badge info dot lg">In review</span>
            </div>
            <div className="chips">
              <span className="chip"><i className="ti ti-clock"></i> Last update 2 days ago</span>
            </div>
          </div>
        </div>

        <div className="app-card" onClick={() => { routerPush('c-project') }}>
          <div className="ring">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="#E8E8EC" stroke-width="5"/>
              <circle cx="32" cy="32" r="26" fill="none" stroke="#00B8A0" stroke-width="5" stroke-dasharray="163.4" stroke-dashoffset="0" stroke-linecap="round"/>
            </svg>
            <div className="v">100%</div>
          </div>
          <div className="info">
            <div className="info-top">
              <div>
                <h4>Pink Slip 2025 (Temporary Residence)</h4>
                <div className="meta">Completed May 03, 2025 · Approved by Anjali Mehta · valid until May 03, 2026</div>
              </div>
              <span className="badge ok dot lg">Approved</span>
            </div>
          </div>
        </div>
      </>
  );
}
