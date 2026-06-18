"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { showToast, openModal, closeModal } from "@/lib/store";

export default function C_appsPage() {
  const router = useRouter();
  const [appsFilter, setAppsFilter] = useState("all");
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
            <div className="eyebrow">Applications</div>
            <h1>My applications</h1>
            <div className="sub">3 total · 1 needs your attention · 1 in review · 1 approved</div>
          </div>
          <div className="actions">
            <button className="btn ghost sm" onClick={() => { showToast('Filters opened', 'In production: filter by status, date, owner, service type') }}><i className="ti ti-filter"></i> Filter</button>
            <button className="btn ghost sm" onClick={() => { showToast('Exporting applications', 'Your CSV will download shortly') }}><i className="ti ti-download"></i> Export</button>
          </div>
        </div>

        <div className="filter-bar" id="apps-filter">
          <span className={`chip${appsFilter === 'all' ? ' on' : ''}`} onClick={() => setAppsFilter('all')} style={{cursor: 'pointer'}}>All <span style={{opacity: '0.8', marginLeft: '3px'}}>3</span></span>
          <span className={`chip${appsFilter === 'warn' ? ' on' : ''}`} onClick={() => setAppsFilter('warn')} style={{cursor: 'pointer'}}>Action needed <span style={{opacity: '0.6', marginLeft: '3px'}}>1</span></span>
          <span className={`chip${appsFilter === 'info' ? ' on' : ''}`} onClick={() => setAppsFilter('info')} style={{cursor: 'pointer'}}>In review <span style={{opacity: '0.6', marginLeft: '3px'}}>1</span></span>
          <span className={`chip${appsFilter === 'ok' ? ' on' : ''}`} onClick={() => setAppsFilter('ok')} style={{cursor: 'pointer'}}>Approved <span style={{opacity: '0.6', marginLeft: '3px'}}>1</span></span>
          <span style={{marginLeft: 'auto', fontSize: '12px', color: 'var(--gray-600)'}}>Sort by: <a onClick={() => showToast('Sort applied', 'Cycling: Deadline → Status → Service')} style={{color: 'var(--navy)', fontWeight: '600', cursor: 'pointer'}}>Deadline ↓</a></span>
        </div>

        <div className="card">
          <div className="card-b" style={{padding: '0'}}>
            <table className="tbl" id="apps-table">
              <thead>
                <tr>
                  <td>Application</td>
                  <td>Service</td>
                  <td>Status</td>
                  <td>Progress</td>
                  <td>Deadline</td>
                  <td>Owner</td>
                  <td style={{width: '32px'}}></td>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'a1', name: "Fast Track (Permanent Residence)", sub: "Started May 02, 2026 · 4/11 docs, 4/7 answers", svc: "Fast Track PR", status: "Action needed", variant: "warn", progress: 40, deadline: "Jul 11, 2026", days: "60 days left", owner: "AM" },
                  { id: 'a2', name: "Pink Slip 2026 renewal", sub: "Started Apr 18, 2026 · all docs uploaded · awaiting verification", svc: "Pink Slip", status: "In review", variant: "info", progress: 90, deadline: "Jul 02, 2026", days: "51 days left", owner: "RK" },
                  { id: 'a3', name: "Pink Slip 2025", sub: "Approved May 03, 2025 · valid until May 03, 2026", svc: "Pink Slip", status: "Approved", variant: "ok", progress: 100, deadline: "Completed", days: "May 03, 2025", owner: "AM" },
                ]
                .filter(a => appsFilter === 'all' || a.variant === appsFilter)
                .map((a) => (
                  <tr key={a.id} data-status={a.variant} onClick={() => { routerPush('c-project') }}>
                    <td>
                      <div style={{fontWeight: '700', color: 'var(--navy)', fontSize: '14px'}}>{a.name}</div>
                      <div style={{fontSize: '11px', color: 'var(--gray-600)', marginTop: '2px'}}>{a.sub}</div>
                    </td>
                    <td>{a.svc}</td>
                    <td><span className={`badge ${a.variant} dot`}>{a.status}</span></td>
                    <td><div className="progress-cell"><div className="bar"><div style={{background: `var(--${a.variant === 'ok' ? 'green' : a.variant === 'info' ? 'blue' : 'amber'})`, width: `${a.progress}%`}}></div></div><span className="pct">{a.progress}%</span></div></td>
                    <td>
                      <div style={{fontWeight: '600'}}>{a.deadline}</div>
                      <div style={{fontSize: '11px', color: a.variant === 'warn' ? 'var(--amber)' : 'var(--gray-600)'}}>{a.days}</div>
                    </td>
                    <td><div className={`avatar ${a.owner === 'AM' ? 'navy' : 'purple'} sm`}>{a.owner}</div></td>
                    <td><i className="ti ti-chevron-right" style={{color: 'var(--gray-400)'}}></i></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--gray-600)'}}>
          <div>Showing 3 of 3 applications</div>
          <div>Need a new application? <a onClick={() => { showToast('Reach out to your advisor', 'Anjali Mehta will send you a new request') }} style={{color: 'var(--blue)', fontWeight: '600', cursor: 'pointer'}}>Request one</a></div>
        </div>
      </>
  );
}
