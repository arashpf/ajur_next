import dynamic from "next/dynamic";
import { useRouter } from "next/router";


// Dynamically load the map to prevent SSR errors
const Location = dynamic(() => import("../../components/map/Location"), {
  ssr: false,
});

export default function MapPage() {
  const place = { lat: 35.6997, long: 51.3380 }; 
//   const place = { lat: 35.7448, long: 51.3755};

const router = useRouter();
  
  const handleDownloadClick = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    router.push('/download'); // Navigate to your download page
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Full-screen map */}
      <Location details={place} />

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        <div>
          <p className="text-sm m-4">برای استفاده از نقشه و تمامی امکانات آن لطفاً اپلیکیشن آجر را نصب کنید</p>
          <button
            onClick={handleDownloadClick} // Added click handler
             className="bg-[#bc323a] text-white px-4 py-2 rounded-lg no-underline font-bold transition-colors duration-300 whitespace-nowrap ml-2.5 hover:bg-[#99272d]"

          >نصب</button>
        </div>
      </div>
    </div>
  );
}
