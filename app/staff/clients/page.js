"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { showToast, openModal, closeModal, useClientsStore } from "@/lib/store";

export default function S_clientsPage() {
  const router = useRouter();
  const allClients = useClientsStore((s) => s.clients);
  const [clientFilter, setClientFilter] = useState("all");
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
            <div className="eyebrow">Clients</div>
            <h1>{allClients.length} clients</h1>
            <div className="sub">38 synced from Zoho · 12 stale records · 8 inactive over 90 days</div>
          </div>
          <div className="actions">
            <button className="btn ghost sm" onClick={() => { showToast('Filters applied') }}><i className="ti ti-filter"></i> Filter</button>
            <button className="btn ghost sm" onClick={() => { showToast('Exporting client list', `CSV with ${allClients.length} rows will download shortly`) }}><i className="ti ti-download"></i> Export</button>
            <button className="btn blue sm" onClick={() => { openModal('add-client') }}><i className="ti ti-plus"></i> Add client</button>
          </div>
        </div>

        <div className="filter-bar">
          <span className={`chip${clientFilter === 'all' ? ' on' : ''}`} onClick={() => setClientFilter('all')} style={{cursor: 'pointer'}}>All</span>
          <span className={`chip${clientFilter === 'Active' ? ' on' : ''}`} onClick={() => setClientFilter('Active')} style={{cursor: 'pointer'}}>Active <span style={{opacity: '0.6'}}>40</span></span>
          <span className={`chip${clientFilter === 'Pending' ? ' on' : ''}`} onClick={() => setClientFilter('Pending')} style={{cursor: 'pointer'}}>Pending <span style={{opacity: '0.6'}}>19</span></span>
          <span className={`chip${clientFilter === 'Submitted' ? ' on' : ''}`} onClick={() => setClientFilter('Submitted')} style={{cursor: 'pointer'}}>Submitted <span style={{opacity: '0.6'}}>28</span></span>
          <span className={`chip${clientFilter === 'Stale' ? ' on' : ''}`} onClick={() => setClientFilter('Stale')} style={{cursor: 'pointer'}}>Stale <span style={{opacity: '0.6'}}>12</span></span>
          <span className={`chip${clientFilter === 'Zoho' ? ' on' : ''}`} onClick={() => setClientFilter('Zoho')} style={{cursor: 'pointer'}}>Zoho synced <span style={{opacity: '0.6'}}>38</span></span>
        </div>

        <div className="card">
          <div className="card-b" style={{padding: '0'}}>
            <table className="tbl">
              <thead>
                <tr>
                  <td style={{width: '24px'}}><i className="ti ti-square"></i></td>
                  <td>Client</td>
                  <td>Service</td>
                  <td>Family</td>
                  <td>Status</td>
                  <td>Progress</td>
                  <td>Owner</td>
                  <td>Source</td>
                  <td style={{width: '32px'}}></td>
                </tr>
              </thead>
              <tbody>
                {allClients
                  .filter(c => {
                    if (clientFilter === "all") return true;
                    if (clientFilter === "Zoho") return c.source === "Zoho";
                    return c.status === clientFilter;
                  })
                  .map((c) => (
                  <tr key={c.id} onClick={() => { 
                    // Map client ID to project ID for this prototype
                    const idMap = { 'dv': 'p1', 'oc': 'p2', 'ps': 'p3', 'na': 'p4', 'jw': 'p5' };
                    const pid = idMap[c.id] || 'p1';
                    router.push(`/staff/project-review?id=${pid}`);
                  }}>
                    <td><i className="ti ti-square"></i></td>
                    <td>
                      <div className="who">
                        <div className={`avatar ${c.color}`}>{c.initials}</div>
                        <div>
                          <div className="nm">{c.name}</div>
                          <div className="em">{c.email} · {c.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td>{c.suggestLabel || "Fast Track PR"}</td>
                    <td>
                      {c.familyCount ? (
                        <span className="badge purple" style={{fontSize: '10px'}}><i className="ti ti-users" style={{fontSize: '10px'}}></i> {c.familyCount} members</span>
                      ) : (
                        <span className="badge mu" style={{fontSize: '10px'}}><i className="ti ti-user" style={{fontSize: '10px'}}></i> Solo</span>
                      )}
                    </td>
                    <td>
                      {c.status === 'Submitted' ? <span className="badge ok dot">Submitted</span> :
                       c.status === 'Stale' ? <span className="badge da dot">Stale</span> :
                       <span className="badge warn dot">Docs pending</span>}
                    </td>
                    <td><div className="progress-cell"><div className="bar"><div style={{background: c.status === 'Submitted' ? 'var(--green)' : 'var(--amber)', width: c.status === 'Submitted' ? '100%' : '40%'}}></div></div><span className="pct">{c.status === 'Submitted' ? '100%' : '40%'}</span></div></td>
                    <td><div className="avatar navy sm">AM</div></td>
                    <td>
                      {c.source === 'Zoho' ? (
                        <span className="badge cyan">Zoho</span>
                      ) : (
                        <span className="badge mu">Manual</span>
                      )}
                    </td>
                    <td><i className="ti ti-dots-vertical" style={{color: 'var(--gray-500)'}}></i></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
  );
}
