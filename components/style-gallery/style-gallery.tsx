"use client";

import { StyleCard } from "./style-card";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { styles } from "@/config/styles";
import { useRouter } from "next/navigation";

export function StyleGallery() {
  const router = useRouter();
  const t = useTranslations("Styles");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselItems = styles.slice(0, 4);

  const gridItems = styles.slice(4, 12);

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
                onClick={() => {
                  router.push(`/image?id=${encodeURIComponent(item.id)}`);
                }}
              >
                <img
                  src={item.previewImage}
                  alt={t(`${item.id}.name`)}
                  className="object-cover w-full h-full rounded-xl"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="text-xl font-bold text-white">{t(`${item.id}.name`)}</div>
                  <div className="text-slate-200 text-sm mt-1">{t(`${item.id}.description`)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-20">
        {gridItems.map((style) => (
          <StyleCard
            key={style.id}
            id={style.id}
            name={t(`${style.id}.name`)}
            description={t(`${style.id}.description`)}
            prompt={style.prompt}
            previewImage={style.previewImage}
          />
        ))}
      </div>
    </>
  );
} 