import loadingAnimation from '@/assets/loading.webm';

const LoadingVideoPlayer = () => (
  <div
    style={{
      width: '100%',
      height: '56.25vh',
      maxHeight: '720px',
      background: '#222',
      borderRadius: '12px',
      boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '1rem auto',
      position: 'relative',
    }}
  >
    <video
      src={loadingAnimation}
      autoPlay
      loop
      muted
      style={{
        width: '10rem',
        height: '10rem',
        objectFit: 'contain',
      }}
    />
    {/* Fake controls at the bottom */}
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        height: '8px',
        background: '#444',
        borderRadius: '4px',
      }}
    />
  </div>
);

export default LoadingVideoPlayer;
