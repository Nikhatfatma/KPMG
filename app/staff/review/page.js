"use client";
import { useRouter } from "next/navigation";
import { showToast, openModal, closeModal } from "@/lib/store";

export default function S_reviewPage() {
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
        <div className="crumbs"><a onClick={() => { routerPush('s-project-review') }}>Review queue</a> <i className="ti ti-chevron-right"></i> <a onClick={() => { routerPush('s-project-review') }}>James Smith</a> <i className="ti ti-chevron-right"></i> Proof of investment</div>
        <div className="ph">
          <div className="lhs">
            <div className="eyebrow">Document review</div>
            <h1>Verify proof of investment</h1>
            <div className="sub">Submitted by James Smith · Fast Track (Permanent Residence) · viewing detail of an item from the application review</div>
          </div>
          <div className="actions">
            <button className="btn ghost sm" onClick={() => { routerPush('s-project-review') }}><i className="ti ti-arrow-left"></i> Back to application</button>
            <button className="btn ghost sm" onClick={() => { showToast('Next document in queue', 'In production: cycles through pending documents') }}>Next <i className="ti ti-arrow-right"></i></button>
          </div>
        </div>

        <div className="review-grid">
          <div>
            <div className="preview-pane">
              <i className="ti ti-file-type-pdf"></i>
              <div className="ttl">james_sale_agreement_dls_limassol.pdf</div>
              <div className="sub">page 1 of 22 · 3.2 MB · uploaded 4 hours ago</div>
              <div className="pcontrols">
                <button className="btn ghost xs" onClick={() => showToast('Zoom in', 'Preview zoomed to fit width')} title="Zoom in"><i className="ti ti-zoom-in"></i></button>
                <button className="btn ghost xs" onClick={() => showToast('Download started', 'james_sale_agreement_dls_limassol.pdf · 3.2 MB')} title="Download"><i className="ti ti-download"></i></button>
                <button className="btn ghost xs" onClick={() => showToast('Opening in new tab', 'In production: opens the original file in a viewer')} title="Open in new tab"><i className="ti ti-external-link"></i></button>
              </div>
            </div>
          </div>
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px'}}>
              <span className="ai-pill"><i className="ti ti-sparkles"></i> AI extraction</span>
              <span style={{fontSize: '11px', color: 'var(--gray-500)'}}>2.3s · 96% confidence</span>
            </div>
            <div className="card" style={{marginBottom: '18px'}}>
              <div className="card-b">
                <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '10px 16px', fontSize: '13px', alignItems: 'center'}}>
                  <span style={{color: 'var(--gray-600)'}}>Document type</span><span style={{fontWeight: '600'}}>DLS sale agreement</span><i className="ti ti-check" style={{color: 'var(--green)'}}></i>
                  <span style={{color: 'var(--gray-600)'}}>Property</span><span>Block B, Apt 302, Limassol</span><i className="ti ti-check" style={{color: 'var(--green)'}}></i>
                  <span style={{color: 'var(--gray-600)'}}>Buyer</span><span>James Smith</span><i className="ti ti-check" style={{color: 'var(--green)'}}></i>
                  <span style={{color: 'var(--gray-600)'}}>Seller</span><span>Cyprus Luxury Homes Ltd</span><i className="ti ti-check" style={{color: 'var(--green)'}}></i>
                  <span style={{color: 'var(--gray-600)'}}>Investment amount</span><span>€320,000</span><i className="ti ti-check" style={{color: 'var(--green)'}}></i>
                  <span style={{color: 'var(--gray-600)'}}>Category</span><span>A · Residential</span><i className="ti ti-check" style={{color: 'var(--green)'}}></i>
                </div>
              </div>
            </div>
            <div className="label-stripe">Verification checks</div>
            <div className="card" style={{marginBottom: '18px'}}>
              <div className="card-b" style={{padding: '4px 18px'}}>
                <div className="check-row ok"><span className="ci"><i className="ti ti-check"></i> Buyer name matches passport</span></div>
                <div className="check-row ok"><span className="ci"><i className="ti ti-check"></i> Meets €300k Cat. A minimum</span></div>
                <div className="check-row ok"><span className="ci"><i className="ti ti-check"></i> DLS stamp detected on all pages</span></div>
                <div className="check-row alert"><span className="ci"><i className="ti ti-alert-triangle"></i> Only 2 of 3 payment receipts attached</span><span className="badge warn">Manual check</span></div>
                <div className="check-row ok"><span className="ci"><i className="ti ti-check"></i> Developer is on approved Reg. 6.2 list</span></div>
              </div>
            </div>
            <div className="form-field" style={{marginBottom: '16px'}}>
              <label>Comment to client (optional)</label>
              <div className="area">Add a note for the client...</div>
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
              <button className="btn full" onClick={() => { showToast('Document approved', 'Proof of investment marked verified · returning to application'); routerPush('s-project-review') }}><i className="ti ti-check"></i> Approve</button>
              <button className="btn ghost full" onClick={() => { showToast('Changes requested', 'James will be notified by email with your comment'); routerPush('s-project-review') }}><i className="ti ti-arrow-back-up"></i> Request changes</button>
            </div>
          </div>
        </div>
      </>
  );
}
