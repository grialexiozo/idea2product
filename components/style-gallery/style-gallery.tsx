"use client";

import { StyleCard } from "./style-card";
import { useTranslations } from "next-intl";

// AI Image Styles
const styles = [
  {
    id: "anime",
    nameKey: "styles.anime.name",
    descriptionKey: "styles.anime.description",
    prompt: "A beautiful anime style illustration with vibrant colors, detailed character design, and dynamic composition",
    previewImage: "/styles/anime-preview.jpg"
  },
  {
    id: "oil-painting",
    nameKey: "styles.oilPainting.name",
    descriptionKey: "styles.oilPainting.description",
    prompt: "A detailed oil painting with rich textures, visible brushstrokes, and classical composition",
    previewImage: "/styles/oil-painting-preview.jpg"
  },
  {
    id: "watercolor",
    nameKey: "styles.watercolor.name",
    descriptionKey: "styles.watercolor.description",
    prompt: "A delicate watercolor painting with soft color transitions, artistic bleeding, and ethereal atmosphere",
    previewImage: "/styles/watercolor-preview.jpg"
  },
  {
    id: "pixel-art",
    nameKey: "styles.pixelArt.name",
    descriptionKey: "styles.pixelArt.description",
    prompt: "A retro pixel art scene with crisp, blocky graphics and vibrant 8-bit color palette",
    previewImage: "/styles/pixel-art-preview.jpg"
  },
  {
    id: "cyberpunk",
    nameKey: "styles.cyberpunk.name",
    descriptionKey: "styles.cyberpunk.description",
    prompt: "A cyberpunk scene with neon lights, high-tech elements, and futuristic urban atmosphere",
    previewImage: "/styles/cyberpunk-preview.jpg"
  },
  {
    id: "sketch",
    nameKey: "styles.sketch.name",
    descriptionKey: "styles.sketch.description",
    prompt: "A detailed hand-drawn sketch with pencil-like strokes and artistic shading",
    previewImage: "/styles/sketch-preview.jpg"
  },
  {
    id: "3d-render",
    nameKey: "styles.3dRender.name",
    descriptionKey: "styles.3dRender.description",
    prompt: "A photorealistic 3D render with modern lighting, detailed materials, and professional composition",
    previewImage: "/styles/3d-render-preview.jpg"
  },
  {
    id: "minimalist",
    nameKey: "styles.minimalist.name",
    descriptionKey: "styles.minimalist.description",
    prompt: "A minimalist design with clean lines, essential elements, and balanced composition",
    previewImage: "/styles/minimalist-preview.jpg"
  },
  {
    id: "fantasy",
    nameKey: "styles.fantasy.name",
    descriptionKey: "styles.fantasy.description",
    prompt: "A fantasy art scene with magical elements, ethereal lighting, and imaginative composition",
    previewImage: "/styles/fantasy-preview.jpg"
  },
  {
    id: "vintage",
    nameKey: "styles.vintage.name",
    descriptionKey: "styles.vintage.description",
    prompt: "A vintage style illustration with nostalgic colors and retro aesthetics",
    previewImage: "/styles/vintage-preview.jpg"
  },
  {
    id: "abstract",
    nameKey: "styles.abstract.name",
    descriptionKey: "styles.abstract.description",
    prompt: "An abstract artwork with bold shapes, dynamic colors, and artistic expression",
    previewImage: "/styles/abstract-preview.jpg"
  },
  {
    id: "comic",
    nameKey: "styles.comic.name",
    descriptionKey: "styles.comic.description",
    prompt: "A comic book style illustration with bold lines, vibrant colors, and dynamic composition",
    previewImage: "/styles/comic-preview.jpg"
  }
];

export function StyleGallery() {
  const t = useTranslations("HomePage");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {styles.map((style) => (
        <StyleCard
          key={style.id}
          id={style.id}
          name={t(style.nameKey)}
          description={t(style.descriptionKey)}
          prompt={style.prompt}
          previewImage={style.previewImage}
        />
      ))}
    </div>
  );
} 