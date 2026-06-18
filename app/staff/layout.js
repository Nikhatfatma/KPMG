import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";

export default function StaffLayout({ children }) {
  return (
    <div className="app">
      <TopBar role="staff" />
      <div className="layout">
        <Sidebar role="staff" />
        <main className="main">{children}</main>
      </div>
    </div>
  );
}
