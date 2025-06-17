
// ABOUTME: A modal dialog to show PWA installation instructions for iOS and as a fallback for other platforms.
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Smartphone, Share, PlusSquare, MoreVertical, Download } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

interface PWAInstructionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PWAInstructionsModal: React.FC<PWAInstructionsModalProps> = ({ open, onOpenChange }) => {
  const { isIOS } = usePWA();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center">Instale o App no seu Dispositivo</DialogTitle>
          <DialogDescription className="text-center">
            Tenha acesso rápido, notificações e uma experiência otimizada.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          {isIOS ? (
            <div className="space-y-4">
              <p className="text-sm text-center text-muted-foreground">Siga estes 3 passos simples no Safari:</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">1</span>
                  <span>Toque no ícone de compartilhar</span>
                  <Share className="h-4 w-4 ml-auto text-muted-foreground" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">2</span>
                  <span>Selecione "Adicionar à Tela de Início"</span>
                  <PlusSquare className="h-4 w-4 ml-auto text-muted-foreground" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">3</span>
                  <span>Confirme tocando em "Adicionar"</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-center text-muted-foreground">Se a instalação não iniciar, siga os passos para o seu navegador:</p>
              <div className="space-y-3 text-sm">
                 <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">1</span>
                  <span>Toque no menu do navegador (geralmente três pontos)</span>
                  <MoreVertical className="h-4 w-4 ml-auto text-muted-foreground" />
                </div>
                 <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">2</span>
                  <span>Procure e selecione "Instalar aplicativo" ou "Adicionar à tela inicial"</span>
                  <Download className="h-4 w-4 ml-auto text-muted-foreground" />
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PWAInstructionsModal;
