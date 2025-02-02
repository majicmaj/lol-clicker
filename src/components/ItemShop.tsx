import React from 'react';
import { Item, GameState } from '../types';
import { purchaseItem, calculateDiscountedCost, getAvailableUpgrades } from '../utils/inventory';

interface ItemShopProps {
  items: Item[];
  gameState: GameState;
  onPurchase: (newState: GameState) => void;
}

export const ItemShop: React.FC<ItemShopProps> = ({ items, gameState, onPurchase }) => {
  const handlePurchase = (item: Item) => {
    const newState = purchaseItem(gameState, item);
    if (newState) {
      onPurchase(newState);
    }
  };

  const availableUpgrades = getAvailableUpgrades(items, gameState.inventory);

  return (
    <div className="bg-[#091428] p-6 border-2 border-[#C8AA6E] shadow-lg shadow-[#C8AA6E]/20">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 text-transparent bg-clip-text">
        Hextech Shop
      </h2>
      
      {availableUpgrades.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-[#C8AA6E] to-[#C8AA6E]/80 text-transparent bg-clip-text">
            Available Upgrades
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {availableUpgrades.map((item) => {
              const discountedCost = calculateDiscountedCost(item, gameState.inventory);
              return (
                <div 
                  key={item.id}
                  className={`bg-[#0A1428] p-4 cursor-pointer transition-all duration-300 border-2 
                    border-[#C8AA6E]/50 hover:border-[#C8AA6E]
                    ${gameState.player.gold >= discountedCost ? 'hover:shadow-[#C8AA6E]/30 hover:shadow-lg' : 'opacity-50'}`}
                  onClick={() => handlePurchase(item)}
                >
                  <div className="relative">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 mx-auto mb-2 border border-[#C8AA6E]/30"
                    />
                    <div className="absolute -top-2 -right-2 bg-[#C8AA6E] text-xs text-[#091428] px-2 py-1">
                      Upgrade
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-white mb-1">{item.name}</div>
                    <div className="text-[#C8AA6E] font-bold mb-1">
                      {discountedCost} gold
                      {discountedCost !== item.cost && (
                        <span className="text-[#A1A1A1] line-through ml-2 text-sm">
                          {item.cost}
                        </span>
                      )}
                    </div>
                    <div className="text-sm space-y-1">
                      {item.stats.ad ? <div className="text-red-400">+{item.stats.ad} AD</div> : null}
                      {item.stats.ap ? <div className="text-[#0397AB]">+{item.stats.ap} AP</div> : null}
                      {item.stats.armor ? <div className="text-[#C8AA6E]">+{item.stats.armor} Armor</div> : null}
                      {item.stats.magicResist ? <div className="text-purple-300">+{item.stats.magicResist} MR</div> : null}
                      {item.stats.critChance ? <div className="text-orange-300">+{item.stats.critChance * 100}% Crit</div> : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const discountedCost = calculateDiscountedCost(item, gameState.inventory);
          const hasComponents = item.from.some(id => 
            gameState.inventory.some(invItem => invItem.id === id)
          );
          
          return (
            <div 
              key={item.id}
              className={`bg-[#0A1428] p-4 cursor-pointer transition-all duration-300 border-2 
                ${hasComponents ? 'border-[#0397AB]/50' : 'border-transparent'}
                ${gameState.player.gold >= discountedCost ? 'hover:border-[#0397AB] hover:shadow-[#0397AB]/30 hover:shadow-lg' : 'opacity-50'}`}
              onClick={() => handlePurchase(item)}
            >
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-16 h-16 mx-auto mb-2 border border-[#C8AA6E]/30"
                />
                {hasComponents && (
                  <div className="absolute -top-2 -right-2 bg-[#0397AB] text-xs text-white px-2 py-1">
                    Upgradeable
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="font-bold text-white mb-1">{item.name}</div>
                <div className="text-[#C8AA6E] font-bold mb-1">
                  {discountedCost} gold
                  {discountedCost !== item.cost && (
                    <span className="text-[#A1A1A1] line-through ml-2 text-sm">
                      {item.cost}
                    </span>
                  )}
                </div>
                <div className="text-sm space-y-1">
                  {item.stats.ad ? <div className="text-red-400">+{item.stats.ad} AD</div> : null}
                  {item.stats.ap ? <div className="text-[#0397AB]">+{item.stats.ap} AP</div> : null}
                  {item.stats.armor ? <div className="text-[#C8AA6E]">+{item.stats.armor} Armor</div> : null}
                  {item.stats.magicResist ? <div className="text-purple-300">+{item.stats.magicResist} MR</div> : null}
                  {item.stats.critChance ? <div className="text-orange-300">+{item.stats.critChance * 100}% Crit</div> : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};