// pages/tour/[id].js
import dynamic from "next/dynamic";
import VirtualTourLayout from "../../components/layouts/VirtualTourLayout";

// Dynamically import the tour page (client-side only)
const VirtualTourPage = dynamic(() => import("../../components/panorama/VirtualTourActual"), {
  ssr: false,
});

// Define the wrapper component
function PageWrapper() {
  return <VirtualTourPage />;
}

// 🔥 Attach the layout to the wrapper (the default export)
PageWrapper.getLayout = function (page) {
  return <VirtualTourLayout>{page}</VirtualTourLayout>;
};

export default PageWrapper;

