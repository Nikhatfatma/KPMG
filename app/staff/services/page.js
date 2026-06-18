"use client";
import { useRouter } from "next/navigation";
import { showToast, openModal, closeModal } from "@/lib/store";

export default function S_servicesPage() {
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
            <div className="eyebrow">Service types</div>
            <h1>Cyprus residency portfolio</h1>
            <div className="sub">Each service is mapped to a template and syncs to the Zoho Deal custom field "Service Type"</div>
          </div>
          <div className="actions">
            <button className="btn blue sm" onClick={() => { openModal('add-service') }}><i className="ti ti-plus"></i> New service type</button>
          </div>
        </div>

        <div className="two-col even">
          <div className="svc-card">
            <div className="lab">Insights · Cyprus residency</div>
            <h3>Fast Track (Permanent Residence)</h3>
            <p>Cyprus Reg. 6.2 · investor route · lifetime validity · no Cyprus employment permitted · 18 active projects · 94% approval rate over the last 12 months</p>
            <div className="key-facts">
              <div className="kf"><span className="lab">Min. investment</span><span className="val">€300,000</span></div>
              <div className="kf"><span className="lab">Min. income</span><span className="val">€50,000 / year</span></div>
              <div className="kf"><span className="lab">Processing</span><span className="val">2–6 months</span></div>
              <div className="kf"><span className="lab">Validity</span><span className="val">Lifetime</span></div>
              <div className="kf" style={{gridColumn: '1 / -1'}}><span className="lab">Gov. fees</span><span className="val">€500 submission + €70 registration / person</span></div>
            </div>
            <div className="foot">
              <span><i className="ti ti-template" style={{marginRight: '4px'}}></i> Cyprus-FastTrack-PR v1</span>
              <span style={{background: 'rgba(67,224,199,0.2)', color: 'var(--cyan)', padding: '3px 8px', borderRadius: '2px', fontSize: '11px', fontWeight: '700'}}>ACTIVE</span>
            </div>
          </div>
          <div className="svc-card">
            <div className="lab">Insights · Cyprus residency</div>
            <h3>Pink Slip (Temporary Residence Permit)</h3>
            <p>Cyprus temporary residence · non-EU nationals of independent means · renewable yearly · 22 active projects · 91% approval rate over the last 12 months</p>
            <div className="key-facts">
              <div className="kf"><span className="lab">Min. income</span><span className="val">€24,000 / year</span></div>
              <div className="kf"><span className="lab">Bank deposit</span><span className="val">€10,000 in Cyprus bank</span></div>
              <div className="kf"><span className="lab">Processing</span><span className="val">4–8 months</span></div>
              <div className="kf"><span className="lab">Validity</span><span className="val">1 year, renewable</span></div>
              <div className="kf" style={{gridColumn: '1 / -1'}}><span className="lab">Gov. fees</span><span className="val">€70–€140 per person</span></div>
            </div>
            <div className="foot">
              <span><i className="ti ti-template" style={{marginRight: '4px'}}></i> Cyprus-PinkSlip-temp v1</span>
              <span style={{background: 'rgba(67,224,199,0.2)', color: 'var(--cyan)', padding: '3px 8px', borderRadius: '2px', fontSize: '11px', fontWeight: '700'}}>ACTIVE</span>
            </div>
          </div>
        </div>
      </>
  );
}
