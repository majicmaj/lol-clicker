const PlayButton = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <button
      onClick={handleClick}
      className="relative w-full grid place-items-center active:brightness-50"
    >
      <div
        style={{
          transform: "perspective(100px) rotateX(20deg)",
        }}
        className="absolute -bottom-3 w-full max-w-48 bg-gradient-to-b from-slate-900 to-[#0397AB]/50
               text-white font-bold py-6 px-2 transition-all duration-300
               border-2 border-[#0397AB]/80 hover:border-[#0AC8B9]
               shadow-lg shadow-[#0397AB]/20 hover:shadow-[#0AC8B9]/40
               transform hover:-translate-y-1"
      />
      <div className="-mt-2 relative flex items-center justify-center text-xl font-beaufort uppercase">
        Play Game
      </div>
    </button>
  );
};

export default PlayButton;
