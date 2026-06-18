"use client";
import { useRouter } from "next/navigation";
import { showToast, openModal, closeModal } from "@/lib/store";
import Logo from "@/components/Logo";

export default function OtpPage() {
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
        <div className="eyebrow">Verify identity</div>
        <h1>One-time codes keep accounts safe.</h1>
        <p>Every sign-in gets a fresh 6-digit code by email. Codes expire in 10 minutes and can only be used once.</p>
      </div>
      <div className="auth-foot">
        <span><i className="ti ti-mail-fast"></i> Code valid 10 minutes</span>
        <span><i className="ti ti-eye-off"></i> Never logged or stored</span>
      </div>
    </div>
    <div className="auth-right">
      <div className="auth-form-wrap">
        <div className="eyebrow">Verify</div>
        <h2>Check your inbox</h2>
        <p className="sub">We sent a 6-digit code to <b style={{color: 'var(--navy)'}}>james@smith-holdings.uk</b>. Enter it below to continue.</p>
        <div className="otp-wrap" id="otp-wrap">
          <input className="otp-box" maxlength="1" inputmode="numeric" data-otp="0" />
          <input className="otp-box" maxlength="1" inputmode="numeric" data-otp="1" />
          <input className="otp-box" maxlength="1" inputmode="numeric" data-otp="2" />
          <input className="otp-box" maxlength="1" inputmode="numeric" data-otp="3" />
          <input className="otp-box" maxlength="1" inputmode="numeric" data-otp="4" />
          <input className="otp-box" maxlength="1" inputmode="numeric" data-otp="5" />
        </div>
        <button className="btn blue full lg" onClick={() => { routerPush('role') }}>
          Verify and continue
        </button>
        <div className="auth-meta">
          Didn't receive it? <a onClick={() => { resendOtp() }}>Resend code</a> · <a onClick={() => { routerPush('login') }}>Use different email</a>
        </div>
      </div>
    </div>
  </div></>
  );
}
