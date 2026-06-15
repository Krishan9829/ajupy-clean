"use client";

import { useState } from "react";
import { FashionType } from "../../lib/fashion-engine";

export default function FashionSelector({
  onSelect,
}: {
  onSelect: (type: FashionType) => void;
}) {
  const [active, setActive] = useState<FashionType>("saree");

  const select = (type: FashionType) => {
    setActive(type);
    onSelect(type);
  };

  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
      <button onClick={() => select("saree")}>
        👗 Saree AI
      </button>

      <button onClick={() => select("textile")}>
        🧵 Textile AI
      </button>

      <button onClick={() => select("embroidery")}>
        🪡 Embroidery AI
      </button>

      <button onClick={() => select("color")}>
        🎨 Color AI
      </button>
    </div>
  );
}