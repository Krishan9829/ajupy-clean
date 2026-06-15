import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        height: "70px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
        borderBottom: "1px solid #222",
      }}
    >
      <h2>AJUPY AI 🚀</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/generator">Generator</Link>
        <Link href="/collections">Collections</Link>
      </div>
    </nav>
  );
}