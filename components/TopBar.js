"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemberViewStore } from "@/lib/store";
import { showToast, openModal } from "@/lib/store";
import Logo from "@/components/Logo";

export default function TopBar({ role = "client" }) {
  const pathname = usePathname();
  const router = useRouter();
  const member = useMemberViewStore((s) => s.member);

  const isClientApps = pathname?.startsWith("/client/apps") || pathname?.startsWith("/client/project") || pathname?.startsWith("/client/upload");

  if (role === "staff") {
    return (
      <div className="topbar">
        <Link href="/staff/overview" className="tb-brand" aria-label="The Cyprus Advantage home">
          <Logo variant="light" size={56} />
        </Link>
        <nav className="tb-nav">
          <Link href="/staff/overview" className={pathname?.startsWith("/staff/overview") ? "active" : ""}>Overview</Link>
          <Link href="/staff/clients" className={pathname?.startsWith("/staff/clients") ? "active" : ""}>Clients</Link>
          <Link href="/staff/projects" className={pathname?.startsWith("/staff/projects") || pathname?.startsWith("/staff/project-review") ? "active" : ""}>Projects</Link>
          <Link href="/staff/templates" className={pathname?.startsWith("/staff/templates") || pathname?.startsWith("/staff/template") ? "active" : ""}>Templates</Link>
        </nav>
        <div className="tb-right">
          <button type="button" className="tb-search" onClick={() => openModal("search")} aria-label="Search"><i className="ti ti-search"></i> Search<span className="kbd">⌘K</span></button>
          <button type="button" className="tb-icon" onClick={() => openModal("notifications")} aria-label="Notifications"><i className="ti ti-bell"></i></button>
          <button className="tb-user" onClick={() => router.push("/role")} aria-label="Switch role">
            <span className="tb-user-av">AM</span>
            <span className="tb-user-info">
              <span className="tb-user-name">Anjali Mehta</span>
              <span className="tb-user-role"><i className="ti ti-briefcase" aria-hidden="true"></i> Staff</span>
            </span>
            <i className="ti ti-chevron-down tb-user-chev"></i>
          </button>
        </div>
      </div>
    );
  }

  // client topbar — reflects member-view swap on c-project
  const showAv = member.avatar || "JS";
  const showName = member.name || "James Smith";
  const showRole = member.id === "main" ? "Client" : "Family member";

  return (
    <div className="topbar">
      <Link href="/client/home" className="tb-brand" aria-label="The Cyprus Advantage home">
        <Logo variant="light" size={56} />
      </Link>
      <nav className="tb-nav">
        <Link href="/client/home" className={pathname === "/client/home" ? "active" : ""}>Home</Link>
        <Link href="/client/apps" className={isClientApps ? "active" : ""}>Applications</Link>
        <Link href="/client/documents" className={pathname === "/client/documents" ? "active" : ""}>Documents</Link>
        <Link href="/client/messages" className={pathname === "/client/messages" ? "active" : ""}>Messages</Link>
      </nav>
      <div className="tb-right">
        <button type="button" className="tb-search" onClick={() => openModal("search")} aria-label="Search"><i className="ti ti-search"></i> Search<span className="kbd">⌘K</span></button>
        <button type="button" className="tb-icon" onClick={() => openModal("notifications")} aria-label="Notifications"><i className="ti ti-bell"></i><span className="pulse"></span></button>
        <button className="tb-user" onClick={() => router.push("/role")} aria-label="Switch role">
          <span className="tb-user-av">{showAv}</span>
          <span className="tb-user-info">
            <span className="tb-user-name">{showName}</span>
            <span className="tb-user-role"><i className="ti ti-user" aria-hidden="true"></i> {showRole}</span>
          </span>
          <i className="ti ti-chevron-down tb-user-chev"></i>
        </button>
      </div>
    </div>
  );
}
