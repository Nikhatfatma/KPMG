"use client";
import { useEffect, useState } from "react";
import { useModalStore, useToastStore, useWizardStore, useClientsStore, useProjectsStore, showToast, closeModal } from "@/lib/store";
import { useRouter } from "next/navigation";

const TITLES = {
  "add-client": "Add new client",
  "add-doc": "Add document to template",
  "add-doc-onetime": "Add a custom document",
  "add-question": "Add question to template",
  "add-question-onetime": "Add a custom question",
  "add-service": "Create service type",
  "create-template": "Create new template",
  "submit-app": "Submit application?",
  "request-reupload": "Request re-upload",
  "reject-doc": "Reject document",
  "ask-more-info": "Ask for more details",
  "add-details": "Add details",
  "flag-question": "Flag answer for clarification",
  "reject-app": "Reject application?",
  "send-back": "Send application back to client",
  "approve-app": "Approve and forward?",
  "sign-in-portal": "Sign document",
  "add-variable": "Add template variable",
  "profile": "Your profile",
  "support": "Contact support",
  "notifications": "Notifications",
  "search": "Search the workspace",
  "message-client": "Message client",
  "add-family-member": "Add family member",
  "chat": "Chat with Anjali Mehta",
};

const FOOTER_LABELS = {
  "add-client": "Add and send invite",
  "add-doc": "Add document",
  "add-doc-onetime": "Add to this application",
  "add-question": "Add question",
  "add-question-onetime": "Add to this application",
  "add-service": "Create service type",
  "create-template": "Create template",
  "submit-app": "Yes, submit application",
  "request-reupload": "Send re-upload request",
  "reject-doc": "Reject document",
  "ask-more-info": "Send question",
  "add-details": "Save details",
  "flag-question": "Flag for clarification",
  "reject-app": "Reject application",
  "send-back": "Send back to client",
  "approve-app": "Approve and forward",
  "sign-in-portal": "Confirm and sign",
  "add-variable": "Add variable",
  "profile": "Save changes",
  "support": "Send message",
  "notifications": "Mark all read",
  "search": "Close",
  "message-client": "Send message",
  "add-family-member": "Add and sync to Zoho",
  "chat": "Reply",
};

const FOOTER_VARIANTS = {
  "reject-doc": "danger",
  "reject-app": "danger",
  "request-reupload": "amber",
  "flag-question": "amber",
  "send-back": "amber",
  "ask-more-info": "blue",
  "add-details": "blue",
  "approve-app": "success",
};

function RadioGroup({ defaultSelected = 0, options }) {
  const [sel, setSel] = useState(defaultSelected);
  return (
    <div className="modal-radio-grid" style={{ gridTemplateColumns: "1fr" }}>
      {options.map((opt, i) => (
        <div
          key={i}
          className={`modal-radio ${i === sel ? "selected" : ""}`}
          onClick={() => setSel(i)}
        >
          <div className="rt" style={opt.color ? { color: opt.color } : undefined}>
            {opt.icon ? <i className={opt.icon}></i> : null} {opt.title}
          </div>
          <div className="rd">{opt.desc}</div>
        </div>
      ))}
    </div>
  );
}

function Toggle({ defaultOn = true }) {
  const [on, setOn] = useState(defaultOn);
  return <div className={`toggle ${on ? "" : "off"}`} onClick={() => setOn((v) => !v)}></div>;
}

function ChatBody({ context }) {
  const [msg, setMsg] = useState("");
  const history = [
    { sender: "Anjali Mehta", text: "Hi James, I've reviewed your UK passport upload. It looks perfect.", time: "Today, 10:45 AM", isMe: false },
    { sender: "You", text: "Thank you Anjali. I'll upload the chartered accountant proof of income by tomorrow.", time: "Today, 11:20 AM", isMe: true },
    { sender: "Anjali Mehta", text: "Great, standing by!", time: "Today, 11:22 AM", isMe: false },
  ];

  useEffect(() => {
    window.__submitChat = () => {
      if (!msg) return false;
      showToast("Message sent", "Your reply has been sent to Anjali");
      return true;
    };
  }, [msg]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 300, overflowY: "auto", padding: "4px 2px" }}>
        {history.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.isMe ? "flex-end" : "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--navy)" }}>{m.sender}</span>
              <span style={{ fontSize: 10, color: "var(--gray-500)" }}>{m.time}</span>
            </div>
            <div style={{ 
              background: m.isMe ? "var(--blue)" : "var(--gray-100)", 
              color: m.isMe ? "white" : "var(--ink)", 
              padding: "10px 14px", 
              borderRadius: m.isMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px", 
              fontSize: 13, 
              maxWidth: "85%",
              lineHeight: 1.5
            }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="form-field" style={{ borderTop: "1px solid var(--gray-200)", paddingTop: 16 }}>
        <textarea 
          placeholder="Type your reply..." 
          style={{ minHeight: 80 }} 
          value={msg} 
          onChange={(e) => setMsg(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
}

function ModalBody({ type, context }) {
  const draft = useWizardStore((s) => s.draft);
  const memberCount = (draft.familyMembers || []).length;
  const ctx = context || "this client";

  if (type === "add-client") {
    const addClient = useClientsStore((s) => s.addClient);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", service: "" });
    
    // Wire up the submit button in the footer to this local state
    useEffect(() => {
      window.__submitAddClient = () => {
        if (!formData.name || !formData.email) {
          showToast("Missing fields", "Please enter at least a name and email", true);
          return false;
        }
        addClient(formData);
        showToast("Client added", `${formData.name} has been added to your client list`);
        return true;
      };
    }, [formData, addClient]);

    return (
      <>
        <div className="modal-row">
          <div className="form-field"><label>Full name</label><input type="text" placeholder="e.g. James Smith" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
          <div className="form-field"><label>Email <span style={{ color: "var(--red)" }}>*</span></label><input type="email" placeholder="name@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
        </div>
        <div className="modal-row">
          <div className="form-field"><label>Phone</label><input type="tel" placeholder="+44 7700 900123" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
          <div className="form-field"><label>Service type</label>
            <select value={formData.service} onChange={(e) => setFormData({...formData, service: e.target.value})}>
              <option value="">Select a service type…</option>
              <option value="fast-track">Fast Track (Permanent Residence)</option>
              <option value="pink-slip">Pink Slip (Temporary Residence Permit)</option>
            </select>
          </div>
        </div>
        <div style={{ margin: "6px 0 4px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "var(--gray-700)" }}>Family members on this application</label>
            <button type="button" className="btn ghost xs" onClick={() => showToast("Family member row added", "A new contact-role slot is ready for name + relationship")}><i className="ti ti-user-plus"></i> Add family member</button>
          </div>
          <div style={{ background: "var(--gray-50)", border: "1px solid var(--gray-200)", borderRadius: 4, padding: "10px 12px", fontSize: 11, color: "var(--gray-700)", display: "flex", gap: 8, alignItems: "flex-start" }}>
            <i className="ti ti-info-circle" style={{ marginTop: 1, color: "var(--blue)" }}></i>
            <div>Each family member becomes a linked <strong>contact role</strong> on the Zoho Deal. Their passports — and any other per-member documents — will be requested individually on the portal.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 32px", gap: 8, marginTop: 10, alignItems: "center" }}>
            <input type="text" placeholder="Spouse full name" style={{ padding: "9px 12px", border: "1.5px solid var(--gray-200)", borderRadius: 3, fontSize: 12 }} />
            <select style={{ padding: "9px 12px", border: "1.5px solid var(--gray-200)", borderRadius: 3, fontSize: 12 }}>
              <option>Spouse</option><option>Child under 18</option><option>Dependent 18–25 (student)</option><option>Parent dependent</option>
            </select>
            <button type="button" onClick={(e) => { const row = e.currentTarget.parentElement; if (row) row.style.display = 'none'; showToast('Family member row removed'); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-500)" }} title="Remove this row"><i className="ti ti-x"></i></button>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--gray-700)", marginBottom: 8 }}>How will this client be created?</label>
          <RadioGroup defaultSelected={0} options={[
            { icon: "ti ti-mail-fast", title: "Send invite", desc: "Email a magic-link to start their application" },
            { icon: "ti ti-archive", title: "Save as draft", desc: "Add to client list, send invite later" },
          ]} />
        </div>
      </>
    );
  }

  if (type === "add-doc") {
    return (
      <>
        <div className="form-field"><label>Document name <span style={{ color: "var(--red)" }}>*</span></label><input type="text" placeholder="e.g. Marriage certificate" /></div>
        <div className="form-field">
          <label>Description (shown to client) <span style={{ fontWeight: 400, color: "var(--gray-500)" }}>· you can use template variables like <code style={{ background: "#F3EBFC", color: "var(--purple)", padding: "1px 4px", borderRadius: 2, fontSize: 11 }}>{"{{minIncome}}"}</code></span></label>
          <textarea placeholder="e.g. Tax return showing min. {{minIncome}}/year"></textarea>
        </div>
        <div style={{ margin: "4px 0 14px 0" }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--gray-700)", marginBottom: 8 }}>How is this document collected? <span style={{ color: "var(--red)" }}>*</span></label>
          <RadioGroup defaultSelected={0} options={[
            { icon: "ti ti-cloud-upload", title: "Client uploads a file", desc: "Customer uploads from device · supports AI auto-extraction" },
            { icon: "ti ti-signature", title: "Sign in portal (no upload)", color: "var(--blue)", desc: "Customer reads the document on the portal and signs directly — we generate the signed PDF and store the audit trail" },
          ]} />
        </div>
        <div className="form-field">
          <label>Collected from <span style={{ color: "var(--red)" }}>*</span></label>
          <select>
            <option>Main applicant only (one copy per application)</option>
            <option>Each family member (one copy per linked contact role)</option>
            <option>Spouse only (if included)</option>
            <option>Each child under 18 (if included)</option>
            <option>Each dependent (any role)</option>
          </select>
        </div>
        <div className="modal-row">
          <div className="form-field"><label>How many files?</label><select><option>Single file (one upload)</option><option>Multiple files · dynamic (min. 1, no upper limit)</option><option>Multiple files · fixed count</option></select></div>
          <div className="form-field"><label>Accepted format</label><select><option>PDF</option><option>PDF or JPG</option><option>PDF, JPG, PNG</option><option>Any file type</option></select></div>
        </div>
        <div className="modal-row">
          <div className="form-field"><label>Maximum file size</label><select><option>10 MB</option><option>25 MB</option><option>50 MB</option></select></div>
          <div className="form-field"><label>Position in list</label><select><option>End of section</option><option>Top</option><option>After a specific document…</option></select></div>
        </div>
        <div className="modal-toggle-row"><div><div className="label">Required</div><div className="desc">Block submission until this document is provided</div></div><Toggle /></div>
        <div className="modal-toggle-row"><div><div className="label">Enable AI auto-extraction</div><div className="desc">Extract metadata and verify against template rules</div></div><Toggle /></div>
      </>
    );
  }

  if (type === "add-doc-onetime") {
    const addCustomDoc = useWizardStore((s) => s.addCustomDoc);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [required, setRequired] = useState(true);
    const [perMember, setPerMember] = useState(false);

    useEffect(() => {
      window.__submitAddDoc = () => {
        if (!name) { showToast("Name required", "Please enter a document name", true); return false; }
        addCustomDoc(name, desc, required, perMember);
        showToast("Custom document added", "Added to this application");
        return true;
      };
    }, [name, desc, required, perMember, addCustomDoc]);

    const hint = memberCount > 1 ? `One copy collected from each of the ${memberCount} family members` : memberCount === 1 ? "Only the main applicant is on this application — add more members first if you need this per-member" : "No members added yet — add family members in Step 3 first";
    return (
      <>
        <div style={{ background: "#EEEDFE", borderLeft: "3px solid var(--purple)", padding: "10px 14px", borderRadius: "0 4px 4px 0", marginBottom: 16, fontSize: 12, color: "var(--purple)", display: "flex", gap: 8 }}>
          <i className="ti ti-info-circle" style={{ marginTop: 1 }}></i>
          <div>This document will be requested <strong>only on {ctx}&apos;s application</strong> — the master template stays untouched.</div>
        </div>
        <div className="form-field"><label>Document name <span style={{ color: "var(--red)" }}>*</span></label><input type="text" placeholder="e.g. NOC from employer" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="form-field"><label>Description (shown to client)</label><textarea placeholder="e.g. No Objection Certificate on company letterhead, signed by HR" value={desc} onChange={(e) => setDesc(e.target.value)}></textarea></div>
        <div style={{ margin: "4px 0 14px 0" }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--gray-700)", marginBottom: 8 }}>Collected from <span style={{ color: "var(--red)" }}>*</span></label>
          <div className="modal-radio-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className={`modal-radio ${!perMember ? "selected" : ""}`} onClick={() => setPerMember(false)}>
              <div className="rt"><i className="ti ti-file"></i> Once for the application</div>
              <div className="rd">A single shared document covers the whole family (e.g. proof of investment)</div>
            </div>
            <div className={`modal-radio ${perMember ? "selected" : ""}`} onClick={() => setPerMember(true)}>
              <div className="rt" style={{ color: "var(--purple)" }}><i className="ti ti-users"></i> Each family member, individually</div>
              <div className="rd">{hint}</div>
            </div>
          </div>
        </div>
        <div className="modal-row">
          <div className="form-field"><label>Accepted format</label><select><option>PDF</option><option>PDF or JPG</option><option>PDF, JPG, PNG</option><option>Any file type</option></select></div>
          <div className="form-field"><label>Maximum file size</label><select><option>10 MB</option><option>25 MB</option><option>50 MB</option></select></div>
        </div>
        <div className="modal-toggle-row"><div><div className="label">Required</div><div className="desc">Block submission until this document is uploaded</div></div><div className={`toggle ${required ? "" : "off"}`} onClick={() => setRequired(!required)}></div></div>
      </>
    );
  }

  if (type === "add-question") {
    return (
      <>
        <div className="form-field"><label>Question text <span style={{ color: "var(--red)" }}>*</span></label><input type="text" placeholder="e.g. Have you traveled to the destination country before?" /></div>
        <div className="form-field"><label>Help text (optional)</label><textarea placeholder="Shown below the question to guide the client"></textarea></div>
        <div style={{ margin: "4px 0 14px 0" }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--gray-700)", marginBottom: 8 }}>Who answers this question? <span style={{ color: "var(--red)" }}>*</span></label>
          <RadioGroup defaultSelected={0} options={[
            { icon: "ti ti-file-text", title: "Once per application", desc: "A single shared answer covers the whole family (e.g. investment amount, household income)" },
            { icon: "ti ti-users", title: "Each family member, individually", color: "var(--purple)", desc: "Client sees one copy of this question per linked contact role · scales automatically when family members are added or removed" },
          ]} />
        </div>
        <div className="modal-row">
          <div className="form-field"><label>Answer type</label><select><option>Short text</option><option>Long text</option><option>Date</option><option>Date range</option><option>Yes / No</option><option>Yes / No + explanation</option><option>Dropdown</option><option>Multi-select</option><option>Number</option><option>File upload</option></select></div>
          <div className="form-field"><label>Position in form</label><select><option>End of section</option><option>Before question 1</option></select></div>
        </div>
        <div className="modal-toggle-row"><div><div className="label">Required</div><div className="desc">Client must answer to submit (every family member must answer if per-member)</div></div><Toggle /></div>
        <div className="modal-toggle-row"><div><div className="label">Conditional question</div><div className="desc">Only show based on a previous answer</div></div><Toggle defaultOn={false} /></div>
      </>
    );
  }

  if (type === "add-question-onetime") {
    const addCustomQuestion = useWizardStore((s) => s.addCustomQuestion);
    const [text, setText] = useState("");
    const [qType, setQType] = useState("Short text");
    const [required, setRequired] = useState(true);
    const [perMember, setPerMember] = useState(false);

    useEffect(() => {
      window.__submitAddQuestion = () => {
        if (!text) { showToast("Text required", "Please enter the question text", true); return false; }
        addCustomQuestion(text, qType, required, perMember);
        showToast("Custom question added", "Added to this application");
        return true;
      };
    }, [text, qType, required, perMember, addCustomQuestion]);

    const hint = memberCount > 1 ? `One answer collected from each of the ${memberCount} family members on this application` : "Only the main applicant — add more members for per-member to apply";
    return (
      <>
        <div style={{ background: "#EEEDFE", borderLeft: "3px solid var(--purple)", padding: "10px 14px", borderRadius: "0 4px 4px 0", marginBottom: 16, fontSize: 12, color: "var(--purple)", display: "flex", gap: 8 }}>
          <i className="ti ti-info-circle" style={{ marginTop: 1 }}></i>
          <div>This question will be asked <strong>only on {ctx}&apos;s application</strong> — the master template stays untouched.</div>
        </div>
        <div className="form-field"><label>Question text <span style={{ color: "var(--red)" }}>*</span></label><input type="text" placeholder="e.g. Have you previously been denied entry to this country?" value={text} onChange={(e) => setText(e.target.value)} /></div>
        <div className="form-field"><label>Help text (optional)</label><textarea placeholder="Guidance shown below the question"></textarea></div>
        <div style={{ margin: "4px 0 14px 0" }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--gray-700)", marginBottom: 8 }}>Who answers this? <span style={{ color: "var(--red)" }}>*</span></label>
          <div className="modal-radio-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className={`modal-radio ${!perMember ? "selected" : ""}`} onClick={() => setPerMember(false)}>
              <div className="rt"><i className="ti ti-file-text"></i> Once for the application</div>
              <div className="rd">A single shared answer covers the whole family</div>
            </div>
            <div className={`modal-radio ${perMember ? "selected" : ""}`} onClick={() => setPerMember(true)}>
              <div className="rt" style={{ color: "var(--purple)" }}><i className="ti ti-users"></i> Each family member, individually</div>
              <div className="rd">{hint}</div>
            </div>
          </div>
        </div>
        <div className="modal-row">
          <div className="form-field"><label>Answer type</label><select value={qType} onChange={(e) => setQType(e.target.value)}><option>Short text</option><option>Long text</option><option>Date</option><option>Yes / No</option><option>Yes / No + explanation</option><option>Dropdown</option><option>Number</option></select></div>
          <div className="form-field"><label>Position</label><select><option>At the end</option><option>Before existing questions</option></select></div>
        </div>
        <div className="modal-toggle-row"><div><div className="label">Required</div><div className="desc">Client must answer to submit</div></div><div className={`toggle ${required ? "" : "off"}`} onClick={() => setRequired(!required)}></div></div>
      </>
    );
  }

  if (type === "chat") {
    return <ChatBody context={context} />;
  }

  if (type === "sign-in-portal") {
    return (
      <>
        <p style={{ fontSize: 13, color: "var(--gray-700)", marginBottom: 14, lineHeight: 1.6 }}>Read the declaration below carefully. When you&apos;re ready, sign with your finger, mouse, or stylus. We&apos;ll record your signature, the exact time, and your IP address as an audit trail — no upload needed.</p>
        <div style={{ background: "var(--gray-50)", border: "1px solid var(--gray-200)", borderRadius: 4, padding: "16px 18px", maxHeight: 180, overflowY: "auto", marginBottom: 14, fontSize: 12, color: "var(--ink)", lineHeight: 1.65 }}>
          <div style={{ fontWeight: 700, textAlign: "center", marginBottom: 8, color: "var(--navy)" }}>DECLARATION OF NO EMPLOYMENT INTENT</div>
          <div style={{ textAlign: "center", fontSize: 10, color: "var(--gray-600)", marginBottom: 12 }}>Cyprus Regulation 6.2 — Fast Track Permanent Residence</div>
          <p style={{ marginBottom: 8 }}>I, <strong>James Smith</strong>, holder of UK passport <strong>UK5829104</strong>, hereby solemnly declare that:</p>
          <p style={{ marginBottom: 8 }}>1. I do not intend to undertake any form of paid employment in the Republic of Cyprus while holding a Category 6.2 permanent residence permit.</p>
          <p style={{ marginBottom: 8 }}>2. My primary source of income is and will remain from sources outside the Republic of Cyprus, currently amounting to no less than €85,000 per annum (calculated as base €50,000 + spouse €15,000 + two child dependents €20,000).</p>
          <p style={{ marginBottom: 8 }}>3. I understand that any breach of this declaration may result in the revocation of my permanent residence status.</p>
          <p>Signed this day at the secure portal of KPMG Cyprus.</p>
        </div>
        <div style={{ border: "1.5px dashed var(--gray-300)", borderRadius: 4, padding: "24px 18px", textAlign: "center", background: "white", marginBottom: 12, cursor: "crosshair" }}>
          <div style={{ fontFamily: "cursive", fontSize: 32, color: "var(--navy)", transform: "rotate(-2deg)", display: "inline-block" }}>James Smith</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 11, color: "var(--gray-600)", marginBottom: 8 }}>
          <div><i className="ti ti-calendar" style={{ marginRight: 4 }}></i>Signed at: <strong style={{ color: "var(--ink)" }}>May 13, 2026 · 22:45 GMT</strong></div>
          <div><i className="ti ti-world" style={{ marginRight: 4 }}></i>IP: <strong style={{ color: "var(--ink)" }}>92.40.x.x</strong> (London, UK)</div>
        </div>
      </>
    );
  }

  if (type === "add-variable") {
    return (
      <>
        <p style={{ fontSize: 13, color: "var(--gray-700)", marginBottom: 14, lineHeight: 1.6 }}>Template variables let you change a value once and update every document description, question hint, and AI validation rule that references it.</p>
        <div className="modal-row">
          <div className="form-field"><label>Variable name <span style={{ color: "var(--red)" }}>*</span></label><input type="text" placeholder="e.g. Min. bank deposit" /></div>
          <div className="form-field"><label>Token (auto-generated)</label><input type="text" value="{{minBankDeposit}}" readOnly style={{ background: "var(--gray-50)", color: "var(--purple)", fontFamily: "ui-monospace, monospace" }} /></div>
        </div>
        <div className="modal-row">
          <div className="form-field"><label>Current value <span style={{ color: "var(--red)" }}>*</span></label><input type="text" placeholder="e.g. €10,000" /></div>
          <div className="form-field"><label>Type</label><select><option>Currency amount</option><option>Plain number</option><option>Text / label</option><option>Duration (months / years)</option><option>Percentage</option></select></div>
        </div>
        <div className="form-field"><label>Notes (visible only to staff)</label><textarea placeholder="e.g. Set by Cyprus Ministry of Interior — review annually in January"></textarea></div>
        <div style={{ background: "#EEEDFE", borderLeft: "3px solid var(--purple)", padding: "10px 14px", borderRadius: "0 4px 4px 0", display: "flex", gap: 8, fontSize: 12, color: "var(--purple)" }}>
          <i className="ti ti-info-circle" style={{ marginTop: 1 }}></i>
          <div>Reference this variable anywhere in the template by typing <code style={{ background: "white", padding: "1px 4px", borderRadius: 2 }}>{"{{minBankDeposit}}"}</code>. Existing projects pick up new values when the template is re-saved.</div>
        </div>
      </>
    );
  }

  // Short text-only modals
  if (type === "request-reupload") {
    return (
      <>
        <p style={{ fontSize: 13, color: "var(--gray-700)", marginBottom: 16, lineHeight: 1.6 }}>Ask James to re-upload <strong style={{ color: "var(--navy)" }}>{ctx}</strong>. They&apos;ll get an email with a link straight to the upload screen and your reason below.</p>
        <div className="form-field"><label>Reason for re-upload <span style={{ color: "var(--red)" }}>*</span></label><textarea placeholder="e.g. Pages 9–14 are not legible — please re-scan at higher resolution"></textarea></div>
        <div className="form-field"><label>Suggested fix (optional)</label><input type="text" placeholder="e.g. Use a flatbed scanner at 300 DPI" /></div>
      </>
    );
  }

  if (type === "reject-doc") {
    return (
      <>
        <p style={{ fontSize: 13, color: "var(--gray-700)", marginBottom: 16, lineHeight: 1.6 }}>Rejecting <strong style={{ color: "var(--red)" }}>{ctx}</strong> marks it as not acceptable. The client will be asked to provide a replacement that meets requirements.</p>
        <div className="form-field"><label>Reason for rejection <span style={{ color: "var(--red)" }}>*</span></label>
          <select><option>Select a reason…</option><option>Wrong document type submitted</option><option>Document is expired or invalid</option><option>Quality too poor to process</option><option>Document does not match client profile</option><option>Suspected fraud or tampering</option><option>Other (explain below)</option></select>
        </div>
        <div className="form-field"><label>Explanation for client (optional)</label><textarea placeholder="What would make a valid replacement?"></textarea></div>
      </>
    );
  }

  if (type === "add-details") {
    return (
      <>
        <p style={{ fontSize: 13, color: "var(--gray-700)", marginBottom: 16, lineHeight: 1.6 }}>Please provide additional information about <strong style={{ color: "var(--navy)" }}>{ctx}</strong>. Your advisor will see this as an inline comment on your application.</p>
        <div className="form-field"><label>Details <span style={{ color: "var(--red)" }}>*</span></label><textarea placeholder="e.g. My previous residence was in London for 3 years before moving to Manchester."></textarea></div>
      </>
    );
  }

  if (type === "ask-more-info") {
    return (
      <>
        <p style={{ fontSize: 13, color: "var(--gray-700)", marginBottom: 16, lineHeight: 1.6 }}>Send James a question about <strong style={{ color: "var(--navy)" }}>{ctx}</strong>. They&apos;ll see it as an inline comment + email notification.</p>
        <div className="form-field"><label>Your question <span style={{ color: "var(--red)" }}>*</span></label><textarea placeholder="e.g. Can you confirm which property this title deed refers to?"></textarea></div>
      </>
    );
  }

  if (type === "flag-question") {
    return (
      <>
        <p style={{ fontSize: 13, color: "var(--gray-700)", marginBottom: 16, lineHeight: 1.6 }}>Flag <strong style={{ color: "var(--navy)" }}>{ctx}</strong> for clarification. The client will see your note in-portal next time they sign in.</p>
        <div className="form-field"><label>Reason for flagging <span style={{ color: "var(--red)" }}>*</span></label><textarea placeholder="e.g. The answer doesn't match the supporting document — please clarify"></textarea></div>
      </>
    );
  }

  if (type === "submit-app") {
    return (
      <>
        <p style={{ fontSize: 14, color: "var(--gray-700)", lineHeight: 1.6, marginBottom: 16 }}>You&apos;re about to submit your <strong style={{ color: "var(--navy)" }}>Fast Track (Permanent Residence)</strong> application to your advisor for review. Once submitted, you can still add missing items — Anjali will follow up.</p>
        <div className="modal-summary">
          <div className="ms-r"><span className="lab">Application</span><span className="val">Fast Track (Permanent Residence)</span></div>
          <div className="ms-r"><span className="lab">Documents uploaded</span><span className="val">4 of 13</span></div>
          <div className="ms-r"><span className="lab">Questions answered</span><span className="val">4 of 12</span></div>
          <div className="ms-r"><span className="lab">Advisor</span><span className="val">Anjali Mehta</span></div>
        </div>
      </>
    );
  }

  if (type === "reject-app") {
    return (
      <>
        <p style={{ fontSize: 13, color: "var(--gray-700)", marginBottom: 16, lineHeight: 1.6 }}>Rejecting closes this application permanently. The client will be notified by email with your reason.</p>
        <div className="form-field"><label>Reason <span style={{ color: "var(--red)" }}>*</span></label><textarea placeholder="Explain why this application can't proceed"></textarea></div>
      </>
    );
  }

  if (type === "send-back") {
    return (
      <>
        <p style={{ fontSize: 13, color: "var(--gray-700)", marginBottom: 16, lineHeight: 1.6 }}>Send the application back to James with feedback. They&apos;ll have 7 days to address the items and resubmit.</p>
        <div className="form-field"><label>Items to address <span style={{ color: "var(--red)" }}>*</span></label><textarea placeholder="List what needs fixing — be specific" defaultValue={"• Re-upload payment receipts (3 of 3, currently 2)\n• Upload FCDO apostilled marriage certificate copy\n• Provide Oliver's UCL student confirmation"}></textarea></div>
      </>
    );
  }

  if (type === "approve-app") {
    return (
      <>
        <p style={{ fontSize: 13, color: "var(--gray-700)", marginBottom: 16, lineHeight: 1.6 }}>Approving forwards this application to the Cyprus Civil Registry and updates Zoho Deal #4791.</p>
        <div className="modal-summary">
          <div className="ms-r"><span className="lab">Application</span><span className="val">Fast Track (Permanent Residence)</span></div>
          <div className="ms-r"><span className="lab">Client</span><span className="val">James Smith</span></div>
          <div className="ms-r"><span className="lab">Documents verified</span><span className="val">15 of 15</span></div>
          <div className="ms-r"><span className="lab">Government fees due</span><span className="val">€710</span></div>
        </div>
      </>
    );
  }

  if (type === "add-service") {
    return (
      <>
        <div className="form-field"><label>Service name <span style={{ color: "var(--red)" }}>*</span></label><input type="text" placeholder="e.g. Cyprus Digital Nomad Visa" /></div>
        <div className="form-field"><label>Description</label><textarea placeholder="Short description shown in the service catalog"></textarea></div>
        <div className="modal-row">
          <div className="form-field"><label>Map to template</label><select><option>Create new template…</option><option>Cyprus-FastTrack-PR v1</option><option>Cyprus-PinkSlip-temp v1</option></select></div>
          <div className="form-field"><label>Default deadline</label><select><option>15 days</option><option>30 days</option><option>45 days</option><option>60 days</option><option>90 days</option></select></div>
        </div>
        <div className="modal-toggle-row"><div><div className="label">Sync to Zoho CRM</div><div className="desc">Mirror this service as a Service Type option on Deal records</div></div><Toggle /></div>
      </>
    );
  }

  if (type === "create-template") {
    return (
      <>
        <div className="form-field"><label>Template name <span style={{ color: "var(--red)" }}>*</span></label><input type="text" placeholder="e.g. Cyprus-DigitalNomad-temp" /></div>
        <div className="form-field"><label>Short description</label><textarea placeholder="e.g. Cyprus digital nomad visa, 1 year renewable"></textarea></div>
        <div className="modal-row">
          <div className="form-field"><label>Map to service type</label><select><option>Select a service type…</option><option>Fast Track (Permanent Residence)</option><option>Pink Slip (Temporary Residence Permit)</option></select></div>
          <div className="form-field"><label>Default deadline</label><select><option>15 days</option><option>30 days</option><option>45 days</option><option>60 days</option><option>90 days</option></select></div>
        </div>
        <div style={{ marginTop: 4 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--gray-700)", marginBottom: 8 }}>Start from</label>
          <RadioGroup defaultSelected={0} options={[
            { icon: "ti ti-file-plus", title: "Blank template", desc: "Start with zero documents and questions" },
            { icon: "ti ti-copy", title: "Duplicate existing", desc: "Clone from Cyprus-FastTrack-PR or Cyprus-PinkSlip-temp" },
          ]} />
        </div>
        <div className="modal-toggle-row" style={{ marginTop: 14 }}><div><div className="label">Enable AI auto-extraction</div><div className="desc">Pre-fill questions from uploaded documents using AI</div></div><Toggle /></div>
      </>
    );
  }

  if (type === "profile") {
    return (
      <>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div className="avatar navy lg" style={{ width: 56, height: 56, fontSize: 18 }}>JS</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--navy)" }}>James Smith</div>
            <div style={{ fontSize: 12, color: "var(--gray-600)" }}>Main applicant · Fast Track (Permanent Residence)</div>
          </div>
        </div>
        <div className="modal-row">
          <div className="form-field"><label>Full name</label><input type="text" defaultValue="James Smith" /></div>
          <div className="form-field"><label>Email</label><input type="email" defaultValue="james@smith-holdings.uk" /></div>
        </div>
        <div className="modal-row">
          <div className="form-field"><label>Phone</label><input type="tel" defaultValue="+44 7700 900123" /></div>
          <div className="form-field"><label>Preferred language</label><select defaultValue="English"><option>English</option><option>Greek</option><option>Russian</option></select></div>
        </div>
        <div className="modal-toggle-row"><div><div className="label">Email notifications</div><div className="desc">Document requests, advisor messages, status updates</div></div><Toggle /></div>
        <div className="modal-toggle-row"><div><div className="label">SMS reminders</div><div className="desc">Get a text 3 days before any deadline</div></div><Toggle defaultOn={false} /></div>
      </>
    );
  }

  if (type === "support") {
    return (
      <>
        <p style={{ fontSize: 13, color: "var(--gray-700)", marginBottom: 14, lineHeight: 1.6 }}>Need help with your application? Send us a message and your advisor will reply within one business day.</p>
        <div className="form-field"><label>What can we help with? <span style={{ color: "var(--red)" }}>*</span></label>
          <select><option>Choose a topic…</option><option>Document upload / format question</option><option>Family members and their documents</option><option>Application status / timeline</option><option>Billing or government fees</option><option>Other</option></select>
        </div>
        <div className="form-field"><label>Your message <span style={{ color: "var(--red)" }}>*</span></label><textarea placeholder="Describe your question or issue — include any relevant document names or sections."></textarea></div>
        <div style={{ background: "var(--gray-50)", border: "1px solid var(--gray-200)", borderRadius: 4, padding: "12px 14px", fontSize: 12, color: "var(--gray-700)", display: "grid", gap: 6 }}>
          <div><i className="ti ti-mail" style={{ marginRight: 6, color: "var(--blue)" }}></i> <strong>Email:</strong> support@kpmg.com.cy</div>
          <div><i className="ti ti-phone" style={{ marginRight: 6, color: "var(--blue)" }}></i> <strong>Phone:</strong> +357 22 209 000 · Mon–Fri 09:00–17:00 EET</div>
          <div><i className="ti ti-clock" style={{ marginRight: 6, color: "var(--blue)" }}></i> <strong>Response time:</strong> within 1 business day</div>
        </div>
      </>
    );
  }

  if (type === "notifications") {
    const notifs = [
      { icon: "ti-mail-fast", color: "var(--blue)",  title: "Anjali Mehta sent you a message", desc: "Re: Proof of investment — please double-check page 4", time: "2h ago", unread: true },
      { icon: "ti-file-check", color: "var(--green)", title: "Document approved", desc: "Health insurance certificate · approved by your advisor", time: "1d ago", unread: true },
      { icon: "ti-calendar", color: "var(--amber)", title: "Deadline reminder", desc: "Fast Track (Permanent Residence) is due in 14 days", time: "2d ago" },
      { icon: "ti-info-circle", color: "var(--gray-600)", title: "New help article", desc: "How to scan documents properly with your phone", time: "1w ago" },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {notifs.map((n, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "10px 12px", border: "1px solid var(--gray-200)", borderRadius: 4, background: n.unread ? "#F4F7FF" : "white" }}>
            <i className={`ti ${n.icon}`} style={{ fontSize: 18, color: n.color, marginTop: 2 }}></i>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)" }}>{n.title} {n.unread && <span className="badge da" style={{ marginLeft: 6 }}>NEW</span>}</div>
              <div style={{ fontSize: 12, color: "var(--gray-700)", marginTop: 2 }}>{n.desc}</div>
              <div style={{ fontSize: 10, color: "var(--gray-500)", marginTop: 4 }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "search") {
    const results = [
      { icon: "ti-folder", title: "Fast Track (Permanent Residence)", sub: "Your application · 40% complete · due in 60 days", href: "/client/project" },
      { icon: "ti-file", title: "Valid passport", sub: "Document on Fast Track · per family member · 1 of 1 uploaded" },
      { icon: "ti-template", title: "Cyprus-FastTrack-PR v1", sub: "Template · 11 docs · 7 questions" },
      { icon: "ti-user", title: "Anjali Mehta", sub: "Your advisor · responds within 1 business day" },
    ];
    return (
      <>
        <div className="form-field"><input type="text" placeholder="Search projects, documents, clients, templates…" autoFocus style={{ fontSize: 14, padding: "12px 14px" }} /></div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--gray-600)", marginBottom: 8 }}>Recent matches</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {results.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "10px 12px", border: "1px solid var(--gray-200)", borderRadius: 4, cursor: "pointer", background: "white" }} onClick={() => { if (r.href) { closeModal(); /* navigate via showToast hint */ showToast("Opening…", r.title); } }}>
              <i className={`ti ${r.icon}`} style={{ fontSize: 18, color: "var(--navy)", marginTop: 2 }}></i>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)" }}>{r.title}</div>
                <div style={{ fontSize: 11, color: "var(--gray-600)", marginTop: 2 }}>{r.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: "var(--gray-500)", textAlign: "center" }}>Press <kbd style={{ background: "var(--gray-100)", padding: "1px 5px", borderRadius: 3, fontFamily: "ui-monospace, monospace" }}>↵</kbd> to open · <kbd style={{ background: "var(--gray-100)", padding: "1px 5px", borderRadius: 3, fontFamily: "ui-monospace, monospace" }}>esc</kbd> to close</div>
      </>
    );
  }

  if (type === "message-client") {
    return (
      <>
        <p style={{ fontSize: 13, color: "var(--gray-700)", marginBottom: 16, lineHeight: 1.6 }}>Send a secure message to <strong style={{ color: "var(--navy)" }}>{ctx}</strong>. They&apos;ll receive a notification and can reply directly in their portal.</p>
        <div className="form-field"><label>Subject</label><input type="text" defaultValue={`Re: ${ctx} - Fast Track application`} /></div>
        <div className="form-field"><label>Message <span style={{ color: "var(--red)" }}>*</span></label><textarea placeholder="Write your message here..." style={{ minHeight: 120 }}></textarea></div>
        <div className="modal-toggle-row"><div><div className="label">Urgent</div><div className="desc">Mark as priority and send SMS notification</div></div><Toggle defaultOn={false} /></div>
      </>
    );
  }

  if (type === "add-family-member") {
    const addMemberToProject = useProjectsStore((s) => s.addMemberToProject);
    const [name, setName] = useState("");
    const [role, setRole] = useState("Spouse");

    useEffect(() => {
      window.__submitAddMember = () => {
        if (!name) { showToast("Name required", "Enter the member's full name", true); return false; }
        // Use the projectId passed via context
        addMemberToProject(context, { name, role });
        showToast("Member added", `${name} added to application family`);
        return true;
      };
    }, [name, role, context, addMemberToProject]);

    return (
      <>
        <p style={{ fontSize: 13, color: "var(--gray-700)", marginBottom: 16, lineHeight: 1.6 }}>Add a new family member to <strong style={{ color: "var(--navy)" }}>{ctx}</strong>&apos;s application. This will create a new <strong>Contact Role</strong> on Zoho Deal #4791.</p>
        <div className="modal-row">
          <div className="form-field"><label>Full name <span style={{ color: "var(--red)" }}>*</span></label><input type="text" placeholder="e.g. Oliver Smith" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="form-field"><label>Relationship</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option>Spouse</option>
              <option>Child under 18</option>
              <option>Dependent 18–25 (student)</option>
              <option>Parent dependent</option>
              <option>Other dependent</option>
            </select>
          </div>
        </div>
        <div className="modal-row">
          <div className="form-field"><label>Passport number</label><input type="text" placeholder="Optional" /></div>
          <div className="form-field"><label>Country of origin</label><input type="text" defaultValue="United Kingdom" /></div>
        </div>
        <div style={{ background: "#EEEDFE", borderLeft: "3px solid var(--purple)", padding: "10px 14px", borderRadius: "0 4px 4px 0", marginTop: 10, fontSize: 12, color: "var(--purple)", display: "flex", gap: 8 }}>
          <i className="ti ti-info-circle" style={{ marginTop: 1 }}></i>
          <div>New member will automatically get a <strong>Passport</strong> requirement and any other per-member items from the template.</div>
        </div>
      </>
    );
  }

  return <p>Action confirmation</p>;
}

export default function Modal() {
  const { open, type, context } = useModalStore();
  const router = useRouter();

  // Lock scroll while open + close on Escape
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open]);

  if (!open) return null;

  const title = (TITLES[type] || "Action") + (context ? ` — ${context}` : "");
  const btnLabel = FOOTER_LABELS[type] || "Confirm";
  const btnClass = FOOTER_VARIANTS[type] || "blue";

  const onSubmit = () => {
    // Lightweight wiring: produce a sensible toast/navigation per type, then close.
    const t = type;
    
    if (t === "add-client") {
      if (window.__submitAddClient && !window.__submitAddClient()) return;
    } else if (t === "add-doc-onetime") {
      if (window.__submitAddDoc && !window.__submitAddDoc()) return;
    } else if (t === "add-question-onetime") {
      if (window.__submitAddQuestion && !window.__submitAddQuestion()) return;
    } else if (t === "add-family-member") {
      if (window.__submitAddMember && !window.__submitAddMember()) return;
    } else if (t === "chat") {
      if (window.__submitChat && !window.__submitChat()) return;
    }
    
    closeModal();
    // if (t === "add-client") ... Handled by window.__submitAddClient now
    if (t === "add-doc") showToast("Document added to template", "Cyprus-FastTrack-PR now has 12 documents · saved as draft");
    else if (t === "add-doc-onetime") showToast("Custom document added", "Requested only on this application");
    else if (t === "add-question") showToast("Question added to template", "Saved as draft");
    else if (t === "add-question-onetime") showToast("Custom question added", "Asked only on this application");
    else if (t === "add-service") showToast("Service type created", "Active and synced to Zoho · ready to use");
    else if (t === "create-template") { showToast("Template created", "Ready to edit"); setTimeout(() => router.push("/staff/template"), 400); }
    else if (t === "submit-app") { showToast("Application submitted", "Anjali Mehta has been notified · expected first review within 2 business days"); setTimeout(() => router.push("/client/apps"), 400); }
    else if (t === "request-reupload") showToast("Re-upload requested", `James will get an email about ${context}`);
    else if (t === "reject-doc") showToast("Document rejected", `${context} marked as not acceptable · client notified`);
    else if (t === "ask-more-info") showToast("Question sent to client", `${context}`);
    else if (t === "add-details") showToast("Details saved", `Additional information for ${context} has been recorded`);
    else if (t === "flag-question") showToast("Answer flagged for clarification", `${context}`);
    else if (t === "reject-app") { showToast("Application rejected", "Closed permanently · client has been notified by email"); setTimeout(() => router.push("/staff/projects"), 500); }
    else if (t === "send-back") { showToast("Application sent back to client", "James has 1 week to address the feedback and resubmit"); setTimeout(() => router.push("/staff/projects"), 500); }
    else if (t === "approve-app") { showToast("Application approved", "Moved to Submitted column · Zoho Deal #4791 updated · Civil Registry notified"); setTimeout(() => router.push("/staff/projects"), 500); }
    else if (t === "sign-in-portal") showToast("Document signed", `${context} · signed PDF generated · audit trail recorded · sent to your advisor for review`);
    else if (t === "add-variable") showToast("Variable added", "Available in this template — reference it anywhere with {{token}} syntax");
    else if (t === "profile") showToast("Profile updated", "Your changes have been saved");
    else if (t === "support") showToast("Message sent to support", "Your advisor will reply within 1 business day");
    else if (t === "notifications") showToast("Notifications cleared", "All caught up");
    else if (t === "message-client") showToast("Message sent", `James Smith has been notified`);
    else if (t === "add-family-member") showToast("Member added", "Synced to Zoho CRM Deal #4791 · new passport slot created");
    // 'search' just closes — no toast needed
  };

  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal">
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button className="modal-x" onClick={closeModal} aria-label="Close"><i className="ti ti-x"></i></button>
        </div>
        <div className="modal-body" id="modal-body">
          <ModalBody type={type} context={context} />
        </div>
        <div className="modal-footer" id="modal-footer">
          <button className="btn ghost" onClick={closeModal}>Cancel</button>
          <button className={`btn ${btnClass}`} onClick={onSubmit}>{btnLabel}</button>
        </div>
      </div>
    </div>
  );
}
