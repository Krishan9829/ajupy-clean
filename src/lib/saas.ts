export type UserPlan = "free" | "pro";

export const PLAN_META: Record<UserPlan, { name: string; credits: number; price: number; accent: string }> = {
  free: { name: "Free", credits: 3, price: 0, accent: "from-slate-500 to-slate-700" },
  pro: { name: "Pro", credits: 30, price: 29, accent: "from-fuchsia-500 to-violet-600" },
};

export function getPlanMeta(plan?: string | null) {
  return PLAN_META[(plan as UserPlan) || "free"] || PLAN_META.free;
}

export function buildStructuredPrompt(values: Record<string, string | undefined>) {
  const parts = [
    `A premium saree design featuring ${values.color || "deep maroon"} tones`,
    `with ${values.fabric || "silk"} texture`,
    `a ${values.pallu || "flowing"} pallu`,
    `a ${values.border || "golden"} border`,
    `and a ${values.blouse || "modern"} blouse silhouette`,
  ];

  return `${parts.join(", ")}.
  Emphasize elegance, luxury, rich drape, ornate detailing, and modern fashion-forward styling.`;
}

export function buildNegativePrompt() {
  return "blurry, low quality, distorted anatomy, messy layout, dull colors, rough fabric, bad symmetry";
}

export function createDesignSvg(prompt: string, index: number) {
  const safePrompt = prompt.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
      <rect width="1200" height="1200" fill="#07080d"/>
      <rect x="40" y="40" width="1120" height="1120" rx="36" fill="#11131d" stroke="#7c3aed" stroke-width="4"/>
      <circle cx="320" cy="340" r="220" fill="rgba(255,255,255,0.06)"/>
      <path d="M320 220c140 0 250 110 250 250v90c0 118-95 220-220 220H320c-125 0-220-96-220-220v-90c0-140 110-250 250-250z" fill="#f2c9ff" opacity="0.18"/>
      <path d="M365 250c120 25 220 125 220 245v95c0 85-73 160-160 160-72 0-145-45-176-115l-20-74c-20-78 0-175 66-214 20-12 48-20 70-20z" fill="#f2f2ff" opacity="0.18"/>
      <rect x="220" y="650" width="760" height="300" rx="26" fill="#0f172a" stroke="#334155"/>
      <text x="260" y="730" fill="#f8fafc" font-family="Arial, sans-serif" font-size="44" font-weight="700">AI Saree Concept ${index}</text>
      <text x="260" y="790" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="24">${safePrompt}</text>
      <text x="260" y="840" fill="#8b5cf6" font-family="Arial, sans-serif" font-size="22">Premium fashion render • generated in studio</text>
    </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}
