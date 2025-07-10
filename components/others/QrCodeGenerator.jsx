import { useState, useRef } from "react";
// other previous imports
import QRCode from "react-qr-code";

function QrCodeGenerator(props) {
  const [qrIsVisible, setQrIsVisible] = useState(true);
  const [url, setUrl] = useState(props.url);

  const handleQrCodeGenerator = () => {
    if (!url) {
      return;
    }
    setQrIsVisible(true);
  };
  // useState variables and the handleQrCodeGenerator previously defined   will be here

  return (
    <div className="qrcode__container">
      {qrIsVisible && (
        <div className="qrcode__download">
          <div className="qrcode__image">
            <QRCode value={url} size={100} />
          </div>
        </div>
      )}
    </div>
  );
}
export default QrCodeGenerator;
