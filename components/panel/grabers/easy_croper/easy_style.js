import { withStyles } from '@mui/styles';

const styles = (theme) => ({
  cropContainer: {
    position: 'relative',
    width: '100%',
    height: 0,
    paddingBottom: '56.25%', // 16:9 aspect ratio (horizontal)
    background: '#333',
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
      paddingBottom: '56.25%', // Maintain same aspect ratio on desktop
    },
  },
  cropInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropImage: {
    width: 'auto', // Let width adjust based on height constraint
    height: '100%', // Constrain height to container
    maxWidth: '100%', // Prevent overflow
    objectFit: 'contain', // or 'cover' depending on your needs
  },
  cropButton: {
    flexShrink: 0,
    marginLeft: 16,
  },
  controls: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
  sliderContainer: {
    display: 'flex',
    flex: '1',
    alignItems: 'center',
  },
  sliderLabel: {
    [theme.breakpoints.down('xs')]: {
      minWidth: 65,
    },
  },
  slider: {
    padding: '22px 0px',
    marginLeft: 32,
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: '0 16px',
    },
  },
});

function EasyCropperComponent({ classes }) {
  return (
    <div>
      <div className={classes.cropContainer}>
        <div className={classes.cropInner}>
          {/* Your image component */}
          <img 
            src="your-image-source" 
            alt="Cropped" 
            className={classes.cropImage}
          />
        </div>
      </div>
      <div className={classes.controls}>
        {/* Your controls */}
      </div>
    </div>
  );
}

export default withStyles(styles)(EasyCropperComponent);