import Sidebar from "../../components/layout/sidebar";

export default function PricingPage() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <main
        style={{
          marginLeft: "260px",
          padding: "30px",
        }}
      >
        <h1>Pricing</h1>

        <h3>Free Plan</h3>
        <h3>Pro Plan</h3>
        <h3>Enterprise Plan</h3>
      </main>
    </div>
  );
}