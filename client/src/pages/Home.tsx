import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useCharacters, useDeleteCharacter } from '@/hooks/use-characters';
import { ParchmentPanel } from '@/components/ui/ParchmentPanel';
import { Trash2, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { data: characters, isLoading } = useCharacters();
  const deleteMutation = useDeleteCharacter();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Hero landing graphic replacement via CSS/Text since no assets */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl md:text-8xl font-display text-accent mb-4 drop-shadow-[0_0_15px_rgba(200,150,50,0.3)]">
          AETHERIA
        </h1>
        <h2 className="text-xl md:text-2xl text-muted-foreground tracking-[0.3em] uppercase">
          The Whispering Woods
        </h2>
      </motion.div>

      <ParchmentPanel className="w-full max-w-md" title="Chronicles">
        <div className="space-y-6">
          <Button 
            className="w-full text-lg h-14" 
            onClick={() => setLocation('/create')}
          >
            Forge New Legend
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or Continue</span>
            </div>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {isLoading ? (
              <div className="text-center text-muted-foreground animate-pulse">Consulting the tomes...</div>
            ) : characters?.length === 0 ? (
              <div className="text-center text-muted-foreground italic">No heroes found.</div>
            ) : (
              characters?.map(char => (
                <div key={char.id} className="flex items-center justify-between p-3 border border-border/50 rounded bg-background/50 hover:border-accent transition-colors group">
                  <div>
                    <h4 className="font-display text-lg text-foreground group-hover:text-accent transition-colors">{char.name}</h4>
                    <p className="text-sm text-muted-foreground">Lvl {char.level} {char.characterClass}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-accent hover:text-accent hover:bg-accent/10"
                      onClick={() => setLocation(`/play/${char.id}`)}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if(confirm('Erase this hero from history?')) deleteMutation.mutate(char.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </ParchmentPanel>
    </div>
  );
}
