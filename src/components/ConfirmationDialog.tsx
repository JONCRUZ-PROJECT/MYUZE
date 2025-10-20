"use client";

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button'; // Importar Button para o botão de gatilho padrão

interface ConfirmationDialogProps {
  children: React.ReactNode; // O elemento que irá disparar o diálogo (ex: um botão)
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"; // Variação do botão de confirmação
}

const ConfirmationDialog = ({
  children,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "destructive",
}: ConfirmationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false); // Fechar o diálogo após a confirmação
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="bg-myuze-black text-myuze-white border-myuze-purple">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-myuze-white">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-gray-400 hover:bg-myuze-gray-translucent hover:text-myuze-white border-myuze-purple/50">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className={`bg-myuze-purple hover:bg-myuze-purple/80 text-myuze-white`}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;