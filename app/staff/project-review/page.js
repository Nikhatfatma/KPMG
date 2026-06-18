"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { showToast, openModal, closeModal, useProjectsStore } from "@/lib/store";

function ProjectReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id") || "p3";
  const project = useProjectsStore((s) => s.projects.find(p => p.id === projectId));
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

  // ---- Page state ----
  const [tab, setTab] = useState("docs"); // 'docs' | 'questions' | 'activity' | 'notes'
  const [expanded, setExpanded] = useState({}); // map of docId -> bool
  const toggleExpanded = (id) => setExpanded((m) => ({ ...m, [id]: !m[id] }));
  const REVIEW_DOC_IDS = ["rdoc-passport", "rdoc-investment", "rdoc-income", "rdoc-declaration"];
  const allExpanded = REVIEW_DOC_IDS.every((id) => expanded[id]);
  const expandAllDocs = () => {
    const next = {};
    REVIEW_DOC_IDS.forEach((id) => { next[id] = true; });
    setExpanded(next);
  };
  const collapseAllDocs = () => setExpanded({});

  const approveDoc = (id, name) => {
    showToast(`${name} approved`, "Marked as verified · client notified · Zoho Deal updated");
  };
  const approveQuestion = (id, label) => {
    showToast(`${label} answer approved`, "Marked as verified");
  };

  return (
    <>
        <div className="crumbs">
          <a onClick={() => { routerPush('s-projects') }}>Projects</a> <i className="ti ti-chevron-right"></i> <a onClick={() => { routerPush('s-clients') }}>{project?.clientName || 'Client'}</a> <i className="ti ti-chevron-right"></i> {project?.service || 'Application'}
        </div>
        <div className="ph">
          <div className="lhs">
            <div className="eyebrow">{project?.service || 'Service'} · Project review</div>
            <h1>{project?.service || 'Application'} <span className="badge warn dot lg" style={{verticalAlign: 'middle', marginLeft: '8px'}}>{project?.status || 'Pending review'}</span></h1>
            <div className="sub">Submitted by {project?.clientName} May 9, 2026 · Deadline Jul 11 · <span style={{color: 'var(--amber)', fontWeight: '600'}}>{project?.docStats || '4/15'} documents and 4 answers awaiting your review</span></div>
          </div>
          <div className="actions">
            <button className="btn ghost sm" onClick={() => { openModal('message-client', project?.clientName) }}><i className="ti ti-message"></i> Message client</button>
            <button className="btn ghost sm" onClick={() => { routerPush('c-home') }}><i className="ti ti-eye"></i> Client view</button>
            <button className="btn ghost sm" onClick={() => { showToast('More actions', 'Reassign · Archive · Duplicate · Print') }}><i className="ti ti-dots-vertical"></i></button>
          </div>
        </div>

        {/* Client card */}
        <div className="client-card">
          <div className={`avatar lg ${project?.color || 'navy'}`} style={{width: '48px', height: '48px', fontSize: '16px'}}>{project?.initials}</div>
          <div className="cc-info">
            <div className="cc-name">{project?.clientName}</div>
            <div className="cc-meta">
              {project?.id === 'p3' ? 'james@smith-holdings.uk · +44 7700 900123' : 'client@example.com · +357 22 XXX XXX'} 
              · client since Feb 2024 · 1 active Fast Track
            </div>
          </div>
          <div className="cc-right">
            <span className="badge cyan dot">{project?.source === 'Zoho' ? 'Zoho contact' : 'Manual'}</span>
            <button className="btn ghost xs" onClick={() => { routerPush('s-clients') }}>View profile</button>
          </div>
        </div>

        {/* Family members card — contact roles drive per-member document collection */}
        <div style={{background: 'white', border: '1px solid var(--gray-200)', borderLeft: '3px solid var(--blue)', borderRadius: '4px', padding: '14px 16px', marginBottom: '18px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
            <div>
              <div style={{fontSize: '10px', fontWeight: '700', letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--navy)'}}>Family on this application · {project?.familyMembers?.length || 0} contact roles</div>
              <div style={{fontSize: '11px', color: 'var(--gray-700)', marginTop: '2px'}}>Synced from Zoho contact roles · each member drives their own passport requirement</div>
            </div>
            <div style={{display: 'flex', gap: '6px'}}>
              <button className="btn ghost xs" onClick={() => { openModal('add-family-member', projectId) }}><i className="ti ti-user-plus"></i> Add member</button>
              <button className="btn ghost xs" onClick={() => { window.open('https://kpmgcyprus.zoho.com', '_blank'); showToast('Opening Zoho CRM', `Deal for ${project?.clientName}`); }}><i className="ti ti-external-link"></i> Open in Zoho</button>
            </div>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px'}}>
            {(project?.familyMembers || []).map((m) => (
              <div key={m.id} style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', border: '1px solid var(--gray-200)', borderRadius: '4px'}}>
                <div className={`avatar ${m.color || 'blue'} sm`}>{m.avatar}</div>
                <div style={{flex: '1'}}>
                  <div style={{fontSize: '12px', fontWeight: '700'}}>{m.name}</div>
                  <div style={{fontSize: '10px', color: 'var(--gray-600)'}}>{m.role}{m.age ? ` · age ${m.age}` : ''}{m.residence ? ` · ${m.residence} resident` : ''}</div>
                </div>
                <span className="badge ok dot" style={{fontSize: '9px'}}>{m.locked ? 'Passport ✓' : 'Passport pending'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="metrics-grid">
          <div className="metric alt">
            <div className="ml">Documents</div>
            <div className="mv" id="docs-stat">4<span style={{fontSize: '16px', color: 'var(--gray-500)'}}>/13</span></div>
            <div className="mt"><span id="docs-pending">4</span> awaiting review</div>
          </div>
          <div className="metric alt">
            <div className="ml">Questions</div>
            <div className="mv" id="qs-stat">4<span style={{fontSize: '16px', color: 'var(--gray-500)'}}>/12</span></div>
            <div className="mt"><span id="qs-pending">4</span> awaiting review</div>
          </div>
          <div className="metric alt">
            <div className="ml">Days remaining</div>
            <div className="mv">60</div>
            <div className="mt">Due Jul 11, 2026</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <div className={`tab${tab === 'docs' ? ' on' : ''}`} onClick={() => setTab('docs')} style={{cursor: 'pointer'}}>Documents <span className="badge mu">4 to review</span></div>
          <div className={`tab${tab === 'questions' ? ' on' : ''}`} onClick={() => setTab('questions')} style={{cursor: 'pointer'}}>Questions <span className="badge mu">4 to review</span></div>
          <div className={`tab${tab === 'activity' ? ' on' : ''}`} onClick={() => setTab('activity')} style={{cursor: 'pointer'}}>Activity</div>
          <div className={`tab${tab === 'notes' ? ' on' : ''}`} onClick={() => setTab('notes')} style={{cursor: 'pointer'}}>Internal notes</div>
        </div>

        {/* ===== DOCUMENTS TAB ===== */}
        {tab === 'docs' && (
        <div className="tab-section" id="pr-docs">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
            <div className="label-stripe" style={{margin: 0}}>Awaiting your review · 4 documents</div>
            <button type="button" className="btn ghost xs" onClick={allExpanded ? collapseAllDocs : expandAllDocs}>
              <i className={`ti ${allExpanded ? 'ti-layout-collapse' : 'ti-layout-expand'}`}></i>
              {allExpanded ? 'Collapse all' : 'Expand all'}
            </button>
          </div>

          {[
            {
              id: 'rdoc-passport',
              icon: 'ti-file-type-pdf',
              iconStyle: null,
              name: 'Valid passport · James Smith',
              badges: [
                { cls: 'badge da', text: 'Required' },
                { cls: 'badge purple', text: '1 of 4 family members' },
              ],
              filename: 'james_passport_2026.pdf',
              meta: '1.2 MB · uploaded May 6, 11:23 AM',
              hint: '3 more passports pending from spouse + child dependents',
              status: { cls: 'badge warn dot', text: 'Pending review' },
            },
            {
              id: 'rdoc-investment',
              icon: 'ti-file-type-pdf',
              iconStyle: null,
              name: 'Proof of investment',
              badges: [
                { cls: 'badge da', text: 'Required' },
                { cls: 'badge warn dot', text: '2 of 3 receipts' },
              ],
              filename: 'james_sale_agreement_dls_limassol.pdf',
              meta: '3.2 MB · uploaded May 8, 9:14 AM',
              status: { cls: 'badge warn dot', text: 'Pending review' },
            },
            {
              id: 'rdoc-income',
              icon: 'ti-file-type-pdf',
              iconStyle: null,
              name: 'Proof of annual income',
              badges: [{ cls: 'badge da', text: 'Required' }],
              filename: 'smith_accountants_proof_income_2026.pdf',
              meta: '520 KB · uploaded May 8, 11:47 AM',
              status: { cls: 'badge warn dot', text: 'Pending review' },
            },
            {
              id: 'rdoc-declaration',
              icon: 'ti-signature',
              iconStyle: { background: '#E6EEFF', color: 'var(--blue)' },
              name: 'Declaration of no employment intent',
              badges: [
                { cls: 'badge da', text: 'Required' },
                { cls: 'badge', text: 'Signed in portal', style: { background: '#E6EEFF', color: 'var(--blue)' } },
              ],
              filename: null,
              meta: 'Signed in portal May 12, 9:12 AM · IP 92.40.x.x',
              status: { cls: 'badge info dot', text: 'Ready' },
              signedInPortal: true,
            },
          ].map((d) => {
            const isOpen = !!expanded[d.id];
            return (
              <div key={d.id} className={`review-doc${isOpen ? ' is-open' : ' is-collapsed'}`} id={d.id}>
                <div className="rd-header" onClick={() => toggleExpanded(d.id)} style={{cursor: 'pointer'}}>
                  <button type="button" className="rd-chevron" aria-label={isOpen ? 'Collapse' : 'Expand'} onClick={(e) => { e.stopPropagation(); toggleExpanded(d.id); }}>
                    <i className={`ti ${isOpen ? 'ti-chevron-down' : 'ti-chevron-right'}`}></i>
                  </button>
                  <div className="rd-thumb" style={d.iconStyle || undefined}><i className={`ti ${d.icon}`}></i></div>
                  <div className="rd-meta">
                    <div className="rd-name">
                      {d.name}{' '}
                      {d.badges.map((b, i) => (
                        <span key={i} className={b.cls} style={{ fontSize: '9px', ...(b.style || {}) }}>{b.text}</span>
                      ))}
                    </div>
                    <div className="rd-file">
                      {d.filename ? <span className="rd-filename">{d.filename}</span> : <span className="rd-sub">{d.meta}</span>}
                      {isOpen && d.filename && d.meta ? <span className="rd-sub"> · {d.meta}</span> : null}
                      {isOpen && d.hint ? <span className="rd-hint">· {d.hint}</span> : null}
                    </div>
                  </div>
                  <div className="rd-status"><span className={d.status.cls}>{d.status.text}</span></div>
                  <button type="button" className="btn success xs" onClick={(e) => { e.stopPropagation(); approveDoc(d.id, d.name.split(' · ')[0]); }} style={{marginLeft: 8}} title="Approve">
                    <i className="ti ti-check"></i> Approve
                  </button>
                </div>
                {isOpen && (
                  <div className="rd-actions">
                    <button className="btn ghost sm" onClick={() => { d.signedInPortal ? showToast('Signed document opened', 'Shows the declaration text + signature image + audit trail') : routerPush('s-review') }}><i className="ti ti-eye"></i> {d.signedInPortal ? 'View signed document' : 'View detail'}</button>
                    <div className="spacer"></div>
                    <button className="btn ghost sm danger" onClick={() => { openModal('reject-doc', d.name.split(' · ')[0]) }}><i className="ti ti-x"></i> Reject</button>
                    {d.signedInPortal ? (
                      <button className="btn ghost sm amber" onClick={() => { showToast('Re-signature requested', 'James will be asked to sign the declaration again in the portal') }}><i className="ti ti-refresh"></i> Request re-sign</button>
                    ) : (
                      <button className="btn ghost sm amber" onClick={() => { openModal('request-reupload', d.name.split(' · ')[0]) }}><i className="ti ti-refresh"></i> Request re-upload</button>
                    )}
                    <button className="btn ghost sm" onClick={() => { openModal('ask-more-info', d.name.split(' · ')[0]) }}><i className="ti ti-question-mark"></i> Ask for more details</button>
                  </div>
                )}
              </div>
            );
          })}

          <div className="label-stripe" style={{marginTop: '28px'}}>Pending upload from client · 11 documents</div>
          <div className="pending-list">
            <div className="pl-row"><div className="pl-info"><i className="ti ti-clock"></i> Valid passport · Sarah Smith (spouse) · <span className="badge purple" style={{fontSize: '9px'}}>Per family member</span></div><span style={{fontSize: '11px', color: 'var(--gray-500)'}}>Awaiting upload</span></div>
            <div className="pl-row"><div className="pl-info"><i className="ti ti-clock"></i> Valid passport · Oliver Smith (student, 19) · <span className="badge purple" style={{fontSize: '9px'}}>Per family member</span></div><span style={{fontSize: '11px', color: 'var(--gray-500)'}}>Awaiting upload</span></div>
            <div className="pl-row"><div className="pl-info"><i className="ti ti-clock"></i> Valid passport · Emily Smith (minor, 12) · <span className="badge purple" style={{fontSize: '9px'}}>Per family member</span></div><span style={{fontSize: '11px', color: 'var(--gray-500)'}}>Awaiting upload</span></div>
            <div className="pl-row"><div className="pl-info"><i className="ti ti-clock"></i> Proof of fund transfer · milestone + final · <span className="badge cyan" style={{fontSize: '9px'}}>2 of 3 transactions pending</span></div><span style={{fontSize: '11px', color: 'var(--gray-500)'}}>€120k of €320k evidenced so far</span></div>
            <div className="pl-row"><div className="pl-info"><i className="ti ti-clock"></i> Criminal record certificate (ACRO) · <span className="badge da" style={{fontSize: '9px'}}>Required</span></div><span style={{fontSize: '11px', color: 'var(--gray-500)'}}>Apostille in progress</span></div>
            <div className="pl-row"><div className="pl-info"><i className="ti ti-clock"></i> Health insurance certificate · <span className="badge da" style={{fontSize: '9px'}}>Required</span></div><span style={{fontSize: '11px', color: 'var(--gray-500)'}}>Awaiting carrier issuance</span></div>
            <div className="pl-row"><div className="pl-info"><i className="ti ti-clock"></i> Marriage certificate (UK certified) · <span className="badge purple" style={{fontSize: '9px'}}>Conditional · spouse</span></div><span style={{fontSize: '11px', color: 'var(--gray-500)'}}>Pending Q5 answer</span></div>
            <div className="pl-row"><div className="pl-info"><i className="ti ti-clock"></i> Birth certificates · <span className="badge purple" style={{fontSize: '9px'}}>Conditional · children</span></div><span style={{fontSize: '11px', color: 'var(--gray-500)'}}>Pending Q6 answer</span></div>
            <div className="pl-row"><div className="pl-info"><i className="ti ti-clock"></i> Student enrolment confirmation · <span className="badge purple" style={{fontSize: '9px'}}>Conditional · dependent 18–25</span></div><span style={{fontSize: '11px', color: 'var(--gray-500)'}}>Pending Q7 answer</span></div>
            <div className="pl-row"><div className="pl-info"><i className="ti ti-clock"></i> Proof of financial dependency (Oliver Smith) · <span className="badge purple" style={{fontSize: '9px'}}>Conditional</span></div><span style={{fontSize: '11px', color: 'var(--gray-500)'}}>Awaiting upload</span></div>
            <div className="pl-row"><div className="pl-info"><i className="ti ti-clock"></i> Declaration of unmarried status (Oliver Smith) · <span className="badge purple" style={{fontSize: '9px'}}>Conditional</span></div><span style={{fontSize: '11px', color: 'var(--gray-500)'}}>Awaiting upload</span></div>
          </div>
          <div style={{marginTop: '12px', display: 'flex', gap: '8px'}}>
            <button className="btn ghost sm" onClick={() => { showToast('Reminder email sent', 'James will receive a nudge to upload pending documents') }}><i className="ti ti-mail-fast"></i> Send reminder</button>
            <button className="btn ghost sm" onClick={() => { showToast('Documents marked optional', 'Client can submit without these') }}><i className="ti ti-check"></i> Mark all as not required</button>
          </div>
        </div>
        )}

        {/* ===== QUESTIONS TAB ===== */}
        {tab === 'questions' && (
        <div className="tab-section" id="pr-questions">
          <div className="label-stripe">Awaiting your review · 4 answers</div>

          <div className="review-q" id="rq-1">
            <div className="q-top">
              <span className="q-num">Q1</span>
              <span className="q-text" style={{flex: '1'}}>Investment category</span>
              <span className="badge warn dot">Pending review</span>
            </div>
            <div className="q-answer"><span className="lab">James's answer</span>Category A · Residential property purchase (Block B, Apt 302, Limassol) from Cyprus Luxury Homes Ltd. Stamped Sale Agreement registered with DLS.</div>
            <div className="q-actions">
              <button className="btn ghost sm" onClick={() => { openModal('flag-question', 'Q1 · Investment category') }}><i className="ti ti-flag"></i> Flag for clarification</button>
              <button className="btn ghost sm" onClick={() => { openModal('ask-more-info', 'Q1 · Investment category') }}><i className="ti ti-question-mark"></i> Ask for more details</button>
              <button className="btn success sm" onClick={() => { approveQuestion('rq-1', 'Q1') }}><i className="ti ti-check"></i> Approve answer</button>
            </div>
          </div>

          <div className="review-q" id="rq-2">
            <div className="q-top">
              <span className="q-num">Q2</span>
              <span className="q-text" style={{flex: '1'}}>Total investment amount (€)</span>
              <span className="badge warn dot">Pending review</span>
            </div>
            <div className="q-answer"><span className="lab">James's answer</span>€320,000 — exceeds the €300,000 Cat. A minimum by €20,000. DLS stamped Sale Agreement uploaded.</div>
            <div className="q-actions">
              <button className="btn ghost sm" onClick={() => { openModal('flag-question', 'Q2 · Total investment amount') }}><i className="ti ti-flag"></i> Flag for clarification</button>
              <button className="btn ghost sm" onClick={() => { openModal('ask-more-info', 'Q2 · Total investment amount') }}><i className="ti ti-question-mark"></i> Ask for more details</button>
              <button className="btn success sm" onClick={() => { approveQuestion('rq-2', 'Q2') }}><i className="ti ti-check"></i> Approve answer</button>
            </div>
          </div>

          <div className="review-q" id="rq-3">
            <div className="q-top">
              <span className="q-num">Q3</span>
              <span className="q-text" style={{flex: '1'}}>Annual income from abroad (€)</span>
              <span className="badge warn dot">Pending review</span>
            </div>
            <div className="q-answer"><span className="lab">James's answer</span>€95,000 / year — dividend income from Smith Holdings (UK) plus UK Director fees. Exceeds the updated €85k minimum. Verified by accountant's proof of income.</div>
            <div className="q-actions">
              <button className="btn ghost sm" onClick={() => { openModal('flag-question', 'Q3 · Annual income from abroad') }}><i className="ti ti-flag"></i> Flag for clarification</button>
              <button className="btn ghost sm" onClick={() => { openModal('ask-more-info', 'Q3 · Annual income from abroad') }}><i className="ti ti-question-mark"></i> Ask for more details</button>
              <button className="btn success sm" onClick={() => { approveQuestion('rq-3', 'Q3') }}><i className="ti ti-check"></i> Approve answer</button>
            </div>
          </div>

          <div className="review-q" id="rq-4">
            <div className="q-top">
              <span className="q-num">Q4</span>
              <span className="q-text" style={{flex: '1'}}>Country of origin and current residence <span className="badge purple" style={{fontSize: '9px', marginLeft: '6px'}}><i className="ti ti-users" style={{fontSize: '9px'}}></i> Per family member · 1 of 4 answered</span></span>
              <span className="badge warn dot">Pending review</span>
            </div>
            <div style={{background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: '4px', padding: '10px 12px', margin: '8px 0', display: 'grid', gap: '6px'}}>
              <div style={{display: 'flex', gap: '10px', alignItems: 'center', padding: '6px 0', borderBottom: '1px dashed var(--gray-200)'}}>
                <div className="avatar navy sm">JS</div>
                <div style={{flex: '1'}}>
                  <div style={{fontSize: '11px', color: 'var(--gray-600)'}}>James Smith · main applicant</div>
                  <div style={{fontSize: '13px', color: 'var(--ink)'}}>UK citizen · resident in London, United Kingdom. UK Passport holder.</div>
                </div>
                <span className="badge warn dot" style={{fontSize: '9px'}}>Pending review</span>
              </div>
              <div style={{display: 'flex', gap: '10px', alignItems: 'center', padding: '6px 0', borderBottom: '1px dashed var(--gray-200)'}}>
                <div className="avatar purple sm">SS</div>
                <div style={{flex: '1'}}>
                  <div style={{fontSize: '11px', color: 'var(--gray-600)'}}>Sarah Smith · spouse</div>
                  <div style={{fontSize: '13px', color: 'var(--gray-500)', fontStyle: 'italic'}}>Awaiting answer from family member</div>
                </div>
                <span className="badge mu" style={{fontSize: '9px'}}>No answer yet</span>
              </div>
              <div style={{display: 'flex', gap: '10px', alignItems: 'center', padding: '6px 0', borderBottom: '1px dashed var(--gray-200)'}}>
                <div className="avatar blue sm">OS</div>
                <div style={{flex: '1'}}>
                  <div style={{fontSize: '11px', color: 'var(--gray-600)'}}>Oliver Smith · child (19, Student)</div>
                  <div style={{fontSize: '13px', color: 'var(--gray-500)', fontStyle: 'italic'}}>Awaiting answer from family member</div>
                </div>
                <span className="badge mu" style={{fontSize: '9px'}}>No answer yet</span>
              </div>
              <div style={{display: 'flex', gap: '10px', alignItems: 'center', padding: '6px 0'}}>
                <div className="avatar cyan sm">ES</div>
                <div style={{flex: '1'}}>
                  <div style={{fontSize: '11px', color: 'var(--gray-600)'}}>Emily Smith · child (12)</div>
                  <div style={{fontSize: '13px', color: 'var(--gray-500)', fontStyle: 'italic'}}>Awaiting answer from family member</div>
                </div>
                <span className="badge mu" style={{fontSize: '9px'}}>No answer yet</span>
              </div>
            </div>
            <div className="q-actions">
              <button className="btn ghost sm" onClick={() => { openModal('flag-question', 'Q4 · Country of origin') }}><i className="ti ti-flag"></i> Flag for clarification</button>
              <button className="btn ghost sm" onClick={() => { openModal('ask-more-info', 'Q4 · Country of origin') }}><i className="ti ti-question-mark"></i> Ask for more details</button>
              <button className="btn success sm" onClick={() => { approveQuestion('rq-4', 'Q4') }}><i className="ti ti-check"></i> Approve James's answer</button>
            </div>
          </div>

          <div className="label-stripe" style={{marginTop: '28px'}}>Awaiting client · 4 answers</div>
          <div className="pending-list">
            <div className="pl-row"><div className="pl-info"><i className="ti ti-clock"></i> <strong>Q5.</strong> Include spouse?</div><span className="badge da" style={{fontSize: '9px'}}>Required</span></div>
            <div className="pl-row"><div className="pl-info"><i className="ti ti-clock"></i> <strong>Q6.</strong> Children under 18 to include</div><span className="badge mu" style={{fontSize: '9px'}}>Optional</span></div>
            <div className="pl-row"><div className="pl-info"><i className="ti ti-clock"></i> <strong>Q7.</strong> Dependent child aged 18–25 (student)?</div><span className="badge purple" style={{fontSize: '9px'}}>Conditional</span></div>
            <div className="pl-row"><div className="pl-info"><i className="ti ti-clock"></i> <strong>Q8.</strong> Ever refused entry to Cyprus or EU? <span className="badge purple" style={{fontSize: '9px', marginLeft: '4px'}}>Per family member · 0 of 4 answered</span></div><span className="badge da" style={{fontSize: '9px'}}>Required</span></div>
          </div>
        </div>
        )}

        {/* ===== ACTIVITY TAB ===== */}
        {tab === 'activity' && (
        <div className="tab-section" id="pr-activity">
          <div className="card">
            <div className="card-b">
              <div className="timeline">
                <div className="tl-item"><span className="badge purple">Upload</span> James Smith uploaded <b>Declaration of no employment intent</b><div className="tt">Today, 9:12 AM · 110 KB · AI extraction in progress</div></div>
                <div className="tl-item"><span className="badge info">Submit</span> James Smith submitted the application for review<div className="tt">May 9, 12:04 PM · 4 documents and 4 questions submitted</div></div>
                <div className="tl-item"><span className="badge purple">Upload</span> James Smith uploaded <b>Proof of investment</b>, <b>Proof of annual income</b>, <b>Valid passport</b><div className="tt">May 6 – May 8</div></div>
                <div className="tl-item"><span className="badge cyan">Answer</span> James Smith answered 4 questions<div className="tt">May 7, 8:32 PM</div></div>
                <div className="tl-item"><span className="badge info">Send</span> Anjali Mehta sent application request<div className="tt">May 2 · 60-day deadline</div></div>
                <div className="tl-item"><span className="badge cyan">CRM sync</span> Project linked to Zoho Deal #4791 (Fast Track PR)<div className="tt">May 2, 9:15 AM</div></div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ===== NOTES TAB ===== */}
        {tab === 'notes' && (
        <div className="tab-section" id="pr-notes">
          <div className="form-field">
            <label>Internal note (only visible to KPMG staff)</label>
            <textarea className="area" id="internal-note" style={{minHeight: '120px', width: '100%', padding: '12px 14px', border: '1.5px solid var(--gray-200)', borderRadius: '4px', fontFamily: 'inherit', fontSize: '13px', color: 'var(--ink)'}} placeholder="Add a private note about this application. Visible to the assigned team but never to the client."></textarea>
          </div>
          <button className="btn blue sm" onClick={() => { showToast('Note saved', 'Visible to the assigned team — Anjali Mehta and Rohan Kapoor') }}><i className="ti ti-device-floppy"></i> Save note</button>

          <div className="label-stripe" style={{marginTop: '28px'}}>Previous notes</div>
          <div className="card">
            <div className="card-b">
              <div style={{padding: '12px 0', borderBottom: '1px solid var(--gray-200)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><div className="avatar navy sm">AM</div><span style={{fontSize: '13px', fontWeight: '600', color: 'var(--navy)'}}>Anjali Mehta</span></div>
                  <span style={{fontSize: '11px', color: 'var(--gray-500)'}}>2 days ago</span>
                </div>
                <div style={{fontSize: '13px', color: 'var(--gray-700)', paddingLeft: '32px'}}>Cat. A residential — clean case. Apt 302 from Cyprus Luxury Homes Ltd is a known compliant project. Watch the SWIFT confirmations when they arrive — must show €320k transferred from <em>abroad</em> (Barclays UK) to their Cyprus Hellenic bank account.</div>
              </div>
              <div style={{padding: '12px 0'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><div className="avatar purple sm">RK</div><span style={{fontSize: '13px', fontWeight: '600', color: 'var(--navy)'}}>Rohan Kapoor</span></div>
                  <span style={{fontSize: '11px', color: 'var(--gray-500)'}}>3 days ago</span>
                </div>
                <div style={{fontSize: '13px', color: 'var(--gray-700)', paddingLeft: '32px'}}>Pre-screened — strong case. James has clean UK status so the ACRO UK police checks will be straightforward. Confirm the statutory single declaration status for Oliver Smith (19, full-time UCL student) to proceed with his adult dependent child approval.</div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ===== Bottom action bar ===== */}
        <div className="submit-bar" style={{marginTop: '32px'}}>
          <div className="sb-info">
            <div className="sb-pri">Make a decision on this application</div>
            <div className="sb-sub"><span id="sb-summary">4 documents and 4 answers awaiting review</span> · approve items individually above, or take overall action here</div>
          </div>
          <div className="sb-actions">
            <button className="btn ghost danger" onClick={() => { openModal('reject-app') }}><i className="ti ti-x"></i> Reject application</button>
            <button className="btn ghost amber" onClick={() => { openModal('send-back') }}><i className="ti ti-arrow-back-up"></i> Send back to client</button>
            <button className="btn success" onClick={() => { openModal('approve-app') }}><i className="ti ti-check"></i> Submit to Civil Registry</button>
          </div>
        </div>
      </>
  );
}

export default function S_project_reviewPage() {
  return (
    <Suspense fallback={<div className="ph"><h1>Loading review...</h1></div>}>
      <ProjectReviewContent />
    </Suspense>
  );
}
