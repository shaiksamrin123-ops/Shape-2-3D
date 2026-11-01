import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GeneratedModel, PageId, ModelCustomSettings } from '../types';
import { applyCustomSettings, validateGlbBuffer } from '../utils/meshGenerator';
import {
  Download,
  RotateCcw,
  Sliders,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Box,
  Eye,
  Layers,
  Palette,
  Loader2,
  HelpCircle,
} from 'lucide-react';

interface ModelViewerProps {
  model: GeneratedModel | null;
  onNavigate: (page: PageId) => void;
  onUpdateModel?: (updated: GeneratedModel) => void;
}

export const ModelViewer: React.FC<ModelViewerProps> = ({
  model,
  onNavigate,
  onUpdateModel,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const activeMeshGroupRef = useRef<THREE.Group | null>(null);

  // Customization state
  const [showCustom, setShowCustom] = useState(false);
  const [customHeight, setCustomHeight] = useState<number>(model?.customSettings?.heightScale ?? 1.0);
  const [customWidth, setCustomWidth] = useState<number>(model?.customSettings?.widthScale ?? 1.0);
  const [customColor, setCustomColor] = useState<string>(model?.customSettings?.color ?? '#4f46e5');

  // UI Toggles
  const [isApplyingCustom, setIsApplyingCustom] = useState(false);
  const [customSuccessMessage, setCustomSuccessMessage] = useState(false);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [currentGlbUrl, setCurrentGlbUrl] = useState<string>(model?.glbBlobUrl ?? '');
  const [currentFileSize, setCurrentFileSize] = useState<number>(model?.fileSizeBytes ?? 0);
  const [currentStats, setCurrentStats] = useState({
    vertices: model?.vertexCount ?? 0,
    faces: model?.faceCount ?? 0,
  });

  // Color Swatches
  const colorPresets = [
    { label: 'Indigo', hex: '#4f46e5' },
    { label: 'Purple', hex: '#7c3aed' },
    { label: 'Cyan', hex: '#0891b2' },
    { label: 'Emerald', hex: '#059669' },
    { label: 'Amber', hex: '#d97706' },
    { label: 'Slate', hex: '#475569' },
  ];

  // Initialize Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 460;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f8fafc');
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 3.2);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.0;
    controls.maxDistance = 8.0;
    controlsRef.current = controls;

    // 5. Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xcfd8dc, 0.9);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.4);
    dirLight.position.set(3, 6, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xe0e7ff, 0.6);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);

    // 6. Ground Shadow Grid Plane
    const gridHelper = new THREE.GridHelper(6, 20, 0xcbd5e1, 0xe2e8f0);
    gridHelper.position.y = -1.1;
    scene.add(gridHelper);

    const planeGeo = new THREE.PlaneGeometry(8, 8);
    const planeMat = new THREE.ShadowMaterial({ opacity: 0.18 });
    const shadowPlane = new THREE.Mesh(planeGeo, planeMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.1;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 7. Load GLB
    if (model?.glbBlobUrl) {
      loadGlbIntoScene(model.glbBlobUrl);
    }

    // 8. Animation Loop
    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotate;
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Listener
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, [model?.glbBlobUrl]);

  // Load GLB helper
  const loadGlbIntoScene = useCallback((url: string) => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove previous model if exists
    if (activeMeshGroupRef.current) {
      scene.remove(activeMeshGroupRef.current);
      activeMeshGroupRef.current = null;
    }

    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        const root = gltf.scene;
        activeMeshGroupRef.current = root;

        // Auto center and scale model
        const box = new THREE.Box3().setFromObject(root);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.8 / (maxDim || 1);
        root.scale.setScalar(scale);

        // Center on X and Z, place above ground plane
        box.setFromObject(root);
        box.getCenter(center);
        root.position.x -= center.x;
        root.position.z -= center.z;
        root.position.y = -box.min.y - 1.05;

        // Apply shadows and material enhancements
        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });

        scene.add(root);
      },
      undefined,
      (error) => {
        console.error('Failed to load GLB model in viewer:', error);
      }
    );
  }, []);

  // Update wireframe mode
  useEffect(() => {
    if (!activeMeshGroupRef.current) return;
    activeMeshGroupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => ((m as THREE.MeshStandardMaterial).wireframe = wireframeMode));
          } else {
            (mesh.material as THREE.MeshStandardMaterial).wireframe = wireframeMode;
          }
        }
      }
    });
  }, [wireframeMode]);

  // Update auto-rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
      controlsRef.current.autoRotateSpeed = 2.0;
    }
  }, [autoRotate]);

  // Reset Camera View
  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 1.2, 3.2);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  // Run Custom Settings (Height, Width, Colour)
  const handleRunCustomSettings = async () => {
    if (!activeMeshGroupRef.current) return;

    setIsApplyingCustom(true);
    setCustomSuccessMessage(false);

    try {
      const newSettings: ModelCustomSettings = {
        heightScale: customHeight,
        widthScale: customWidth,
        color: customColor,
      };

      // Apply settings to actual mesh geometry and material
      const updated = await applyCustomSettings(activeMeshGroupRef.current, newSettings);

      setCurrentGlbUrl(updated.glbBlobUrl);
      setCurrentFileSize(updated.fileSizeBytes);
      setCurrentStats({
        vertices: updated.vertexCount,
        faces: updated.faceCount,
      });

      // Notify parent to persist updated model
      if (model && onUpdateModel) {
        const updatedModel: GeneratedModel = {
          ...model,
          glbBlobUrl: updated.glbBlobUrl,
          glbArrayBuffer: updated.glbArrayBuffer,
          fileSizeBytes: updated.fileSizeBytes,
          vertexCount: updated.vertexCount,
          faceCount: updated.faceCount,
          customSettings: newSettings,
        };
        onUpdateModel(updatedModel);
      }

      setCustomSuccessMessage(true);
      setTimeout(() => setCustomSuccessMessage(false), 3000);
    } catch (err) {
      console.error('Error applying custom settings:', err);
      alert('Failed to update 3D model custom parameters.');
    } finally {
      setIsApplyingCustom(false);
    }
  };

  // Download GLB File
  const handleDownloadGlb = () => {
    if (!currentGlbUrl) {
      alert('3D model file is not ready for download.');
      return;
    }

    // Verify buffer if available
    if (model?.glbArrayBuffer) {
      const check = validateGlbBuffer(model.glbArrayBuffer);
      if (!check.valid) {
        alert(`Cannot download: ${check.error}`);
        return;
      }
    }

    const safeName = (model?.name || 'sketch2shape_model')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_');
    const filename = `${safeName}.glb`;

    const a = document.createElement('a');
    a.href = currentGlbUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!model) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <Box className="w-16 h-16 text-indigo-400 mb-4 stroke-[1.5]" />
        <h2 className="text-2xl font-bold text-slate-800">No Model Selected</h2>
        <p className="text-slate-600 max-w-sm mt-1 mb-6">
          Please sketch an outline or upload an image to generate your first 3D model.
        </p>
        <button
          onClick={() => onNavigate('explore')}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors cursor-pointer"
        >
          Explore Creation Methods
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('explore')}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm cursor-pointer transition-colors"
              title="Back to Explore"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {model.name}
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  {model.inputType === 'sketch' ? 'From Sketch' : 'From Image'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Generated {model.createdAt} • Binary glTF 2.0 (.glb)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Custom Button */}
            <button
              onClick={() => setShowCustom(!showCustom)}
              className={`px-4 py-2.5 rounded-xl border font-semibold text-sm flex items-center gap-2 cursor-pointer transition-all ${
                showCustom
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>Custom</span>
            </button>

            {/* Download GLB Button */}
            <button
              onClick={handleDownloadGlb}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-200 flex items-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download GLB</span>
            </button>
          </div>
        </div>

        {/* Customization Drawer (when user clicks "Custom") */}
        {showCustom && (
          <div className="mb-6 bg-white rounded-2xl border border-indigo-200 shadow-sm p-5 transition-all">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Custom Model Settings</h3>
              </div>
              <span className="text-xs text-slate-600">
                Adjust values and click <strong>Run</strong> to apply.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Height Adjustment */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Height
                  </label>
                  <span className="text-xs font-mono font-semibold text-indigo-600">
                    {customHeight.toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.2"
                  step="0.05"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                  <span>0.5x (Compact)</span>
                  <span>1.0x (Standard)</span>
                  <span>2.2x (Tall)</span>
                </div>
              </div>

              {/* 2. Width Adjustment */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Width
                  </label>
                  <span className="text-xs font-mono font-semibold text-indigo-600">
                    {customWidth.toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.2"
                  step="0.05"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                  <span>0.5x (Slim)</span>
                  <span>1.0x (Standard)</span>
                  <span>2.2x (Wide)</span>
                </div>
              </div>

              {/* 3. Colour Adjustment */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Colour
                </label>
                <div className="flex items-center gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.hex}
                      onClick={() => setCustomColor(preset.hex)}
                      style={{ backgroundColor: preset.hex }}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                        customColor === preset.hex
                          ? 'scale-110 border-indigo-600 ring-2 ring-indigo-200'
                          : 'border-white'
                      }`}
                      title={preset.label}
                    />
                  ))}
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-7 h-7 p-0 border-0 rounded-full cursor-pointer bg-transparent"
                    title="Custom color picker"
                  />
                </div>
              </div>
            </div>

            {/* Run Button to apply custom settings */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-600">
                {customSuccessMessage ? (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Custom settings applied and GLB updated successfully!
                  </span>
                ) : (
                  <span>Click Run to re-mesh and re-export the modified 3D model.</span>
                )}
              </div>
              <button
                onClick={handleRunCustomSettings}
                disabled={isApplyingCustom}
                className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-colors active:scale-95"
              >
                {isApplyingCustom ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Updating Mesh...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Main Model View Grid: 2D Input beside 3D Model */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Input Image Preview & Details */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Original 2D Input
                </span>
                <span className="text-[11px] text-slate-600">Source Asset</span>
              </div>

              {/* 2D Input Image Container */}
              <div className="w-full h-60 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center p-3 overflow-hidden shadow-inner">
                {model.inputThumbnail ? (
                  <img
                    src={model.inputThumbnail}
                    alt="Original Input"
                    className="max-h-full max-w-full object-contain rounded-md"
                  />
                ) : (
                  <div className="text-xs text-slate-400">No input image preview</div>
                )}
              </div>
            </div>

            {/* Model Geometry Specifications */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5 text-xs">
              <div className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-200">
                <Box className="w-3.5 h-3.5 text-indigo-600" />
                <span>3D Mesh Metrics</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Vertices:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {currentStats.vertices.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Triangles / Faces:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {currentStats.faces.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>File Size:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {(currentFileSize / 1024).toFixed(1)} KB
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Format:</span>
                <span className="font-mono font-semibold text-emerald-600">Binary glTF 2.0 (.glb)</span>
              </div>
            </div>

            {/* Creation CTA */}
            <div>
              <button
                onClick={() => onNavigate('explore')}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Create Another 3D Model</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive 3D Viewer */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col relative min-h-[480px]">
            {/* 3D Viewport Controls Bar */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                <span>3D Orbit View</span>
              </div>
            </div>

            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border shadow-sm cursor-pointer transition-colors ${
                  autoRotate
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white/90 text-slate-700 border-slate-200 hover:bg-white'
                }`}
                title="Toggle turntable auto-rotation"
              >
                Auto-Rotate
              </button>
              <button
                onClick={() => setWireframeMode(!wireframeMode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border shadow-sm cursor-pointer transition-colors ${
                  wireframeMode
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white/90 text-slate-700 border-slate-200 hover:bg-white'
                }`}
                title="Toggle wireframe display"
              >
                Wireframe
              </button>
              <button
                onClick={handleResetCamera}
                className="p-1.5 rounded-xl bg-white/90 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm cursor-pointer hover:bg-white transition-colors"
                title="Reset Camera Position"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Three.js Canvas Container */}
            <div
              ref={mountRef}
              className="w-full flex-1 min-h-[460px] bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-200/50 cursor-grab active:cursor-grabbing"
            />

            {/* Bottom Viewer Guidance Bar */}
            <div className="py-2.5 px-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600 gap-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                <span>Left click & drag to rotate • Scroll wheel or pinch to zoom • Right click to pan</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Validated 3D Geometry</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
