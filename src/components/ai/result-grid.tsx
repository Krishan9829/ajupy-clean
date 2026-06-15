"use client";

export default function ResultGrid({ result }: { result: any }) {
  if (!result) return null;

  const saveImage = async () => {
    await fetch("/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: result.image,
        prompt: result.text,
      }),
    });

    alert("Saved to collection!");
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>👗 Fashion AI Output</h3>

      <p style={{ whiteSpace: "pre-wrap" }}>{result.text}</p>

      <img
        src={result.image}
        alt="Fashion AI"
        style={{
          width: "100%",
          maxWidth: 500,
          borderRadius: 12,
          marginTop: 10,
          border: "1px solid #333",
        }}
      />

      {/*  ACTION BUTTONS */}
      <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
        
        <button onClick={saveImage}>
           Save
        </button>

        <a href={result.image} download>
           Download
        </a>

      </div>
    </div>
  );
}