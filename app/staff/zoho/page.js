"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { showToast, openModal, closeModal } from "@/lib/store";

export default function S_zohoPage() {
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

  const [tab, setTab] = useState("rules");
  // Sync-rule toggles
  const [rules, setRules] = useState({ pullContacts: true, pushStatus: true, pushDocs: true, readSvc: true, autoCreate: false });
  const toggleRule = (key, label) => {
    setRules((s) => {
      const next = { ...s, [key]: !s[key] };
      showToast(next[key] ? `${label} — active` : `${label} — paused`, next[key] ? "Next sync runs in 12 minutes" : "Will skip on next run until re-enabled");
      return next;
    });
  };

  return (
    <>
        <div className="crumbs"><a onClick={() => routerPush('s-overview')} style={{cursor: 'pointer'}}>Integrations</a> <i className="ti ti-chevron-right"></i> Zoho CRM</div>
        <div className="ph">
          <div className="lhs">
            <div className="eyebrow">Integration</div>
            <h1>Zoho CRM <span className="badge ok dot lg" style={{verticalAlign: 'middle', marginLeft: '8px'}}>Connected</span></h1>
            <div className="sub">kpmgcyprus.zoho.com · last sync 4 minutes ago · 1,247 records mirrored</div>
          </div>
          <div className="actions">
            <button className="btn ghost sm" onClick={() => { showToast('Disconnect requires confirmation', 'In production this opens a 2-step confirm dialog', true) }}>Disconnect</button>
            <button className="btn blue sm" onClick={() => { showToast('Syncing with Zoho CRM', 'Pulled 2 new contacts, pushed 5 status updates') }}><i className="ti ti-refresh"></i> Sync now</button>
          </div>
        </div>

        <div className="tabs">
          <div className={`tab${tab === 'rules' ? ' on' : ''}`} onClick={() => setTab('rules')} style={{cursor: 'pointer'}}>Sync rules</div>
          <div className={`tab${tab === 'mapping' ? ' on' : ''}`} onClick={() => { setTab('mapping'); showToast('Field mapping', 'Maps DocFlow fields to Zoho Deal custom fields — view in production'); }} style={{cursor: 'pointer'}}>Field mapping</div>
          <div className={`tab${tab === 'webhooks' ? ' on' : ''}`} onClick={() => { setTab('webhooks'); showToast('Webhooks', 'Outbound webhook URLs and recent deliveries — view in production'); }} style={{cursor: 'pointer'}}>Webhooks</div>
          <div className={`tab${tab === 'log' ? ' on' : ''}`} onClick={() => setTab('log')} style={{cursor: 'pointer'}}>Sync log</div>
        </div>

        <div className="label-stripe">Active sync rules</div>

        <div className="li-row">
          <div className="li-info"><div className="nm">Pull Contacts → Clients</div><div className="mt">From Zoho Contacts module · 134 imported · runs every 15 minutes</div></div>
          <div className="li-r"><span className={`sdot ${rules.pullContacts ? 'g' : 'a'}`}></span><div className={`toggle${rules.pullContacts ? '' : ' off'}`} onClick={() => toggleRule('pullContacts', 'Pull Contacts')}></div></div>
        </div>
        <div className="li-row">
          <div className="li-info"><div className="nm">Push Project status → Deal Stage</div><div className="mt">DocFlow status pushed to the linked Zoho Deal on every change</div></div>
          <div className="li-r"><span className={`sdot ${rules.pushStatus ? 'g' : 'a'}`}></span><div className={`toggle${rules.pushStatus ? '' : ' off'}`} onClick={() => toggleRule('pushStatus', 'Push Project status')}></div></div>
        </div>
        <div className="li-row">
          <div className="li-info"><div className="nm">Push approved Documents → Deal attachments</div><div className="mt">Mirror verified uploads back to Zoho Deal as attachments</div></div>
          <div className="li-r"><span className={`sdot ${rules.pushDocs ? 'b' : 'a'}`}></span><div className={`toggle${rules.pushDocs ? '' : ' off'}`} onClick={() => toggleRule('pushDocs', 'Push approved Documents')}></div></div>
        </div>
        <div className="li-row">
          <div className="li-info"><div className="nm">Read Service Type custom field → Service type</div><div className="mt">Use the Zoho Deal's "Service Type" (Fast Track PR / Pink Slip) to auto-select the DocFlow service type</div></div>
          <div className="li-r"><span className={`sdot ${rules.readSvc ? 'g' : 'a'}`}></span><div className={`toggle${rules.readSvc ? '' : ' off'}`} onClick={() => toggleRule('readSvc', 'Read Service Type field')}></div></div>
        </div>
        <div className="li-row" style={{opacity: rules.autoCreate ? '1' : '0.6'}}>
          <div className="li-info"><div className="nm">Auto-create Project when Deal moves to "Documents stage"</div><div className="mt">{rules.autoCreate ? 'Active · Projects auto-created on stage transition' : 'Currently off · turn on to skip manual request creation'}</div></div>
          <div className="li-r"><span className={`sdot ${rules.autoCreate ? 'g' : 'a'}`}></span><div className={`toggle${rules.autoCreate ? '' : ' off'}`} onClick={() => toggleRule('autoCreate', 'Auto-create Project')}></div></div>
        </div>

        <div className="label-stripe" style={{marginTop: '28px'}}>Recent sync activity</div>
        <div className="sync-log">
          <div className="lg-row"><span className="sdot g"></span><span>Pulled 3 contacts from Zoho · <b>Dmitri Volkov, Olivia Chen, Pavlos Stavrou</b></span><span className="ts">11:42</span></div>
          <div className="lg-row"><span className="sdot g"></span><span>Pushed status <b>"Under review"</b> to Deal #4821 (James Wallace · Pink Slip renewal)</span><span className="ts">10:58</span></div>
          <div className="lg-row"><span className="sdot g"></span><span>Mirrored 2 documents to Deal #4791 (James Smith · Fast Track PR)</span><span className="ts">10:22</span></div>
          <div className="lg-row"><span className="sdot r"></span><span>Failed: contact missing email · skipped 1 record · <a onClick={() => showToast('Sync error detail', 'Record: id=zc-8821 · field "Email" was empty · re-run after fixing the source record in Zoho')} style={{color: 'var(--blue)', cursor: 'pointer'}}>View detail</a></span><span className="ts">09:14</span></div>
          <div className="lg-row"><span className="sdot g"></span><span>Pulled 1 contact · <b>Mariam Habib</b></span><span className="ts">08:00</span></div>
        </div>
      </>
  );
}
