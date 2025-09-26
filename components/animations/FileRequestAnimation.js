import Lottie from "lottie-react";
import animationData from "./Travel Icons - Map.json"; // adjust path as needed

function FileRequestAnimation() {
    return (
        <div style={{ width: 180, height: 180, margin: '0 auto' }}>
            <Lottie
                animationData={animationData}
                loop={false}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
}

export default FileRequestAnimation;
