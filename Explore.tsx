import React from 'react';
import { PageId } from '../types';
import { PenTool, Upload, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';

interface ExploreProps {
  onNavigate: (page: PageId) => void;
}

export const Explore: React.FC<ExploreProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Select Input Workflow</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore 3D Creation
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Choose one of the three creation methods below to start building your 3D model.
          </p>
        </div>

        {/* Exactly Three Large Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Sketch to 3D */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
                <PenTool className="w-7 h-7 stroke-[2]" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">1. Sketch to 3D</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Draw your own sketch and convert it into a 3D model.
              </p>
            </div>
            <div className="pt-8">
              <button
                onClick={() => onNavigate('sketch')}
                className="w-full py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-98"
              >
                <span>Explore</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Upload Image to 3D */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-purple-300 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
                <Upload className="w-7 h-7 stroke-[2]" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">2. Upload Image to 3D</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upload an existing image and convert it into a 3D model.
              </p>
            </div>
            <div className="pt-8">
              <button
                onClick={() => onNavigate('upload')}
                className="w-full py-3 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-98"
              >
                <span>Explore</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 3: Text / Prompt to 3D */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-7 h-7 stroke-[2]" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">3. Text / Prompt to 3D</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Describe an object using text and generate a 3D model.
              </p>
            </div>
            <div className="pt-8">
              <button
                onClick={() => onNavigate('text')}
                className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-98"
              >
                <span>Explore</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
