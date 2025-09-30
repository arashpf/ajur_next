import Lottie from "lottie-react";
import animationData from "./Travel Icons - Map.json"; // adjust path as needed

function FileRequestAnimation() {
    // make this flexible so the parent can control exact width/height
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Lottie
                animationData={animationData}
                loop={false}
                autoplay={true}
                style={{ width: '100%', height: '100%', display: 'block' }}
            />
        </div>
    );
}

export default FileRequestAnimation;
