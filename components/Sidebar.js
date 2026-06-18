"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { showToast, openModal } from "@/lib/store";

export default function Sidebar({ role = "client" }) {
  const pathname = usePathname() || "";

  if (role === "staff") {
    const items = [
      { section: "Workspace" },
      { href: "/staff/overview", icon: "ti-layout-dashboard", label: "Overview" },
      { href: "/staff/clients", icon: "ti-users", label: "Clients", badge: "134" },
      { href: "/staff/projects", icon: "ti-folders", label: "Projects", badge: "40", match: ["/staff/projects", "/staff/project-review"] },
      { href: "/staff/project-review", icon: "ti-inbox", label: "Review queue", badge: "12" },
      { section: "Configure" },
      { href: "/staff/templates", icon: "ti-template", label: "Templates", match: ["/staff/templates", "/staff/template"] },
      { href: "/staff/services", icon: "ti-stamp", label: "Service types" },
      { href: "/staff/request", icon: "ti-send", label: "Send request" },
      { section: "System" },
      { href: "/staff/zoho", icon: "ti-plug", label: "Integrations" },
    ];
    return (
      <aside className="sidebar">
        {items.map((it, i) =>
          it.section ? (
            <div key={i} className="sb-section">{it.section}</div>
          ) : (
            <Link
              key={i}
              href={it.href}
              className={`sb-item ${(it.match ? it.match.some((m) => pathname.startsWith(m)) : pathname.startsWith(it.href)) ? "active" : ""}`}
            >
              <i className={`ti ${it.icon}`}></i> {it.label} {it.badge ? <span className="badge">{it.badge}</span> : null}
            </Link>
          )
        )}
      </aside>
    );
  }

  // client
  const stubHandlers = {
    Documents: () => showToast("Documents library — preview", "Browse documents from inside each Application. A central library lives here in production."),
    Messages:  () => showToast("Messages — preview", "Your conversations with your KPMG advisor will appear here. Full inbox in production."),
    Profile:   () => openModal("profile"),
    Support:   () => openModal("support"),
  };
  const items = [
    { section: "Workspace" },
    { href: "/client/home", icon: "ti-home", label: "Home" },
    { href: "/client/apps", icon: "ti-folder", label: "Applications", badge: "3", match: ["/client/apps", "/client/project", "/client/upload"] },
    { href: "/client/documents", icon: "ti-files", label: "Documents" },
    { href: "/client/messages", icon: "ti-message", label: "Messages", badge: "2" },
    { section: "Account" },
    { stub: "Profile", icon: "ti-user", label: "Profile" },
    { stub: "Support", icon: "ti-help-circle", label: "Support" },
  ];
  return (
    <aside className="sidebar">
      {items.map((it, i) =>
        it.section ? (
          <div key={i} className="sb-section">{it.section}</div>
        ) : it.stub ? (
          <button
            key={i}
            type="button"
            className="sb-item"
            onClick={stubHandlers[it.stub]}
            style={{ background: "none", border: "none", textAlign: "left", width: "100%", cursor: "pointer", font: "inherit", color: "inherit" }}
          >
            <i className={`ti ${it.icon}`}></i> {it.label} {it.badge ? <span className="badge">{it.badge}</span> : null}
          </button>
        ) : (
          <Link
            key={i}
            href={it.href}
            className={`sb-item ${(it.match ? it.match.some((m) => pathname.startsWith(m)) : pathname === it.href) ? "active" : ""}`}
          >
            <i className={`ti ${it.icon}`}></i> {it.label} {it.badge ? <span className="badge">{it.badge}</span> : null}
          </Link>
        )
      )}
    </aside>
  );
}
