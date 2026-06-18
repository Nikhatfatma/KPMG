"use client";
import { useRouter } from "next/navigation";
import { showToast, openModal, closeModal, useMemberViewStore } from "@/lib/store";
import Logo from "@/components/Logo";

export default function RolePage() {
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
  const { setMember } = useMemberViewStore();
  const setMemberView = (id, name, role, avatar, color) => {
    setMember({ id: id || 'main', name: name || 'James Smith', role: role || 'Main applicant', avatar: avatar || 'JS', color: color || 'navy' });
  };
  // Legacy helper aliases used in inline handlers within the JSX
  const navigate = routerPush;

  return (
    <><div className="auth">
    <div className="auth-left">
      <div className="brand-mark"><Logo variant="light" size={100} /></div>
      <div className="auth-hero">
        <div className="eyebrow">Demo · choose perspective</div>
        <h1>One platform, two experiences.</h1>
        <p>In production, your role is bound to your email and routing is automatic. For this prototype, choose how you'd like to explore.</p>
      </div>
      <div className="auth-foot">
        <span><i className="ti ti-info-circle"></i> You can switch anytime from the top-right menu</span>
      </div>
    </div>
    <div className="auth-right">
      <div className="auth-form-wrap" style={{maxWidth: '440px'}}>
        <div className="eyebrow">Continue as</div>
        <h2>Pick a perspective</h2>
        <p className="sub">Both flows are fully clickable.</p>
        <div className="role-grid">
          <div className="role-card" onClick={() => { setMemberView('main', 'James Smith', 'Main applicant', 'JS', 'navy'); routerPush('c-home') }}>
            <div className="ri"><i className="ti ti-user"></i></div>
            <h4>Client · main applicant</h4>
            <p>James Smith — sees the full application, all documents and questions</p>
            <div className="ar">Open client portal <i className="ti ti-arrow-right"></i></div>
          </div>
          <div className="role-card" onClick={() => { routerPush('s-overview') }}>
            <div className="ri"><i className="ti ti-briefcase"></i></div>
            <h4>Staff / Admin</h4>
            <p>Templates, projects, clients, integrations — full console</p>
            <div className="ar">Open admin console <i className="ti ti-arrow-right"></i></div>
          </div>
        </div>
        <div style={{marginTop: '18px', padding: '14px 16px', background: 'var(--gray-50)', border: '1px dashed var(--gray-300)', borderRadius: '6px'}}>
          <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gray-600)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px'}}><i className="ti ti-users" style={{fontSize: '13px'}}></i> Or log in as a family member</div>
          <div style={{fontSize: '11px', color: 'var(--gray-700)', marginBottom: '10px'}}>In production each family member gets their own magic-link — they see only their own documents and questions on James's application.</div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px'}}>
            <div className="role-card" style={{padding: '12px 10px', cursor: 'pointer'}} onClick={() => { setMemberView('ss', 'Sarah Smith', 'Spouse', 'SS', 'purple'); routerPush('c-project') }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <div className="avatar purple sm">SS</div>
                <div>
                  <div style={{fontSize: '12px', fontWeight: '700', color: 'var(--navy)'}}>Sarah Smith</div>
                  <div style={{fontSize: '10px', color: 'var(--gray-600)'}}>Spouse · UK</div>
                </div>
              </div>
            </div>
            <div className="role-card" style={{padding: '12px 10px', cursor: 'pointer'}} onClick={() => { setMemberView('os', 'Oliver Smith', 'Child (19, Student)', 'OS', 'blue'); routerPush('c-project') }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <div className="avatar blue sm">OS</div>
                <div>
                  <div style={{fontSize: '12px', fontWeight: '700', color: 'var(--navy)'}}>Oliver Smith</div>
                  <div style={{fontSize: '10px', color: 'var(--gray-600)'}}>Student · 19</div>
                </div>
              </div>
            </div>
            <div className="role-card" style={{padding: '12px 10px', cursor: 'pointer'}} onClick={() => { setMemberView('es', 'Emily Smith', 'Child (12)', 'ES', 'cyan'); routerPush('c-project') }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <div className="avatar cyan sm">ES</div>
                <div>
                  <div style={{fontSize: '12px', fontWeight: '700', color: 'var(--navy)'}}>Emily Smith</div>
                  <div style={{fontSize: '10px', color: 'var(--gray-600)'}}>Minor · 12</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div></>
  );
}
