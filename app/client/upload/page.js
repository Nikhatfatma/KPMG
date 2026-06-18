"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, Suspense } from "react";
import { showToast } from "@/lib/store";

// Per-document demo metadata — what the page renders depends on ?doc=<key>
const DOCS = {
  "passport-james": {
    eyebrow: "Upload · passport",
    title: "Valid passport — James Smith",
    sub: "PDF up to 25 MB · UK passport certified copy · AI will verify automatically",
    accepts: ".pdf",
    sampleFile: { name: "james_passport_2026.pdf", size: "1.2 MB" },
    aiFields: [
      { lab: "Holder", val: "James Smith (matches profile)" },
      { lab: "Passport number", val: "UK5829104" },
      { lab: "Issuing country", val: "United Kingdom" },
      { lab: "Expiry", val: "18 May 2036" },
      { lab: "Document quality", val: "Clear, no obstruction" },
    ],
    okLine: "Holder matches application · expiry valid for Fast Track timeline",
  },
  "passport-sarah": {
    eyebrow: "Upload · passport",
    title: "Valid passport — Sarah Smith (spouse)",
    sub: "PDF up to 25 MB · UK passport certified copy",
    accepts: ".pdf",
    sampleFile: { name: "sarah_passport_2026.pdf", size: "1.1 MB" },
    aiFields: [
      { lab: "Holder", val: "Sarah Smith" },
      { lab: "Passport number", val: "UK8912402" },
      { lab: "Issuing country", val: "United Kingdom" },
      { lab: "Expiry", val: "14 Feb 2036" },
      { lab: "Document quality", val: "Clear, no obstruction" },
    ],
    okLine: "Spouse passport recorded — linked to main applicant's application",
  },
  "passport-oliver": {
    eyebrow: "Upload · passport",
    title: "Valid passport — Oliver Smith (adult dependent child)",
    sub: "PDF up to 25 MB · UK passport certified copy",
    accepts: ".pdf",
    sampleFile: { name: "oliver_passport_2026.pdf", size: "1.1 MB" },
    aiFields: [
      { lab: "Holder", val: "Oliver Smith" },
      { lab: "Passport number", val: "UK7201824" },
      { lab: "Issuing country", val: "United Kingdom" },
      { lab: "Expiry", val: "30 Nov 2035" },
      { lab: "Document quality", val: "Clear, no obstruction" },
    ],
    okLine: "Adult dependent child passport recorded — active student",
  },
  "passport-emily": {
    eyebrow: "Upload · passport",
    title: "Valid passport — Emily Smith (minor child)",
    sub: "PDF up to 25 MB · UK passport certified copy",
    accepts: ".pdf",
    sampleFile: { name: "emily_passport_2026.pdf", size: "0.9 MB" },
    aiFields: [
      { lab: "Holder", val: "Emily Smith" },
      { lab: "Passport number", val: "UK9837412" },
      { lab: "Issuing country", val: "United Kingdom" },
      { lab: "Expiry", val: "30 Sep 2031" },
      { lab: "Document quality", val: "Clear, no obstruction" },
    ],
    okLine: "Minor child passport recorded — included as dependent",
  },
  "investment": {
    eyebrow: "Upload · proof of investment",
    title: "Proof of investment — DLS Sale Agreement",
    sub: "PDF up to 25 MB · Sale agreement (€300,000+ filed with DLS) or title deeds",
    accepts: ".pdf",
    sampleFile: { name: "james_sale_agreement_dls_limassol.pdf", size: "3.2 MB" },
    aiFields: [
      { lab: "Document type", val: "DLS Sale Agreement · stamped and filed" },
      { lab: "Property", val: "Block B, Apt 302, Limassol · residential" },
      { lab: "Buyer", val: "James Smith (matches passport)" },
      { lab: "Investment amount", val: "€320,000" },
      { lab: "Developer", val: "Cyprus Luxury Homes Ltd" },
    ],
    okLine: "Meets Fast Track minimum investment requirement (€300,000)",
  },
  "fund-down": {
    eyebrow: "Upload · transfer 1 of 3",
    title: "Proof of fund transfer — down payment",
    sub: "PDF up to 25 MB · SWIFT MT103 confirmation from foreign bank transfer",
    accepts: ".pdf",
    sampleFile: { name: "barclays_swift_mt103_downpayment_may2026.pdf", size: "2.4 MB" },
    aiFields: [
      { lab: "Sender", val: "James Smith · Barclays UK" },
      { lab: "Beneficiary", val: "Cyprus Luxury Homes Ltd · Hellenic Bank A/C" },
      { lab: "Amount", val: "€120,000.00" },
      { lab: "Reference", val: "FT-PR / Block B Apt 302 Limassol · DOWN PAYMENT" },
      { lab: "Date", val: "22 Apr 2026" },
    ],
    okLine: "Down payment recorded · 2 transfers remaining to reach €320,000",
    multiTransfer: true,
  },
  "fund-milestone": {
    eyebrow: "Upload · transfer 2 of 3",
    title: "Proof of fund transfer — milestone payment",
    sub: "PDF up to 25 MB · SWIFT MT103 confirmation",
    accepts: ".pdf",
    sampleFile: { name: "barclays_swift_mt103_milestone_may2026.pdf", size: "2.3 MB" },
    aiFields: [
      { lab: "Sender", val: "James Smith · Barclays UK" },
      { lab: "Beneficiary", val: "Cyprus Luxury Homes Ltd · Hellenic Bank A/C" },
      { lab: "Amount", val: "€100,000.00" },
      { lab: "Reference", val: "FT-PR / Block B Apt 302 Limassol · MILESTONE 1" },
      { lab: "Date", val: "12 May 2026" },
    ],
    okLine: "Milestone recorded · 1 transfer remaining (final)",
    multiTransfer: true,
  },
  "fund-final": {
    eyebrow: "Upload · transfer 3 of 3",
    title: "Proof of fund transfer — final payment",
    sub: "PDF up to 25 MB · SWIFT MT103 confirmation",
    accepts: ".pdf",
    sampleFile: { name: "barclays_swift_mt103_final_may2026.pdf", size: "2.2 MB" },
    aiFields: [
      { lab: "Sender", val: "James Smith · Barclays UK" },
      { lab: "Beneficiary", val: "Cyprus Luxury Homes Ltd · Hellenic Bank A/C" },
      { lab: "Amount", val: "€100,000.00" },
      { lab: "Reference", val: "FT-PR / Block B Apt 302 Limassol · FINAL" },
      { lab: "Date", val: "15 May 2026" },
    ],
    okLine: "Full €320,000 investment chain evidenced — ready for review",
    multiTransfer: true,
  },
  "income": {
    eyebrow: "Upload · proof of annual income",
    title: "Proof of annual income — accountant's letter",
    sub: "PDF up to 25 MB · tax return or accountant's proof of foreign income ≥ €85,000/year",
    accepts: ".pdf",
    sampleFile: { name: "smith_accountants_proof_income_2026.pdf", size: "520 KB" },
    aiFields: [
      { lab: "Issued by", val: "Smith & Associates · UK chartered accountants" },
      { lab: "Subject", val: "James Smith (matches profile)" },
      { lab: "Stated income", val: "€95,000 / year" },
      { lab: "Source", val: "Dividends + UK Director fees (100% foreign derived)" },
      { lab: "Verification", val: "Bank statement audits complete" },
    ],
    okLine: "Exceeds €85,000 minimum annual income requirement (combined main + spouse + 2 child dependents)",
  },
  "criminal-record": {
    eyebrow: "Upload · ACRO Police Certificate",
    title: "ACRO Police Certificate",
    sub: "PDF up to 25 MB · apostilled by FCDO · Country of origin (<6 months old)",
    accepts: ".pdf",
    sampleFile: { name: "uk_acro_police_certificate_apostilled.pdf", size: "640 KB" },
    aiFields: [
      { lab: "Issued by", val: "ACRO Criminal Records Office (UK)" },
      { lab: "Subject", val: "James Smith (matches passport)" },
      { lab: "Issue date", val: "18 Apr 2026" },
      { lab: "Apostille", val: "FCDO · 22 Apr 2026" },
      { lab: "Result", val: "No convictions found" },
    ],
    okLine: "Clean record · apostilled by FCDO · valid for Fast Track submission",
  },
  "health-insurance": {
    eyebrow: "Upload · health insurance certificate",
    title: "Health insurance certificate",
    sub: "PDF up to 25 MB · BUPA/AXA covering applicant and dependants (inpatient + outpatient)",
    accepts: ".pdf",
    sampleFile: { name: "bupa_axa_global_certificate_2026.pdf", size: "410 KB" },
    aiFields: [
      { lab: "Insurer", val: "BUPA / AXA Global Health" },
      { lab: "Policyholder", val: "James Smith" },
      { lab: "Covered persons", val: "4 (James, Sarah, Oliver, Emily)" },
      { lab: "Coverage", val: "Full inpatient + outpatient (Cyprus compliant)" },
      { lab: "Period", val: "01 May 2026 – 30 Apr 2027" },
    ],
    okLine: "Covers all 4 family members for the full Fast Track timeline",
  },
  "marriage-certificate": {
    eyebrow: "Upload · marriage certificate",
    title: "Marriage certificate",
    sub: "PDF up to 25 MB · UK certified copy · apostilled by FCDO",
    accepts: ".pdf",
    sampleFile: { name: "marriage_certificate_uk_certified_apostilled.pdf", size: "540 KB" },
    aiFields: [
      { lab: "Spouse 1", val: "James Smith" },
      { lab: "Spouse 2", val: "Sarah Smith" },
      { lab: "Date of marriage", val: "12 Aug 2005" },
      { lab: "Place", val: "London, United Kingdom" },
      { lab: "Apostille", val: "FCDO · UK Government verified" },
    ],
    okLine: "Marriage record verified — spouse included on application",
  },
  "birth-certificates": {
    eyebrow: "Upload · birth certificate",
    title: "Birth certificate — Emily Smith",
    sub: "PDF up to 25 MB · UK certified copy · apostilled by FCDO · showing both parents",
    accepts: ".pdf",
    sampleFile: { name: "emily_birth_certificate_certified_apostilled.pdf", size: "510 KB" },
    aiFields: [
      { lab: "Child", val: "Emily Smith" },
      { lab: "Date of birth", val: "14 May 2014" },
      { lab: "Place", val: "London, UK" },
      { lab: "Parents", val: "James Smith · Sarah Smith" },
      { lab: "Apostille", val: "FCDO · valid" },
    ],
    okLine: "Child birth certificate verified — dependent included on application",
  },
  "university-enrolment": {
    eyebrow: "Upload · university student status",
    title: "University enrolment certificate — Oliver Smith",
    sub: "PDF up to 25 MB · active full-time student status confirmation · current academic year",
    accepts: ".pdf",
    sampleFile: { name: "ucl_enrolment_confirmation_2025_26.pdf", size: "280 KB" },
    aiFields: [
      { lab: "Institution", val: "University College London (UCL)" },
      { lab: "Student", val: "Oliver Smith" },
      { lab: "Academic Year", val: "2025–2026" },
      { lab: "Enrollment Status", val: "Full-time student" },
    ],
    okLine: "Active student status confirmed — adult dependent student eligible",
  },
  "financial-dependency": {
    eyebrow: "Upload · dependency proof",
    title: "Proof of financial dependency — Oliver Smith",
    sub: "PDF up to 25 MB · evidence James pays tuition/living costs + dependency declaration",
    accepts: ".pdf",
    sampleFile: { name: "dependency_evidence_tuition_payments.pdf", size: "450 KB" },
    aiFields: [
      { lab: "Sponsor", val: "James Smith" },
      { lab: "Dependent", val: "Oliver Smith" },
      { lab: "Evidence Type", val: "Tuition and bank transfers to Hellenic A/C" },
    ],
    okLine: "Financial dependency verified — adult dependent child eligible",
  },
  "unmarried-declaration": {
    eyebrow: "Upload · unmarried status",
    title: "Declaration of unmarried status — Oliver Smith",
    sub: "PDF up to 25 MB · UK statutory declaration sworn before solicitor, apostilled",
    accepts: ".pdf",
    sampleFile: { name: "oliver_unmarried_declaration_sworn.pdf", size: "620 KB" },
    aiFields: [
      { lab: "Subject", val: "Oliver Smith" },
      { lab: "Status", val: "Unmarried / Single" },
      { lab: "Sworn Before", val: "Solicitor of the Senior Courts of England and Wales" },
      { lab: "Apostille", val: "FCDO · valid" },
    ],
    okLine: "Single status declaration confirmed — adult dependent child eligible",
  }
};

const DEFAULT_DOC = DOCS["fund-down"];

function humanFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

function UploadInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const docKey = searchParams.get("doc");
  const doc = (docKey && DOCS[docKey]) || DEFAULT_DOC;

  const routerPush = (path) => {
    const map = {
      "login": "/login", "otp": "/otp", "role": "/role",
      "c-home": "/client/home", "c-apps": "/client/apps", "c-project": "/client/project", "c-upload": "/client/upload",
    };
    router.push(map[path] || path);
  };

  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const [fields, setFields] = useState(doc.aiFields);

  const onPickClick = () => fileInputRef.current?.click();

  const ingestFile = (f) => {
    if (!f) return;
    setFile({ name: f.name, size: humanFileSize(f.size), isDemo: false });
    setExtracting(true);
    setExtracted(false);
    showToast("File received", `${f.name} · running AI extraction…`);
    // Simulate AI extraction
    setTimeout(() => {
      setExtracting(false);
      setExtracted(true);
      showToast("AI extraction complete", `Verified ${doc.aiFields.length} fields automatically`);
    }, 1600);
  };

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    ingestFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    ingestFile(f);
  };

  const onConfirm = () => {
    showToast(`${doc.title.split(" — ")[0]} uploaded`, "AI extraction verified · back to application");
    router.push("/client/project");
  };

  return (
    <>
      <div className="crumbs">
        <a onClick={() => { routerPush('c-home') }}>Home</a> <i className="ti ti-chevron-right"></i> <a onClick={() => { routerPush('c-project') }}>Fast Track (Permanent Residence)</a> <i className="ti ti-chevron-right"></i> {doc.title}
      </div>
      <div className="ph">
        <div className="lhs">
          <div className="eyebrow">{doc.eyebrow}</div>
          <h1>{doc.title}</h1>
          <div className="sub">{doc.sub}</div>
        </div>
        <div className="actions">
          <button className="btn ghost sm" onClick={() => { routerPush('c-project') }}><i className="ti ti-arrow-left"></i> Back</button>
        </div>
      </div>

      <div className="two-col even">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={doc.accepts || ".pdf"}
            onChange={onFileChange}
            style={{ display: "none" }}
          />
          <div
            className={`dropzone${dragOver ? ' dragover' : ''}`}
            onClick={onPickClick}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onPickClick(); }}
          >
            <i className="ti ti-cloud-upload"></i>
            <div className="t1">Drop file here or click to browse</div>
            <div className="t2">{doc.sub.split(" · ").slice(0, 2).join(" · ")}</div>
          </div>
          {file && (
          <div style={{marginTop: '16px', padding: '14px 18px', background: 'var(--paper)', border: '1px solid var(--gray-200)', borderLeft: '3px solid var(--cyan)', borderRadius: '0 4px 4px 0', display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div style={{width: '40px', height: '40px', background: '#FFE2DC', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
              <i className="ti ti-file-type-pdf" style={{fontSize: '22px', color: 'var(--red)'}}></i>
            </div>
            <div style={{flex: '1', minWidth: 0}}>
              <div style={{fontWeight: '700', color: 'var(--navy)', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{file.name}</div>
              <div style={{fontSize: '11px', color: 'var(--gray-600)', marginTop: '2px'}}>
                {file.size} · {file.isDemo ? "demo upload · click the dropzone to replace" : "uploaded just now"}
              </div>
            </div>
            {extracting ? (
              <i className="ti ti-loader" style={{fontSize: '22px', color: 'var(--blue)', animation: 'spin 1.2s linear infinite'}} title="Extracting"></i>
            ) : (
              <i className="ti ti-circle-check-filled" style={{fontSize: '22px', color: 'var(--green)'}}></i>
            )}
          </div>
          )}
        </div>
        <div>
          {!file ? (
            <div style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', border: '1px dashed var(--gray-300)', borderRadius: '6px', color: 'var(--gray-500)', padding: '40px', textAlign: 'center'}}>
              <i className="ti ti-sparkles" style={{fontSize: '32px', marginBottom: '12px', opacity: '0.5'}}></i>
              <div style={{fontWeight: '600', fontSize: '15px'}}>Waiting for document</div>
              <p style={{fontSize: '12px', marginTop: '4px'}}>Upload a file to see AI extraction results</p>
            </div>
          ) : (
            <>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
                <span className="ai-pill"><i className="ti ti-sparkles"></i> {extracting ? "AI extracting…" : "AI extracted"}</span>
                <span style={{fontSize: '11px', color: 'var(--gray-500)'}}>{extracting ? "processing…" : "processed in 2.3s"}</span>
              </div>
              <div className="card">
                <div className="card-b">
                  <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '12px 16px', fontSize: '13px', alignItems: 'center'}}>
                    {fields.map((f, i) => (
                      <div key={i} style={{display: 'contents'}}>
                        <span style={{color: 'var(--gray-600)'}}>{f.lab}</span>
                        <span style={{fontWeight: i === 0 ? '600' : '500'}}>{f.val}</span>
                        {extracting ? (
                          <i className="ti ti-loader" style={{color: 'var(--gray-400)', animation: 'spin 1.2s linear infinite'}}></i>
                        ) : (
                          <i className="ti ti-check" style={{color: 'var(--green)'}}></i>
                        )}
                      </div>
                    ))}
                  </div>
                  {extracted && !extracting && (
                    <div style={{marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--gray-200)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--green)', fontWeight: '600'}}>
                      <i className="ti ti-shield-check" style={{fontSize: '18px'}}></i> {doc.okLine}
                    </div>
                  )}
                </div>
              </div>
              {doc.multiTransfer && (
                <div style={{marginTop: '16px', padding: '12px 14px', background: '#F4F8FF', border: '1px solid #D6E4FF', borderRadius: '4px', display: 'flex', gap: '10px', alignItems: 'center'}}>
                  <i className="ti ti-info-circle" style={{color: 'var(--blue)', fontSize: '18px'}}></i>
                  <div style={{fontSize: '12px', color: 'var(--navy)', flex: '1'}}>This is a multi-transaction document. You can return to the project page to add the remaining transfers as they happen.</div>
                </div>
              )}
              <div style={{display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap'}}>
                <button className="btn blue" onClick={onConfirm} disabled={extracting}>Confirm and continue</button>
                {doc.multiTransfer && (
                  <button className="btn ghost" onClick={() => { showToast('Add another transfer', 'Returning to the project — pick the next pending transfer slot'); router.push('/client/project') }}><i className="ti ti-plus"></i> Add another transfer</button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function C_uploadPage() {
  return (
    <Suspense fallback={<div style={{padding: 40}}>Loading…</div>}>
      <UploadInner />
    </Suspense>
  );
}
