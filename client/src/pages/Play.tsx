import React, { useEffect, useState, useCallback } from 'react';
import { Link, useRoute } from 'wouter';
import { useCharacter, useUpdateCharacter } from '@/hooks/use-characters';
import { useGameStore } from '@/game/engine';
import { GameData, ItemData } from '@/game/data';
import { ParchmentPanel } from '@/components/ui/ParchmentPanel';
import { Button } from '@/components/ui/button';
import { JuiceOverlay } from '@/components/game/JuiceOverlay';
import { DialogueModal } from '@/components/game/DialogueModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Shield, Swords, PersonStanding, LogOut, Backpack } from 'lucide-react';

export default function Play() {
  const [, params] = useRoute('/play/:id');
  const charId = params?.id ? parseInt(params.id) : null;
  
  const { data: character, isLoading } = useCharacter(charId);
  const updateMutation = useUpdateCharacter();
  
  const game = useGameStore();
  const [isShaking, setIsShaking] = useState(false);
  const [showInventory, setShowInventory] = useState(false);

  // Initialize game when character loads
  useEffect(() => {
    if (character && !game.character) {
      game.initGame(character);
    }
  }, [character, game]);

  // Handle global shake events
  useEffect(() => {
    const handleShake = () => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
    };
    window.addEventListener('game-shake', handleShake);
    return () => window.removeEventListener('game-shake', handleShake);
  }, []);

  // Keyboard controls
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (game.combat.isActive && !game.combat.actionAvailable && game.combat.movementLeft <= 0) return;
    
    switch(e.key) {
      case 'ArrowUp': case 'w': game.movePlayer(0, -1); break;
      case 'ArrowDown': case 's': game.movePlayer(0, 1); break;
      case 'ArrowLeft': case 'a': game.movePlayer(-1, 0); break;
      case 'ArrowRight': case 'd': game.movePlayer(1, 0); break;
    }
  }, [game]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Auto-save logic (debounced implicitly by combat state changes or distinct moves, but keep simple here)
  useEffect(() => {
    // Only save if HP changed or combat ended
    if (game.character && character && game.character.hp !== character.hp) {
       updateMutation.mutate({ id: character.id, hp: game.character.hp });
    }
  }, [game.character?.hp]);

  if (isLoading || !game.character) {
    return <div className="h-screen flex items-center justify-center text-accent font-display text-2xl">Summoning Reality...</div>;
  }

  const { mapData, fogData, playerPos, combat } = game;

  return (
    <div className={`h-screen flex flex-col md:flex-row bg-[#0a0a0c] overflow-hidden ${isShaking ? 'shake' : ''}`}>
      <DialogueModal
        isOpen={game.dialogue.isOpen}
        npcName={game.dialogue.npcName}
        currentText={game.dialogue.currentText}
        options={game.dialogue.options}
        onClose={() => game.closeDialogue()}
        onSelectOption={(response) => {
          // Update dialogue to show response
          game.closeDialogue();
        }}
      />
      <JuiceOverlay />
      
      {/* Left Sidebar: Character Sheet */}
      <aside className="w-full md:w-80 border-r border-border bg-background/95 flex flex-col z-20 shadow-2xl shadow-black">
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-display text-accent">{game.character.name}</h2>
              <p className="text-sm text-muted-foreground uppercase tracking-widest">Level {game.character.level} {game.character.characterClass}</p>
            </div>
            <Link href="/" aria-label="Back to characters" className="text-muted-foreground hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-card p-3 rounded border border-border/50 flex flex-col items-center">
              <Heart className="w-5 h-5 text-destructive mb-1" />
              <span className="text-xl font-display">{game.character.hp} / {game.character.maxHp}</span>
            </div>
            <div className="bg-card p-3 rounded border border-border/50 flex flex-col items-center">
              <Shield className="w-5 h-5 text-blue-400 mb-1" />
              <span className="text-xl font-display">{game.character.ac}</span>
            </div>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto">
             <h3 className="font-display text-accent border-b border-border/50 pb-1">Attributes</h3>
             <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="bg-card p-2 rounded border border-border/30"><div className="text-muted-foreground text-xs uppercase">STR</div>{game.character.str}</div>
                <div className="bg-card p-2 rounded border border-border/30"><div className="text-muted-foreground text-xs uppercase">DEX</div>{game.character.dex}</div>
                <div className="bg-card p-2 rounded border border-border/30"><div className="text-muted-foreground text-xs uppercase">CON</div>{game.character.con}</div>
                <div className="bg-card p-2 rounded border border-border/30"><div className="text-muted-foreground text-xs uppercase">INT</div>{game.character.int}</div>
                <div className="bg-card p-2 rounded border border-border/30"><div className="text-muted-foreground text-xs uppercase">WIS</div>{game.character.wis}</div>
                <div className="bg-card p-2 rounded border border-border/30"><div className="text-muted-foreground text-xs uppercase">CHA</div>{game.character.cha}</div>
             </div>

             <div className="pt-2">
               <button
                 onClick={() => setShowInventory(!showInventory)}
                 className="flex items-center gap-2 w-full text-accent font-display border-b border-border/50 pb-1 hover:text-accent/80 transition-colors"
               >
                 <Backpack className="w-4 h-4" />
                 Inventory ({game.inventory.length} items)
               </button>
               
               {showInventory && (
                 <div className="mt-2 space-y-1">
                   {game.inventory.length === 0 ? (
                     <p className="text-xs text-muted-foreground italic">Empty</p>
                   ) : (
                     game.inventory.map((item) => {
                       const itemData = ItemData[item.itemId];
                       return (
                         <div key={item.itemId} className="flex justify-between items-center text-xs bg-card p-2 rounded border border-border/30">
                           <div className="flex items-center gap-2">
                             <span>{itemData?.sprite || '❓'}</span>
                             <span className="text-muted-foreground">{itemData?.name || item.itemId}</span>
                           </div>
                           <span className="font-display text-accent">×{item.quantity}</span>
                         </div>
                       );
                     })
                   )}
                 </div>
               )}
             </div>
          </div>

          {/* Combat Log */}
          <div className="h-48 mt-4 bg-[#050505] rounded border border-border p-3 overflow-y-auto font-mono text-sm space-y-1">
             <div className="text-accent text-xs uppercase mb-2 sticky top-0 bg-[#050505]">Chronicle</div>
             {combat.log.map((entry, i) => (
               <div key={i} className={entry.includes('damage') ? 'text-destructive' : 'text-muted-foreground'}>
                 {'>'} {entry}
               </div>
             ))}
             {/* Dummy div to scroll to bottom usually needed, skipped for brevity */}
          </div>
        </div>
      </aside>

      {/* Main Game Area */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-4">
        {/* Map Header */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
          <h2 className="text-3xl font-display text-white drop-shadow-md">{GameData.maps[game.mapId as keyof typeof GameData.maps]?.name || game.mapId}</h2>
        </div>

        {/* The Grid Canvas alternative (using CSS Grid for simplicity & styling control) */}
        <div className="relative iron-border bg-[#111] p-2 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden rounded-md">
          {/* Tile Grid */}
          <div 
            className="grid" 
            style={{ 
              gridTemplateColumns: `repeat(${mapData[0]?.length || 10}, 40px)`,
              gridTemplateRows: `repeat(${mapData.length || 10}, 40px)`
            }}
          >
            {mapData.map((row, y) => row.map((cell, x) => {
              const isPlayer = playerPos.x === x && playerPos.y === y;
              const isFogged = fogData[y]?.[x];
              const entity = GameData.entities[cell];
              
              return (
                <div 
                  key={`${x}-${y}`} 
                  className={`w-10 h-10 flex items-center justify-center relative transition-colors duration-300
                    ${cell === '#' ? 'bg-[#1a1c20] border-t border-l border-white/5' : 'bg-[#2a2c30]'}
                  `}
                >
                  {/* Floor texture */}
                  {cell !== '#' && !isFogged && <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')]"></div>}
                  
                  {/* Entity or Player */}
                  <span className="text-2xl relative z-10 filter drop-shadow-md select-none">
                    {isPlayer ? '🧙‍♂️' : (entity?.sprite || (cell === '#' ? '🌲' : ''))}
                  </span>

                  {/* Fog overlay */}
                  <div className={`absolute inset-0 bg-black transition-opacity duration-700 pointer-events-none z-20 ${isFogged ? 'opacity-100' : 'opacity-0'}`} />
                </div>
              );
            }))}
          </div>
          
          {/* Cinematic Lighting Gradient over the grid */}
          <div className="absolute inset-0 pointer-events-none radial-gradient-mask z-30" 
               style={{background: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,0.8) 100%)'}}>
          </div>
        </div>

        {/* Action Economy Overlay (When in Combat) */}
        <AnimatePresence>
          {combat.isActive && combat.enemyData && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30"
            >
              <ParchmentPanel className="flex flex-col items-center p-4 border-accent">
                <div className="flex items-center gap-6 mb-4">
                  <div className="text-center">
                    <div className="text-sm font-display text-accent uppercase">{combat.enemyData.name}</div>
                    <div className="w-48 h-2 bg-background rounded-full mt-1 overflow-hidden border border-border">
                      <div 
                        className="h-full bg-destructive transition-all duration-300" 
                        style={{width: `${(combat.enemyHp / combat.enemyMaxHp) * 100}%`}}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <Button 
                      variant={combat.actionAvailable ? 'default' : 'outline'}
                      disabled={!combat.actionAvailable}
                      onClick={() => game.attackEnemy()}
                      className="w-32"
                    >
                      <Swords className="w-4 h-4 mr-2" /> Strike
                    </Button>
                    <span className="text-[10px] uppercase text-muted-foreground">Action</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <Button 
                      variant="outline"
                      className="w-32"
                      onClick={() => game.endTurn()}
                    >
                      End Turn
                    </Button>
                    <span className="text-[10px] uppercase text-muted-foreground">{combat.movementLeft}ft Move</span>
                  </div>
                </div>
              </ParchmentPanel>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
