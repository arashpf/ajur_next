import * as THREE from "three";
import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";
import VirtualTourLayout from "../layouts/VirtualTourLayout";

import LogPanoPosition from "../LogPanoPosition";
import SectionNav from "./SectionNav";
import VirtualTourVoice from "./VirtualTourVoice";
import LoadingScreen, {
  NoDataScreen,
} from "./LoadingScreen";
function CameraController({ initialYaw, initialPosition = [0, 0, 0.1] }) {
  const { camera } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    camera.position.set(...initialPosition);
    if (initialYaw !== undefined && controlsRef.current) {
      const yawRad = THREE.MathUtils.degToRad(initialYaw);
      controlsRef.current.setAzimuthalAngle(yawRad);
      controlsRef.current.update();
    }
  }, [initialYaw, initialPosition]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={true}
      enablePan={false}
      minDistance={1}
      maxDistance={10}
      rotateSpeed={-0.5}
      target={[0, 0, 0]}
    />
  );
}

function Dome({ texture }) {
  return (
    <mesh>
      <sphereBufferGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function Hotspot({ name, position, onClick }) {
  return (
    <group position={position}>
      <Html center>
        <div
          onClick={onClick}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "60px",
            height: "60px",
            padding: "0",
            background:
              "radial-gradient(circle at center, rgba(0, 242, 255, 0.8) 0%, rgba(0, 68, 102, 0.8) 100%)",
            color: "#ffffff",
            border: "2px solid rgba(185, 42, 49, 0.7)",
            borderRadius: "50%",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow:
              "0 0 12px rgba(185, 42, 49, 0.7), 0 0 20px rgba(0,255,255,0.3)",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            backdropFilter: "blur(6px)",
            transform: "translateY(20px)",
            transition: "all 0.2s ease-in-out",
            opacity: "0.9",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1) translateY(20px)";
            e.currentTarget.style.boxShadow =
              "0 0 20px rgba(185, 42, 49, 0.8), 0 0 30px rgba(0,255,255,0.4)";
            e.currentTarget.style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1.0) translateY(20px)";
            e.currentTarget.style.boxShadow =
              "0 0 12px rgba(185, 42, 49, 0.7), 0 0 20px rgba(0,255,255,0.3)";
            e.currentTarget.style.opacity = "0.9";
          }}
        >
          {name}
        </div>
      </Html>
    </group>
  );
}

function Portals({ panoramas, currentIndex, setCurrentIndex }) {
  const textures = useLoader(
    THREE.TextureLoader,
    panoramas.map((p) => p.panorama_url)
  );
  const currentPanorama = panoramas[currentIndex];
  const currentTexture = textures[currentIndex];
  const hotspots = currentPanorama?.hotspots || [];
  const initialYaw = currentPanorama?.metadata?.initial_yaw || 0;
  const initialPosition = currentPanorama?.metadata?.initial_position || [
    0, 0, 0.1,
  ];
  

  const handleHotspotClick = (targetPanoramaId) => {
    const newIndex = panoramas.findIndex((p) => p.id === targetPanoramaId);
    if (newIndex !== -1) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <>
      <CameraController
        initialYaw={initialYaw}
        initialPosition={initialPosition}
      />
      {currentTexture && <Dome texture={currentTexture} />}

      {hotspots.map((hotspot, i) => {
        const targetPanorama = panoramas.find(
          (p) => p.id == hotspot.target_panorama_id
        );
        if (!targetPanorama) return null;

        return (
          <Hotspot
            key={i}
            name={targetPanorama.name || `پانوراما ${i + 1}`}
            position={[
              hotspot.x_position,
              hotspot.y_position,
              hotspot.z_position,
            ]}
            onClick={() => handleHotspotClick(targetPanorama.id)}
          />
        );
      })}
    </>
  );
}

function VirtualTourPage() {
  const router = useRouter();
  const { id } = router.query;
  const [panoramas, setPanoramas] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [currentPanoramaIndex, setCurrentPanoramaIndex] = useState(0);
  const [currentPanoramaId, setCurrentPanoramaId] = useState(null);

  useEffect(() => {
    if (!id) return;

    const loadTourData = async () => {
      try {
        setLoading(true);
        const tourRes = await axios.get(
          `https://api.ajur.app/api/virtual-tour?worker_id=${id}`
        );
        const sectionsRes = await axios.get(
          `https://api.ajur.app/api/virtual-tours/${tourRes.data.id}/sections`
        );
        setSections(sectionsRes.data);

        const panoramaPromises = sectionsRes.data.map((section) =>
          axios.get(`https://api.ajur.app/api/sections/${section.id}/panoramas`)
        );

        const panoramasRes = await Promise.all(panoramaPromises);
        const allPanoramas = panoramasRes.flatMap((res) => res.data);
        setPanoramas(allPanoramas);

        if (sectionsRes.data.length > 0) {
          setCurrentSectionId(sectionsRes.data[0].id);
        }
      } catch (error) {
        console.error("Failed to load tour:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTourData();
  }, [id]);

  useEffect(() => {
    if (panoramas.length > 0 && currentPanoramaIndex < panoramas.length) {
      const currentPanorama = panoramas[currentPanoramaIndex];
      setCurrentSectionId(currentPanorama.section_id);
    }
  }, [currentPanoramaIndex, panoramas]);

  if (loading) return <LoadingScreen />;
  if (!panoramas.length) return <NoDataScreen />;

  return (
    <>
      <Head>
        <title>تور مجازی آجر</title>
      </Head>
      <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
        <Canvas
          style={{ height: "100vh", width: "100vw", background: "black" }}
          camera={{ position: [0, 0, 0.1], fov: 75 }}
        >
          <ambientLight intensity={0.5} />
          <Suspense fallback={null}>
            {/* <Portals 
              panoramas={panoramas} 
              currentIndex={currentPanoramaIndex}
              setCurrentIndex={setCurrentPanoramaIndex}
            /> */}

            <Portals
              panoramas={panoramas}
              currentIndex={currentPanoramaIndex}
              setCurrentIndex={(index) => {
                setCurrentPanoramaIndex(index);
                setCurrentPanoramaId(panoramas[index]?.id);
              }}
            />
          </Suspense>
        </Canvas>

        <VirtualTourVoice
          currentSection={currentSectionId}
          currentPanorama={currentPanoramaId}
          sections={sections}
          panoramas={panoramas}
        />

        {sections.length > 0 && (
          <SectionNav
            sections={sections}
            currentSectionId={currentSectionId}
            onSectionChange={setCurrentSectionId}
            panoramas={panoramas}
            setCurrentPanoramaIndex={setCurrentPanoramaIndex}
          />
        )}
      </div>
    </>
  );
}

export default VirtualTourPage;

VirtualTourPage.getLayout = function (page) {
  return <VirtualTourLayout>{page}</VirtualTourLayout>;
};
