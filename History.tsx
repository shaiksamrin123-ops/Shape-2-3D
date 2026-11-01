import React, { useState, useEffect } from 'react';
import { PageId, HistoryItem, GeneratedModel } from '../types';
import { getHistory, deleteHistoryItem, clearHistory } from '../utils/historyStorage';
import { generate3DMeshFromImage } from '../utils/meshGenerator';
import {
  History as HistoryIcon,
  Trash2,
  Box,
  Eye,
  Calendar,
  Layers,
  ArrowRight,
  Download,
  Loader2,
} from 'lucide-react';

interface HistoryProps {
  onNavigate: (page: PageId) => void;
  onSelectModel: (model: GeneratedModel) => void;
}

export const History: React.FC<HistoryProps> = ({ onNavigate, onSelectModel }) => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    setItems(getHistory());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteHistoryItem(id);
    setItems(updated);
  };

  const handleClearAll = () => {
    if (confirm('Clear all model history?')) {
      clearHistory();
      setItems([]);
    }
  };

  const handleOpenModel = async (item: HistoryItem) => {
    setLoadingId(item.id);
    try {
      // Re-generate or restore active mesh result from thumbnail
      const result = await generate3DMeshFromImage(item.inputThumbnail, item.customSettings);

      const generatedModel: GeneratedModel = {
        id: item.id,
        name: item.name,
        inputType: item.inputType,
        inputThumbnail: item.inputThumbnail,
        glbBlobUrl: result.glbBlobUrl,
        glbArrayBuffer: result.glbArrayBuffer,
        createdAt: item.createdAt,
        vertexCount: result.vertexCount,
        faceCount: result.faceCount,
        fileSizeBytes: result.fileSizeBytes,
        customSettings: item.customSettings,
      };

      onSelectModel(generatedModel);
      onNavigate('result');
    } catch (err) {
      console.error('Failed to open history model:', err);
      alert('Could not load 3D model.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 text-xs font-semibold mb-2">
              <HistoryIcon className="w-3.5 h-3.5" />
              <span>Project Archive</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Model History
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              View and reopen your previously generated 3D models.
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* History List */}
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm max-w-md mx-auto">
            <Box className="w-12 h-12 text-slate-300 mx-auto mb-3 stroke-[1.5]" />
            <h3 className="text-lg font-bold text-slate-800">No Generations Yet</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              Create your first 3D model by drawing a sketch or uploading an image.
            </p>
            <button
              onClick={() => onNavigate('explore')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <span>Explore Methods</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenModel(item)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Container */}
                  <div className="relative w-full h-44 bg-slate-50 flex items-center justify-center p-3 border-b border-slate-100 overflow-hidden">
                    <img
                      src={item.inputThumbnail}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/95 text-slate-700 border border-slate-200 shadow-sm capitalize">
                        {item.inputType}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 text-slate-400 hover:text-rose-600 hover:bg-white shadow-sm border border-slate-200 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors truncate">
                      {item.name}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.createdAt}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                      <span>{item.vertexCount.toLocaleString()} vertices</span>
                      <span className="font-mono text-emerald-600">.GLB</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleOpenModel(item)}
                    disabled={loadingId === item.id}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {loadingId === item.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Opening in 3D...</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Open 3D Model</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
