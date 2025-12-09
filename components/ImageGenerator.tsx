import React, { useState } from 'react';
import { AspectRatio, ImageSize } from '../types';
import { ASPECT_RATIOS, IMAGE_SIZES } from '../constants';
import { generateCreativeImage } from '../services/geminiService';
import { Image as ImageIcon, Download, Loader2, Maximize2, Wand2, Settings2, Sparkles } from 'lucide-react';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const images = await generateCreativeImage(prompt, aspectRatio, imageSize);
      setGeneratedImages(images);
    } catch (err) {
      setError("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full bg-slate-950">
      {/* Control Panel */}
      <div className="w-80 border-r border-slate-800 p-6 flex flex-col gap-6 bg-slate-900/50 overflow-y-auto">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Wand2 className="text-purple-400" size={20} />
            Creative Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">Powered by Nano Banana Pro</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic data center with glowing blue cables..."
              className="w-full h-32 bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-100 focus:ring-2 focus:ring-purple-500/50 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Maximize2 size={12} /> Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.value}
                  onClick={() => setAspectRatio(ratio.value as AspectRatio)}
                  className={`px-3 py-2 rounded text-xs font-medium transition-all ${
                    aspectRatio === ratio.value
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Settings2 size={12} /> Resolution
            </label>
            <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
              {IMAGE_SIZES.map((size) => (
                <button
                  key={size.value}
                  onClick={() => setImageSize(size.value as ImageSize)}
                  className={`flex-1 py-1.5 rounded text-xs font-medium transition-all ${
                    imageSize === size.value
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg font-semibold shadow-lg shadow-purple-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            Generate Image
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 p-8 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        {generatedImages.length > 0 ? (
          <div className="relative group max-w-full max-h-full">
            <img 
              src={generatedImages[0]} 
              alt="Generated Result" 
              className="max-w-full max-h-[80vh] rounded-lg shadow-2xl shadow-black border border-slate-800"
            />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                    href={generatedImages[0]} 
                    download={`mcp-generated-${Date.now()}.png`}
                    className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur rounded-lg text-white block"
                >
                    <Download size={20} />
                </a>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-600">
             {isGenerating ? (
                 <div className="flex flex-col items-center gap-4">
                     <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                     </div>
                     <p className="animate-pulse">Dreaming up your image...</p>
                 </div>
             ) : (
                 <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                        <ImageIcon size={40} className="opacity-20" />
                    </div>
                    <p>Enter a prompt to generate high-fidelity assets.</p>
                 </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};