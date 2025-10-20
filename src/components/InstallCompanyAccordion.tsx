"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const InstallCompanyAccordion = () => {
  const handleAddStore = () => {
    toast.info("Funcionalidade 'Adicionar Loja' será implementada aqui.");
    // Lógica para adicionar loja será adicionada posteriormente
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" className="border-b border-myuze-purple/50">
        <AccordionTrigger className="text-myuze-white hover:no-underline hover:text-myuze-purple/80 transition-colors">
          Configurações de Instalação
        </AccordionTrigger>
        <AccordionContent className="bg-myuze-black/50 p-4 rounded-b-md">
          <p className="text-gray-300 mb-4">
            Clique no botão abaixo para adicionar uma nova loja/instalação.
          </p>
          <Button onClick={handleAddStore} className="bg-myuze-purple hover:bg-myuze-purple/80 text-myuze-white">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Loja
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default InstallCompanyAccordion;