import Sidebar from "./sidebar";
import Navbar from "./navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div>
        <Navbar />
        {children}
      </div>
    </div>
  );
}