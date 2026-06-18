"use client";
import { useRouter } from "next/navigation";
import { showToast, openModal, closeModal, useProjectsStore } from "@/lib/store";
import { useState, useMemo } from "react";

export default function S_projectsPage() {
  const router = useRouter();
  const allProjects = useProjectsStore((s) => s.projects);
  const [svcFilter, setSvcFilter] = useState("all");
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

  const projects = useMemo(() => {
    if (svcFilter === "all") return allProjects;
    return allProjects.filter(p => p.service.toLowerCase().includes(svcFilter.toLowerCase()));
  }, [svcFilter, allProjects]);

  return (
    <>
        <div className="ph">
          <div className="lhs">
            <div className="eyebrow">Pipeline</div>
            <h1>Projects board</h1>
            <div className="sub">40 active · 5 stages · drag cards to update status</div>
          </div>
          <div className="actions">
            <button className="btn ghost sm" onClick={() => { showToast('Filters applied') }}><i className="ti ti-filter"></i> Filter</button>
            <button className="btn ghost sm" onClick={() => { showToast('Switched to list view', 'In production: shows the same projects in a sortable table') }}><i className="ti ti-list"></i> List view</button>
            <button className="btn blue sm" onClick={() => { routerPush('s-request') }}><i className="ti ti-plus"></i> New project</button>
          </div>
        </div>

        <div className="filter-bar">
          <span className={`chip ${svcFilter === 'all' ? 'on' : ''}`} onClick={() => setSvcFilter('all')} style={{cursor: 'pointer'}}>All services <span style={{opacity: '0.8', marginLeft: '3px'}}>{allProjects.length}</span></span>
          <span className={`chip ${svcFilter === 'Fast Track' ? 'on' : ''}`} onClick={() => setSvcFilter('Fast Track')} style={{cursor: 'pointer'}}>Fast Track PR <span style={{opacity: '0.6', marginLeft: '3px'}}>{allProjects.filter(p => p.service.includes('Fast Track')).length}</span></span>
          <span className={`chip ${svcFilter === 'Pink Slip' ? 'on' : ''}`} onClick={() => setSvcFilter('Pink Slip')} style={{cursor: 'pointer'}}>Pink Slip <span style={{opacity: '0.6', marginLeft: '3px'}}>{allProjects.filter(p => p.service.includes('Pink Slip')).length}</span></span>
          <span style={{marginLeft: 'auto', fontSize: '12px', color: 'var(--gray-600)'}}>Sort by: <a onClick={() => showToast('Sort applied', 'Cycling: Deadline → Last activity → Client name')} style={{color: 'var(--navy)', fontWeight: '600', cursor: 'pointer'}}>Deadline ↓</a></span>
        </div>

        <div className="kanban">
          <div className="k-col">
            <h5>New request <span className="badge mu">{projects.filter(p => p.status === "New request").length}</span></h5>
            {projects.filter(p => p.status === "New request").map(p => (
              <div key={p.id} className="k-card" onClick={() => { router.push(`/staff/project-review?id=${p.id}`) }}>
                <div className="kn">{p.clientName}</div>
                <div className="km">{p.service} · {p.timestamp ? "just sent" : "2d"}</div>
                <div className="kr"><span className={`badge ${p.source === 'Zoho' ? 'cyan' : 'mu'}`}>{p.source || 'manual'}</span><div className={`avatar ${p.color} sm`}>{p.initials}</div></div>
              </div>
            ))}
          </div>
          <div className="k-col">
            <h5>Docs pending <span className="badge warn">{projects.filter(p => p.status === "Docs pending").length}</span></h5>
            {projects.filter(p => p.status === "Docs pending").map(p => (
              <div key={p.id} className="k-card" onClick={() => { router.push(`/staff/project-review?id=${p.id}`) }}>
                <div className="kn">{p.clientName}</div>
                <div className="km">{p.service} · {p.progress ? "60d left" : "45d"}</div>
                <div className="kr"><span className="badge warn">{p.docStats || "0/0"}</span><div className={`avatar ${p.color} sm`}>{p.initials}</div></div>
              </div>
            ))}
          </div>
          <div className="k-col">
            <h5>Under review <span className="badge info">{projects.filter(p => p.status === "Under review").length}</span></h5>
            {projects.filter(p => p.status === "Under review").map(p => (
              <div key={p.id} className="k-card" onClick={() => { router.push(`/staff/project-review?id=${p.id}`) }}>
                <div className="kn">{p.clientName}</div>
                <div className="km">{p.service} · {p.timestamp ? "new" : "4d"}</div>
                <div className="kr"><span className="badge info">{p.docStats || "ok"}</span><div className={`avatar ${p.color} sm`}>{p.initials}</div></div>
              </div>
            ))}
          </div>
          <div className="k-col">
            <h5>Submitted <span className="badge purple">2</span></h5>
            <div className="k-card"><div className="kn">Sahil Khanna</div><div className="km">Fast Track PR · May 8</div><div className="kr"><span className="badge purple">Authorities</span><div className="avatar navy sm">SK</div></div></div>
            <div className="k-card"><div className="kn">Karan Mehta</div><div className="km">Pink Slip · May 6</div><div className="kr"><span className="badge purple">Migration Dept</span><div className="avatar purple sm">KM</div></div></div>
          </div>
          <div className="k-col">
            <h5>Done <span className="badge ok">2</span></h5>
            <div className="k-card"><div className="kn">Aarav Singh</div><div className="km">Fast Track PR · May 03</div><div className="kr"><span className="badge ok">Submitted</span><div className="avatar navy sm">AS</div></div></div>
            <div className="k-card"><div className="kn">Meera Iyer</div><div className="km">Pink Slip · Apr 28</div><div className="kr"><span className="badge ok">Submitted</span><div className="avatar navy sm">MI</div></div></div>
          </div>
        </div>
      </>
  );
}
