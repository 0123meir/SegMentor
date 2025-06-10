const ProgressBar = () => {
  return (
    <div className="relative w-11/12 mt-2 h-2 rounded-xl overflow-hidden bg-white/10 backdrop-blur-md border-none border-white/20 justify-self-center">
          <div
            className="absolute top-0 left-0 h-full w-1/3 bg-white/40 rounded-xl"
            style={{
              animation: "slide .5s ease-in-out infinite",
            }}
          />
          <style>{`
            @keyframes slide {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(300%); }
            }
          `}</style>
        </div>
  )
}

export default ProgressBar