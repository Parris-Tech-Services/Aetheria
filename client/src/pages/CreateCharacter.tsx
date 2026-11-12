import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ParchmentPanel } from '@/components/ui/ParchmentPanel';
import { useCreateCharacter } from '@/hooks/use-characters';
import { ClassData } from '@/game/data';
import { motion } from 'framer-motion';

export default function CreateCharacter() {
  const [, setLocation] = useLocation();
  const createMutation = useCreateCharacter();
  
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<keyof typeof ClassData>('Fighter');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const classInfo = ClassData[selectedClass];
    
    // Generate basic stats based on class
    const baseStats = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
    baseStats[classInfo.primaryStat as keyof typeof baseStats] = 16;
    baseStats.con = 14; // Everyone likes HP

    createMutation.mutate({
      name,
      characterClass: selectedClass,
      hp: classInfo.hpBase + 2, // +2 from 14 Con mod
      maxHp: classInfo.hpBase + 2,
      ac: selectedClass === 'Fighter' ? 16 : selectedClass === 'Rogue' ? 14 : 11,
      ...baseStats,
      mapId: 'village',
      x: 1,
      y: 1
    }, {
      onSuccess: (data) => setLocation(`/play/${data.id}`)
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
         <div className="w-[800px] h-[800px] rounded-full border border-accent/30 flex items-center justify-center">
            <div className="w-[600px] h-[600px] rounded-full border border-accent/20" />
         </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <ParchmentPanel title="Birth of a Hero" className="w-full max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="space-y-2">
              <label className="text-accent font-display uppercase tracking-wider text-sm">Name your character</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Alaric the Brave"
                className="w-full bg-background border border-border p-3 text-foreground font-display text-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all rounded-sm shadow-inner"
                required
                maxLength={30}
              />
            </div>

            <div className="space-y-4">
              <label className="text-accent font-display uppercase tracking-wider text-sm">Choose your Path</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(Object.entries(ClassData) as [keyof typeof ClassData, typeof ClassData['Fighter']][]).map(([className, data]) => (
                  <div 
                    key={className}
                    onClick={() => setSelectedClass(className)}
                    className={`cursor-pointer border-2 p-4 rounded-sm transition-all duration-300 relative overflow-hidden ${
                      selectedClass === className 
                        ? 'border-accent bg-accent/5 shadow-[0_0_15px_rgba(200,150,50,0.1)]' 
                        : 'border-border bg-background hover:border-accent/50'
                    }`}
                  >
                    <h4 className="font-display text-xl mb-2 text-foreground">{className}</h4>
                    <p className="text-sm text-muted-foreground mb-4">Base HP: {data.hpBase}</p>
                    <ul className="text-xs space-y-1">
                      {data.features.map(f => (
                        <li key={f} className="text-accent-foreground/80 flex items-center gap-2">
                          <span className="w-1 h-1 bg-accent rounded-full" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-border/50">
              <Button type="button" variant="ghost" onClick={() => setLocation('/')}>
                Abandon
              </Button>
              <Button type="submit" disabled={createMutation.isPending || !name.trim()}>
                {createMutation.isPending ? 'Forging...' : 'Enter Aetheria'}
              </Button>
            </div>
          </form>
        </ParchmentPanel>
      </motion.div>
    </div>
  );
}
