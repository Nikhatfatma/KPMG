"use client";
import { useRouter } from "next/navigation";
import { showToast, openModal, closeModal, useClientsStore, useWizardStore, useProjectsStore } from "@/lib/store";
import { TEMPLATES } from "@/lib/templates";
import { useMemo, useState } from "react";

const FAMILY_PALETTE = ["purple", "cyan", "pink", "blue", "amber"];
const initialsFromName = (n) => {
  const parts = (n || "").trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "?";
};

export default function S_requestPage() {
  const router = useRouter();
  const clients = useClientsStore((s) => s.clients);
  const addProject = useProjectsStore((s) => s.addProject);
  
  const { 
    draft, 
    pickClient: storePickClient, 
    pickService: storePickService, 
    addFamilyMember: storeAddFamilyMember, 
    removeFamilyMember, 
    goToStep, 
    reset: resetWizard 
  } = useWizardStore();

  const step = draft.step || 1;
  const setStep = goToStep;
  
  const docs = draft.documents || [];
  const questions = draft.questions || [];
  const familyMembers = draft.familyMembers || [];
  
  const selectedClientId = draft.clientId;
  const selectedServiceId = draft.serviceId;

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

  // ---- Search and filter ----
  const [search, setSearch] = useState("");
  
  // Owners / approvers — multi-select
  const STAFF_POOL = [
    { id: "am", name: "Anjali Mehta",  initials: "AM", color: "navy",  role: "Senior consultant" },
    { id: "rk", name: "Rohan Kapoor",  initials: "RK", color: "purple", role: "Consultant" },
    { id: "es", name: "Elena Stavrou", initials: "ES", color: "cyan",  role: "Compliance lead" },
    { id: "mp", name: "Marios Pavlou", initials: "MP", color: "pink",  role: "Tax partner" },
    { id: "nd", name: "Nikos Dimitriou", initials: "ND", color: "amber", role: "Operations" },
  ];
  const [owners, setOwners] = useState([STAFF_POOL[0]]); // default: Anjali
  const [ownerPickerOpen, setOwnerPickerOpen] = useState(false);
  const addOwner = (id) => {
    const u = STAFF_POOL.find((x) => x.id === id);
    if (!u) return;
    if (owners.find((o) => o.id === id)) return;
    setOwners((arr) => [...arr, u]);
  };
  const removeOwner = (id) => setOwners((arr) => arr.filter((o) => o.id !== id));
  
  const [note, setNote] = useState("");
  const [pushZoho, setPushZoho] = useState(true);

  // Expected completion date — stored as YYYY-MM-DD; defaults to today + 60 days.
  const todayPlus = (n) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };
  const [expectedDate, setExpectedDate] = useState(todayPlus(60));

  // Local state for family input
  const [familyAddOpen, setFamilyAddOpen] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [inlineRole, setInlineRole] = useState("Spouse");

  const [inlineAddKey, setInlineAddKey] = useState(null);
  const [inlineName, setInlineName] = useState("");

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedClientId) || null,
    [selectedClientId, clients]
  );
  const selectedService = selectedServiceId ? TEMPLATES[selectedServiceId] : null;

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) =>
      [c.name, c.email, c.phone].some((v) => (v || "").toLowerCase().includes(q))
    );
  }, [search, clients]);

  // ---------- Step handlers ----------
  const pickClient = (clientId) => {
    const c = clients.find((x) => x.id === clientId);
    if (c) {
      storePickClient({
        clientId: c.id,
        clientName: c.name,
        clientEmail: c.email,
        clientPhone: c.phone,
        clientInitials: c.initials,
        clientColor: c.color,
        clientSource: c.source
      });
    }
  };

  const loadTemplate = (svcId) => {
    const tpl = TEMPLATES[svcId];
    if (!tpl) return;
    storePickService(svcId, tpl.name, tpl.deadline || 30, TEMPLATES);
    setExpectedDate(todayPlus(tpl.deadline || 30));
  };

  const pickService = (svcId) => {
    loadTemplate(svcId);
  };

  const pickServiceFromSuggest = () => {
    if (selectedClient?.suggested) pickService(selectedClient.suggested);
  };

  const canContinue = () => {
    if (step === 1) return !!selectedClientId;
    if (step === 2) return !!selectedServiceId;
    if (step === 3) return docs.some((d) => d.included) || questions.some((q) => q.included);
    return false;
  };

  const nextStep = () => {
    if (!canContinue()) return;
    setStep(Math.min(4, step + 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const prevStep = () => {
    setStep(Math.max(1, step - 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------- Family member handlers ----------
  const showFamilyAddForm = () => { setFamilyAddOpen(true); setFamilyName(""); setInlineRole("Spouse"); };
  const cancelFamilyAdd = () => { setFamilyAddOpen(false); setFamilyName(""); };
  const addFamilyMember = () => {
    const name = familyName.trim();
    if (!name) { showToast("Add a name", "Enter the family member's full name", true); return; }
    storeAddFamilyMember(name, inlineRole);
    setFamilyName("");
    setFamilyAddOpen(false);
    showToast("Member added", `${name} added to the application family`);
  };

  // ---------- Inline "Add another member" ----------
  const openInlineAdd = (key) => { setInlineAddKey(key); setInlineName(""); setInlineRole("Spouse"); };
  const cancelInlineAdd = () => { setInlineAddKey(null); setInlineName(""); };
  const confirmInlineAdd = () => {
    const name = inlineName.trim();
    if (!name) { showToast("Add a name", "Enter the family member's full name", true); return; }
    storeAddFamilyMember(name, inlineRole);
    setInlineAddKey(null);
    setInlineName("");
    showToast("Member added to application", `${name} now appears on every per-member item`);
  };

  // ---------- Item toggle handlers (Wizard store) ----------
  const toggleDocIncluded = (id) => useWizardStore.getState().toggleItem("doc", id);
  const toggleDocRequired = (id) => useWizardStore.getState().toggleItemRequired("doc", id);
  const removeDoc = (id) => useWizardStore.getState().removeItem("doc", id);
  const toggleQIncluded   = (id) => useWizardStore.getState().toggleItem("q", id);
  const toggleQRequired   = (id) => useWizardStore.getState().toggleItemRequired("q", id);
  const removeQ = (id) => useWizardStore.getState().removeItem("q", id);

  const toggleDocPerMember = (id) => {
    const d = docs.find(x => x.id === id);
    if (!d) return;
    useWizardStore.getState().setPerMember("doc", id, d.collectPer !== 'familyMember');
  };
  const toggleQPerMember = (id) => {
    const q = questions.find(x => x.id === id);
    if (!q) return;
    useWizardStore.getState().setPerMember("q", id, q.answerPer !== 'familyMember');
  };

  const toggleSkipMemberForDoc = (docId, memberId) => useWizardStore.getState().togglePerMemberItem("doc", docId, memberId);
  const toggleSkipMemberForQ = (qId, memberId) => useWizardStore.getState().togglePerMemberItem("q", qId, memberId);

  const renderPerMemberPanel = (item, kind) => {
    const isDoc = kind === "doc";
    const key = `${isDoc ? 'doc' : 'q'}:${item.id}`;
    const excluded = item.excludedMembers || [];
    const activeMembers = familyMembers.filter((m) => !excluded.includes(m.id));
    const headLabel = isDoc ? "Copies for this application" : "Answers for this application";
    return (
      <div className="rqi-pm-panel">
        <div className="rqi-pm-head">
          <i className="ti ti-users"></i>
          {headLabel} · {activeMembers.length} of {familyMembers.length} member{familyMembers.length === 1 ? '' : 's'}
        </div>
        <div className="rqi-pm-list">
          {familyMembers.map((m) => {
            const skipped = excluded.includes(m.id);
            return (
              <div key={m.id} className={`rqi-pm-row${skipped ? ' skipped' : ''}`}>
                <div className={`avatar ${m.color} sm`}>{m.avatar}</div>
                <div className="rqi-pm-info">
                  <div className="rqi-pm-name">{m.name}</div>
                  <div className="rqi-pm-role">{m.role}</div>
                </div>
                <button
                  type="button"
                  className={`rqi-pm-skip${skipped ? ' is-skipped' : ''}`}
                  onClick={() => (isDoc ? toggleSkipMemberForDoc(item.id, m.id) : toggleSkipMemberForQ(item.id, m.id))}
                >
                  <i className={`ti ${skipped ? 'ti-rotate-clockwise' : 'ti-x'}`}></i>
                  {skipped ? 'Re-include' : 'Skip for this member'}
                </button>
              </div>
            );
          })}
        </div>
        <div className="rqi-pm-foot">
          {inlineAddKey === key ? (
            <div className="rqi-pm-inline-add" style={{flex: 1}}>
              <input type="text" value={inlineName} onChange={(e) => setInlineName(e.target.value)} placeholder="Full name" autoFocus onKeyDown={(e) => { if(e.key==='Enter') confirmInlineAdd(); if(e.key==='Escape') cancelInlineAdd(); }} />
              <select value={inlineRole} onChange={(e) => setInlineRole(e.target.value)}>
                <option>Spouse</option>
                <option>Child under 18</option>
                <option>Dependent 18–25 (student)</option>
                <option>Parent dependent</option>
                <option>Other dependent</option>
              </select>
              <button type="button" className="btn ghost sm" onClick={cancelInlineAdd}>Cancel</button>
              <button type="button" className="btn blue sm" onClick={confirmInlineAdd}><i className="ti ti-check"></i> Add</button>
            </div>
          ) : (
            <>
              <button type="button" className="rqi-pm-add-btn" onClick={() => openInlineAdd(key)}><i className="ti ti-user-plus"></i> Add another member</button>
              <div className="rqi-pm-foot-help">Need one more person for this item? Adding them updates every per-member doc and question on this application.</div>
            </>
          )}
        </div>
      </div>
    );
  };

  const handleSend = () => {
    const c = selectedClient;
    if (!c) return;
    
    addProject({
      clientName: c.name,
      service: selectedService?.name || "Custom Service",
      status: "New request",
      color: c.color,
      initials: c.initials,
      source: c.source,
      owner: "AM",
      progress: 0,
      docStats: `0/${docs.filter(d => d.included).length}`,
      timestamp: Date.now()
    });

    showToast("Request sent", `${c.name} has been emailed a secure magic-link.`);
    resetWizard();
    setTimeout(() => routerPush("s-projects"), 600);
  };

  const includedDocs = docs.filter((d) => d.included);
  const includedQs   = questions.filter((q) => q.included);
  const customDocCount = docs.filter((d) => d.custom).length;
  const customQCount   = questions.filter((q) => q.custom).length;
  const requiredFromClient = includedDocs.filter((d) => !d.signInPortal).length;

  const expectedDateLabel = (() => {
    if (!expectedDate) return "—";
    const dt = new Date(expectedDate + "T00:00:00");
    if (isNaN(dt.getTime())) return "—";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round((dt - today) / (1000 * 60 * 60 * 24));
    const formatted = dt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    if (diffDays < 0) return `${formatted} (${Math.abs(diffDays)} days ago)`;
    if (diffDays === 0) return `${formatted} (today)`;
    return `${formatted} (${diffDays} day${diffDays === 1 ? "" : "s"} from today)`;
  })();

  const stepStateClass = (n) => {
    if (n === step) return "step cur";
    if (n < step) return "step done";
    return "step";
  };

  return (
    <>
        <div className="crumbs"><a onClick={() => { routerPush('s-projects') }}>Projects</a> <i className="ti ti-chevron-right"></i> New request</div>
        <div className="ph">
          <div className="lhs">
            <div className="eyebrow">New request</div>
            <h1 id="rq-title">Create a new application</h1>
            <div className="sub" id="rq-sub">Pick a client and service type — the template loads with all default documents and questions, ready for you to customize for this specific application</div>
          </div>
        </div>

        <div className="stepper" id="rq-stepper">
          <div className={stepStateClass(1)} data-step="1"><div className="num">{step > 1 ? <i className="ti ti-check"></i> : 1}</div><span className="nm">Client</span><div className="ln"></div></div>
          <div className={stepStateClass(2)} data-step="2"><div className="num">{step > 2 ? <i className="ti ti-check"></i> : 2}</div><span className="nm">Service</span><div className="ln"></div></div>
          <div className={stepStateClass(3)} data-step="3"><div className="num">{step > 3 ? <i className="ti ti-check"></i> : 3}</div><span className="nm">Customize</span><div className="ln"></div></div>
          <div className={stepStateClass(4)} data-step="4"><div className="num">4</div><span className="nm">Send</span></div>
        </div>

        {step === 1 && (
        <div className="step-content" id="rq-step-1">
          <div className="label-stripe">Choose a client</div>
          <div className="form-field" style={{marginBottom: '16px'}}>
            <input type="text" id="rq-client-search" placeholder="Search by name, email, or phone…" value={search} onChange={(e) => setSearch(e.target.value)} style={{width: '100%', padding: '11px 14px', border: '1.5px solid var(--gray-200)', borderRadius: '4px', fontFamily: 'inherit', fontSize: '13px'}} />
          </div>
          <div id="rq-client-list" className="rq-client-list">
            {filteredClients.map((c) => (
              <div
                key={c.id}
                className="rq-pick-card"
                onClick={() => pickClient(c.id)}
                style={selectedClientId === c.id ? { borderColor: 'var(--blue)', background: '#F4F7FF', boxShadow: '0 0 0 3px rgba(40,90,255,0.10)' } : undefined}
              >
                <div className={`avatar ${c.color} lg`}>{c.initials}</div>
                <div className="rqp-info">
                  <div className="rqp-name">{c.name}</div>
                  <div className="rqp-meta">{c.email} · {c.phone}</div>
                  <div className="rqp-meta" style={{marginTop: '4px'}}>
                    {c.source === 'Zoho'
                      ? <span className="badge cyan dot">Zoho</span>
                      : <span className="badge mu">Manual entry</span>}
                    {' '}
                    {c.renewalNote
                      ? <span className="badge da">{c.renewalNote}</span>
                      : <span className="badge mu">Suggested: {c.suggestLabel}</span>}
                  </div>
                </div>
                <i className={`ti ${selectedClientId === c.id ? 'ti-check' : 'ti-arrow-right'} rqp-arrow`} style={selectedClientId === c.id ? { color: 'var(--blue)' } : undefined}></i>
              </div>
            ))}
            {filteredClients.length === 0 && (
              <div className="rq-empty" id="rq-no-client">
                <div className="empty-state">
                  <i className="ti ti-user-question"></i>
                  <div className="et">No matching client</div>
                  <div className="es">Try a different search term — or add a new client</div>
                </div>
              </div>
            )}
          </div>
          <div style={{marginTop: '16px', padding: '14px 16px', background: 'var(--gray-50)', border: '1px dashed var(--gray-300)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{fontSize: '13px', color: 'var(--gray-700)'}}>Client not in the list?</div>
            <button className="btn blue sm" onClick={() => { openModal('add-client') }}><i className="ti ti-plus"></i> Add new client</button>
          </div>
        </div>
        )}

        {step === 2 && (
        <div className="step-content" id="rq-step-2">
          <div className="label-stripe">Choose a service type</div>
          {selectedClient?.suggested && TEMPLATES[selectedClient.suggested] && (
            <div id="rq-suggest" className="rq-suggest">
              <i className="ti ti-sparkles"></i>
              <div><b>Suggested for <span id="rq-suggest-name">{selectedClient.name}</span>:</b> <span id="rq-suggest-svc">{TEMPLATES[selectedClient.suggested].name}</span> — based on Zoho Deal type and past applications</div>
              <button className="btn white sm" onClick={pickServiceFromSuggest}>Use suggestion</button>
            </div>
          )}
          <div className="rq-service-grid">
            {Object.entries(TEMPLATES).map(([svcId, tpl]) => (
              <div
                key={svcId}
                className={`rq-service-card${selectedServiceId === svcId ? ' selected' : ''}`}
                onClick={() => pickService(svcId)}
              >
                <div className="rqs-head"><div className="rqs-icon"><i className="ti ti-stamp"></i></div><span className="badge ok dot">Active</span></div>
                <h4>{tpl.name}</h4>
                <p className="rqs-desc">
                  {svcId === 'fast-track'
                    ? 'Cyprus Reg. 6.2 · investor route · lifetime PR · investment + income proof required'
                    : 'Cyprus temporary residence · independent means · renewable annually · MVIS8 form'}
                </p>
                <div className="rqs-stats"><span><b>{tpl.documents.length}</b> docs</span><span><b>{tpl.questions.length}</b> questions</span><span><b>{tpl.deadline}</b> days</span></div>
                <div className="key-facts-compact">
                  {(tpl.keyFacts || []).slice(0, 4).map((kf, i) => (
                    <span key={i} className="kfc"><b>{kf.label.replace(/^Min\.\s+/, '').replace(/\s.*/, '.')}</b>{kf.value.split('·')[0].trim()}</span>
                  ))}
                </div>
                <div className="rqs-foot">Template: {tpl.tplLabel}</div>
              </div>
            ))}
          </div>
        </div>
        )}

        {step === 3 && (
        <div className="step-content" id="rq-step-3">
          <div className="rq-customize-head">
            <div>
              <div className="label-stripe" style={{margin: '0'}}>Customize for <span id="rq-cust-client">{selectedClient?.name || 'this client'}</span></div>
              <div style={{fontSize: '13px', color: 'var(--gray-700)', marginTop: '6px'}}>
                Based on <strong id="rq-cust-tpl-name">{selectedService?.tplLabel || 'template'}</strong>. Toggle off any documents or questions that aren't relevant, mark items as optional, or add custom ones just for this application.
              </div>
            </div>
            <div className="rq-cust-summary">
              <div className="rq-summary-stat"><span className="num" id="rq-doc-count">{includedDocs.length}</span><span className="lab">Documents</span></div>
              <div className="rq-summary-stat"><span className="num" id="rq-q-count">{includedQs.length}</span><span className="lab">Questions</span></div>
            </div>
          </div>

          {selectedService?.keyFacts?.length > 0 && (
            <div className="key-facts-panel" id="rq-key-facts">
              <div className="kfp-head">
                <i className="ti ti-info-square-rounded"></i>
                <div>
                  <div className="kfp-title">Key facts for this service</div>
                  <div className="kfp-sub">Reference thresholds and timelines — show these to the client in the email note if helpful.</div>
                </div>
              </div>
              <div className="kfp-grid" id="rq-key-facts-grid">
                {selectedService.keyFacts.map((kf, i) => (
                  <div key={i} className="kfp-item"><span className="lab">{kf.label}</span><span className="val">{kf.value}</span></div>
                ))}
              </div>
            </div>
          )}

          <div className="rq-cust-section" style={{marginTop: '6px'}}>
            <div className="rq-cust-section-head">
              <div>
                <h3><i className="ti ti-users" style={{fontSize: '16px', verticalAlign: '-2px', color: 'var(--purple)'}}></i> Family members on this application <span id="rq-family-count" style={{fontSize: '12px', fontWeight: '500', color: 'var(--gray-600)', marginLeft: '4px'}}>· {familyMembers.length}</span></h3>
                <div className="rq-section-meta">Add the spouse, children, or dependents on this application. Documents and questions marked "per family member" will expand automatically below — each can be customized for each person.</div>
              </div>
              <button className="btn blue sm" onClick={showFamilyAddForm}><i className="ti ti-user-plus"></i> Add family member</button>
            </div>
            <div id="rq-family-list" style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              {familyMembers.map((m) => (
                <div key={m.id} style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', border: '1px solid var(--gray-200)', borderRadius: '4px', background: 'var(--paper)'}}>
                  <div className={`avatar ${m.color} sm`}>{m.avatar}</div>
                  <div style={{flex: 1}}>
                    <div style={{fontSize: '13px', fontWeight: '700', color: 'var(--navy)'}}>{m.name}</div>
                    <div style={{fontSize: '11px', color: 'var(--gray-600)'}}>{m.role}{m.locked ? ' · locked (main applicant)' : ''}</div>
                  </div>
                  {!m.locked && (
                    <button className="btn ghost xs danger" onClick={() => removeFamilyMember(m.id)} title="Remove"><i className="ti ti-x"></i></button>
                  )}
                </div>
              ))}
            </div>
            {familyAddOpen && (
              <div id="rq-family-add" style={{background: '#FAF6FF', border: '1px solid #E5D4F5', borderRadius: '4px', padding: '12px 14px', marginTop: '8px'}}>
                <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--purple)', marginBottom: '8px'}}>New family member</div>
                <div style={{display: 'grid', gridTemplateColumns: '2fr 1.5fr auto auto', gap: '8px', alignItems: 'center'}}>
                  <input type="text" value={familyName} onChange={(e) => setFamilyName(e.target.value)} placeholder="Full name (e.g. Rohan Sharma)" style={{padding: '9px 12px', border: '1.5px solid var(--gray-200)', borderRadius: '3px', fontFamily: 'inherit', fontSize: '13px'}} onKeyDown={(e) => { if(e.key==='Enter') addFamilyMember(); if(e.key==='Escape') cancelFamilyAdd(); }} autoFocus />
                  <select value={inlineRole} onChange={(e) => setInlineRole(e.target.value)} style={{padding: '9px 12px', border: '1.5px solid var(--gray-200)', borderRadius: '3px', fontFamily: 'inherit', fontSize: '13px'}}>
                    <option>Spouse</option>
                    <option>Child under 18</option>
                    <option>Dependent 18–25 (student)</option>
                    <option>Parent dependent</option>
                    <option>Other dependent</option>
                  </select>
                  <button className="btn ghost sm" onClick={cancelFamilyAdd}>Cancel</button>
                  <button className="btn blue sm" onClick={addFamilyMember}><i className="ti ti-check"></i> Add</button>
                </div>
                <div style={{fontSize: '11px', color: 'var(--gray-600)', marginTop: '8px', display: 'flex', gap: '6px', alignItems: 'center'}}><i className="ti ti-info-circle"></i> A contact role will be created on the linked Zoho Deal · the new member's passport row + any per-member questions appear in the lists below.</div>
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="rq-cust-section">
            <div className="rq-cust-section-head">
              <div>
                <h3>Documents</h3>
                <div className="rq-section-meta"><span id="rq-doc-meta">{includedDocs.length} included · {docs.length - includedDocs.length} excluded · {customDocCount} custom</span></div>
              </div>
              <button className="btn ghost sm" onClick={() => { openModal('add-doc-onetime', selectedClient?.name || '') }}><i className="ti ti-plus"></i> Add custom document</button>
            </div>
            <div className="rq-item-list" id="rq-doc-list">
              {docs.map((d) => {
                const perMember = d.collectPer === 'familyMember';
                const cls = ['rq-item'];
                if (d.included) cls.push('included'); else cls.push('excluded');
                if (d.custom) cls.push('custom');
                if (perMember && d.included) cls.push('per-member');
                return (
                  <div key={d.id} className={cls.join(' ')}>
                    <div className="rqi-row">
                      <div className="rqi-check" onClick={() => toggleDocIncluded(d.id)} title={d.included ? 'Click to exclude' : 'Click to include'}>
                        {d.included && <i className="ti ti-check"></i>}
                      </div>
                      <div className="rqi-info">
                        <div className="rqi-name">
                          {d.name}
                          {perMember && <span className="badge mu">Per family member</span>}
                          {d.signInPortal && <span className="badge mu"><i className="ti ti-signature" style={{fontSize: '11px', marginRight: '2px'}}></i>Sign in portal</span>}
                          {d.multiDoc && <span className="badge ok dot">Multiple files</span>}
                          {d.conditional && <span className="badge mu">Conditional · {d.conditional}</span>}
                          {d.custom && <span className="badge mu" style={{background: '#EEEDFE', color: 'var(--purple)'}}>Custom</span>}
                        </div>
                        <div className="rqi-desc">{d.desc}</div>
                      </div>
                      <div className="rqi-actions">
                        <button
                          type="button"
                          className="rqi-pm-indicator"
                          onClick={() => toggleDocPerMember(d.id)}
                          disabled={!d.included || d.signInPortal}
                          title={perMember ? 'Per family member — click to collect once for the application' : 'Click to collect this document per family member'}
                          style={!perMember ? { color: 'var(--gray-500)' } : undefined}
                        >
                          <i className={`ti ${perMember ? 'ti-users' : 'ti-user-plus'}`}></i>
                        </button>
                        <button
                          type="button"
                          className={`rqi-toggle ${d.required ? 'required' : 'optional'}`}
                          onClick={() => toggleDocRequired(d.id)}
                          disabled={!d.included}
                          title="Toggle required / optional"
                        >
                          {d.required ? 'Required' : 'Optional'}
                        </button>
                        <button type="button" className="rqi-icon-btn" onClick={() => removeDoc(d.id)} title="Remove from this application">
                          <i className="ti ti-x"></i>
                        </button>
                      </div>
                    </div>
                    {perMember && d.included && familyMembers.length > 0 && renderPerMemberPanel(d, 'doc')}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Questions */}
          <div className="rq-cust-section">
            <div className="rq-cust-section-head">
              <div>
                <h3>Questions</h3>
                <div className="rq-section-meta"><span id="rq-q-meta">{includedQs.length} included · {questions.length - includedQs.length} excluded · {customQCount} custom</span></div>
              </div>
              <button className="btn ghost sm" onClick={() => { openModal('add-question-onetime', selectedClient?.name || '') }}><i className="ti ti-plus"></i> Add custom question</button>
            </div>
            <div className="rq-item-list" id="rq-q-list">
              {questions.map((q) => {
                const perMember = q.answerPer === 'familyMember';
                const cls = ['rq-item'];
                if (q.included) cls.push('included'); else cls.push('excluded');
                if (q.custom) cls.push('custom');
                if (perMember && q.included) cls.push('per-member');
                return (
                  <div key={q.id} className={cls.join(' ')}>
                    <div className="rqi-row">
                      <div className="rqi-check" onClick={() => toggleQIncluded(q.id)} title={q.included ? 'Click to exclude' : 'Click to include'}>
                        {q.included && <i className="ti ti-check"></i>}
                      </div>
                      <div className="rqi-info">
                        <div className="rqi-name">
                          {q.text}
                          {perMember && <span className="badge mu">Per family member</span>}
                          {q.custom && <span className="badge mu" style={{background: '#EEEDFE', color: 'var(--purple)'}}>Custom</span>}
                        </div>
                        <div className="rqi-desc">{q.type}</div>
                      </div>
                      <div className="rqi-actions">
                        <button
                          type="button"
                          className="rqi-pm-indicator"
                          onClick={() => toggleQPerMember(q.id)}
                          disabled={!q.included}
                          title={perMember ? 'Answered per family member — click to answer once for the application' : 'Click to ask this question per family member'}
                          style={!perMember ? { color: 'var(--gray-500)' } : undefined}
                        >
                          <i className={`ti ${perMember ? 'ti-users' : 'ti-user-plus'}`}></i>
                        </button>
                        <button
                          type="button"
                          className={`rqi-toggle ${q.required ? 'required' : 'optional'}`}
                          onClick={() => toggleQRequired(q.id)}
                          disabled={!q.included}
                          title="Toggle required / optional"
                        >
                          {q.required ? 'Required' : 'Optional'}
                        </button>
                        <button type="button" className="rqi-icon-btn" onClick={() => removeQ(q.id)} title="Remove from this application">
                          <i className="ti ti-x"></i>
                        </button>
                      </div>
                    </div>
                    {perMember && q.included && familyMembers.length > 0 && renderPerMemberPanel(q, 'q')}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{background: '#EEEDFE', borderLeft: '3px solid var(--purple)', padding: '12px 14px', borderRadius: '0 4px 4px 0', display: 'flex', gap: '10px', marginTop: '18px', fontSize: '12px', color: 'var(--purple)'}}>
            <i className="ti ti-info-circle" style={{marginTop: '1px', fontSize: '16px'}}></i>
            <div>Changes here apply <strong>only to this application</strong>. The underlying template stays unchanged. To edit the template for everyone, go to <a onClick={() => { routerPush('s-templates-list') }} style={{color: 'var(--purple)', textDecoration: 'underline', cursor: 'pointer'}}>Templates</a>.</div>
          </div>
        </div>
        )}

        {/* ===== STEP 4: SEND ===== */}
        {step === 4 && (
        <div className="step-content" id="rq-step-4">
          <div className="two-col even">
            <div>
              <div className="label-stripe">Summary</div>
              <div className="card" style={{marginBottom: '14px'}}>
                <div className="card-b">
                  <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 14px', fontSize: '13px', alignItems: 'center'}}>
                    <span style={{color: 'var(--gray-600)'}}>Client</span>
                    <span><strong style={{color: 'var(--navy)'}} id="rq-send-client">{selectedClient?.name || '—'}</strong> <span id="rq-send-email" style={{color: 'var(--gray-600)'}}>{selectedClient?.email}</span></span>
                    <span style={{color: 'var(--gray-600)'}}>Service</span>
                    <span style={{fontWeight: '600', color: 'var(--navy)'}} id="rq-send-service">{selectedService?.name || '—'}</span>
                    <span style={{color: 'var(--gray-600)'}}>Family</span>
                    <span><strong>{familyMembers.length}</strong> {familyMembers.length === 1 ? 'person (main applicant)' : 'people on application'}</span>
                    <span style={{color: 'var(--gray-600)'}}>Documents</span>
                    <span><strong id="rq-send-doc-count">{requiredFromClient}</strong> required from client</span>
                    <span style={{color: 'var(--gray-600)'}}>Questions</span>
                    <span><strong id="rq-send-q-count">{includedQs.length}</strong> to answer</span>
                    <span style={{color: 'var(--gray-600)'}}>Estimated completion</span>
                    <span><strong id="rq-send-deadline">{expectedDateLabel}</strong></span>
                    <span style={{color: 'var(--gray-600)'}}>Owners</span>
                    <span>{owners.length === 0 ? '— none assigned' : owners.map((o) => o.name).join(', ')}</span>
                  </div>
                </div>
              </div>
              <div style={{background: '#E6EEFF', borderLeft: '3px solid var(--blue)', padding: '12px 14px', borderRadius: '0 4px 4px 0', display: 'flex', gap: '10px', fontSize: '12px', color: 'var(--navy)'}}>
                <i className="ti ti-mail-fast" style={{fontSize: '16px', marginTop: '1px'}}></i>
                <div>Client receives a secure magic-link email. They sign in with OTP — no password needed. The application opens with your customized template.</div>
              </div>
            </div>
            <div>
              <div className="label-stripe">Request settings</div>
              <div className="form-field" style={{marginBottom: '12px'}}>
                <label>Estimated completion date <span style={{color: 'var(--gray-500)', fontWeight: 400}}>· optional</span></label>
                <input
                  type="date"
                  value={expectedDate}
                  min={todayPlus(0)}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  style={{width: '100%', padding: '10px 14px', border: '1.5px solid var(--gray-200)', borderRadius: '3px', fontFamily: 'inherit', fontSize: '13px'}}
                />
                <div style={{fontSize: '11px', color: 'var(--gray-600)', marginTop: '4px'}}>{expectedDateLabel}</div>
                <div style={{display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap'}}>
                  {[15, 30, 45, 60, 90].map((n) => {
                    const iso = todayPlus(n);
                    const active = iso === expectedDate;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setExpectedDate(iso)}
                        style={{
                          padding: '4px 10px',
                          fontSize: '11px',
                          fontWeight: 600,
                          border: '1px solid ' + (active ? 'var(--blue)' : 'var(--gray-300)'),
                          background: active ? '#E6EEFF' : 'white',
                          color: active ? 'var(--blue)' : 'var(--gray-700)',
                          borderRadius: '3px',
                          cursor: 'pointer',
                        }}
                      >
                        +{n}d
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="form-field" style={{marginBottom: '12px'}}>
                <label>Assign owners <span style={{color: 'var(--gray-500)', fontWeight: 400}}>· one or more approvers</span></label>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px'}}>
                  {owners.map((o) => (
                    <span key={o.id} style={{display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '20px', padding: '4px 8px 4px 4px', fontSize: '12px'}}>
                      <span className={`avatar ${o.color} sm`} style={{width: '22px', height: '22px', fontSize: '10px'}}>{o.initials}</span>
                      <span style={{fontWeight: 600, color: 'var(--navy)'}}>{o.name}</span>
                      <button type="button" onClick={() => removeOwner(o.id)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)', display: 'inline-flex', alignItems: 'center', padding: 0, marginLeft: '2px'}} title={`Remove ${o.name}`}>
                        <i className="ti ti-x" style={{fontSize: '14px'}}></i>
                      </button>
                    </span>
                  ))}
                  {owners.length === 0 && <span style={{fontSize: '12px', color: 'var(--gray-500)', fontStyle: 'italic'}}>No owners assigned yet</span>}
                </div>
                {STAFF_POOL.filter((s) => !owners.find((o) => o.id === s.id)).length > 0 && (
                  ownerPickerOpen ? (
                    <div style={{border: '1px solid var(--gray-200)', borderRadius: '4px', overflow: 'hidden'}}>
                      {STAFF_POOL.filter((s) => !owners.find((o) => o.id === s.id)).map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => { addOwner(s.id); setOwnerPickerOpen(false); }}
                          style={{width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'white', border: 'none', borderBottom: '1px solid var(--gray-200)', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit'}}
                        >
                          <span className={`avatar ${s.color} sm`}>{s.initials}</span>
                          <span style={{flex: 1, minWidth: 0}}>
                            <span style={{display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)'}}>{s.name}</span>
                            <span style={{display: 'block', fontSize: '11px', color: 'var(--gray-600)'}}>{s.role}</span>
                          </span>
                          <i className="ti ti-plus" style={{color: 'var(--blue)'}}></i>
                        </button>
                      ))}
                      <button type="button" onClick={() => setOwnerPickerOpen(false)} style={{width: '100%', padding: '6px', background: 'var(--gray-50)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '11px', color: 'var(--gray-600)'}}>Cancel</button>
                    </div>
                  ) : (
                    <button type="button" className="btn ghost xs" onClick={() => setOwnerPickerOpen(true)} style={{padding: '6px 12px'}}><i className="ti ti-user-plus"></i> Add another owner</button>
                  )
                )}
              </div>
              <div className="form-field" style={{marginBottom: '12px'}}>
                <label>Personal note (included in email)</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a short note that the client will see when they open the application…" style={{width: '100%', minHeight: '80px', padding: '10px 14px', border: '1.5px solid var(--gray-200)', borderRadius: '3px', fontFamily: 'inherit', fontSize: '13px'}}></textarea>
              </div>
              <div className="modal-toggle-row" style={{margin: '0'}}>
                <div>
                  <div className="label">Push to Zoho CRM</div>
                  <div className="desc">Create or update the linked Deal record</div>
                </div>
                <div className={`toggle${pushZoho ? ' on' : ''}`} onClick={() => setPushZoho((v) => !v)}></div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ===== Step footer (Back / Continue / Send) ===== */}
        <div className="step-foot" id="rq-foot">
          <button className="btn ghost" id="rq-back" onClick={prevStep} disabled={step === 1}><i className="ti ti-arrow-left"></i> Back</button>
          <div style={{flex: '1', textAlign: 'center', fontSize: '12px', color: 'var(--gray-600)'}} id="rq-step-info">
            {step === 1 && (selectedClient ? `Step 1 of 4 — ${selectedClient.name} selected` : 'Step 1 of 4 — pick a client to continue')}
            {step === 2 && (selectedService ? `Step 2 of 4 — ${selectedService.name}` : 'Step 2 of 4 — pick a service type')}
            {step === 3 && `Step 3 of 4 — ${includedDocs.length} docs · ${includedQs.length} questions · ${familyMembers.length} on application`}
            {step === 4 && 'Step 4 of 4 — review and send'}
          </div>
          <div style={{display: 'flex', gap: '8px'}}>
            {step < 4 ? (
              <button className="btn blue" id="rq-next" onClick={nextStep} disabled={!canContinue()}>Continue <i className="ti ti-arrow-right"></i></button>
            ) : (
              <button className="btn blue" id="rq-send" onClick={handleSend}><i className="ti ti-send"></i> Send request</button>
            )}
          </div>
        </div>
      </>
  );
}
