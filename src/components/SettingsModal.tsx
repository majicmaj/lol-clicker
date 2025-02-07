import { useState } from "react";
import { useGameState } from "../hooks/useGameState";
import { Divider } from "./dividers/Divider";

const SettingsModal = () => {
  const { resetGame } = useGameState();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    if (showResetConfirm) {
      resetGame();
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      // Auto-hide the confirmation after 3 seconds
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  return (
    <div className="p-2 absolute inset-0 bg-black/40 backdrop-blur-lg flex items-center justify-center">
      <div className="flex flex-col gap-4 max-w-xl relative bg-[#091428]/90 p-4 pb-8 px-4 border-2 border-[#C8AA6E] shadow-lg shadow-[#C8AA6E]/20 w-full backdrop-blur-sm">
        <div className="flex flex-col ">
          <h2 className="text-xl font-bold  text-center bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 text-transparent bg-clip-text">
            Settings
          </h2>
          <Divider />
        </div>

        <p>
          LolClicker was created under Riot Games' "Legal Jibber Jabber" policy
          using assets owned by Riot Games. Riot Games does not endorse or
          sponsor this project.
        </p>
        <Divider size="sm" />
        <button
          onClick={handleReset}
          className="border-2 border-red-500 text-white px-4 p-1"
        >
          {showResetConfirm ? "Click again to confirm" : "Reset Game"}
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
