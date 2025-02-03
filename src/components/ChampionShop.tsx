import React, { useState, useEffect } from "react";
import { Champion, GameState } from "../types";
import { RANK_VALUES } from "../utils/ranks";

interface ChampionShopProps {
  gameState: GameState;
  onPurchase: (champion: Champion) => void;
}

export const ChampionShop: React.FC<ChampionShopProps> = ({
  gameState,
  onPurchase,
}) => {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const response = await fetch(
          "https://ddragon.leagueoflegends.com/cdn/15.2.1/data/en_US/champion.json"
        );
        const data = await response.json();

        const processedChampions = (
          Object.values(data.data || {}) as Champion[]
        ).map((champion: Champion) => ({
          id: champion.id,
          name: champion.name,
          title: champion.title,
          image: `https://ddragon.leagueoflegends.com/cdn/15.2.1/img/champion/${champion.image.full}`,
          stats: champion.stats,
          info: champion.info,
          tags: champion.tags,
          inventory: [],
        }));

        setChampions(processedChampions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching champions:", error);
        setLoading(false);
      }
    };

    fetchChampions();
  }, []);

  const handlePurchase = (champion: Champion) => {
    const lpCost = 6300;

    if (gameState.player.lp >= lpCost) {
      onPurchase(champion);

      setChampions((prev) =>
        prev.filter((prevChampion) => prevChampion.id !== champion.id)
      );
    }
  };

  const filteredChampions = champions.filter(
    (champion) =>
      champion.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(gameState.player.champions || []).some(
        (owned) => owned.id === champion.id
      )
  );

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="text-xl font-bold bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 text-transparent bg-clip-text">
          Loading Champions...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#091428] p-6 border-2 border-[#C8AA6E] shadow-lg shadow-[#C8AA6E]/20">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 text-transparent bg-clip-text">
        Champion Store
      </h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search champions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 bg-[#0A1428] border-2 border-[#C8AA6E]/50 text-[#C8AA6E] focus:outline-none focus:border-[#C8AA6E]"
        />
      </div>

      <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 text-transparent bg-clip-text">
        {filteredChampions.length} champions available
      </h3>

      <div className="flex flex-wrap justify-center gap-4 max-h-96 overflow-auto border border-[#C8AA6E] p-4">
        {filteredChampions.map((champion) => {
          const lpCost = 6300;
          const canAfford =
            RANK_VALUES[gameState.player.rank] + gameState.player.lp >= lpCost;

          return (
            <div
              key={champion.id}
              onClick={() => canAfford && handlePurchase(champion)}
              className={`bg-[#0A1428] grid w-40 p-4 border-2 transition-all duration-300 ${
                canAfford
                  ? "border-[#C8AA6E]/30 hover:border-[#C8AA6E] cursor-pointer"
                  : "border-[#C8AA6E]/10 cursor-not-allowed opacity-50"
              }`}
            >
              <img
                src={champion.image}
                alt={champion.name}
                className="min-w-24 min-h-24 mx-auto mb-4"
              />
              <h3 className="text-lg font-bold text-center text-[#C8AA6E] mb-1">
                {champion.name}
              </h3>
              <p className="text-sm text-center text-[#C8AA6E]/70 mb-2">
                {champion.title}
              </p>
              <div className="text-center mb-2">
                <span
                  className={`font-bold ${
                    canAfford ? "text-[#C8AA6E]" : "text-gray-500"
                  }`}
                >
                  {lpCost} LP
                </span>
              </div>
              <div className="flex flex-wrap gap-1 justify-center">
                {champion.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-[#0397AB]/20 text-[#0397AB]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
