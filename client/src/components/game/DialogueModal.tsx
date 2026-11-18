import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ParchmentPanel } from '@/components/ui/ParchmentPanel';
import { X } from 'lucide-react';

interface DialogueModalProps {
  isOpen: boolean;
  npcName: string;
  currentText: string;
  options: Array<{ id: string; label: string }>;
  onClose: () => void;
  onSelectOption: (optionId: string) => void;
}

export function DialogueModal({
  isOpen,
  npcName,
  currentText,
  options,
  onClose,
  onSelectOption
}: DialogueModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ParchmentPanel className="w-96 border-accent/50 shadow-2xl">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-display text-accent">{npcName}</h3>
                  <button
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p data-testid="dialogue-text" className="text-sm text-foreground leading-relaxed italic">{currentText}</p>

                <div className="space-y-2 pt-2">
                  {options.map((option) => (
                    <Button
                      key={option.id}
                      data-testid={`dialogue-option-${option.id}`}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-2 px-3"
                      onClick={() => {
                        onSelectOption(option.id);
                      }}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            </ParchmentPanel>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
