import { Champion } from "../types";

export const ChampionInventory: React.FC<{
  champions?: Champion[];
}> = ({ champions = [] }) => {
  return (
    <div className="bg-[#091428] p-6 border-2 border-[#C8AA6E] shadow-lg shadow-[#C8AA6E]/20">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 text-transparent bg-clip-text">
        Champions ({champions.length})
      </h2>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {champions.map((champion) => (
          <div
            key={champion.id}
            className="bg-[#0A1428] p-2 border-2 border-[#0397AB]/30 hover:border-[#0397AB]/50 transition-colors cursor-pointer relative group"
            title={champion.name}
          >
            <img
              src={champion.image}
              alt={champion.name}
              className="w-12 h-12 mx-auto border border-[#C8AA6E]/30"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
