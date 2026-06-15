export type FashionType =
  | "saree"
  | "textile"
  | "embroidery"
  | "color";

export function buildFashionPrompt(
  type: FashionType,
  userPrompt: string
) {
  switch (type) {
    case "saree":
      return `Design a premium Indian saree with: ${userPrompt}. Include silk texture, elegant patterns, studio lighting, ultra realistic fashion photography.`;

    case "textile":
      return `Create textile fabric design: ${userPrompt}. High detail weave pattern, manufacturing-ready design, professional textile mockup.`;

    case "embroidery":
      return `Generate embroidery pattern: ${userPrompt}. Traditional Indian embroidery style, fine thread details, luxury garment design.`;

    case "color":
      return `Create fashion color palette inspired by: ${userPrompt}. Include HEX codes, seasonal fashion trends, textile applicability.`;

    default:
      return userPrompt;
  }
}