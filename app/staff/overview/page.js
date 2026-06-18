"use client";
import { useRouter } from "next/navigation";
import { showToast, openModal, closeModal } from "@/lib/store";

export default function S_overviewPage() {
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
            <div className="eyebrow">Insights</div>
            <h1>Cyprus Documents Portal</h1>
            <div className="sub">6 staff · 134 clients · today is Tue, May 12, 2026</div>
          </div>
          <div className="actions">
            <button className="btn ghost sm" onClick={() => { showToast('Filters opened') }}><i className="ti ti-filter"></i> Filter</button>
            <button className="btn ghost sm" onClick={() => { showToast('Last 30 days', 'Date range changed — overview metrics refreshed') }}><i className="ti ti-calendar"></i> Last 30 days</button>
            <button className="btn blue sm" onClick={() => { routerPush('s-request') }}><i className="ti ti-send"></i> New request</button>
          </div>
        </div>

        <div className="metrics-grid">
          <div className="metric"><div className="ml">Active projects</div><div className="mv">40</div><div className="mt"><i className="ti ti-trending-up"></i> +5 this week</div></div>
          <div className="metric"><div className="ml">Review queue</div><div className="mv">12</div><div className="mt"><i className="ti ti-trending-down"></i> −3 vs last week</div></div>
          <div className="metric"><div className="ml">Avg completion</div><div className="mv">11d</div><div className="mt"><i className="ti ti-trending-down"></i> 2 days faster</div></div>
          <div className="metric"><div className="ml">Approval rate</div><div className="mv">93%</div><div className="mt"><i className="ti ti-trending-up"></i> +3 points</div></div>
        </div>

        <div className="two-col">
          <div className="card">
            <div className="card-h"><h3>Projects by stage</h3><a className="btn ghost xs" onClick={() => { routerPush('s-projects') }}>View board <i className="ti ti-arrow-right"></i></a></div>
            <div className="card-b">
              <div className="stat-bars">
                <div className="stat-bar"><div className="sl"><span className="nm">New request</span><span className="vl">8</span></div><div className="bar"><div style={{background: 'var(--gray-500)', width: '17%'}}></div></div></div>
                <div className="stat-bar"><div className="sl"><span className="nm">Collecting documents</span><span className="vl">19</span></div><div className="bar"><div style={{background: 'var(--amber)', width: '40%'}}></div></div></div>
                <div className="stat-bar"><div className="sl"><span className="nm">Under review</span><span className="vl">12</span></div><div className="bar"><div style={{background: 'var(--blue)', width: '26%'}}></div></div></div>
                <div className="stat-bar"><div className="sl"><span className="nm">Submitted to Authorities</span><span className="vl">5</span></div><div className="bar"><div style={{background: 'var(--purple)', width: '11%'}}></div></div></div>
                <div className="stat-bar"><div className="sl"><span className="nm">Submitted</span><span className="vl">3</span></div><div className="bar"><div style={{background: 'var(--green)', width: '6%'}}></div></div></div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-h">
              <h3>Live activity</h3>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <select style={{fontSize: '11px', padding: '2px 4px', border: '1px solid var(--gray-200)', borderRadius: '3px'}} onChange={(e) => showToast('Activity filtered', `Showing ${e.target.value === 'me' ? 'only your' : 'all'} activity`)}>
                  <option value="me">My activity</option>
                  <option value="all">All staff</option>
                </select>
                <a className="btn ghost xs" onClick={() => showToast('Full activity log', 'Navigating to detailed activity audit trail...')}>View Full Activity</a>
              </div>
            </div>
            <div className="card-b">
              <div className="timeline">
                <div className="tl-item"><span className="badge purple">Upload</span> James Smith uploaded <b>SWIFT confirmation</b><div className="tt">2 min ago · Fast Track PR</div></div>
                <div className="tl-item"><span className="badge ok">Approve</span> Rohan approved 3 documents for <b>James Wallace</b><div className="tt">12 min ago · Pink Slip renewal</div></div>
                <div className="tl-item"><span className="badge cyan">CRM sync</span> New lead <b>Dmitri Volkov</b> synced from Zoho<div className="tt">1 hour ago</div></div>
                <div className="tl-item"><span className="badge info">Send</span> Request sent to <b>Olivia Chen</b><div className="tt">3 hours ago · Fast Track PR</div></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-h"><h3>Active Customers</h3><a className="btn ghost xs" onClick={() => { routerPush('s-clients') }}>See all 134 <i className="ti ti-arrow-right"></i></a></div>
          <div className="card-b" style={{padding: '0'}}>
            <table className="tbl">
              <thead><tr><td>Client</td><td>Service</td><td>Status</td><td>Progress</td><td>Owner</td></tr></thead>
              <tbody>
                <tr onClick={() => { routerPush('s-project-review') }}><td><div className="who"><div className="avatar navy sm">JS</div><div><div className="nm">James Smith</div><div className="em">james@smith-holdings.uk</div></div></div></td><td>Fast Track PR</td><td><span className="badge warn dot">Docs pending</span></td><td><div className="progress-cell"><div className="bar"><div style={{background: 'var(--amber)', width: '40%'}}></div></div><span className="pct">40%</span></div></td><td><div className="avatar navy sm">AM</div></td></tr>
                <tr onClick={() => { routerPush('s-project-review') }}><td><div className="who"><div className="avatar cyan sm">JW</div><div><div className="nm">James Wallace</div><div className="em">james@wallace-digital.uk</div></div></div></td><td>Pink Slip renewal</td><td><span className="badge info dot">In review</span></td><td><div className="progress-cell"><div className="bar"><div style={{background: 'var(--blue)', width: '90%'}}></div></div><span className="pct">90%</span></div></td><td><div className="avatar purple sm">RK</div></td></tr>
                <tr onClick={() => { routerPush('s-clients') }}><td><div className="who"><div className="avatar purple sm">DV</div><div><div className="nm">Dmitri Volkov</div><div className="em">d.volkov@volkov-cap.com</div></div></div></td><td>Fast Track PR</td><td><span className="badge mu dot">New request</span></td><td><div className="progress-cell"><div className="bar"><div style={{background: 'var(--gray-500)', width: '5%'}}></div></div><span className="pct">5%</span></div></td><td><div className="avatar navy sm">AM</div></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
  );
}
