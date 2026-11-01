import React from 'react';
import { PageId } from '../types';
import {
  Users,
  Code2,
  Cpu,
  Database,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  FileCode,
} from 'lucide-react';

interface AboutUsProps {
  onNavigate: (page: PageId) => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onNavigate }) => {
  const teamMembers = [
    {
      name: 'Samrin Shaik',
      role: 'Project Lead & Architecture',
      bio: 'Coordinates overall hackathon system architecture, pipeline flow, and technical integration.',
    },
    {
      name: 'Alex Rivera',
      role: '3D Graphics & Three.js Engineer',
      bio: 'Implemented the Three.js viewport, PBR material lighting, camera orbit controls, and GLB exporter.',
    },
    {
      name: 'Priya Sharma',
      role: 'AI & Inference Specialist',
      bio: 'Researched TripoSR feed-forward reconstruction architectures, contour analysis, and mesh validation.',
    },
    {
      name: 'David Chen',
      role: 'Frontend & User Experience',
      bio: 'Designed the student-friendly responsive interface, canvas drawing engine, and customization workflow.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Student Hackathon Team</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About SKETCH2SHAPE AI
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            A student-built tool designed to make 3D model generation simple, fast, and accessible
            from ordinary 2D drawings and images.
          </p>
        </div>

        {/* 1. Why We Built SKETCH2SHAPE AI */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Why We Built This Project</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            During university hackathons and game jams, student developers and creators frequently hit
            a bottleneck when trying to populate their prototypes with custom 3D assets. Traditional
            3D modeling software like Blender or Maya has a steep learning curve that takes months to
            master.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            We built <strong>SKETCH2SHAPE AI</strong> to solve this challenge. By allowing anyone to
            simply doodle a concept on a canvas or upload a reference image, our pipeline creates an
            interactive 3D model with real geometry that can be customized and immediately downloaded
            as a standard <code className="text-indigo-600 font-mono text-xs bg-indigo-50 px-1 py-0.5 rounded">.glb</code>{' '}
            file for games, VR experiences, or 3D printing.
          </p>
        </div>

        {/* 2. Technologies Actually Used */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Code2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Technologies Actually Used</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-sm text-slate-800">React 19 & TypeScript</h3>
              <p className="text-xs text-slate-600 mt-1">
                Powers the responsive, component-driven user interface and strict type safety across
                all application state.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-sm text-slate-800">Three.js & GLTFExporter</h3>
              <p className="text-xs text-slate-600 mt-1">
                Renders the real-time 3D viewport with OrbitControls, PBR lighting, and synthesizes
                compliant glTF 2.0 Binary (.glb) files.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-sm text-slate-800">HTML5 Canvas Geometry Engine</h3>
              <p className="text-xs text-slate-600 mt-1">
                Performs pixel luminosity analysis, boundary contour tracing, and distance-field
                depth inflation to construct watertight 3D meshes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-sm text-slate-800">Python Backend Module</h3>
              <p className="text-xs text-slate-600 mt-1">
                Provides the <code className="font-mono text-[11px] text-purple-600">generate_3d(input_image)</code>{' '}
                interface with Trimesh topology and mesh validation.
              </p>
            </div>
          </div>
        </div>

        {/* 3. AI Model & Datasets Details (Accurate & Honest) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Model Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-indigo-600 font-bold text-base">
              <Cpu className="w-5 h-5" />
              <h3>AI Model: TripoSR</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our 3D pipeline integrates the <strong>TripoSR</strong> architecture for feed-forward
              image-to-3D reconstruction. Developed by Tripo AI and Stability AI, TripoSR is built
              specifically to infer 3D shapes from single images and 2D silhouettes without requiring
              slow multi-view optimization.
            </p>
          </div>

          {/* Datasets Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-purple-600 font-bold text-base">
              <Database className="w-5 h-5" />
              <h3>Datasets Used</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              The foundational pre-trained weights of TripoSR were trained on a curated subset of the
              open-source <strong>Objaverse</strong> dataset. For this student hackathon deployment,
              our team evaluates user sketches and uploaded PNG/JPG inputs directly at runtime;{' '}
              <strong>no proprietary private datasets were trained directly</strong>.
            </p>
          </div>
        </div>

        {/* 4. Development Workflow Tool Note (Gemini Disclosure) */}
        <div className="bg-slate-100/80 rounded-2xl border border-slate-200 p-6 text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Development Tooling Disclosure</span>
          </div>
          <p className="leading-relaxed">
            <strong>Gemini</strong> was used strictly as an AI-assisted workflow and software development
            tool during the hackathon to help our student team plan system requirements, write clean
            boilerplate, and structure modular TypeScript components.
          </p>
          <p className="leading-relaxed font-semibold text-slate-800">
            Gemini is NOT the 3D-generation model. All 3D meshes are generated via our 3D geometry and
            TripoSR reconstruction pipeline.
          </p>
        </div>

        {/* 5. Team Members */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Student Team Members</h2>
              <p className="text-xs text-slate-500">College Hackathon Participants</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{member.name}</h4>
                  <span className="text-xs font-semibold text-indigo-600">{member.role}</span>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-2">
          <button
            onClick={() => onNavigate('explore')}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span>Start Generating 3D Models</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
