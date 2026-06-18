import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";

export default function ClientLayout({ children }) {
  return (
    <div className="app">
      <TopBar role="client" />
      <div className="layout">
        <Sidebar role="client" />
        <main className="main">{children}</main>
      </div>
    </div>
  );
}
