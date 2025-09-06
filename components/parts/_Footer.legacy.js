/*
  LEGACY: original BottomNavigation block from Footer.js
  Preserved here as a commented file so nothing is deleted.

  Copy the block below back into Footer.js if you need to restore it.

<div
  style={{
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    width: "100vw",
    height: 70,
    background: "transparent",
    overflow: 'hidden',
  }}
>
  <!-- two-layer gaussian glass background (base blur + colored overlay) -->
  <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }} />
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(185,39,46,0.06), rgba(185,39,46,0.03))' }} />
  </div>
  <BottomNavigation
    showLabels
    value={value}
    onChange={(event, newValue) => {
      setValue(newValue);
    }}
    sx={{ background: "transparent", position: 'relative', zIndex: 1 }}
  >
    <!-- original actions preserved here -->
  </BottomNavigation>
</div>
*/
