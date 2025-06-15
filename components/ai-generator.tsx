"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Download, Share2, Wand2, Upload, Sparkles, AlertCircle, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FluxDevUltraFastParams, wsFluxDevUltraFast, wsFluxDevUltraFastStatus, TaskInfo } from "@/app/actions/tool/ws-flux-dev-ultra-fast";
import { uploadFile } from "@/app/actions/common/upload";
import { toast } from "sonner";
import { UserContext } from "@/lib/types/auth/user-context.bean";
import { AuthStatus, ActiveStatus } from "@/lib/types/permission/permission-config.dto";
import { TaskStatus, TaskStatusType, TaskResultStatus, TaskResultType } from "@/lib/types/task/enum.bean";

import { styles } from "@/config/styles";

export default function AIGenerator({ selectedStyle, selectedStyleId }: { selectedStyle?: any, selectedStyleId?: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [textPrompt, setTextPrompt] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImage2, setUploadedImage2] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskInfo, setTaskInfo] = useState<TaskInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Image generation parameters
  const [imageSize, setImageSize] = useState<string>("1024*1024");
  const [numImages, setNumImages] = useState<number>(1);
  const [inferenceSteps, setInferenceSteps] = useState<number>(28);
  const [guidanceScale, setGuidanceScale] = useState<number>(3.5);
  const [strength, setStrength] = useState<number>(0.8);
  const [seed, setSeed] = useState<number>(-1);
  const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState(false);

  // 新增本地预览 state
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [localPreview2, setLocalPreview2] = useState<string | null>(null);

  const t = useTranslations("AiGenerator");

  // Poll task status
  useEffect(() => {
    // Cleanup function
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, []);

  // start polling task status
  const startPolling = async (id: string) => {
    // Clear any existing polling
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    // Ensure generation status is set to true before starting polling
    setIsGenerating(true);

    // Set polling interval
    pollingRef.current = setInterval(async () => {
      try {
        const taskInfo = await wsFluxDevUltraFastStatus(id);
        setTaskInfo(taskInfo);

        if (taskInfo.progress !== undefined) {
          setGenerationProgress(taskInfo.progress);
        }

        // If task is completed or failed, stop polling
        if (taskInfo.status === TaskStatus.COMPLETED || taskInfo.status === TaskStatus.FAILED || taskInfo.status === TaskStatus.CANCELLED) {
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }

          if (taskInfo.status === TaskStatus.COMPLETED && taskInfo.result) {
            // Process successful result
            handleSuccessResult(taskInfo.result);
            // Only change generation status after successfully processing the result
            setIsGenerating(false);
          } else if (taskInfo.status === TaskStatus.FAILED) {
            // Handle failure
            setErrorMessage(taskInfo.message || "Failed to generate image");
            setIsGenerating(false);
            toast.error(taskInfo.message || "Failed to generate image, please try again later");
          } else if (taskInfo.status === TaskStatus.CANCELLED) {
            // Handle cancellation
            setErrorMessage(taskInfo.message || "Image generation cancelled");
            setIsGenerating(false);
            toast.error(taskInfo.message || "Image generation cancelled, please try again later");
          }
        }
      } catch (error) {
        console.error("Failed to poll task status:", error);
        // Don't stop polling on failure, continue waiting for status updates
        if (error instanceof Error) {
          setErrorMessage(`Error getting task status: ${error.message}`);
          // Use toast.id to prevent showing too many error messages
          toast.error("Error getting image generation status, but will keep trying", {
            duration: 3000,
            id: "polling-error",
          });
        }
      }
    }, 2000); // Poll every 2 seconds
  };

  // Handle successful generation results
  const handleSuccessResult = (result: string[]) => {
    try {
      if (result.length > 0) {
        setGeneratedImages(result);
        setSelectedImageIndex(0);
      } else {
        throw new Error("Generated image list is empty");
      }
    } catch (error) {
      console.error("Error processing generation results:", error);
      setErrorMessage(error instanceof Error ? error.message : "Error processing generation results");
      // Even if processing fails, keep isGenerating=false to prevent UI from getting stuck in loading state
      setIsGenerating(false);
    }
  };

  // Generate image
  const handleGenerate = async () => {
    try {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }

      setIsGenerating(true);
      setErrorMessage(null);
      setGeneratedImages([]);
      setGenerationProgress(0);

      // Build request parameters
      const params: FluxDevUltraFastParams = {
        prompt: textPrompt,
        size: imageSize,
        num_images: numImages,
        num_inference_steps: inferenceSteps,
        guidance_scale: guidanceScale,
        seed: seed,
      };

      // If in image-to-image mode, add image parameters
      if (uploadedImage) {
        params.image = uploadedImage;
        params.strength = strength;
      }

      // Call Server Action
      const taskInfo = await wsFluxDevUltraFast(params);

      if (taskInfo.id) {
        setTaskId(taskInfo.id);
        // Start polling task status
        startPolling(taskInfo.id);
      } else {
        setIsGenerating(false);
        setErrorMessage(taskInfo.message || "Failed to submit image generation request");
        toast.error(taskInfo.message || "Failed to start image generation");
      }
    } catch (error) {
      console.log("Error in generation:", error);
      setIsGenerating(false);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
      toast.error("Error sending generation request, please try again later");
    }
  };

  // 修改handleImageUpload，支持本地预览
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    // 本地预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setLocalPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error(t("fileSizeExceedsLimit") || "File size exceeds limit (5MB)");
      return;
    }

    try {
      // Resize image
      const resizedFile = await new Promise<File>((resolve) => {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(img.src); // Clean up object URL
          const canvas = document.createElement("canvas");
          const MAX_DIMENSION = 1024;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_DIMENSION) {
              height *= MAX_DIMENSION / width;
              width = MAX_DIMENSION;
            }
          } else {
            if (height > MAX_DIMENSION) {
              width *= MAX_DIMENSION / height;
              height = MAX_DIMENSION;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: file.type }));
            } else {
              resolve(file); // Use original file if blob creation fails
            }
          }, file.type);
        };
      });

      // Prepare for upload
      const formData = new FormData();
      formData.append("file", resizedFile);

      // Show uploading notification
      toast.loading(t("uploadingImage") || "Uploading image...", {
        id: "image-upload",
      });

      // Call upload API
      const result = await uploadFile(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.data?.publicUrl) {
        // Update uploaded image URL
        setUploadedImage(result.data.publicUrl);
        toast.success(t("uploadSuccessDescription") || "Image uploaded successfully", {
          id: "image-upload",
        });
      }
    } catch (err: any) {
      console.error("Image upload failed:", err);
      toast.error(err.message || t("uploadErrorDescription") || "Image upload failed, please try again", {
        id: "image-upload",
      });
    }
  };

  // handleImageUpload2 同理
  const handleImageUpload2 = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setLocalPreview2(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error(t("fileSizeExceedsLimit") || "File size exceeds limit (5MB)");
      return;
    }

    try {
      // Resize image
      const resizedFile = await new Promise<File>((resolve) => {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(img.src); // Clean up object URL
          const canvas = document.createElement("canvas");
          const MAX_DIMENSION = 1024;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_DIMENSION) {
              height *= MAX_DIMENSION / width;
              width = MAX_DIMENSION;
            }
          } else {
            if (height > MAX_DIMENSION) {
              width *= MAX_DIMENSION / height;
              height = MAX_DIMENSION;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: file.type }));
            } else {
              resolve(file); // Use original file if blob creation fails
            }
          }, file.type);
        };
      });

      // Prepare for upload
      const formData = new FormData();
      formData.append("file", resizedFile);

      // Show uploading notification
      toast.loading(t("uploadingImage") || "Uploading image...", {
        id: "image-upload-2",
      });

      // Call upload API
      const result = await uploadFile(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.data?.publicUrl) {
        // Update uploaded image URL
        setUploadedImage2(result.data.publicUrl);
        toast.success(t("uploadSuccessDescription") || "Image uploaded successfully", {
          id: "image-upload-2",
        });
      }
    } catch (err: any) {
      console.error("Image upload failed:", err);
      toast.error(err.message || t("uploadErrorDescription") || "Image upload failed, please try again", {
        id: "image-upload-2",
      });
    }
  };

  // 兼容：优先用selectedStyleId查找style，否则用selectedStyle
  const style = selectedStyleId
    ? styles.find((s) => s.id === selectedStyleId)
    : selectedStyle;

  // 新增：当style变化时，设置默认图片和提示词
  useEffect(() => {
    if (style) {
      setTextPrompt(style.prompt || "");
      setGeneratedImages(style.previewImage ? [style.previewImage] : []);
      setSelectedImageIndex(0);
    }
  }, [style]);

  return (
    <div className="grid lg:grid-cols-3 gap-8" style={{ gridTemplateColumns: "1fr 2fr" }}>
      {/* Control Panel */}
      <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center space-x-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-white">{t("controlPanelTitle")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-6">
            {/* 单图或多图上传卡片 */}
            <label htmlFor="image-upload" className="flex-1 cursor-pointer">
              <div className="flex flex-col items-center justify-center border-2 border-slate-600 rounded-xl bg-slate-800/40 hover:border-blue-500 transition-all min-h-[180px] py-8">
                {localPreview || uploadedImage ? (
                  <Image
                    src={localPreview || uploadedImage || "/placeholder.svg"}
                    alt={t("uploadedImageAlt")}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover mx-auto shadow-lg max-h-40"
                  />
                ) : (
                  <>
                    <Plus className="w-10 h-10 text-slate-400 mb-2" />
                    <div className="text-slate-300 text-lg font-medium">点击上传图像</div>
                  </>
                )}
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {style?.isMulti && (
              <label htmlFor="image-upload-2" className="flex-1 cursor-pointer">
                <div className="flex flex-col items-center justify-center border-2 border-slate-600 rounded-xl bg-slate-800/40 hover:border-blue-500 transition-all min-h-[180px] py-8">
                  {localPreview2 || uploadedImage2 ? (
                    <Image
                      src={localPreview2 || uploadedImage2 || "/placeholder.svg"}
                      alt={t("uploadedImageAlt") + " 2"}
                      width={200}
                      height={200}
                      className="rounded-lg object-cover mx-auto shadow-lg max-h-40"
                    />
                  ) : (
                    <>
                      <Plus className="w-10 h-10 text-slate-400 mb-2" />
                      <div className="text-slate-300 text-lg font-medium">点击上传图像</div>
                    </>
                  )}
                </div>
                <input
                  id="image-upload-2"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload2}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div className="text-slate-400 text-sm mt-2">您可以上传 JPG 和 PNG 格式的图片，大小不超过 10MB，且尺寸不小于 300px.</div>
          <div>
            <Label htmlFor="modify-prompt" className="text-slate-200 font-medium mb-2">
              {t("imageToImageModifyPromptLabel")}
            </Label>
            <Textarea
              id="modify-prompt"
              placeholder={t("imageToImageModifyPromptPlaceholder")}
              value={textPrompt}
              onChange={(e) => setTextPrompt(e.target.value)}
              className="min-h-[100px] bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !textPrompt.trim()}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50">
            {isGenerating ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                {t("generatingText")}
              </>
            ) : (
              <>
                <Wand2 className="mr-3 h-5 w-5" />
                {t("startGeneratingButton")}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      {/* Result Display */}
      <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl text-white">{t("resultTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-square bg-slate-700/30 rounded-xl flex items-center justify-center overflow-hidden">
            {isGenerating ? (
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                  <div
                    className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto"
                    style={{ animationDelay: "0.1s" }}></div>
                </div>
                <div className="space-y-2">
                  <p className="text-white font-medium">{t("generatingStatus")}</p>
                  <p className="text-slate-400 text-sm">{t("generatingHint")}</p>
                </div>
              </div>
            ) : generatedImages.length > 0 ? (
              <div className="w-full space-y-4">
                {/* Selected main image */}
                <div className="relative group mb-4">
                  <Image
                    src={generatedImages[selectedImageIndex] || "/placeholder.svg"}
                    alt={t("generatedImageAlt")}
                    width={512}
                    height={512}
                    className="w-full h-full object-cover rounded-lg shadow-xl"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <div className="flex space-x-3">
                      <Button size="sm" variant="secondary" className="bg-white/90 text-slate-900 hover:bg-white">
                        <Download className="w-4 h-4 mr-2" />
                        {t("downloadButton")}
                      </Button>
                      <Button size="sm" variant="secondary" className="bg-white/90 text-slate-900 hover:bg-white">
                        <Share2 className="w-4 h-4 mr-2" />
                        {t("shareButton")}
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Image grid - shown when there are multiple images */}
                {generatedImages.length > 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {generatedImages.map((image, index) => (
                      <div
                        key={index}
                        className={`relative cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                          index === selectedImageIndex ? "border-blue-500 ring-2 ring-blue-500/50" : "border-transparent hover:border-slate-500"
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={t("generatedImageAlt")}
                          width={256}
                          height={256}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-slate-600/50 rounded-full flex items-center justify-center mx-auto">
                  <Wand2 className="w-10 h-10 text-slate-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-slate-300 font-medium">{t("waitingForCreation")}</p>
                  <p className="text-slate-500 text-sm">{t("creationHint")}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
