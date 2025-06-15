'use client';

import Navbar from "@/components/navbar";
import AIGenerator from "@/components/ai-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Rocket, Shield, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import useSWR from "swr";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { getCurrentUserProfile } from "@/app/actions/auth/get-user-info";
import { useEffect, useState } from "react";
import { styles } from "@/config/styles";

export default function ImageGenerationPage() {
  const t = useTranslations("Styles");
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<string>(styles[0]?.id);

  useEffect(() => {
    // 页面加载时读取id参数
    const urlId = searchParams.get("id");
    if (urlId && styles.some(s => s.id === urlId)) {
      setSelectedId(urlId);
    } else if (!selectedId && styles.length > 0) {
      setSelectedId(styles[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedStyle = styles.find((s) => s.id === selectedId) || styles[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-row w-full bg-transparent rounded-3xl shadow-2xl">
          {/* 左侧风格选择栏 */}
          <aside className="w-80 bg-slate-900/80 border-r border-slate-800 flex flex-col py-10 px-6 rounded-l-3xl shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-8">{t('sceneSelectTitle') || '选择场景'}</h2>
            <div className="space-y-4 overflow-y-auto pr-2">
              {styles.map((style) => (
                <button
                  key={style.id}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left shadow-sm ${
                    selectedId === style.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white scale-105 shadow-lg'
                      : 'hover:bg-slate-800 text-slate-200'
                  }`}
                  onClick={() => setSelectedId(style.id)}
                >
                  <img src={style.previewImage} alt={t(`${style.id}.name`)} className="w-14 h-14 rounded-lg object-cover" />
                  <span className="font-semibold text-lg truncate">{t(`${style.id}.name`)}</span>
                </button>
              ))}
            </div>
          </aside>
          {/* 右侧主内容区 */}
          <main className="w-full flex  bg-transparent rounded-r-2xl">
            {/* 操作卡片 */}
            <div className="flex-1 bg-slate-800/80 rounded-2xl shadow-xl p-10 flex flex-col">
              <div className="flex items-center gap-6 mb-10">
                <img src={selectedStyle.previewImage} alt={t(selectedStyle.id + '.name')} className="w-20 h-20 rounded-xl object-cover" />
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{t(selectedStyle.id + '.name')}</h1>
                  <p className="text-slate-300 text-lg">{t(selectedStyle.id + '.description')}</p>
                </div>
              </div>
              <AIGenerator selectedStyleId={selectedId} />
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
