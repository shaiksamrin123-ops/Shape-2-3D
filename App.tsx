import React, { useState, useEffect } from 'react';
import { PageId, GeneratedModel } from './types';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Explore } from './components/Explore';
import { SketchInput } from './components/inputs/SketchInput';
import { UploadInput } from './components/inputs/UploadInput';
import { TextInput } from './components/inputs/TextInput';
import { ModelViewer } from './components/ModelViewer';
import { History } from './components/History';
import { AboutUs } from './components/AboutUs';
import { generate3DMeshFromImage } from './utils/meshGenerator';
import { SAMPLE_IMAGES } from './utils/samples';
import { saveHistoryItem } from './utils/historyStorage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [currentModel, setCurrentModel] = useState<GeneratedModel | null>(null);

  // Initialize a default starter model in background so that clicking to 'result' directly has a 3D model
  useEffect(() => {
    let isMounted = true;
    const initDefault = async () => {
      try {
        const sample = SAMPLE_IMAGES[0];
        const res = await generate3DMeshFromImage(sample.dataUrl, {
          heightScale: 1.0,
          widthScale: 1.0,
          color: '#4f46e5',
        });
        if (isMounted) {
          const defaultModel: GeneratedModel = {
            id: 'demo-default',
            name: 'Coffee Mug 3D',
            inputType: 'sketch',
            inputThumbnail: sample.dataUrl,
            glbBlobUrl: res.glbBlobUrl,
            glbArrayBuffer: res.glbArrayBuffer,
            createdAt: '2026-10-31 18:24',
            vertexCount: res.vertexCount,
            faceCount: res.faceCount,
            fileSizeBytes: res.fileSizeBytes,
            customSettings: {
              heightScale: 1.0,
              widthScale: 1.0,
              color: '#4f46e5',
            },
          };
          setCurrentModel(defaultModel);
        }
      } catch (e) {
        console.warn('Initial default model setup notice:', e);
      }
    };
    initDefault();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModelGenerated = (model: GeneratedModel) => {
    setCurrentModel(model);
    setCurrentPage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateModel = (updated: GeneratedModel) => {
    setCurrentModel(updated);
    saveHistoryItem({
      id: updated.id,
      name: updated.name,
      inputType: updated.inputType,
      inputThumbnail: updated.inputThumbnail,
      createdAt: updated.createdAt,
      vertexCount: updated.vertexCount,
      faceCount: updated.faceCount,
      fileSizeBytes: updated.fileSizeBytes,
      customSettings: updated.customSettings,
    });
  };

  const handleSelectModelFromHistory = (model: GeneratedModel) => {
    setCurrentModel(model);
    setCurrentPage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Consistent Simple Navigation Bar */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Pages Router */}
      <main className="flex-1">
        {currentPage === 'home' && <Home onNavigate={handleNavigate} />}

        {currentPage === 'explore' && <Explore onNavigate={handleNavigate} />}

        {/* Input Pages (Part of Explore Flow) */}
        {currentPage === 'sketch' && (
          <SketchInput
            onNavigate={handleNavigate}
            onModelGenerated={handleModelGenerated}
          />
        )}

        {currentPage === 'upload' && (
          <UploadInput
            onNavigate={handleNavigate}
            onModelGenerated={handleModelGenerated}
          />
        )}

        {currentPage === 'text' && <TextInput onNavigate={handleNavigate} />}

        {/* 3D Model Result Page */}
        {currentPage === 'result' && (
          <ModelViewer
            model={currentModel}
            onNavigate={handleNavigate}
            onUpdateModel={handleUpdateModel}
          />
        )}

        {/* History Page */}
        {currentPage === 'history' && (
          <History
            onNavigate={handleNavigate}
            onSelectModel={handleSelectModelFromHistory}
          />
        )}

        {/* About Us Page */}
        {currentPage === 'about' && <AboutUs onNavigate={handleNavigate} />}
      </main>
    </div>
  );
}
