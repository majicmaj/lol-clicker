import { Champion } from "../types";
import { Divider } from "./dividers/Divider";

export const ChampionInventory: React.FC<{
  champions?: Champion[];
}> = ({ champions = [] }) => {
  return (
    <div className="flex flex-col bg-[#091428] p-4 border-2 border-[#C8AA6E] shadow-lg shadow-[#C8AA6E]/20">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 text-transparent bg-clip-text">
        Champions ({champions.length})
      </h2>
      <Divider size="sm" />

      <div className="border border-[#C8AA6E] h-full max-h-48 overflow-auto p-2 flex flex-col">
        <div className="overflow-auto flex flex-wrap items-center gap-2 justify-center">
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
    </div>
  );
};
