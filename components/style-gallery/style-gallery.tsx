"use client";

import { StyleCard } from "./style-card";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

// AI Image Styles
const styles = [
  {
    id: "photo-restoration",
    nameKey: "styles.photoRestoration.name",
    descriptionKey: "styles.photoRestoration.description",
    prompt: "restore and colorize this photo. Repair the damaged white background. Maintain the consistency between the characters and the background",
    previewImage: "/styles/image1.png"
  },
  {
    id: "style-transfer",
    nameKey: "styles.styleTransfer.name",
    descriptionKey: "styles.styleTransfer.description",
    prompt: "Transform to $Style$, while maintaining women and pose unchanged",
    previewImage: "/styles/image2.png"
  },
  {
    id: "image-fusion",
    nameKey: "styles.imageFusion.name",
    descriptionKey: "styles.imageFusion.description",
    prompt: "Change image to the man and women to hug together, while maintaining the same facial features, hairstyle, and expression",
    previewImage: "/styles/image3.png"
  },
  {
    id: "model-product-fusion",
    nameKey: "styles.modelProductFusion.name",
    descriptionKey: "styles.modelProductFusion.description",
    prompt: "The change involved a woman holding a blue bag for a live stream display, maintaining the consistency of the character unchanged",
    previewImage: "/styles/image4.png"
  },
  {
    id: "product-showcase",
    nameKey: "styles.productShowcase.name",
    descriptionKey: "styles.productShowcase.description",
    prompt: "Place the item in the picture on the table. Keep the items, the table and the background unchanged.",
    previewImage: "/styles/image5.png"
  },
  {
    id: "model-product-fusion",
    nameKey: "styles.modelProductFusion.name",
    descriptionKey: "styles.modelProductFusion.description",
    prompt: "The change involved a woman holding a blue bag for a live stream display, maintaining the consistency of the character unchanged",
    previewImage: "/styles/image6.png"
  },
  {
    id: "furniture-showcase",
    nameKey: "styles.furnitureShowcase.name",
    descriptionKey: "styles.furnitureShowcase.description",
    prompt: "The character is sitting cross-legged on the sofa, and the Dalmatian is lying on the blanket sleeping.",
    previewImage: "/styles/image7.png"
  },
  {
    id: "nail-art",
    nameKey: "styles.nailArt.name",
    descriptionKey: "styles.nailArt.description",
    prompt: "Make a nail art pattern on the fingernails. Nail Art, $style$ Printed pattern on Nail Art, beautiful, bright, comforting, soft lighting. Do not make any changes except for your fingernails.",
    previewImage: "/styles/image8.png"
  },
  {
    id: "background-replacement",
    nameKey: "styles.backgroundReplacement.name",
    descriptionKey: "styles.backgroundReplacement.description",
    prompt: "Change the background to in the classroom of the school, keep the subject in the exact same position and pose",
    previewImage: "/styles/image9.png"
  },

  {
    id: "object-removal",
    nameKey: "styles.objectRemoval.name",
    descriptionKey: "styles.objectRemoval.description",
    prompt: "Remove the watermarks and text from the picture, while keeping all other details unchanged",
    previewImage: "/styles/image10.png"
  },

  {
    id: "ip-adapter-style-transfer",
    nameKey: "styles.ipAdapterStyleTransfer.name",
    descriptionKey: "styles.ipAdapterStyleTransfer.description",
    prompt: "Using this image style, a woman and a man are looking up at the sky by the stream, 18-years-old",
    previewImage: "/styles/image11.png"
  },
  {
    id: "partial-edit",
    nameKey: "styles.partialEdit.name",
    descriptionKey: "styles.partialEdit.description",
    prompt: "Partial adjustment, only modify the selected part (e.g. hair color, clothes, accessories), keep all other details unchanged.",
    previewImage: "/styles/image12.png"
  }
];

export function StyleGallery() {
  const t = useTranslations("HomePage");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselItems = styles.slice(0, 5);

  // 简单自动轮播效果
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [carouselItems.length]);

  return (
    <>
      {/* 3D Carousel Section */}
      <div className="mb-8 w-full flex justify-center">
        <div className="relative w-full max-w-2xl h-72 flex items-center justify-center" style={{ perspective: 1200 }}>
          {carouselItems.map((item, idx) => {
            // 计算相对当前索引的位置
            const pos = idx - carouselIndex;
            let style = "absolute transition-all duration-700";
            let transform = "";
            let zIndex = 0;
            let opacity = 1;
            let boxShadow = "";

            if (pos === 0) {
              // 当前项更大更突出
              transform = "translateX(-50%) scale(1.18) rotateY(0deg)";
              zIndex = 40;
              opacity = 1;
              boxShadow = "0 8px 32px 0 rgba(80,80,200,0.25), 0 1.5px 8px 0 rgba(0,0,0,0.18)";
            } else if (pos === -1 || (pos === carouselItems.length - 1 && carouselIndex === 0)) {
              // 左侧更小更远
              transform = "translateX(-140%) scale(0.78) rotateY(30deg)";
              zIndex = 20;
              opacity = 0.6;
              boxShadow = "0 2px 8px 0 rgba(0,0,0,0.10)";
            } else if (pos === 1 || (pos === -(carouselItems.length - 1) && carouselIndex === carouselItems.length - 1)) {
              // 右侧更小更远
              transform = "translateX(40%) scale(0.78) rotateY(-30deg)";
              zIndex = 20;
              opacity = 0.6;
              boxShadow = "0 2px 8px 0 rgba(0,0,0,0.10)";
            } else {
              // 其余项隐藏
              transform = "translateX(-50%) scale(0.6) rotateY(0deg)";
              opacity = 0;
              zIndex = 0;
              boxShadow = "none";
            }

            return (
              <div
                key={item.id}
                className={style}
                style={{
                  left: "50%",
                  top: 0,
                  width: "72%",
                  height: "100%",
                  transform,
                  zIndex,
                  opacity,
                  pointerEvents: pos === 0 ? "auto" : "none",
                  boxShadow,
                }}
              >
                <img
                  src={item.previewImage}
                  alt={t(item.nameKey)}
                  className="object-cover w-full h-full rounded-xl"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="text-xl font-bold text-white">{t(item.nameKey)}</div>
                  <div className="text-slate-200 text-sm mt-1">{t(item.descriptionKey)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-20">
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
    </>
  );
} 