// components/map/ParcelMap.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, 
  MenuItem, Select, InputLabel, FormControl, Box, Autocomplete, Checkbox, FormControlLabel,
  Paper, Typography, CircularProgress, Slider
} from '@mui/material';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const parcelIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const PAPER_MAP_URL = "https://api.ajur.app/public/complex/maps/shahrakkhane.jpg"; 

const MapEvents = ({ isAddingMode, onMapClick }) => {
  useMapEvents({
    click(e) {
      if (isAddingMode) onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const FlyToLocation = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 18, { duration: 1.5 });
  }, [center, map]);
  return null;
};

// 🎯 Custom Overlay that maintains Aspect Ratio and Fixes Mirroring
const AspectRatioImageOverlay = ({ url, bounds, opacity, rotation, scale }) => {
  const map = useMap();
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    const paneName = 'paperMapPane';
    if (!map.getPane(paneName)) {
      map.createPane(paneName);
      map.getPane(paneName).style.zIndex = 400;
      map.getPane(paneName).style.pointerEvents = 'none';
    }

    const img = document.createElement('img');
    img.src = url;
    img.style.position = 'absolute';
    img.style.opacity = opacity;
    img.style.transformOrigin = 'center center';
    img.style.maxWidth = 'none';
    
    // ⚠️ FIX: Flip the image horizontally and vertically to fix the mirroring issue
    img.style.transform = 'scaleX(-1) scaleY(-1)';
    
    map.getPane(paneName).appendChild(img);
    overlayRef.current = img;

    const updatePosition = () => {
      if (!overlayRef.current) return;
      
      const naturalWidth = img.naturalWidth || 1;
      const naturalHeight = img.naturalHeight || 1;
      const aspectRatio = naturalWidth / naturalHeight;

      const sw = L.latLng(bounds[0]);
      const ne = L.latLng(bounds[1]);

      const swPoint = map.latLngToLayerPoint(sw);
      const nePoint = map.latLngToLayerPoint(ne);

      let width = Math.abs(nePoint.x - swPoint.x);
      let height = width / aspectRatio;

      const centerLat = (sw.lat + ne.lat) / 2;
      const centerLng = (sw.lng + ne.lng) / 2;
      const centerPoint = map.latLngToLayerPoint(L.latLng(centerLat, centerLng));

      img.style.width = `${width}px`;
      img.style.height = `${height}px`;
      img.style.left = `${centerPoint.x - width / 2}px`;
      img.style.top = `${centerPoint.y - height / 2}px`;

      // Apply rotation, scale, AND the flip to fix mirroring
      img.style.transform = `rotate(${rotation}deg) scale(${scale}) scaleX(-1) scaleY(-1)`;
    };

    img.onload = () => {
      updatePosition();
      map.on('zoom viewreset move', updatePosition);
    };

    return () => {
      map.off('zoom viewreset move', updatePosition);
      if (img.parentNode) {
        img.parentNode.removeChild(img);
      }
    };
  }, [map, url, bounds, opacity, rotation, scale]);

  return null;
};

const ParcelMap = ({ complexId, center = [35.4935, 51.0415], isAdmin = false }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  const [parcels, setParcels] = useState([]);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [newLocation, setNewLocation] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [flyToCenter, setFlyToCenter] = useState(null);
  const [activeParcelId, setActiveParcelId] = useState(null);
  
  const [showPaperMap, setShowPaperMap] = useState(true);
  const [showTuner, setShowTuner] = useState(true); 

  const [rotation, setRotation] = useState(0); 
  const [scale, setScale] = useState(1); 
  
  const [bounds, setBounds] = useState([
    [35.498945, 51.031986], 
    [35.491887, 51.051383]  
  ]);

  const [formData, setFormData] = useState({
    parcel_number: '', area: '', property_type: 'زمین',
    distance_highway: '', distance_mosque: '', owner_phone: '',
    price: '', last_owner_price: '', description: '', ajar_link: ''
  });

  const fetchParcels = () => {
    fetch(`https://api.ajur.app/api/complexes/${complexId}/parcels`)
      .then(res => res.json())
      .then(data => setParcels(data))
      .catch(err => console.error("Error fetching parcels:", err));
  };

  useEffect(() => { if (isClient) fetchParcels(); }, [complexId, isClient]);

  const handleMapClickToAdd = (latlng) => {
    setNewLocation(latlng);
    setOpenModal(true);
    setIsAddingMode(false);
  };

  const handleSubmitForm = async () => {
    if (!newLocation) return;
    const payload = {
      ...formData, complex_id: complexId, coordinates: [newLocation], user_id: 1, 
    };
    try {
      const res = await fetch('https://api.ajur.app/api/parcels', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert("قطعه با موفقیت ثبت شد");
        setOpenModal(false); setNewLocation(null);
        setFormData({ parcel_number: '', area: '', property_type: 'زمین', distance_highway: '', distance_mosque: '', owner_phone: '', price: '', last_owner_price: '', description: '', ajar_link: '' });
        fetchParcels();
      } else { alert("خطا در ثبت قطعه."); }
    } catch (err) { console.error(err); }
  };

  const handleSearch = (event, value) => {
    if (!value) return;
    const foundParcel = parcels.find(p => p.parcel_number === value);
    if (foundParcel && foundParcel.coordinates && foundParcel.coordinates.length > 0) {
      const pos = Array.isArray(foundParcel.coordinates[0]) ? foundParcel.coordinates[0] : foundParcel.coordinates;
      setFlyToCenter(pos);
      setActiveParcelId(foundParcel.id);
    } else {
      alert("قطعه مورد نظر یافت نشد.");
    }
  };

  const handleShift = (direction) => {
    const step = 0.0001;
    setBounds(prev => {
      const newBounds = [...prev];
      if (direction === 'up') { newBounds[0][0] += step; newBounds[1][0] += step; }
      if (direction === 'down') { newBounds[0][0] -= step; newBounds[1][0] -= step; }
      if (direction === 'left') { newBounds[0][1] -= step; newBounds[1][1] -= step; }
      if (direction === 'right') { newBounds[0][1] += step; newBounds[1][1] += step; }
      return newBounds;
    });
  };

  if (!isClient) {
    return (
      <Box sx={{ height: '800px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>در حال بارگذاری نقشه...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', height: '800px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
      
      <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, width: '300px', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Autocomplete
          options={parcels.map(p => p.parcel_number)} 
          onChange={handleSearch}
          renderInput={(params) => (
            <TextField {...params} placeholder="جستجوی قطعه..." size="small" sx={{ backgroundColor: 'white', borderRadius: 1 }} InputProps={{ ...params.InputProps, startAdornment: <SearchIcon color="action" sx={{ ml: 1, mr: 1 }} /> }} />
          )}
        />
        
        <Paper sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <FormControlLabel
            control={<Checkbox checked={showPaperMap} onChange={(e) => setShowPaperMap(e.target.checked)} size="small" />}
            label={<Typography variant="body2">نمایش نقشه کاغذی</Typography>}
          />
          {isAdmin && (
             <FormControlLabel
               control={<Checkbox checked={showTuner} onChange={(e) => setShowTuner(e.target.checked)} size="small" color="warning" />}
               label={<Typography variant="body2" color="warning.main" fontWeight="bold">پنل تنظیم دستی (ادمین)</Typography>}
             />
          )}
        </Paper>
      </Box>

      <MapContainer center={center} zoom={16} style={{ height: '100%', width: '100%', cursor: isAddingMode ? 'crosshair' : 'grab' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {showPaperMap && (
          <AspectRatioImageOverlay 
            url={PAPER_MAP_URL} 
            bounds={bounds} 
            opacity={0.7} 
            rotation={rotation} 
            scale={scale}
          />
        )}

        <MapEvents isAddingMode={isAddingMode} onMapClick={handleMapClickToAdd} />
        {flyToCenter && <FlyToLocation center={flyToCenter} />}

        {parcels.map((parcel) => {
          const position = Array.isArray(parcel.coordinates[0]) ? parcel.coordinates[0] : parcel.coordinates;
          if (!position) return null;

          return (
            <Marker 
              key={parcel.id} 
              position={position} 
              icon={parcelIcon}
              eventHandlers={{ add: (e) => { if (parcel.id === activeParcelId) e.target.openPopup(); } }}
            >
              <Tooltip direction="top" offset={[0, -41]} opacity={1}>{`قطعه ${parcel.parcel_number}`}</Tooltip>
              <Popup>
                <div style={{ textAlign: 'right', direction: 'rtl', fontFamily: 'Tahoma', minWidth: '200px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#b92a31' }}>قطعه {parcel.parcel_number}</h3>
                  <p style={{ margin: '4px 0' }}>متراژ: {parcel.area || 'نامشخص'}</p>
                  <p style={{ margin: '4px 0' }}>نوع: {parcel.property_type}</p>
                  {parcel.ajar_link && (<Button href={parcel.ajar_link} target="_blank" variant="contained" size="small" style={{ marginTop: '10px', backgroundColor: '#b92a31' }}>مشاهده در آجر</Button>)}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {newLocation && <Marker position={newLocation} icon={parcelIcon} />}
      </MapContainer>

      {isAdmin && showTuner && (
        <Paper sx={{ position: 'absolute', bottom: 20, right: 20, zIndex: 1000, width: '340px', p: 2 }}>
          <Typography variant="subtitle2" gutterBottom color="warning.main" fontWeight="bold">
            <TuneIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
            تنظیم نقشه کاغذی
          </Typography>
          
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption">چرخش (Rotation): {rotation}°</Typography>
            <Slider value={rotation} min={-180} max={180} step={0.1} onChange={(e, v) => setRotation(v)} />
          </Box>

          <Box sx={{ mt: 1 }}>
            <Typography variant="caption">بزرگنمایی (Scale): {scale.toFixed(2)}</Typography>
            <Slider value={scale} min={0.1} max={3} step={0.01} onChange={(e, v) => setScale(v)} />
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            برای جابه‌جایی نقشه، از دکمه‌های زیر استفاده کنید:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'center' }}>
             <Button variant="outlined" size="small" onClick={() => handleShift('left')}>چپ</Button>
             <Button variant="outlined" size="small" onClick={() => handleShift('up')}>بالا</Button>
             <Button variant="outlined" size="small" onClick={() => handleShift('down')}>پایین</Button>
             <Button variant="outlined" size="small" onClick={() => handleShift('right')}>راست</Button>
          </Box>

          <Box sx={{ mt: 2, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1, fontFamily: 'monospace', fontSize: '11px' }}>
            <div>Rotation: {rotation}</div>
            <div>Scale: {scale.toFixed(2)}</div>
            <div>TL: {bounds[0][0].toFixed(5)}, {bounds[0][1].toFixed(5)}</div>
            <div>BR: {bounds[1][0].toFixed(5)}, {bounds[1][1].toFixed(5)}</div>
          </Box>
        </Paper>
      )}

      {isAdmin && (
        <Box sx={{ position: 'absolute', bottom: 20, left: 20, zIndex: 1000 }}>
          <Button 
            variant="contained" 
            startIcon={<AddLocationIcon />} 
            onClick={() => setIsAddingMode(true)} 
            sx={{ backgroundColor: isAddingMode ? '#ff9800' : '#1976d2', '&:hover': { backgroundColor: isAddingMode ? '#f57c00' : '#115293' } }}
          >
            {isAddingMode ? 'روی قطعه در نقشه کلیک کنید...' : 'افزودن قطعه'}
          </Button>
        </Box>
      )}

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
         <DialogTitle sx={{ textAlign: 'center', color: '#b92a31', fontWeight: 'bold' }}>مشخصات قطعه جدید</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '15px', paddingTop: '20px !important' }}>
          <Box sx={{ display: 'flex', gap: '15px' }}>
            <TextField label="شماره قطعه" variant="outlined" fullWidth value={formData.parcel_number} onChange={e => setFormData({...formData, parcel_number: e.target.value})} />
            <TextField label="متراژ" variant="outlined" fullWidth value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
          </Box>
          <Box sx={{ display: 'flex', gap: '15px' }}>
            <FormControl fullWidth>
              <InputLabel>نوع ملک</InputLabel>
              <Select value={formData.property_type} label="نوع ملک" onChange={e => setFormData({...formData, property_type: e.target.value})}>
                <MenuItem value="زمین">زمین</MenuItem>
                <MenuItem value="ویلای نیمه ساز">ویلای نیمه ساز</MenuItem>
                <MenuItem value="ویلای کامل">ویلای کامل</MenuItem>
              </Select>
            </FormControl>
            <TextField label="شماره مالک" variant="outlined" fullWidth value={formData.owner_phone} onChange={e => setFormData({...formData, owner_phone: e.target.value})} />
          </Box>
          <Box sx={{ display: 'flex', gap: '15px' }}>
            <TextField label="فاصله از اتوبان (متر)" variant="outlined" fullWidth value={formData.distance_highway} onChange={e => setFormData({...formData, distance_highway: e.target.value})} />
            <TextField label="فاصله از مسجد (متر)" variant="outlined" fullWidth value={formData.distance_mosque} onChange={e => setFormData({...formData, distance_mosque: e.target.value})} />
          </Box>
          <Box sx={{ display: 'flex', gap: '15px' }}>
            <TextField label="قیمت" variant="outlined" fullWidth value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            <TextField label="آخرین قیمت مالک" variant="outlined" fullWidth value={formData.last_owner_price} onChange={e => setFormData({...formData, last_owner_price: e.target.value})} />
          </Box>
          <TextField label="لینک آجر" variant="outlined" fullWidth value={formData.ajar_link} onChange={e => setFormData({...formData, ajar_link: e.target.value})} />
          <TextField label="توضیحات" variant="outlined" fullWidth multiline rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </DialogContent>
        <DialogActions sx={{ padding: '15px 24px' }}>
          <Button onClick={() => { setOpenModal(false); setNewLocation(null); }} color="inherit">انصراف</Button>
          <Button onClick={handleSubmitForm} variant="contained" sx={{ backgroundColor: '#b92a31' }}>ذخیره در دیتابیس</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ParcelMap;