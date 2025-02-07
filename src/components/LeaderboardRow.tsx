import { formatBigNumbers } from "../utils/formatBigNumbers";

// Import all rank images
import bronzeRank from "../assets/ranks/bronze.webp";
import challengerRank from "../assets/ranks/challenger.webp";
import diamondRank from "../assets/ranks/diamond.webp";
import emeraldRank from "../assets/ranks/emerald.webp";
import goldRank from "../assets/ranks/gold.webp";
import grandmasterRank from "../assets/ranks/grandmaster.webp";
import ironRank from "../assets/ranks/iron.webp";
import masterRank from "../assets/ranks/master.webp";
import platinumRank from "../assets/ranks/platinum.webp";
import silverRank from "../assets/ranks/silver.webp";
import { GOLD_ICON } from "../constants/goldIcon";

const getRankImage = (rank: string): string => {
  const images: Record<string, string> = {
    IRON: ironRank,
    BRONZE: bronzeRank,
    SILVER: silverRank,
    GOLD: goldRank,
    PLATINUM: platinumRank,
    EMERALD: emeraldRank,
    DIAMOND: diamondRank,
    MASTER: masterRank,
    GRANDMASTER: grandmasterRank,
    CHALLENGER: challengerRank,
  };
  return images[rank] || ironRank;
};

const lastSeen = (time: number | undefined) => {
  if (!time) return "Offline";
  const seconds = Math.floor((Date.now() - time) / 1000);
  if (seconds < 60) return "Online";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

const isOnline = (player: any) => {
  if (!player.lastGameTime) return false;
  return Date.now() - player.lastGameTime < 1000 * 60 * 5; // 5 minutes
};

const LeaderboardRow = ({ player, index }: { player: any; index: number }) => {
  return (
    <div
      key={player.id}
      className="flex flex-col gap-2 border-b border-[#C8AA6E]/20 pt-1 pb-3"
    >
      <div className="flex items-center justify-start gap-2">
        <span className="text-lg font-bold text-white w-4 flex justify-between">
          <span>{index + 1}.</span>
        </span>

        <div className="relative">
          <img
            src={getRankImage(player.rank)}
            alt={player.rank}
            className="w-8 h-8 object-cover"
          />
          {player.division && (
            <span className="absolute top-0 right-0 bg-[#C8AA6E] text-black text-xs font-bold px-0.5">
              {player.division}
            </span>
          )}
        </div>
        <span className="flex flex-1 items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline(player) ? "bg-green-500" : "bg-gray-500"
            }`}
          />
          <span className="text-sm font-bold text-white truncate">
            {player.username || "_"}
          </span>
          <div className="flex-1 w-full" />
          <span className="text-sm text-[#C8AA6E]">
            {lastSeen(player.lastGameTime)}
          </span>
        </span>
      </div>

      <div className="w-full grid grid-cols-4 place-items-center gap-2">
        <div className="flex flex-col items-center">
          <span className="text-white">{formatBigNumbers(player.lp)}</span>
          <span className="text-xs text-[#C8AA6E]">LP</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-white">{formatBigNumbers(player.wins)}</span>
          <span className="text-xs text-[#C8AA6E]">W</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-white">{formatBigNumbers(player.losses)}</span>
          <span className="text-xs text-[#C8AA6E]">L</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-white">{formatBigNumbers(player.gold)}</span>
          <img src={GOLD_ICON} alt="Gold" className="w-4 h-4 object-cover" />
        </div>

        {!!player?.items?.length && (
          <div className="col-span-4 flex gap-1 overflow-auto w-full justify-between">
            {player.items.map((item, index) => (
              <div className="relative min-w-max pb-2" key={index}>
                <img
                  className={
                    "w-7 h-7 lg:w-8 lg:h-8 asepct-square object-cover " +
                    (index === 0 ? " border border-[#C8AA6E]" : "")
                  }
                  src={item.image}
                  alt={item.name}
                  title={item.name}
                />
                <span className="absolute -bottom-0 -right-1 bg-slate-900 text-[#C8AA6E] text-xs px-[1px] border border-[#C8AA6E]">
                  {formatBigNumbers(item.count || 1, 0)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardRow;
