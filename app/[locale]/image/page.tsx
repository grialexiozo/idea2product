"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { wsFluxKontextPro, wsFluxKontextProStatus } from "@/app/actions/tool/ws-flux-kontext-pro";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { useUserContext } from "@/hooks/use-user-context";

export default function ImageGenerationPage() {
  const searchParams = useSearchParams();
  const { userContext } = useUserContext();
  const t = useTranslations("ImageGeneration");
  const [taskId, setTaskId] = useState<string>("");
  const [status, setStatus] = useState<string>("pending");
  const [result, setResult] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  const style = searchParams.get("style");
  const prompt = searchParams.get("prompt");

  useEffect(() => {
    if (!style || !prompt || !userContext) return;

    const generateImage = async () => {
      try {
        const response = await wsFluxKontextPro({
          prompt,
          num_images: 1,
          enable_safety_checker: true,
          safety_tolerance: "2",
          userContext
        } as any);

        if (response.status === "failed") {
          setError(response.message || t("generationFailed"));
          return;
        }

        setTaskId(response.id);
        checkStatus(response.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("unknownError"));
      }
    };

    generateImage();
  }, [style, prompt, userContext, t]);

  const checkStatus = async (id: string) => {
    if (!userContext) return;

    try {
      const response = await wsFluxKontextProStatus({ taskId: id, userContext } as any);
      setStatus(response.status);

      if (response.status === "completed") {
        setResult(response.result || []);
      } else if (response.status === "failed") {
        setError(response.message || t("generationFailed"));
      } else if (response.status === "pending" || response.status === "processing") {
        // Continue checking status
        setTimeout(() => checkStatus(id), 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("unknownError"));
    }
  };

  if (!style || !prompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto p-6 bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
            <div className="text-center text-red-500">{t("invalidParameters")}</div>
            <div className="mt-4 text-center">
              <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("backToHome")}
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-6 bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
          <div className="mb-6">
            <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("backToHome")}
              </Link>
            </Button>
          </div>

          <h1 className="text-2xl font-bold mb-4 text-white">{t("generatingImage")}</h1>
          <div className="space-y-4">
            <div className="text-slate-300">
              <p className="text-sm">{t("style")}: {style}</p>
              <p className="text-sm">{t("prompt")}: {prompt}</p>
            </div>
            
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <>
                <p className="text-sm text-slate-400">{t("status")}: {t(`status.${status}`)}</p>
                
                {result.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">{t("generatedImages")}</h2>
                    {result.map((url, index) => (
                      <div key={index} className="relative aspect-square w-full rounded-lg overflow-hidden">
                        <img
                          src={url}
                          alt={`${t("generatedImage")} ${index + 1}`}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
