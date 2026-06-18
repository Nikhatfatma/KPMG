"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { showToast, openModal, closeModal } from "@/lib/store";

export default function S_templates_listPage() {
  const router = useRouter();
  const [tplFilter, setTplFilter] = useState("all");
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
            <div className="eyebrow">Templates</div>
            <h1>Document templates</h1>
            <div className="sub">2 total · 2 active · used by 40 active projects</div>
          </div>
          <div className="actions">
            <button className="btn ghost sm" onClick={() => { showToast('Filters opened') }}><i className="ti ti-filter"></i> Filter</button>
            <button className="btn blue sm" onClick={() => { openModal('create-template') }}><i className="ti ti-plus"></i> Create new template</button>
          </div>
        </div>

        <div className="filter-bar" id="tpl-filter">
          <span className={`chip${tplFilter === 'all' ? ' on' : ''}`} onClick={() => setTplFilter('all')} style={{cursor: 'pointer'}}>All <span style={{opacity: '0.8', marginLeft: '3px'}}>2</span></span>
          <span className={`chip${tplFilter === 'ok' ? ' on' : ''}`} onClick={() => setTplFilter('ok')} style={{cursor: 'pointer'}}>Active <span style={{opacity: '0.6', marginLeft: '3px'}}>2</span></span>
          <span style={{marginLeft: 'auto', fontSize: '12px', color: 'var(--gray-600)'}}>Sort by: <a onClick={() => showToast('Sort applied', 'Cycling: Most used → Last edited → Name')} style={{color: 'var(--navy)', fontWeight: '600', cursor: 'pointer'}}>Most used ↓</a></span>
        </div>

        <div className="template-grid" id="tpl-grid">
          {(tplFilter === 'all' || tplFilter === 'ok') && (
            <div className="template-card" data-status="ok" onClick={() => { routerPush('s-templates') }}>
              <div className="t-top">
                <div className="t-icon"><i className="ti ti-template"></i></div>
                <span className="badge ok dot">Active</span>
              </div>
              <h3>Cyprus-FastTrack-PR</h3>
              <p className="t-svc">Fast Track · Cyprus permanent residence (Reg. 6.2)</p>
              <div className="t-stats">
                <div className="t-stat"><span className="num">11</span><span className="lab">Docs</span></div>
                <div className="t-stat"><span className="num">7</span><span className="lab">Questions</span></div>
                <div className="t-stat"><span className="num">18</span><span className="lab">Projects</span></div>
              </div>
              <div className="t-foot">
                <span className="t-version">v1</span>
                <span>Edited 3 days ago</span>
              </div>
            </div>
          )}

          {(tplFilter === 'all' || tplFilter === 'ok') && (
            <div className="template-card" data-status="ok" onClick={() => { routerPush('s-templates') }}>
              <div className="t-top">
                <div className="t-icon"><i className="ti ti-template"></i></div>
                <span className="badge ok dot">Active</span>
              </div>
              <h3>Cyprus-PinkSlip-temp</h3>
              <p className="t-svc">Pink Slip · Cyprus temporary residence permit</p>
              <div className="t-stats">
                <div className="t-stat"><span className="num">11</span><span className="lab">Docs</span></div>
                <div className="t-stat"><span className="num">7</span><span className="lab">Questions</span></div>
                <div className="t-stat"><span className="num">22</span><span className="lab">Projects</span></div>
              </div>
              <div className="t-foot">
                <span className="t-version">v1</span>
                <span>Edited yesterday</span>
              </div>
            </div>
          )}

          <div className="template-card new" data-status="all" onClick={() => { openModal('create-template') }}>
            <div className="new-icon"><i className="ti ti-plus"></i></div>
            <h3>Create new template</h3>
            <p>Start from blank, duplicate an existing one, or import from a Word document</p>
          </div>
        </div>

        <div style={{marginTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--gray-600)'}}>
          <div>Showing 2 templates</div>
          <div>Need a template you don't see? <a onClick={() => { openModal('create-template') }} style={{color: 'var(--blue)', fontWeight: '600', cursor: 'pointer'}}>Create one →</a></div>
        </div>
      </>
  );
}
