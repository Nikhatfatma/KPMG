"use client";
import { useRouter } from "next/navigation";
import { showToast, openModal, closeModal } from "@/lib/store";
import Logo from "@/components/Logo";

export default function LoginPage() {
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
    <><div className="auth">
    <div className="auth-left">
      <div className="brand-mark"><Logo variant="light" size={100} /></div>
      <div className="auth-hero">
        <div className="eyebrow">Insights · Document System</div>
        <h1>Bringing clarity to every Cyprus residency application.</h1>
        <p>One workspace for templates, client documents, and questions — built for staff who manage many applications, and clients who only manage their own.</p>
      </div>

    </div>
    <div className="auth-right">
      <div className="auth-form-wrap">
        <div className="eyebrow">Sign in</div>
        <h2>Welcome to the portal</h2>
        <p className="sub">Enter your work email — we'll send a one-time code. No passwords to remember.</p>
        <div className="field">
          <label>Email address</label>
          <input type="email" id="login-email" placeholder="name@kpmg.com" defaultValue="james@smith-holdings.uk" />
        </div>
        <button className="btn blue full lg" onClick={() => { routerPush('otp') }}>
          Send verification code <i className="ti ti-arrow-right"></i>
        </button>
        <div className="auth-meta">
          Need help signing in? <a href="mailto:support@kpmg.com.cy?subject=Sign-in%20help" style={{cursor: 'pointer'}}>Contact your administrator</a>
        </div>
      </div>
    </div>
  </div></>
  );
}
