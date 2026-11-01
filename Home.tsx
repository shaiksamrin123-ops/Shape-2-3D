import React from 'react';
import { PageId } from '../types';
import {
  PenTool,
  Upload,
  MessageSquare,
  ArrowRight,
  Layers,
  Sparkles,
  Download,
  CheckCircle2,
  Box,
  Cpu,
  FileCheck,
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: PageId) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20 border-b border-slate-200/80 bg-gradient-to-b from-white via-indigo-50/30 to-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Student Hackathon Project</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Turn Your Ideas into{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600">
                  3D Models
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Draw a sketch, upload an image, or describe your idea. Convert it into a simple 3D
                model using AI.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => onNavigate('explore')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-md shadow-indigo-200 flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-98"
                >
                  <span>Explore Creation Methods</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('history')}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-sm transition-colors cursor-pointer"
                >
                  View Sample Models
                </button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-6 pt-3 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Real .GLB Export</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Interactive 3D Viewer</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Custom Sizing & Color</span>
                </div>
              </div>
            </div>

            {/* Right Column: 2D Sketch transforming into 3D Model Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-200">
                {/* Visual Transformation Badge */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5 text-indigo-600">
                    <PenTool className="w-3.5 h-3.5" /> 2D User Sketch
                  </span>
                  <span className="text-slate-400">→ TripoSR Pipeline →</span>
                  <span className="flex items-center gap-1.5 text-purple-600">
                    <Box className="w-3.5 h-3.5" /> 3D GLB Model
                  </span>
                </div>

                {/* Interactive/Animated transformation illustration */}
                <div className="relative py-6 flex items-center justify-between gap-4">
                  {/* Left: 2D Sketch Card */}
                  <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-dashed border-indigo-300 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-white rounded-lg border border-slate-200 flex items-center justify-center relative shadow-sm overflow-hidden">
                      {/* 2D Sketch svg drawing */}
                      <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-slate-800 fill-none stroke-[3] stroke-linecap-round stroke-linejoin-round">
                        {/* 2D Mug Sketch */}
                        <path d="M 25 35 L 65 35 Q 70 80 65 85 Q 45 88 25 85 Q 20 80 25 35 Z" fill="#f1f5f9" />
                        <path d="M 65 45 Q 85 48 85 65 Q 85 80 65 80" />
                        <ellipse cx="45" cy="35" rx="20" ry="5" fill="#e2e8f0" />
                        {/* Pencil icon accent */}
                        <line x1="15" y1="20" x2="25" y2="30" stroke="#4f46e5" strokeWidth="2.5" />
                      </svg>
                      <div className="absolute top-1 right-1 text-[9px] font-bold px-1 py-0.5 rounded bg-indigo-100 text-indigo-700">
                        2D
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-600 mt-2">Drawn Outline</span>
                  </div>

                  {/* Middle Arrow / Transform Spark */}
                  <div className="flex flex-col items-center justify-center text-indigo-500">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-[10px] font-semibold text-indigo-600 mt-1">Reconstruct</span>
                  </div>

                  {/* Right: 3D Rendered Object Card */}
                  <div className="flex-1 bg-gradient-to-br from-indigo-50/60 to-purple-50/60 rounded-xl p-3 border border-indigo-200 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-white rounded-lg border border-indigo-100 flex items-center justify-center relative shadow-md overflow-hidden">
                      {/* 3D isometric shaded model */}
                      <svg viewBox="0 0 100 100" className="w-16 h-16">
                        <defs>
                          <linearGradient id="mug3dFront" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#4338ca" />
                          </linearGradient>
                          <linearGradient id="mug3dTop" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#4f46e5" />
                          </linearGradient>
                        </defs>
                        {/* 3D Volumetric body with bevel */}
                        <path d="M 24 35 L 66 35 C 72 65 68 82 64 86 C 45 90 25 88 24 86 C 20 80 18 55 24 35 Z" fill="url(#mug3dFront)" />
                        {/* 3D Handle */}
                        <path d="M 65 42 C 86 44 88 66 82 76 C 76 83 67 80 64 78 C 65 74 72 74 74 70 C 78 64 76 52 65 48 Z" fill="#4338ca" />
                        {/* Top rim inner depth */}
                        <ellipse cx="45" cy="35" rx="21" ry="6" fill="url(#mug3dTop)" />
                        <ellipse cx="45" cy="35" rx="16" ry="4" fill="#312e81" />
                        {/* Soft ground shadow */}
                        <ellipse cx="45" cy="91" rx="24" ry="4" fill="#cbd5e1" opacity="0.6" />
                      </svg>
                      <div className="absolute top-1 right-1 text-[9px] font-bold px-1 py-0.5 rounded bg-purple-100 text-purple-700">
                        3D GLB
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-purple-700 mt-2">Watertight 3D</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Box className="w-4 h-4 text-indigo-600" />
                    <span>3D Mesh with real vertices & normals</span>
                  </div>
                  <span className="font-semibold text-indigo-600">glTF 2.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORE SECTION (Explanation of 3 Methods) */}
      <section className="py-14 bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Three Ways to Create 3D Models
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Choose the workflow that best fits your idea. Each option produces an interactive 3D model.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Sketch to 3D */}
            <div className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                  <PenTool className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">1. Sketch to 3D</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Use the built-in digital canvas with mouse or touch to draw your doodle or outline.
                  Watch it transform into a 3D volumetric model.
                </p>
              </div>
              <button
                onClick={() => onNavigate('sketch')}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                <span>Try Sketch to 3D</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 2. Upload Image to 3D */}
            <div className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-sm">
                  <Upload className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">2. Upload Image to 3D</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Upload an existing photo, drawing, or silhouette graphic. The pipeline isolates the
                  subject and creates a 3D mesh.
                </p>
              </div>
              <button
                onClick={() => onNavigate('upload')}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700 cursor-pointer"
              >
                <span>Try Image Upload</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 3. Text / Prompt to 3D */}
            <div className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                  <MessageSquare className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">3. Text / Prompt to 3D</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Type a plain text description of the object. Check system requirements and model
                  integration status.
                </p>
              </div>
              <button
                onClick={() => onNavigate('text')}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                <span>Inspect Text Option</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigate('explore')}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
            >
              Open Explore Hub
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works-section" className="py-14 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 text-xs font-semibold mb-2">
              Simple 3-Step Process
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              From idea to downloadable 3D asset in under a minute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-base flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Choose your input method
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Decide whether you want to sketch interactively on the canvas, upload a pre-drawn picture,
                or describe what you want with text.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-base flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Provide sketch, image, or prompt
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Use your mouse or touchscreen to draw, or select an image file from your device.
                Clean outlines produce the best 3D geometry.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-base flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Generate and download 3D model
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                View your 3D model in the interactive viewer. Customize height, width, and color,
                then download the valid .GLB file for your game or project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLANATORY CONTENT NEAR BOTTOM */}
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-indigo-50/50 via-purple-50/40 to-blue-50/50 rounded-2xl p-8 border border-indigo-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
                  <FileCheck className="w-5 h-5" />
                  <h4>Standard GLB Format</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Generated models are exported in industry-standard glTF 2.0 Binary (.glb). They open
                  directly in Blender, Unity, Unreal Engine, Godot, and 3D printing slicers.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-700 font-bold text-base">
                  <PenTool className="w-5 h-5" />
                  <h4>Tips for Great Sketches</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Draw clear, closed outlines with good contrast. Objects with defined outer boundaries
                  like cups, vases, swords, shields, and chairs inflate into great 3D geometries.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-base">
                  <Cpu className="w-5 h-5" />
                  <h4>Built by Students</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Developed for a college hackathon to make 3D asset generation accessible to
                  students, hobbyists, and game developers without expensive software.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto py-6 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-600">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 SKETCH2SHAPE AI - Student Hackathon Project</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('explore')} className="hover:text-indigo-600">
              Explore
            </button>
            <button onClick={() => onNavigate('history')} className="hover:text-indigo-600">
              History
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-indigo-600">
              About Us
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
