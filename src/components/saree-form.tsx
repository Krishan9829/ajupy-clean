"use client";

import { useState } from "react";
import axios from "axios";

export default function SareeForm() {
  const [form, setForm] = useState({
    fabric: "silk",
    color: "red",
    embroidery: "zari",
    occasion: "wedding",
    style: "royal",
  });
  

  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generatePrompt = () => {
    return `
    ${form.style} Indian saree,
    ${form.fabric} fabric,
    ${form.color} color,
    ${form.embroidery} embroidery,
    ${form.occasion} wear,
    ultra detailed textile design, luxury fashion
    `;
  };

  const handleGenerate = async () => {
    setLoading(true);

    const res = await axios.post("/api/generate", {
      prompt: generatePrompt(),
    });

    setImage(res.data.image);
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-3">

      <select name="fabric" onChange={handleChange}>
        <option>silk</option>
        <option>cotton</option>
        <option>chiffon</option>
      </select>

      <select name="color" onChange={handleChange}>
        <option>red</option>
        <option>blue</option>
        <option>gold</option>
      </select>

      <select name="embroidery" onChange={handleChange}>
        <option>zari</option>
        <option>thread work</option>
        <option>mirror work</option>
      </select>

      <select name="occasion" onChange={handleChange}>
        <option>wedding</option>
        <option>festival</option>
        <option>party</option>
      </select>

      <select name="style" onChange={handleChange}>
        <option>royal</option>
        <option>modern</option>
        <option>bridal</option>
      </select>

      <button
        onClick={handleGenerate}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Generate
      </button>

      {loading && <p>Generating...</p>}

      {image && <img src={image} className="rounded mt-4" />}
    </div>
  );
}