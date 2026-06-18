"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { showToast, openModal, closeModal } from "@/lib/store";

export default function S_templatesPage() {
  const router = useRouter();
  // Template default estimated completion — stored as a date the user picks;
  // we also compute "+N days from send" so each project sent from this template
  // can roll the delta forward off its own send date.
  const todayPlus = (n) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };
  const [estDate, setEstDate] = useState(todayPlus(60));
  const dayDelta = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(estDate + "T00:00:00");
    if (isNaN(target.getTime())) return 60;
    return Math.max(0, Math.round((target - today) / (1000 * 60 * 60 * 24)));
  })();
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
        <div className="crumbs"><a onClick={() => { routerPush('s-templates-list') }}>Templates</a> <i className="ti ti-chevron-right"></i> Cyprus-FastTrack-PR</div>
        <div className="ph">
          <div className="lhs">
            <div className="eyebrow">Template v1</div>
            <h1>Fast Track — Cyprus permanent residence</h1>
            <div className="sub">Edited 3 days ago by Anjali Mehta · used by 18 active projects</div>
          </div>
          <div className="actions">
            <button className="btn ghost sm" onClick={() => { showToast('Preview mode', 'Opens the form exactly as the client will see it') }}><i className="ti ti-eye"></i> Preview as client</button>
            <button className="btn ghost sm" onClick={() => { showToast('Version history', '1 version · last edited 3 days ago by Anjali Mehta') }}><i className="ti ti-history"></i> Version history</button>
            <button className="btn blue sm" onClick={() => { showToast('Template saved', 'Cyprus-FastTrack-PR v2 is now live — 18 active projects will use the new version') }}>Save changes</button>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label>Mapped service type</label>
            <div className="ipt"><i className="ti ti-stamp"></i> Fast Track (Permanent Residence)</div>
          </div>
          <div className="form-field">
            <label>Default estimated completion date</label>
            <input
              type="date"
              value={estDate}
              min={todayPlus(0)}
              onChange={(e) => setEstDate(e.target.value)}
              style={{width: '100%', padding: '10px 14px', border: '1.5px solid var(--gray-200)', borderRadius: '3px', fontFamily: 'inherit', fontSize: '13px'}}
            />
            <div style={{fontSize: '11px', color: 'var(--gray-600)', marginTop: '4px'}}>
              <i className="ti ti-info-circle" style={{marginRight: '4px', verticalAlign: '-1px'}}></i>
              = {dayDelta} day{dayDelta === 1 ? '' : 's'} from send · each new project will set its own date {dayDelta} day{dayDelta === 1 ? '' : 's'} after going out
            </div>
          </div>
        </div>

        {/* Template Variables — editable per-template values referenced by docs, questions, and AI checks */}
        <div style={{background: 'linear-gradient(135deg, #F4F8FF 0%, #ECF7F4 100%)', border: '1px solid var(--cyan-s)', borderLeft: '3px solid var(--cyan)', padding: '16px 18px', borderRadius: '4px', margin: '4px 0 18px 0'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
            <div>
              <div style={{fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: '6px'}}><i className="ti ti-variable" style={{fontSize: '14px'}}></i> Template variables</div>
              <div style={{fontSize: '11px', color: 'var(--gray-700)', marginTop: '3px'}}>Edit once here — values flow into document descriptions, question hints, and AI validation rules. No code changes needed.</div>
            </div>
            <button className="btn ghost xs" onClick={() => { showToast('Variable history', 'Min. investment last changed Mar 14, 2026 by Anjali Mehta — from €250,000 to €300,000') }}><i className="ti ti-history"></i> History</button>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px'}}>
            <div style={{background: 'white', border: '1px solid var(--gray-200)', padding: '10px 12px', borderRadius: '3px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
                <div style={{fontSize: '9px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gray-600)'}}>Min. investment</div>
                <code style={{fontSize: '9px', color: 'var(--purple)', background: '#F3EBFC', padding: '1px 5px', borderRadius: '2px'}}>{"{{minInvestment}}"}</code>
              </div>
              <input type="text" defaultValue="€300,000" onChange={(e) => { showToast('Variable updated', 'minInvestment changed to ' + e.target.value + ' — 18 active projects will pick up the new value') }} style={{width: '100%', padding: '4px 6px', border: '1px solid var(--gray-200)', borderRadius: '3px', fontFamily: 'inherit', fontSize: '13px', fontWeight: '700', color: 'var(--navy)'}} />
            </div>
            <div style={{background: 'white', border: '1px solid var(--gray-200)', padding: '10px 12px', borderRadius: '3px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
                <div style={{fontSize: '9px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gray-600)'}}>Min. income / yr</div>
                <code style={{fontSize: '9px', color: 'var(--purple)', background: '#F3EBFC', padding: '1px 5px', borderRadius: '2px'}}>{"{{minIncome}}"}</code>
              </div>
              <input type="text" defaultValue="€50,000" onChange={(e) => { showToast('Variable updated', 'minIncome changed to ' + e.target.value) }} style={{width: '100%', padding: '4px 6px', border: '1px solid var(--gray-200)', borderRadius: '3px', fontFamily: 'inherit', fontSize: '13px', fontWeight: '700', color: 'var(--navy)'}} />
            </div>
            <div style={{background: 'white', border: '1px solid var(--gray-200)', padding: '10px 12px', borderRadius: '3px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
                <div style={{fontSize: '9px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gray-600)'}}>Government fees</div>
                <code style={{fontSize: '9px', color: 'var(--purple)', background: '#F3EBFC', padding: '1px 5px', borderRadius: '2px'}}>{"{{govFees}}"}</code>
              </div>
              <input type="text" defaultValue="€500 + €70 / person" onChange={(e) => { showToast('Variable updated', 'govFees changed to ' + e.target.value) }} style={{width: '100%', padding: '4px 6px', border: '1px solid var(--gray-200)', borderRadius: '3px', fontFamily: 'inherit', fontSize: '13px', fontWeight: '700', color: 'var(--navy)'}} />
            </div>
            <div style={{background: 'white', border: '1px solid var(--gray-200)', padding: '10px 12px', borderRadius: '3px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
                <div style={{fontSize: '9px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gray-600)'}}>Processing time</div>
                <code style={{fontSize: '9px', color: 'var(--purple)', background: '#F3EBFC', padding: '1px 5px', borderRadius: '2px'}}>{"{{processingTime}}"}</code>
              </div>
              <input type="text" defaultValue="2–6 months" onChange={(e) => { showToast('Variable updated', 'processingTime changed to ' + e.target.value) }} style={{width: '100%', padding: '4px 6px', border: '1px solid var(--gray-200)', borderRadius: '3px', fontFamily: 'inherit', fontSize: '13px', fontWeight: '700', color: 'var(--navy)'}} />
            </div>
            <div style={{background: 'white', border: '1px solid var(--gray-200)', padding: '10px 12px', borderRadius: '3px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
                <div style={{fontSize: '9px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gray-600)'}}>Validity</div>
                <code style={{fontSize: '9px', color: 'var(--purple)', background: '#F3EBFC', padding: '1px 5px', borderRadius: '2px'}}>{"{{validity}}"}</code>
              </div>
              <input type="text" defaultValue="Lifetime" onChange={(e) => { showToast('Variable updated', 'validity changed to ' + e.target.value) }} style={{width: '100%', padding: '4px 6px', border: '1px solid var(--gray-200)', borderRadius: '3px', fontFamily: 'inherit', fontSize: '13px', fontWeight: '700', color: 'var(--navy)'}} />
            </div>
            <div style={{background: 'white', border: '1px dashed var(--gray-300)', padding: '10px 12px', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}} onClick={() => { openModal('add-variable') }}>
              <span style={{fontSize: '11px', color: 'var(--gray-600)', display: 'flex', alignItems: 'center', gap: '4px'}}><i className="ti ti-plus"></i> Add variable</span>
            </div>
          </div>
        </div>

        <div className="two-col even">
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
              <div className="label-stripe" style={{margin: '0'}}>Documents · 11</div>
              <button className="btn ghost sm" onClick={() => { openModal('add-doc') }}><i className="ti ti-plus"></i> Add</button>
            </div>
            <div className="tb-list">
              <div className="tb-row">
                <div><div className="name">Valid passport</div><div className="desc" style={{marginTop: '5px'}}><span className="badge purple">Per family member</span> Original + certified copies · one passport per linked contact role</div></div>
                <div className="right"><span className="badge da">Required</span><i className="ti ti-grip-vertical" style={{color: 'var(--gray-400)'}}></i></div>
              </div>
              <div className="tb-row">
                <div><div className="name">Proof of investment</div><div className="desc">Title deed / sale agreement (DLS) / share certificates + receipts</div></div>
                <div className="right"><span className="badge da">Required</span><i className="ti ti-grip-vertical" style={{color: 'var(--gray-400)'}}></i></div>
              </div>
              <div className="tb-row">
                <div><div className="name">Proof of fund transfer from abroad</div><div className="desc" style={{marginTop: '5px'}}><span className="badge cyan">Multiple files</span> Bank transfer with SWIFT confirmation · min. 1 transaction, no upper limit (down payment + milestones + final)</div></div>
                <div className="right"><span className="badge da">Required</span><i className="ti ti-grip-vertical" style={{color: 'var(--gray-400)'}}></i></div>
              </div>
              <div className="tb-row">
                <div><div className="name">Proof of annual income</div><div className="desc" style={{marginTop: '5px'}}>Tax return declarations or accountant’s letter · min. <code style={{background: '#F3EBFC', color: 'var(--purple)', padding: '1px 4px', borderRadius: '2px', fontSize: '11px'}}>{"{{minIncome}}"}</code>/year</div></div>
                <div className="right"><span className="badge da">Required</span><i className="ti ti-grip-vertical" style={{color: 'var(--gray-400)'}}></i></div>
              </div>
              <div className="tb-row">
                <div><div className="name">Criminal record certificate</div><div className="desc">Apostilled · country of origin + country of residence</div></div>
                <div className="right"><span className="badge da">Required</span><i className="ti ti-grip-vertical" style={{color: 'var(--gray-400)'}}></i></div>
              </div>
              <div className="tb-row">
                <div><div className="name">Health insurance certificate</div><div className="desc">Covering applicant and dependants · ~€200/person/year</div></div>
                <div className="right"><span className="badge da">Required</span><i className="ti ti-grip-vertical" style={{color: 'var(--gray-400)'}}></i></div>
              </div>
              <div className="tb-row">
                <div><div className="name">Declaration of no employment intent</div><div className="desc" style={{marginTop: '5px'}}><span className="badge" style={{background: '#E6EEFF', color: 'var(--blue)'}}><i className="ti ti-signature" style={{fontSize: '10px'}}></i> Sign in portal</span> Customer signs directly on the portal — no upload needed</div></div>
                <div className="right"><span className="badge da">Required</span><i className="ti ti-grip-vertical" style={{color: 'var(--gray-400)'}}></i></div>
              </div>
              <div className="tb-row conditional">
                <div><div className="name">Proof of accommodation</div><div className="desc" style={{marginTop: '5px'}}><span className="badge purple">Conditional · non-residential investment</span> Only required if Cat. B, C or D</div></div>
                <div className="right"><span className="badge mu">Optional</span><i className="ti ti-grip-vertical" style={{color: 'var(--gray-400)'}}></i></div>
              </div>
              <div className="tb-row conditional">
                <div><div className="name">Marriage certificate</div><div className="desc" style={{marginTop: '5px'}}><span className="badge purple">Conditional · spouse included</span> Apostilled and translated</div></div>
                <div className="right"><span className="badge mu">Optional</span><i className="ti ti-grip-vertical" style={{color: 'var(--gray-400)'}}></i></div>
              </div>
              <div className="tb-row conditional">
                <div><div className="name">Birth certificates</div><div className="desc" style={{marginTop: '5px'}}><span className="badge purple">Conditional · children under 18</span> Apostilled and translated</div></div>
                <div className="right"><span className="badge mu">Optional</span><i className="ti ti-grip-vertical" style={{color: 'var(--gray-400)'}}></i></div>
              </div>
              <div className="tb-row conditional">
                <div><div className="name">Student enrolment confirmation</div><div className="desc" style={{marginTop: '5px'}}><span className="badge purple">Conditional · dependent child 18–25</span> Institution letter + proof of dependency</div></div>
                <div className="right"><span className="badge mu">Optional</span><i className="ti ti-grip-vertical" style={{color: 'var(--gray-400)'}}></i></div>
              </div>
            </div>
          </div>
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
              <div className="label-stripe" style={{margin: '0'}}>Questions · 8</div>
              <button className="btn ghost sm" onClick={() => { openModal('add-question') }}><i className="ti ti-plus"></i> Add</button>
            </div>
            <div className="tb-list">
              <div className="tb-row">
                <div><div className="name">Investment category</div><div className="desc" style={{marginTop: '5px'}}><span className="badge mu">Dropdown</span> <span className="badge da">Required</span> · A / B / C / D · <span style={{color: 'var(--gray-600)'}}>answered once</span></div></div>
                <i className="ti ti-grip-vertical" style={{color: 'var(--gray-400)'}}></i>
              </div>
              <div className="tb-row">
                <div><div className="name">Total investment amount (€)</div><div className="desc" style={{marginTop: '5px'}}><span className="badge mu">Number</span> <span className="badge da">Required</span> · min. <code style={{background: '#F3EBFC', color: 'var(--purple)', padding: '1px 4px', borderRadius: '2px', fontSize: '11px'}}>{"{{minInvestment}}"}</code> · <span style={{color: 'var(--gray-600)'}}>answered once</span></div></div>
                <i className="ti ti-grip-vertical" style={{color: 'var(--gray-400)'}}></i>
              </div>
              <div className="tb-row">
                <div><div className="name">Annual income from abroad (€)</div><div className="desc" style={{marginTop: '5px'}}><span className="badge mu">Number</span> <span className="badge da">Required</span> · min. <code style={{background: '#F3EBFC', color: 'var(--purple)', padding: '1px 4px', borderRadius: '2px', fontSize: '11px'}}>{"{{minIncome}}"}</code> · <span style={{color: 'var(--gray-600)'}}>answered once</span></div></div>
                <i className="ti ti-grip-vertical" style={{color: 'var(--gray-400)'}}></i>
              </div>
              <div className="tb-row">
                <div><div className="name">Country of origin and current residence</div><div className="desc" style={{marginTop: '5px'}}><span className="badge mu">Short text</span> <span className="badge da">Required</span> <span className="badge purple">Per family member</span> One answer per linked contact role · client sees N copies of this question</div></div>
                <i className="ti ti-grip-vertical" style={{color: 'var(--gray-400)'}}></i>
              </div>
              <div className="tb-row">
                <div><div className="name">Include spouse?</div><div className="desc" style={{marginTop: '5px'}}><span className="badge mu">Yes / No</span> <span className="badge da">Required</span> <span className="badge purple">+ conditional</span> · <span style={{color: 'var(--gray-600)'}}>answered once</span></div></div>
                <i className="ti ti-grip-vertical" style={{color: 'var(--gray-400)'}}></i>
              </div>
              <div className="tb-row optional">
                <div><div className="name">Children under 18 to include</div><div className="desc" style={{marginTop: '5px'}}><span className="badge mu">Number</span> <span className="badge mu">Optional</span> · <span style={{color: 'var(--gray-600)'}}>answered once</span></div></div>
                <i className="ti ti-grip-vertical" style={{color: 'var(--gray-400)'}}></i>
              </div>
              <div className="tb-row conditional">
                <div><div className="name">Dependent child aged 18–25 (student)?</div><div className="desc" style={{marginTop: '5px'}}><span className="badge mu">Yes / No</span> <span className="badge purple">conditional</span> · <span style={{color: 'var(--gray-600)'}}>answered once</span></div></div>
                <i className="ti ti-grip-vertical" style={{color: 'var(--gray-400)'}}></i>
              </div>
              <div className="tb-row">
                <div><div className="name">Has this person ever been refused entry to Cyprus or any EU country?</div><div className="desc" style={{marginTop: '5px'}}><span className="badge mu">Yes / No + explanation</span> <span className="badge da">Required</span> <span className="badge purple">Per family member</span> Each member answers separately · scales with family size</div></div>
                <i className="ti ti-grip-vertical" style={{color: 'var(--gray-400)'}}></i>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}
