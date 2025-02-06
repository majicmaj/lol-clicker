import { useEffect, useState } from "react";
import { useGameState } from "../hooks/useGameState";
import { Champion } from "../types";
import { calculateLpGain } from "../utils/lpCalculations";
import { handleFreeWinClick } from "../utils/gameLogic";
import { calculateWinChance } from "../utils/winChance";

const Enemy = () => {
  const { champions, championsLoading, gameState, setGameState } =
    useGameState();
  const [enemy, setEnemy] = useState<Champion | null>(null);

  // Challenge-related states
  const [challengeActive, setChallengeActive] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [clickThreshold, setClickThreshold] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  // Set a random enemy from the champions list once loaded.
  useEffect(() => {
    if (!championsLoading && champions.length > 0) {
      setEnemy(champions[Math.floor(Math.random() * champions.length)]);
    }
  }, [champions, championsLoading]);

  // Schedule a new challenge when one is not active.
  useEffect(() => {
    if (!challengeActive) {
      // Choose a random delay between 10 and 30 seconds
      const randomDelay =
        Math.floor(Math.random() * (30000 - 10000 + 1)) + 10000;
      const challengeTimeout = setTimeout(() => {
        // When the timer fires, start a new challenge:
        // Pick a random threshold (e.g. require 10–15 clicks in 10 seconds)
        if (!enemy) return;

        setClickCount(0);
        setTimeLeft(enemy?.stats?.movespeed / 10);
        setClickThreshold(enemy?.stats.hp);
        setChallengeActive(true);
      }, randomDelay);

      return () => clearTimeout(challengeTimeout);
    }
  }, [challengeActive, enemy]);

  // Countdown timer: while the challenge is active, every second decrease timeLeft.
  useEffect(() => {
    if (challengeActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Time's up! End the challenge (failure: do nothing special)
            clearInterval(timer);
            setChallengeActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [challengeActive, timeLeft]);

  // Check if the challenge has been won.
  useEffect(() => {
    if (challengeActive && clickCount >= clickThreshold) {
      setChallengeActive(false);
      const newState = handleFreeWinClick(gameState, 1);
      setGameState(newState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengeActive, clickCount, clickThreshold]);

  // Handle the Fight button click. Only registers if the challenge is active.
  const handleFight = () => {
    if (challengeActive) {
      const baseDamage =
        calculateLpGain(
          gameState.inventory,
          gameState.player.rank,
          gameState.player.lp
        ) +
        calculateWinChance(
          gameState.inventory,
          gameState.player.rank,
          gameState.player.lp,
          gameState.player.champions
        );

      const enemyResistances = enemy
        ? (enemy.stats.hp * enemy.stats.armor) / 1000 +
          (enemy.stats.hp * enemy.stats.spellblock) / 1000
        : 0;

      const damage = Math.max(1, baseDamage - enemyResistances);

      setClickCount((prev) => prev + damage);
      // Optionally add extra feedback here (e.g. sounds, particle effects, etc.)
    }
  };

  return (
    <div className="mx-auto w-48 h-48 relative flex flex-col items-center bg-[#091428] p-4 space-y-4 border-[#C8AA6E]">
      {challengeActive && (
        <div className="space-y-1 absolute top-0 left-0 right-0 bg-opacity-80 text-white p-2 text-center">
          <div className="relative h-4 w-full rounded bg-black border border-[#0A1428] overflow-hidden">
            <p className="absolute top-0 font-bold left-0 right-0 text-xs text-center">
              {(clickThreshold - clickCount).toFixed(0)} /{" "}
              {clickThreshold.toFixed(0)}
            </p>
            <div
              className="h-full bg-red-500"
              style={{
                width: `${
                  ((clickThreshold - clickCount) / clickThreshold) * 100
                }%`,
              }}
            />
          </div>

          {/* <p>Time left: {timeLeft}s</p> */}
          <div className="relative h-4 w-full rounded bg-black border border-[#0A1428] overflow-hidden">
            <p className="absolute top-0 left-0 right-0 text-xs text-center">
              {timeLeft}s
            </p>
            <div
              className="h-full bg-sky-500"
              style={{
                width: `${(timeLeft / (enemy?.stats?.movespeed / 10)) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {challengeActive && (
        <button
          className={`disabled:saturate-0 
          ${
            challengeActive
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-500 cursor-not-allowed"
          }`}
          onClick={handleFight}
          disabled={!challengeActive}
        >
          <img src={enemy?.image} alt={enemy?.name} />
        </button>
      )}

      {!challengeActive && (
        <div>
          <img
            className="w-full h-full object-contain"
            src={
              "https://static.wikia.nocookie.net/leagueoflegends/images/c/c0/Enemy_Missing_ping.png"
            }
          />
        </div>
      )}
    </div>
  );
};

export default Enemy;
