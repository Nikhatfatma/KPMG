"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { showToast, openModal, closeModal, useMemberViewStore, useProjectsStore } from "@/lib/store";

export default function C_projectPage() {
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
  const { viewing, member, setMember } = useMemberViewStore();
  // setMemberView is the legacy global; expose as a local that mirrors store API
  const setMemberView = (id, name, role, avatar, color) => {
    setMember({ id: id || 'main', name: name || 'James Smith', role: role || 'Main applicant', avatar: avatar || 'JS', color: color || 'navy' });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // Legacy helper aliases used in inline handlers within the JSX
  const navigate = routerPush;

  // Collapsible doc/question groups — collapsed by default for a cleaner view
  const [openGroups, setOpenGroups] = useState({});
  const toggleGroup = (key) => setOpenGroups((g) => ({ ...g, [key]: !g[key] }));
  const DOC_KEYS = ["passport", "fund-transfer"];
  const Q_KEYS = ["q4", "q8"];
  const allDocsOpen = DOC_KEYS.every((k) => openGroups[k]);
  const allQsOpen = Q_KEYS.every((k) => openGroups[k]);
  const setMany = (keys, value) => setOpenGroups((g) => {
    const next = { ...g };
    keys.forEach((k) => { next[k] = value; });
    return next;
  });
  // Active tab
  const [tab, setTab] = useState("docs"); // 'docs' | 'questions' | 'activity' | 'messages'
  
  // Section filters
  const [docsFilter, setDocsFilter] = useState("attention"); // 'attention' | 'completed'
  const [qsFilter, setQsFilter] = useState("attention"); // 'attention' | 'completed'
  
  // Application-level question state
  const [appState, setAppState] = useState({
    includeSpouse: "Yes",
    childrenCount: "1",
    includeStudent: "No"
  });
  const updateAppState = (k, v) => setAppState(prev => ({ ...prev, [k]: v }));

  const project = useProjectsStore(s => s.projects.find(p => p.id === 'p3')) || { familyMembers: [] };
  const familyMembers = project.familyMembers;

  return (
    <><div data-viewing-member={viewing !== "main" ? viewing : undefined}>
        <div className="crumbs">
          <a onClick={() => { routerPush('c-home') }}>Home</a> <i className="ti ti-chevron-right"></i> <a onClick={() => { routerPush('c-apps') }}>Applications</a> <i className="ti ti-chevron-right"></i> Fast Track (Permanent Residence)
        </div>
        <div className="ph">
          <div className="lhs">
            <div className="eyebrow">Cyprus Reg. 6.2 · Template v1</div>
            <h1 id="cv-page-h">Fast Track (Permanent Residence) <span className="badge warn dot lg" style={{verticalAlign: 'middle', marginLeft: '8px'}}>Action needed</span></h1>
            <div className="sub" id="cv-page-sub">Due in 60 days · 40% complete · Owner: Anjali Mehta, Rohan Kapoor</div>
          </div>
          <div className="actions">
            <div className="avatar-group">
              <div className="avatar navy sm">AM</div>
              <div className="avatar purple sm">RK</div>
            </div>
            <button className="btn ghost sm" onClick={() => openModal('support')}><i className="ti ti-message-circle"></i> Message team</button>
          </div>
        </div>

        {/* DEMO ONLY: per-member view switcher (production: lands here automatically based on the magic-link recipient) */}
        <div className="cv-view-switcher" id="cv-view-switcher">
          {familyMembers.map((m, i) => (
            <button 
              key={m.id} 
              className={`opt ${viewing === m.id || (m.id === 'main' && viewing === 'main') ? 'active' : ''}`} 
              onClick={() => { setMemberView(m.id, m.name, m.role, m.avatar, m.color) }}
            >
              <span className={`avatar ${m.color} sm`} style={{width: '22px', height: '22px', fontSize: '10px'}}>{m.avatar}</span>
              <span>{m.name.split(' ')[0]} <span className="role">· {m.role.toLowerCase().includes('main') ? 'main, sees all' : m.role.toLowerCase()}</span></span>
            </button>
          ))}
          <span style={{flex: '1'}}></span>
          <span style={{fontSize: '10px', color: 'var(--gray-500)'}}><i className="ti ti-info-circle" style={{fontSize: '11px'}}></i> Each family member gets their own magic-link login in production</span>
        </div>

        {/* Member banner — appears only when viewing as a non-main member */}
        <div className="cv-member-banner" id="cv-member-banner">
          <i className="ti ti-user-shield"></i>
          <div style={{flex: '1'}}>
            <div className="ttl">You're a family member on this application</div>
            <div className="sub">Only items that need your input are shown below.</div>
          </div>
        </div>

        <div className="tabs">
          <div className={`tab${tab === 'docs' ? ' on' : ''}`} onClick={() => setTab('docs')} style={{cursor: 'pointer'}}>Documents <span className="badge mu">4/13</span></div>
          <div className={`tab${tab === 'questions' ? ' on' : ''}`} onClick={() => setTab('questions')} style={{cursor: 'pointer'}}>Questions <span className="badge mu">4/12</span></div>
          <div className={`tab cv-shared${tab === 'activity' ? ' on' : ''}`} onClick={() => setTab('activity')} style={{cursor: 'pointer'}}>Activity</div>
          <div className={`tab cv-shared${tab === 'messages' ? ' on' : ''}`} onClick={() => setTab('messages')} style={{cursor: 'pointer'}}>Messages</div>
        </div>

        {tab === 'docs' && (<>
        {/* Family on this application — only visible to the main applicant */}
        <div className="cv-shared" style={{background: '#F4F8FF', border: '1px solid #D6E4FF', borderLeft: '3px solid var(--blue)', borderRadius: '4px', padding: '14px 16px', marginBottom: '18px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
            <div>
              <div style={{fontSize: '10px', fontWeight: '700', letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--navy)'}}>Family on this application · {familyMembers.length} people</div>
              <div style={{fontSize: '11px', color: 'var(--gray-700)', marginTop: '2px'}}>Each family member has their own passport requirement below. Add or remove members to update the document list.</div>
            </div>
            <button className="btn blue sm" onClick={() => { openModal('add-family-member', 'p3') }}><i className="ti ti-user-plus"></i> Add member</button>
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
            {familyMembers.map(m => (
              <div key={m.id} style={{display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid var(--gray-200)', padding: '6px 10px 6px 6px', borderRadius: '20px'}}>
                <div className={`avatar ${m.color} sm`}>{m.avatar}</div>
                <div>
                  <div style={{fontSize: '12px', fontWeight: '700'}}>{m.name}</div>
                  <div style={{fontSize: '10px', color: 'var(--gray-600)'}}>{m.role}{m.age ? ` · age ${m.age}` : ''}{m.origin ? ` · ${m.origin}` : ''}{m.residence ? ` · ${m.residence} resident` : ''}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--gray-100)', pb: '8px'}}>
          <div style={{display: 'flex', gap: '4px'}}>
            <button className={`chip ${docsFilter === 'attention' ? 'on' : ''}`} onClick={() => setDocsFilter('attention')}>Needs Attention</button>
            <button className={`chip ${docsFilter === 'completed' ? 'on' : ''}`} onClick={() => setDocsFilter('completed')}>Completed</button>
          </div>
          <button type="button" className="btn ghost xs" onClick={() => setMany(DOC_KEYS, !allDocsOpen)}>
            <i className={`ti ${allDocsOpen ? 'ti-layout-collapse' : 'ti-layout-expand'}`}></i>
            {allDocsOpen ? 'Collapse all' : 'Expand all'}
          </button>
        </div>
        <div className="card">
          <div className="card-b">
            {/* Group: Valid passport — collected per family member */}
            <div className="doc-group">
              <button
                type="button"
                className="doc-group-head"
                onClick={() => toggleGroup('passport')}
                aria-expanded={!!openGroups.passport}
              >
                <i className={`ti ${openGroups.passport ? 'ti-chevron-down' : 'ti-chevron-right'} dgh-chev`}></i>
                <i className="ti ti-passport dgh-icon"></i>
                <div className="dgh-info">
                  <div className="dgh-name">Valid passport <span className="req">*</span></div>
                  <div className="dgh-meta">One passport per family member · 1 of 4 uploaded</div>
                </div>
                <span className="badge warn dot">3 remaining</span>
              </button>
              {openGroups.passport && (
                <div className="doc-group-body">
                  <div className="doc-row cv-pm-row" data-pm-member="main" style={{border: 'none', padding: '10px 16px'}}>
                    <div className="doc-info">
                      <div className="avatar navy sm" style={{marginRight: '4px'}}>JS</div>
                      <div>
                        <div className="doc-name" style={{fontSize: '13px'}}>James Smith · main applicant</div>
                        <div className="doc-meta">james_passport_2026.pdf · 1.2 MB · uploaded May 6</div>
                      </div>
                    </div>
                    <span className="badge ok dot">Verified</span>
                  </div>
                  <div className="doc-row cv-pm-row" data-pm-member="ss" style={{border: 'none', padding: '10px 16px', borderTop: '1px dashed var(--gray-200)'}}>
                    <div className="doc-info">
                      <div className="avatar purple sm" style={{marginRight: '4px'}}>SS</div>
                      <div>
                        <div className="doc-name" style={{fontSize: '13px'}}>Sarah Smith · spouse</div>
                        <div className="doc-meta">PDF · certified copy required</div>
                      </div>
                    </div>
                    <button className="btn blue sm" onClick={() => router.push('/client/upload?doc=passport-sarah')}><i className="ti ti-upload"></i> Upload</button>
                  </div>
                  <div className="doc-row cv-pm-row" data-pm-member="os" style={{border: 'none', padding: '10px 16px', borderTop: '1px dashed var(--gray-200)'}}>
                    <div className="doc-info">
                      <div className="avatar blue sm" style={{marginRight: '4px'}}>OS</div>
                      <div>
                        <div className="doc-name" style={{fontSize: '13px'}}>Oliver Smith · child (19, Student)</div>
                        <div className="doc-meta">PDF · certified copy required</div>
                      </div>
                    </div>
                    <button className="btn blue sm" onClick={() => router.push('/client/upload?doc=passport-oliver')}><i className="ti ti-upload"></i> Upload</button>
                  </div>
                  <div className="doc-row cv-pm-row" data-pm-member="es" style={{border: 'none', padding: '10px 16px', borderTop: '1px dashed var(--gray-200)'}}>
                    <div className="doc-info">
                      <div className="avatar cyan sm" style={{marginRight: '4px'}}>ES</div>
                      <div>
                        <div className="doc-name" style={{fontSize: '13px'}}>Emily Smith · child (12)</div>
                        <div className="doc-meta">PDF · certified copy required</div>
                      </div>
                    </div>
                    <button className="btn blue sm" onClick={() => router.push('/client/upload?doc=passport-emily')}><i className="ti ti-upload"></i> Upload</button>
                  </div>
                </div>
              )}
            </div>

            {docsFilter === 'completed' && (
              <>
                <div className="doc-row cv-shared">
                  <div className="doc-info">
                    <div className="doc-icon ok"><i className="ti ti-file-check"></i></div>
                    <div>
                      <div className="doc-name">Proof of investment<span className="req">*</span></div>
                      <div className="doc-meta">PDF · 3.2 MB · DLS Sale Agreement (Apt 302, Limassol) · uploaded May 8</div>
                    </div>
                  </div>
                  <span className="badge ok dot">Verified</span>
                </div>
                <div className="doc-row cv-shared">
                  <div className="doc-info">
                    <div className="doc-icon ok"><i className="ti ti-file-check"></i></div>
                    <div>
                      <div className="doc-name">Proof of annual income<span className="req">*</span></div>
                      <div className="doc-meta">PDF · 520 KB · accountant proof ≥ €85,000 (abroad) · uploaded May 8</div>
                    </div>
                  </div>
                  <span className="badge ok dot">Uploaded</span>
                </div>
              </>
            )}

            {docsFilter === 'attention' && (
              <>
                {/* Group: Declaration — signed in portal, no upload */}
                <div className="doc-row cv-shared" style={{background: 'linear-gradient(90deg, #F4F8FF 0%, transparent 100%)'}}>
                  <div className="doc-info">
                    <div className="doc-icon" style={{background: '#E6EEFF', color: 'var(--blue)'}}><i className="ti ti-signature"></i></div>
                    <div>
                      <div className="doc-name">Declaration of no employment intent<span className="req">*</span> <span className="badge" style={{background: '#E6EEFF', color: 'var(--blue)', fontSize: '9px', marginLeft: '4px'}}><i className="ti ti-signature" style={{fontSize: '9px'}}></i> Sign in portal</span></div>
                      <div className="doc-meta">Read the declaration and sign on this page — nothing to upload</div>
                    </div>
                  </div>
                  <button className="btn blue sm" onClick={() => { openModal('sign-in-portal', 'Declaration of no employment intent') }}><i className="ti ti-signature"></i> Sign now</button>
                </div>

                {/* Group: Proof of fund transfer — multiple transactions */}
                <div className="doc-group cv-shared">
                  <button
                    type="button"
                    className="doc-group-head"
                    onClick={() => toggleGroup('fund-transfer')}
                    aria-expanded={!!openGroups['fund-transfer']}
                  >
                    <i className={`ti ${openGroups['fund-transfer'] ? 'ti-chevron-down' : 'ti-chevron-right'} dgh-chev`}></i>
                    <i className="ti ti-arrow-bar-to-down dgh-icon"></i>
                    <div className="dgh-info">
                      <div className="dgh-name">Proof of fund transfer from abroad <span className="req">*</span> <span className="badge cyan" style={{fontSize: '9px', marginLeft: '4px'}}>Multiple files</span></div>
                      <div className="dgh-meta">1 of 3 uploaded · €200,000 still to evidence</div>
                    </div>
                    <span className="badge warn dot">2 remaining</span>
                  </button>
                  {openGroups['fund-transfer'] && (
                    <div className="doc-group-body">
                      <div className="doc-row" style={{border: 'none', padding: '10px 16px'}}>
                        <div className="doc-info">
                          <div className="doc-icon ok"><i className="ti ti-file-check"></i></div>
                          <div>
                            <div className="doc-name" style={{fontSize: '13px'}}>Down payment · €120,000</div>
                            <div className="doc-meta">barclays_swift_mt103_downpayment_may2026.pdf · SWIFT MT103 · 22 Apr 2026 · uploaded May 6</div>
                          </div>
                        </div>
                        <span className="badge ok dot">Verified</span>
                      </div>
                      <div className="doc-row" style={{border: 'none', padding: '10px 16px', borderTop: '1px dashed var(--gray-200)'}}>
                        <div className="doc-info">
                          <div className="doc-icon"><i className="ti ti-file-upload"></i></div>
                          <div>
                            <div className="doc-name" style={{fontSize: '13px'}}>Milestone payment #1 · €100,000</div>
                            <div className="doc-meta">PDF · SWIFT MT103 confirmation required</div>
                          </div>
                        </div>
                        <button className="btn blue sm" onClick={() => router.push('/client/upload?doc=fund-milestone')}><i className="ti ti-upload"></i> Upload</button>
                      </div>
                      <div className="doc-row" style={{border: 'none', padding: '10px 16px', borderTop: '1px dashed var(--gray-200)'}}>
                        <div className="doc-info">
                          <div className="doc-icon"><i className="ti ti-file-upload"></i></div>
                          <div>
                            <div className="doc-name" style={{fontSize: '13px'}}>Final payment · €100,000</div>
                            <div className="doc-meta">PDF · SWIFT MT103 confirmation required</div>
                          </div>
                        </div>
                        <button className="btn blue sm" onClick={() => router.push('/client/upload?doc=fund-final')}><i className="ti ti-upload"></i> Upload</button>
                      </div>
                      <div style={{padding: '8px 16px', borderTop: '1px dashed var(--gray-200)', background: 'var(--gray-50)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div style={{fontSize: '11px', color: 'var(--gray-600)'}}><i className="ti ti-info-circle" style={{marginRight: '4px'}}></i>Got more payments to add later? You can keep uploading transfers after submission.</div>
                        <button className="btn ghost xs" onClick={() => { showToast('Transfer row added', 'A new empty transfer slot is now ready for upload') }}><i className="ti ti-plus"></i> Another transfer</button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="doc-row cv-shared">
                  <div className="doc-info">
                    <div className="doc-icon"><i className="ti ti-file-upload"></i></div>
                    <div>
                      <div className="doc-name">Criminal record certificate (ACRO)<span className="req">*</span></div>
                      <div className="doc-meta">PDF · FCDO apostilled · Required for James, Sarah and Oliver (less than 6 months old)</div>
                    </div>
                  </div>
                  <button className="btn blue sm" onClick={() => router.push('/client/upload?doc=criminal-record')}><i className="ti ti-upload"></i> Upload</button>
                </div>
                <div className="doc-row cv-shared">
                  <div className="doc-info">
                    <div className="doc-icon"><i className="ti ti-file-upload"></i></div>
                    <div>
                      <div className="doc-name">Health insurance certificate<span className="req">*</span></div>
                      <div className="doc-meta">PDF · Inpatient + outpatient covering all 4 family members</div>
                    </div>
                  </div>
                  <button className="btn blue sm" onClick={() => router.push('/client/upload?doc=health-insurance')}><i className="ti ti-upload"></i> Upload</button>
                </div>
                <div className="doc-row cv-shared">
                  <div className="doc-info">
                    <div className="doc-icon"><i className="ti ti-file-upload"></i></div>
                    <div>
                      <div className="doc-name">Marriage certificate (UK certified)<span className="req">*</span></div>
                      <div className="doc-meta">PDF · Certified copy apostilled by FCDO · spouse requirement</div>
                    </div>
                  </div>
                  <button className="btn blue sm" onClick={() => router.push('/client/upload?doc=marriage-certificate')}><i className="ti ti-upload"></i> Upload</button>
                </div>
                <div className="doc-row cv-shared">
                  <div className="doc-info">
                    <div className="doc-icon"><i className="ti ti-file-upload"></i></div>
                    <div>
                      <div className="doc-name">Birth certificates (children)<span className="req">*</span></div>
                      <div className="doc-meta">PDF · UK certified copy apostilled by FCDO · showing both parents (Emily & Oliver)</div>
                    </div>
                  </div>
                  <button className="btn blue sm" onClick={() => router.push('/client/upload?doc=birth-certificates')}><i className="ti ti-upload"></i> Upload</button>
                </div>

                {/* Section: Adult Dependent Child (Oliver Smith, 19) special documents */}
                <div className="doc-row cv-shared" style={{borderLeft: '3px solid var(--purple)'}}>
                  <div className="doc-info">
                    <div className="doc-icon" style={{background: 'var(--purple)', color: 'white'}}><i className="ti ti-school"></i></div>
                    <div>
                      <div className="doc-name">University Enrolment Certificate · Oliver Smith<span className="req">*</span></div>
                      <div className="doc-meta">PDF · Active full-time student status confirmation for current academic year</div>
                    </div>
                  </div>
                  <button className="btn blue sm" onClick={() => router.push('/client/upload?doc=university-enrolment')}><i className="ti ti-upload"></i> Upload</button>
                </div>
                <div className="doc-row cv-shared" style={{borderLeft: '3px solid var(--purple)'}}>
                  <div className="doc-info">
                    <div className="doc-icon" style={{background: 'var(--purple)', color: 'white'}}><i className="ti ti-wallet"></i></div>
                    <div>
                      <div className="doc-name">Proof of Financial Dependency · Oliver Smith<span className="req">*</span></div>
                      <div className="doc-meta">PDF · Stated dependency declaration + evidence sponsor pays tuition & living costs</div>
                    </div>
                  </div>
                  <button className="btn blue sm" onClick={() => router.push('/client/upload?doc=financial-dependency')}><i className="ti ti-upload"></i> Upload</button>
                </div>
                <div className="doc-row cv-shared" style={{borderLeft: '3px solid var(--purple)'}}>
                  <div className="doc-info">
                    <div className="doc-icon" style={{background: 'var(--purple)', color: 'white'}}><i className="ti ti-gavel"></i></div>
                    <div>
                      <div className="doc-name">Declaration of Unmarried Status · Oliver Smith<span className="req">*</span></div>
                      <div className="doc-meta">PDF · UK statutory declaration sworn before solicitor, apostilled by FCDO</div>
                    </div>
                  </div>
                  <button className="btn blue sm" onClick={() => router.push('/client/upload?doc=unmarried-declaration')}><i className="ti ti-upload"></i> Upload</button>
                </div>
              </>
            )}
          </div>
        </div>
        </>)}

        {tab === 'questions' && (
        <div style={{marginTop: '32px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--gray-100)', pb: '8px'}}>
            <div style={{display: 'flex', gap: '4px'}}>
              <button className={`chip ${qsFilter === 'attention' ? 'on' : ''}`} onClick={() => setQsFilter('attention')}>Needs Attention</button>
              <button className={`chip ${qsFilter === 'completed' ? 'on' : ''}`} onClick={() => setQsFilter('completed')}>Completed</button>
            </div>
            <button type="button" className="btn ghost xs" onClick={() => setMany(Q_KEYS, !allQsOpen)}>
              <i className={`ti ${allQsOpen ? 'ti-layout-collapse' : 'ti-layout-expand'}`}></i>
              {allQsOpen ? 'Collapse all' : 'Expand all'}
            </button>
          </div>
          <div className="card">
            <div className="card-b">
              {qsFilter === 'completed' && (
                <div className="cv-shared">
                  <div style={{fontSize: '10px', fontWeight: '700', letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--gray-600)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px'}}><i className="ti ti-file-text" style={{fontSize: '13px'}}></i> Application-level · answered once</div>
                  <div className="form-grid">
                    <div className="form-field">
                      <label>Investment category</label>
                      <div className="ipt">Category A · Residential</div>
                    </div>
                    <div className="form-field">
                      <label>Total investment amount (€)</label>
                      <div className="ipt">€320,000</div>
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-field">
                      <label>Annual income from abroad (€)</label>
                      <div className="ipt">€78,500</div>
                    </div>
                  </div>
                </div>
              )}

              {qsFilter === 'attention' && (
                <div className="cv-shared">
                  <div style={{fontSize: '10px', fontWeight: '700', letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--gray-600)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px'}}><i className="ti ti-file-text" style={{fontSize: '13px'}}></i> Application-level · pending</div>
                  <div className="form-grid">
                    <div className="form-field">
                      <label>Include spouse?</label>
                      <select 
                        className="ipt" 
                        value={appState.includeSpouse} 
                        onChange={(e) => updateAppState('includeSpouse', e.target.value)}
                        style={{width: '100%', padding: '8px 10px', border: '1.5px solid var(--gray-200)', borderRadius: '4px', fontSize: '13px', background: 'white', fontFamily: 'inherit'}}
                      >
                        <option value="">Select Yes or No</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label>Children under 18 to include</label>
                      <input 
                        type="number" 
                        className="ipt" 
                        value={appState.childrenCount}
                        onChange={(e) => updateAppState('childrenCount', e.target.value)}
                        placeholder="Enter a number"
                        style={{width: '100%', padding: '8px 10px', border: '1.5px solid var(--gray-200)', borderRadius: '4px', fontSize: '13px', background: 'white', fontFamily: 'inherit'}}
                      />
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-field">
                      <label>Dependent child aged 18–25 (student)?</label>
                      <select 
                        className="ipt" 
                        value={appState.includeStudent}
                        onChange={(e) => updateAppState('includeStudent', e.target.value)}
                        style={{width: '100%', padding: '8px 10px', border: '1.5px solid var(--gray-200)', borderRadius: '4px', fontSize: '13px', background: 'white', fontFamily: 'inherit'}}
                      >
                        <option value="">Select Yes or No</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Per-family-member questions — one slot per linked contact role */}
              <div style={{marginTop: '28px', paddingTop: '22px', borderTop: '1px dashed var(--gray-300)'}}>
                <div style={{fontSize: '10px', fontWeight: '700', letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--purple)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px'}}><i className="ti ti-users" style={{fontSize: '13px'}}></i> Per family member · answered separately</div>
                <div className="cv-shared" style={{fontSize: '11px', color: 'var(--gray-600)', marginBottom: '14px'}}>These questions are repeated for each of the 4 family members on this application.</div>

                {/* Q4: Country of origin and current residence — per member */}
                <div className="q-group" style={{marginBottom: '10px'}}>
                  <button type="button" className="q-group-head" onClick={() => toggleGroup('q4')} aria-expanded={!!openGroups.q4}>
                    <i className={`ti ${openGroups.q4 ? 'ti-chevron-down' : 'ti-chevron-right'} qgh-chev`}></i>
                    <div className="qgh-title">Country of origin and current residence <span className="req">*</span></div>
                    <span className="badge warn dot" style={{fontSize: '9px'}}>1 of 4 answered</span>
                  </button>
                  {openGroups.q4 && (
                    <div className="q-group-body">
                      <div className="cv-pm-row" data-pm-member="main" style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '4px'}}>
                        <div className="avatar navy sm">JS</div>
                        <div style={{flex: '1'}}>
                          <div style={{fontSize: '11px', color: 'var(--gray-600)'}}>James Smith · main applicant</div>
                          <div style={{fontSize: '13px', fontWeight: '600', color: 'var(--ink)'}}>United Kingdom · resident in United Kingdom</div>
                        </div>
                        <span className="badge ok dot" style={{fontSize: '9px'}}>Answered</span>
                      </div>
                      <div className="cv-pm-row" data-pm-member="ss" style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '4px', marginTop: '8px'}}>
                        <div className="avatar purple sm">SS</div>
                        <div style={{flex: '1'}}>
                          <div style={{fontSize: '11px', color: 'var(--gray-600)'}}>Sarah Smith · spouse</div>
                          <input type="text" placeholder="e.g. United Kingdom · resident in United Kingdom" style={{width: '100%', padding: '6px 8px', border: '1px solid var(--gray-200)', borderRadius: '3px', fontFamily: 'inherit', fontSize: '13px', marginTop: '2px'}} />
                        </div>
                      </div>
                      <div className="cv-pm-row" data-pm-member="os" style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '4px', marginTop: '8px'}}>
                        <div className="avatar blue sm">OS</div>
                        <div style={{flex: '1'}}>
                          <div style={{fontSize: '11px', color: 'var(--gray-600)'}}>Oliver Smith · child (19, Student)</div>
                          <input type="text" placeholder="e.g. United Kingdom · resident in United Kingdom" style={{width: '100%', padding: '6px 8px', border: '1px solid var(--gray-200)', borderRadius: '3px', fontFamily: 'inherit', fontSize: '13px', marginTop: '2px'}} />
                        </div>
                      </div>
                      <div className="cv-pm-row" data-pm-member="es" style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '4px', marginTop: '8px'}}>
                        <div className="avatar cyan sm">ES</div>
                        <div style={{flex: '1'}}>
                          <div style={{fontSize: '11px', color: 'var(--gray-600)'}}>Emily Smith · child (12)</div>
                          <input type="text" placeholder="e.g. United Kingdom · resident in United Kingdom" style={{width: '100%', padding: '6px 8px', border: '1px solid var(--gray-200)', borderRadius: '3px', fontFamily: 'inherit', fontSize: '13px', marginTop: '2px'}} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Q8: Refused entry — per member */}
                <div className="q-group">
                  <button type="button" className="q-group-head" onClick={() => toggleGroup('q8')} aria-expanded={!!openGroups.q8}>
                    <i className={`ti ${openGroups.q8 ? 'ti-chevron-down' : 'ti-chevron-right'} qgh-chev`}></i>
                    <div className="qgh-title">Has this person ever been refused entry to Cyprus or any EU country? <span className="req">*</span></div>
                    <span className="badge warn dot" style={{fontSize: '9px'}}>0 of 4 answered</span>
                  </button>
                  {openGroups.q8 && (
                    <div className="q-group-body">
                      <div className="cv-pm-row" data-pm-member="main" style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '4px'}}>
                        <div className="avatar navy sm">JS</div>
                        <div style={{flex: '1'}}>
                          <div style={{fontSize: '11px', color: 'var(--gray-600)'}}>James Smith · main applicant</div>
                          <div style={{display: 'flex', gap: '6px', marginTop: '4px'}}>
                            <button className="btn ghost xs" style={{padding: '4px 10px'}} onClick={() => showToast('Answer recorded: No', 'Saved as draft — submit the application to finalize')}>No</button>
                            <button className="btn ghost xs" style={{padding: '4px 10px'}} onClick={() => openModal('add-details', 'this question')}>Yes — add details</button>
                          </div>
                        </div>
                      </div>
                      <div className="cv-pm-row" data-pm-member="ss" style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '4px', marginTop: '8px'}}>
                        <div className="avatar purple sm">SS</div>
                        <div style={{flex: '1'}}>
                          <div style={{fontSize: '11px', color: 'var(--gray-600)'}}>Sarah Smith · spouse</div>
                          <div style={{display: 'flex', gap: '6px', marginTop: '4px'}}>
                            <button className="btn ghost xs" style={{padding: '4px 10px'}} onClick={() => showToast('Answer recorded: No', 'Saved as draft — submit the application to finalize')}>No</button>
                            <button className="btn ghost xs" style={{padding: '4px 10px'}} onClick={() => openModal('add-details', 'this question')}>Yes — add details</button>
                          </div>
                        </div>
                      </div>
                      <div className="cv-pm-row" data-pm-member="os" style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '4px', marginTop: '8px'}}>
                        <div className="avatar blue sm">OS</div>
                        <div style={{flex: '1'}}>
                          <div style={{fontSize: '11px', color: 'var(--gray-600)'}}>Oliver Smith · child (19, Student)</div>
                          <div style={{display: 'flex', gap: '6px', marginTop: '4px'}}>
                            <button className="btn ghost xs" style={{padding: '4px 10px'}} onClick={() => showToast('Answer recorded: No', 'Saved as draft — submit the application to finalize')}>No</button>
                            <button className="btn ghost xs" style={{padding: '4px 10px'}} onClick={() => openModal('add-details', 'this question')}>Yes — add details</button>
                          </div>
                        </div>
                      </div>
                      <div className="cv-pm-row" data-pm-member="es" style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '4px', marginTop: '8px'}}>
                        <div className="avatar cyan sm">ES</div>
                        <div style={{flex: '1'}}>
                          <div style={{fontSize: '11px', color: 'var(--gray-600)'}}>Emily Smith · child (12)</div>
                          <div style={{display: 'flex', gap: '6px', marginTop: '4px'}}>
                            <button className="btn ghost xs" style={{padding: '4px 10px'}} onClick={() => showToast('Answer recorded: No', 'Saved as draft — submit the application to finalize')}>No</button>
                            <button className="btn ghost xs" style={{padding: '4px 10px'}} onClick={() => openModal('add-details', 'this question')}>Yes — add details</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {tab === 'activity' && (
        <div style={{marginTop: '20px'}}>
          <div className="label-stripe">Recent activity</div>
          <div className="card">
            <div className="card-b">
              <div className="timeline">
                <div className="tl-item"><span className="badge purple">Upload</span> You uploaded <b>Declaration of no employment intent</b> (signed in-portal)<div className="tt">Today, 9:12 AM</div></div>
                <div className="tl-item"><span className="badge cyan">Answer</span> You answered <b>Question 4 · Country of origin and current residence</b><div className="tt">Yesterday, 4:15 PM</div></div>
                <div className="tl-item"><span className="badge purple">Upload</span> You uploaded <b>Proof of annual income</b><div className="tt">May 8, 11:47 AM · 480 KB</div></div>
                <div className="tl-item"><span className="badge purple">Upload</span> You uploaded <b>Proof of investment</b><div className="tt">May 8, 9:14 AM · 2.1 MB</div></div>
                <div className="tl-item"><span className="badge purple">Upload</span> You uploaded <b>Valid passport</b><div className="tt">May 6, 11:23 AM · 1.2 MB</div></div>
                <div className="tl-item"><span className="badge cyan">Answer</span> You answered <b>Questions 1–3</b> (investment category, amount, income)<div className="tt">May 7, 8:32 PM</div></div>
                <div className="tl-item"><span className="badge info">Start</span> Anjali Mehta sent you this application<div className="tt">May 2, 9:15 AM · 60-day timeline</div></div>
              </div>
            </div>
          </div>
        </div>
        )}

        {tab === 'messages' && (
        <div style={{marginTop: '20px'}}>
          <div className="label-stripe">Conversation with your advisor</div>
          <div className="card">
            <div className="card-b" style={{padding: '0'}}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px', padding: '18px'}}>
                <div style={{display: 'flex', gap: '10px'}}>
                  <div className="avatar navy sm">AM</div>
                  <div style={{flex: '1', background: '#F4F7FF', border: '1px solid #D6E4FF', borderRadius: '6px', padding: '10px 12px'}}>
                    <div style={{fontSize: '11px', fontWeight: '700', color: 'var(--navy)'}}>Anjali Mehta · your advisor <span style={{fontWeight: '400', color: 'var(--gray-500)', marginLeft: '6px'}}>2 days ago</span></div>
                    <div style={{fontSize: '13px', color: 'var(--ink)', marginTop: '4px', lineHeight: '1.5'}}>Hi James — your investment proof looks great. When you have a moment, please add the two outstanding fund-transfer receipts so I can verify the full €320k chain. Aim for end of this week if possible.</div>
                  </div>
                </div>
                <div style={{display: 'flex', gap: '10px', flexDirection: 'row-reverse'}}>
                  <div className="avatar purple sm">JS</div>
                  <div style={{flex: '1', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '6px', padding: '10px 12px'}}>
                    <div style={{fontSize: '11px', fontWeight: '700', color: 'var(--navy)', textAlign: 'right'}}>You <span style={{fontWeight: '400', color: 'var(--gray-500)', marginLeft: '6px'}}>2 days ago</span></div>
                    <div style={{fontSize: '13px', color: 'var(--ink)', marginTop: '4px', lineHeight: '1.5', textAlign: 'right'}}>Thanks — milestone receipt should be from Barclays by Friday. Final tranche is set for late June. I'll upload both as they come.</div>
                  </div>
                </div>
                <div style={{display: 'flex', gap: '10px'}}>
                  <div className="avatar navy sm">AM</div>
                  <div style={{flex: '1', background: '#F4F7FF', border: '1px solid #D6E4FF', borderRadius: '6px', padding: '10px 12px'}}>
                    <div style={{fontSize: '11px', fontWeight: '700', color: 'var(--navy)'}}>Anjali Mehta · your advisor <span style={{fontWeight: '400', color: 'var(--gray-500)', marginLeft: '6px'}}>1 day ago</span></div>
                    <div style={{fontSize: '13px', color: 'var(--ink)', marginTop: '4px', lineHeight: '1.5'}}>Perfect, that timeline still fits inside the Cyprus Reg. 6.2 window. Reach out anytime if Sarah, Oliver, or Emily have trouble uploading their passports.</div>
                  </div>
                </div>
              </div>
              <div style={{borderTop: '1px solid var(--gray-200)', padding: '12px 18px', display: 'flex', gap: '8px', alignItems: 'flex-start'}}>
                <textarea placeholder="Type a message to your advisor…" style={{flex: '1', minHeight: '60px', padding: '10px 12px', border: '1.5px solid var(--gray-200)', borderRadius: '4px', fontFamily: 'inherit', fontSize: '13px', resize: 'vertical'}}></textarea>
                <button className="btn blue sm" onClick={() => showToast('Message sent', 'Anjali Mehta will reply within 1 business day')}><i className="ti ti-send"></i> Send</button>
              </div>
            </div>
          </div>
        </div>
        )}

        <div className="submit-bar cv-shared">
          <div className="sb-info">
            <div className="sb-pri">40% complete · ready to submit?</div>
            <div className="sb-sub">9 documents and 3 questions remaining · including 2 family-member passports and 2 fund-transfer tranches · you can still submit and complete them after, your advisor will follow up</div>
          </div>
          <div className="sb-actions">
            {/* Save draft removed - autosave exists */}
            <button className="btn blue" onClick={() => { openModal('submit-app') }} style={{display: '40%' === '100%' ? 'flex' : 'none'}}><i className="ti ti-send"></i> Submit application</button>
          </div>
        </div>

        {/* Member-view footer — shown only to non-main members */}
        <div className="cv-member-footer" style={{display: 'none', marginTop: '24px', padding: '16px 20px', background: 'linear-gradient(135deg, #FAF6FF 0%, #F4F8FF 100%)', border: '1px solid #E5D4F5', borderLeft: '3px solid var(--purple)', borderRadius: '4px', alignItems: 'center', gap: '14px'}}>
          <i className="ti ti-circle-check" style={{fontSize: '26px', color: 'var(--purple)', flexShrink: '0'}}></i>
          <div style={{flex: '1'}}>
            <div style={{fontSize: '14px', fontWeight: '700', color: 'var(--navy)', marginBottom: '2px'}}>Once you're done with your items, the main applicant takes it from here</div>
            <div style={{fontSize: '12px', color: 'var(--gray-700)'}}>James Smith will be notified the moment you upload your passport and answer your questions. He submits the whole application when everyone is done.</div>
          </div>
          <button className="btn ghost sm" onClick={() => { showToast('Saved', 'Your progress was saved · James will see you completed your part') }}><i className="ti ti-device-floppy"></i> Save and finish later</button>
        </div>
      </div></>
  );
}
