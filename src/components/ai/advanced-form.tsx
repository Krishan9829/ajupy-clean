"use client";

import { useState } from "react";

export default function AdvancedForm({ onGenerate }: any) {
  const [form, setForm] = useState({
    fabric: "silk",
    color: "red",
    embroidery: "zari",
    occasion: "wedding",
    style: "royal",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const buildPrompt = () => {
    return `
    ${form.style} Indian saree design,
    made of ${form.fabric},
    primary color ${form.color},
    featuring ${form.embroidery} embroidery,
    suitable for ${form.occasion},
    ultra detailed textile, luxury fashion, 4k, studio lighting
    `;
  };

  const handleSubmit = () => {
    const prompt = buildPrompt();
    onGenerate(prompt);
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow space-y-4">

      <h2 className="text-lg font-semibold">
        🎯 Customize Your Design
      </h2>

      {/* FABRIC */}
      <select name="fabric" onChange={handleChange} className="w-full p-2 border rounded">
        <option value="silk">Silk</option>
        <option value="cotton">Cotton</option>
        <option value="chiffon">Chiffon</option>
      </select>

      {/* COLOR */}
      <select name="color" onChange={handleChange} className="w-full p-2 border rounded">
        <option value="red">Red</option>
        <option value="blue">Blue</option>
        <option value="gold">Gold</option>
        <option value="green">Green</option>
      </select>

      {/* EMBROIDERY */}
      <select name="embroidery" onChange={handleChange} className="w-full p-2 border rounded">
        <option value="zari">Zari</option>
        <option value="thread work">Thread Work</option>
        <option value="mirror work">Mirror Work</option>
      </select>

      {/* OCCASION */}
      <select name="occasion" onChange={handleChange} className="w-full p-2 border rounded">
        <option value="wedding">Wedding</option>
        <option value="festival">Festival</option>
        <option value="party">Party</option>
      </select>

      {/* STYLE */}
      <select name="style" onChange={handleChange} className="w-full p-2 border rounded">
        <option value="royal">Royal</option>
        <option value="bridal">Bridal</option>
        <option value="modern">Modern</option>
      </select>

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
      >
        🚀 Generate Design
      </button>

    </div>
  );
}