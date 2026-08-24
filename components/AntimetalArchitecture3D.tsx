'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Link from 'next/link';
import { ArrowDown, ArrowUp, Cpu, ChevronRight } from 'lucide-react';

interface ArchitectureStep {
  id: string;
  badge: string;
  title: string;
  description: string;
  activeLayers: number[]; // which layers to display/expand
  stats?: { label: string; value: string }[];
}

const STEPS: ArchitectureStep[] = [
  {
    id: 'vision',
    badge: 'THE VISION',
    title: 'Outbound should close itself.',
    description:
      'Prospecting is too fragmented and manual to scale by hand. Sales leaders should set ICP direction, refine offer strategy, and close high-intent buyers. The rest of the pipeline should run autonomously.',
    activeLayers: [0, 3],
    stats: [
      { label: 'Manual Prospecting', value: '0 hrs/wk' },
      { label: 'Pipeline Velocity', value: '4.8x' },
    ],
  },
  {
    id: 'agents',
    badge: 'THE AGENT SWARM',
    title: 'An army of autonomous scouts.',
    description:
      'LeadDrive deploys autonomous scrapers and enrichment agents that scout Google Maps, Apollo, and social footprints 24/7. Every contact is verified with multi-vector deliverability checks before dispatch.',
    activeLayers: [0, 1, 3],
    stats: [
      { label: 'Lead Verification', value: '99.8%' },
      { label: 'Scouting Capacity', value: '50k/day' },
    ],
  },
  {
    id: 'engine',
    badge: 'THE PROTOTYPE LAB',
    title: 'A layer that builds live proof.',
    description:
      'At its core sits a live headless rendering engine. LeadDrive crawls prospect sites, pinpoints conversion leaks, and synthesizes bespoke interactive redesign prototypes in under 15 seconds.',
    activeLayers: [0, 1, 2, 3],
    stats: [
      { label: 'Synthesis Time', value: '<15s' },
      { label: 'Demo CTR', value: '38.4%' },
    ],
  },
  {
    id: 'telemetry',
    badge: 'THE TELEMETRY LOOP',
    title: 'Real-time buyer engagement telemetry.',
    description:
      'When a prospect interacts with a custom demo prototype, live telemetry fires instant Slack/CRM notifications with deep session heatmaps so your reps strike at peak buying intent.',
    activeLayers: [0, 1, 2, 3],
    stats: [
      { label: 'Instant Alerts', value: '<200ms' },
      { label: 'Reply Rate', value: '14.2%' },
    ],
  },
];

const LAYER_CONFIGS = [
  {
    title: 'Your Sales Team',
    subtitle: 'Defines target ICP, value propositions, and closes deals.',
    accent: '#2563eb',
    tag: 'STRATEGY LAYER',
  },
  {
    title: 'LeadDrive Autonomous Agents',
    subtitle: 'Army of 24/7 scrapers, enrichers, and email deliverability specialists.',
    accent: '#3b82f6',
    tag: 'AUTONOMOUS RUNTIME',
  },
  {
    title: 'LeadDrive Redesign & Prototype Lab',
    subtitle: 'Headless rendering engine that generates interactive prospect redesigns.',
    accent: '#0284c7',
    tag: 'SYNTHESIS ENGINE',
  },
  {
    title: 'Prospect Inboxes & Decision Makers',
    subtitle: 'Target executive inboxes, interactive demo views, and CRM telemetry.',
    accent: '#10b981',
    tag: 'DELIVERY & TELEMETRY',
  },
];

export default function AntimetalArchitecture3D() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const currentStep = STEPS[currentStepIndex];

  // Three.js Scene Setup & Animation
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = null; // transparent background

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(13, 11, 17);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x3b82f6, 2.2);
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x60a5fa, 1.4);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    // Main 3D Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Grid Floor Helper for Architectural Feel
    const gridHelper = new THREE.GridHelper(18, 18, 0xdbeafe, 0xeff6ff);
    gridHelper.position.y = -5.5;
    rootGroup.add(gridHelper);

    // Build 4 Architectural Floating Layer Planes
    const layerPlanes: THREE.Group[] = [];
    const planeWidth = 9.5;
    const planeDepth = 5.2;

    const layerYPositions = [3.6, 1.2, -1.2, -3.6];

    LAYER_CONFIGS.forEach((config, idx) => {
      const planeGroup = new THREE.Group();
      planeGroup.position.set(0, layerYPositions[idx], 0);

      // 1. Frosted Translucent Glass Plane
      const planeGeo = new THREE.PlaneGeometry(planeWidth, planeDepth);
      const planeMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.88,
        roughness: 0.15,
        transmission: 0.35,
        reflectivity: 0.8,
        clearcoat: 0.4,
        side: THREE.DoubleSide,
      });
      const planeMesh = new THREE.Mesh(planeGeo, planeMat);
      planeMesh.rotation.x = -Math.PI / 2;
      planeGroup.add(planeMesh);

      // 2. Fine Architectural Wireframe Border
      const edges = new THREE.EdgesGeometry(planeGeo);
      const lineMat = new THREE.LineBasicMaterial({
        color: idx === 0 || idx === 3 ? 0x94a3b8 : 0x3b82f6,
        linewidth: 1.5,
        transparent: true,
        opacity: 0.85,
      });
      const wireframe = new THREE.LineSegments(edges, lineMat);
      wireframe.rotation.x = -Math.PI / 2;
      planeGroup.add(wireframe);

      // 3. Precision Corner Brackets (Antimetal Signature)
      const bracketSize = 0.5;
      const bracketMat = new THREE.LineBasicMaterial({
        color: 0x1e293b,
        linewidth: 2,
      });

      const corners = [
        [-planeWidth / 2, -planeDepth / 2],
        [planeWidth / 2, -planeDepth / 2],
        [planeWidth / 2, planeDepth / 2],
        [-planeWidth / 2, planeDepth / 2],
      ];

      corners.forEach(([cx, cz], cIdx) => {
        const signX = cIdx === 0 || cIdx === 3 ? 1 : -1;
        const signZ = cIdx === 0 || cIdx === 1 ? 1 : -1;

        const points = [
          new THREE.Vector3(cx + signX * bracketSize, 0.02, cz),
          new THREE.Vector3(cx, 0.02, cz),
          new THREE.Vector3(cx, 0.02, cz + signZ * bracketSize),
        ];
        const bracketGeo = new THREE.BufferGeometry().setFromPoints(points);
        const bracketLine = new THREE.Line(bracketGeo, bracketMat);
        planeGroup.add(bracketLine);
      });

      // 4. Subtle Inner Grid on plane
      const innerGrid = new THREE.GridHelper(planeWidth * 0.9, 8, 0xeff6ff, 0xf1f5f9);
      innerGrid.position.y = 0.01;
      planeGroup.add(innerGrid);

      rootGroup.add(planeGroup);
      layerPlanes.push(planeGroup);
    });

    // 4 Corner Vertical Projection Lines (Connecting the Layers)
    const cornerPositions = [
      new THREE.Vector2(-planeWidth / 2, -planeDepth / 2),
      new THREE.Vector2(planeWidth / 2, -planeDepth / 2),
      new THREE.Vector2(planeWidth / 2, planeDepth / 2),
      new THREE.Vector2(-planeWidth / 2, planeDepth / 2),
    ];

    const cornerLineMat = new THREE.LineDashedMaterial({
      color: 0x93c5fd,
      dashSize: 0.25,
      gapSize: 0.15,
      transparent: true,
      opacity: 0.7,
    });

    cornerPositions.forEach((corner) => {
      const points = [
        new THREE.Vector3(corner.x, layerYPositions[0], corner.y),
        new THREE.Vector3(corner.x, layerYPositions[3], corner.y),
      ];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, cornerLineMat);
      line.computeLineDistances();
      rootGroup.add(line);
    });

    // 3D Animated Floating Data Stream Particles
    const particleCount = 140;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const cIdx = Math.floor(Math.random() * 4);
      const corner = cornerPositions[cIdx];
      const jitterX = (Math.random() - 0.5) * 0.2;
      const jitterZ = (Math.random() - 0.5) * 0.2;

      particlePositions[i * 3] = corner.x + jitterX;
      particlePositions[i * 3 + 1] = layerYPositions[3] + Math.random() * (layerYPositions[0] - layerYPositions[3]);
      particlePositions[i * 3 + 2] = corner.y + jitterZ;
      particleSpeeds[i] = 0.02 + Math.random() * 0.035;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x2563eb,
      size: 0.22,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particleSystem);

    // 3D Rotating Neural Swarm Cluster (Floating beside Layer 2)
    const clusterGroup = new THREE.Group();
    clusterGroup.position.set(5.8, 0, 0);

    const nodeCount = 18;
    const nodeGeometry = new THREE.SphereGeometry(0.14, 16, 16);
    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });

    const nodePoints: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.3 + Math.random() * 0.6;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
      nodeMesh.position.set(x, y, z);
      clusterGroup.add(nodeMesh);
      nodePoints.push(new THREE.Vector3(x, y, z));
    }

    // Connect node points with lines
    const lineIndices: number[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodePoints[i].distanceTo(nodePoints[j]) < 1.4) {
          lineIndices.push(i, j);
        }
      }
    }

    const clusterLineGeo = new THREE.BufferGeometry().setFromPoints(nodePoints);
    clusterLineGeo.setIndex(lineIndices);
    const clusterLineMat = new THREE.LineBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.45,
    });
    const clusterLines = new THREE.LineSegments(clusterLineGeo, clusterLineMat);
    clusterGroup.add(clusterLines);
    rootGroup.add(clusterGroup);

    // Mouse Interaction Tracking
    let targetRotX = 0.08;
    let targetRotY = -0.15;
    let targetCamY = 11;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

      targetRotY = mouseX * 0.45;
      targetRotX = mouseY * 0.35 + 0.08;
      targetCamY = 11 - mouseY * 3;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera and rotation lerp
      rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.06;
      rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.06;
      camera.position.y += (targetCamY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Rotate Neural Cluster
      clusterGroup.rotation.y = elapsedTime * 0.4;
      clusterGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2;
      clusterGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.2;

      // Animate particles flowing between layers
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        let y = positions[i * 3 + 1];
        y += particleSpeeds[i];

        if (y > layerYPositions[0]) {
          y = layerYPositions[3];
        }
        positions[i * 3 + 1] = y;
      }
      posAttr.needsUpdate = true;

      // Pulse and adjust layer positions based on active step and hover
      layerPlanes.forEach((plane, idx) => {
        const isHovered = hoveredLayer === idx;
        const targetY = layerYPositions[idx] + (isHovered ? 0.35 : Math.sin(elapsedTime * 1.5 + idx * 0.8) * 0.05);
        plane.position.y += (targetY - plane.position.y) * 0.1;

        if (isHovered) {
          plane.scale.set(1.03, 1.03, 1.03);
        } else {
          plane.scale.set(1, 1, 1);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Teardown
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [hoveredLayer]);

  const handleNextStep = () => {
    setCurrentStepIndex((prev) => (prev + 1) % STEPS.length);
  };

  const handlePrevStep = () => {
    setCurrentStepIndex((prev) => (prev - 1 + STEPS.length) % STEPS.length);
  };

  return (
    <section id="architecture" className="py-24 sm:py-32 px-4 sm:px-6 bg-[#f8fafc] border-t border-b border-gray-200/80 relative overflow-hidden">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 sm:mb-20 pb-8 border-b border-gray-200/90">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-[11px] font-extrabold uppercase tracking-wider mb-4 shadow-2xs">
              <Cpu className="w-3.5 h-3.5" />
              Autonomous Architecture &amp; World Model
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-950 leading-tight">
              A layer that owns the outbound runtime.
            </h2>
          </div>

          <p className="text-sm sm:text-base text-gray-600 max-w-md leading-relaxed font-normal">
            Continuous prospecting intelligence with real-time website rendering, dynamic prototype synthesis, and multi-vector inbox delivery.
          </p>
        </div>

        {/* Antimetal Split Architecture Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: Antimetal High-Contrast Vision Cards & Interactive Step Navigator */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Active Vision Card (Dark Antimetal Block) */}
            <div className="bg-[#0a0f1d] text-white rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(10,15,29,0.3)] border border-gray-800 relative overflow-hidden transition-all duration-500">
              
              {/* Subtle top ambient glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-400">
                  {currentStep.badge}
                </span>
                <span className="text-[11px] font-mono text-gray-400 bg-white/10 px-2.5 py-0.5 rounded-full">
                  0{currentStepIndex + 1} / 0{STEPS.length}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-4 leading-snug">
                {currentStep.title}
              </h3>

              <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed mb-8">
                {currentStep.description}
              </p>

              {/* Stats Bar */}
              {currentStep.stats && (
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                  {currentStep.stats.map((stat, i) => (
                    <div key={i}>
                      <div className="text-xs text-gray-400 font-medium mb-1">{stat.label}</div>
                      <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-blue-400">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step Selection Pills / Thumbnails */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {STEPS.map((step, idx) => {
                const isActive = currentStepIndex === idx;
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`text-left p-3.5 rounded-2xl border transition-all min-h-[44px] ${
                      isActive
                        ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-600/10'
                        : 'bg-white/60 hover:bg-white border-gray-200/80 text-gray-600'
                    }`}
                  >
                    <div className="text-[10px] font-mono font-bold text-gray-400 mb-1">0{idx + 1}</div>
                    <div className={`text-xs font-bold truncate ${isActive ? 'text-blue-600' : 'text-gray-800'}`}>
                      {step.badge.replace('THE ', '')}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action CTA & Arrow Controllers */}
            <div className="flex items-center justify-between pt-4">
              <Link
                href="/signup"
                className="relink-pill-btn relink-btn-blue text-xs font-bold px-7 py-3 inline-flex items-center gap-2 min-h-[44px]"
              >
                <span>Deploy Outbound Swarm</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              {/* Antimetal Signature Bottom Arrow Controls */}
              <div className="flex items-center gap-2 bg-white p-1.5 rounded-full border border-gray-200 shadow-xs">
                <button
                  onClick={handlePrevStep}
                  aria-label="Previous step"
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-700 transition-colors"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextStep}
                  aria-label="Next step"
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-700 transition-colors"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Three.js 3D Interactive Isometric Layer Stack & HUD */}
          <div className="lg:col-span-7">
            <div className="relative bg-white rounded-3xl sm:rounded-[2.5rem] border border-gray-200/90 shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-4 sm:p-6 overflow-hidden">
              
              {/* Top 3D Stack HUD Banner */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                  <span className="font-mono font-bold text-gray-800 text-[11px]">THREE.JS RUNTIME: LIVE STACK</span>
                </div>
                <div className="text-[11px] font-mono text-gray-400 hidden sm:block">
                  ROTATION: ISOMETRIC PERSPECTIVE
                </div>
              </div>

              {/* 3D WebGL Canvas Viewport */}
              <div
                ref={canvasContainerRef}
                className="w-full h-[400px] sm:h-[480px] cursor-grab active:cursor-grabbing relative"
              />

              {/* Interactive Layer Cards Floating Legend / Inspector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                {LAYER_CONFIGS.map((layer, idx) => {
                  const isHovered = hoveredLayer === idx;
                  const isLayerActive = currentStep.activeLayers.includes(idx);

                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredLayer(idx)}
                      onMouseLeave={() => setHoveredLayer(null)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isHovered
                          ? 'bg-blue-50/80 border-blue-500 shadow-sm scale-[1.02]'
                          : isLayerActive
                          ? 'bg-[#fcfdfe] border-gray-200/90'
                          : 'bg-gray-50/50 border-gray-100 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: layer.accent }}
                          />
                          <span className="font-extrabold text-xs text-gray-900">{layer.title}</span>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-gray-400 tracking-wider">
                          L0{idx + 1}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-normal leading-relaxed">
                        {layer.subtitle}
                      </p>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
