"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div style={{ padding: "50px", color: "red", textAlign: "center" }}>
      <h2>Something went wrong 🚨</h2>

      <button
        onClick={() => reset()}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "white",
          color: "black",
          borderRadius: "5px",
        }}
      >
        Try Again
      </button>
    </div>
  );
}