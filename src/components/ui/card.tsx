export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 16,
        background: "#111",
        border: "1px solid #222",
        borderRadius: 12,
      }}
    >
      {children}
    </div>
  );
}