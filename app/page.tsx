"use client";

import { useState, useRef, useEffect } from "react";
import {
  Upload,
  Trash2,
  Download,
  Sparkles,
  ImageIcon,
  Loader2,
} from "lucide-react";

// مكون الخلفية الشطرنجية لعرض الصور الشفافة
const CheckeredBackground = ({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: "light" | "dark";
}) => {
  const bgStyle = theme === "dark" ? "bg-slate-800" : "bg-slate-200";

  return (
    <div
      className={`w-full aspect-square max-h-[420px] flex items-center justify-center overflow-hidden rounded-xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiM4ODg4ODgiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHJlY3QgeD0iNCIgeT0iNCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iI2NjY2NjYyIgZmlsbC1vcGFjaXR5PSIwLjIiLz48L3N2Zz4=')] bg-repeat transition-all duration-300 ${bgStyle}`}
    >
      {children}
    </div>
  );
};

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("dark");

  const originalUrlRef = useRef<string | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  const revokeUrls = () => {
    if (originalUrlRef.current) {
      URL.revokeObjectURL(originalUrlRef.current);
      originalUrlRef.current = null;
    }
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }
  };

  useEffect(() => {
    return () => revokeUrls();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    revokeUrls();

    const url = URL.createObjectURL(file);
    originalUrlRef.current = url;

    setImage(url);
    setImageFile(file);
    setResult(null);
    setProgress("");
  };

  const preprocessImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const tempUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(tempUrl);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Canvas context failed"));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.filter = "contrast(120%) saturate(110%) brightness(102%)";
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Failed to create image blob"));
            return;
          }
          resolve(blob);
        }, "image/png", 1);
      };

      img.onerror = () => {
        URL.revokeObjectURL(tempUrl);
        reject(new Error("Failed to load image"));
      };
      img.src = tempUrl;
    });
  };

  const removeBackground = async () => {
    if (!imageFile || loading) return;

    setLoading(true);
    setProgress("Loading AI segmentation model...");

    try {
      const imglyRemoveBackground = await import("@imgly/background-removal");

      setProgress("Enhancing image contrast and edge details...");
      const enhancedBlob = await preprocessImage(imageFile);

      setProgress("Analyzing objects and isolating foreground...");
      // تم حذف alphaMatting من هنا لحل خطأ الـ Build
      const blob = await imglyRemoveBackground.removeBackground(enhancedBlob, {
        model: "isnet",
        progress: (key: string, current: number, total: number) => {
          if (!total) return;
          const percent = Math.round((current / total) * 100);
          setProgress(`Processing image: ${percent}%`);
        },
      });

      if (resultUrlRef.current) {
        URL.revokeObjectURL(resultUrlRef.current);
      }

      const resultUrl = URL.createObjectURL(blob);
      resultUrlRef.current = resultUrl;
      setResult(resultUrl);
      setProgress("Completed successfully");
    } catch (error) {
      console.error(error);
      alert("Background removal failed. Please try another image.");
    } finally {
      setLoading(false);
    }
  };

  const resetApp = () => {
    revokeUrls();
    setImage(null);
    setImageFile(null);
    setResult(null);
    setProgress("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* ... باقي هيكل الصفحة كما هو ... */}
      <header className="flex flex-col items-center text-center mt-10 mb-12">
        <span className="px-3 py-1 text-xs font-semibold tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-3">
          AI Background Removal • Fully Local
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-400 mb-5">
          Smart Background Remover
        </h1>
        <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
          Remove backgrounds from products, electronics, portraits, transparent
          objects, and complex scenes directly inside your browser with
          AI-powered edge detection.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-24">
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-8">
          {!image && (
            <label className="w-full max-w-3xl aspect-[16/9] border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-950 hover:bg-black rounded-3xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 group">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <div className="p-5 bg-slate-800 rounded-full text-slate-500 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-300 mb-5">
                <Upload size={36} />
              </div>
              <p className="text-xl font-semibold mb-2 text-slate-200">Upload an image</p>
              <p className="text-sm text-slate-500">PNG, JPG, WEBP • Local AI Processing</p>
            </label>
          )}

          {image && (
            <div className="w-full flex flex-col gap-7">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 relative">
                  <span className="absolute top-5 left-5 bg-black/70 px-3 py-1 rounded-md text-xs font-semibold text-slate-400">Original Image</span>
                  <div className="w-full aspect-square max-h-[420px] flex items-center justify-center overflow-hidden rounded-xl">
                    <img src={image} alt="Original" className="max-w-full max-h-full object-contain" />
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 relative min-h-[300px] flex items-center justify-center">
                  <span className="absolute top-5 left-5 bg-black/70 px-3 py-1 rounded-md text-xs font-semibold text-indigo-400">Processed Result</span>
                  {result && !loading && (
                    <div className="absolute top-4 right-4 z-10 flex gap-1 bg-slate-900 border border-slate-700 p-1 rounded-lg">
                      <button onClick={() => setPreviewTheme("dark")} className={`px-3 py-1 text-xs rounded-md font-medium ${previewTheme === "dark" ? "bg-indigo-600 text-white" : "text-slate-400"}`}>Dark</button>
                      <button onClick={() => setPreviewTheme("light")} className={`px-3 py-1 text-xs rounded-md font-medium ${previewTheme === "light" ? "bg-indigo-600 text-white" : "text-slate-400"}`}>Light</button>
                    </div>
                  )}
                  {loading && (
                    <div className="flex flex-col items-center text-center gap-4 px-6">
                      <Loader2 className="animate-spin text-indigo-500" size={42} />
                      <div><p className="text-sm font-medium text-slate-200 mb-2">Processing image...</p><p className="text-xs text-slate-500 max-w-xs">{progress}</p></div>
                    </div>
                  )}
                  {!loading && !result && (
                    <div className="text-center p-6 text-slate-600 flex flex-col items-center gap-3"><ImageIcon size={42} /><p className="text-sm">Your processed image will appear here</p></div>
                  )}
                  {result && !loading && (
                    <CheckeredBackground theme={previewTheme}>
                      <img src={result} alt="Result" className="max-w-full max-h-full object-contain drop-shadow-2xl" />
                    </CheckeredBackground>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 border-t border-slate-800 pt-7">
                <button onClick={resetApp} disabled={loading} className="flex items-center gap-2 px-5 py-3 bg-slate-800 text-slate-300 rounded-xl font-medium transition hover:bg-slate-700 disabled:opacity-50"><Trash2 size={18} /> Reset</button>
                {!result && (
                  <button onClick={removeBackground} disabled={loading} className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold transition hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 disabled:opacity-50">
                    <Sparkles size={18} /> {loading ? "Processing..." : "Remove Background"}
                  </button>
                )}
                {result && (
                  <a href={result} download="background-removed.png" className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold transition hover:bg-emerald-500"><Download size={18} /> Download PNG</a>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}