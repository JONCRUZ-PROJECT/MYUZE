"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import InstallCompanyAccordion from '@/components/InstallCompanyAccordion';

const Installations = () => {
  const [showAccordion, setShowAccordion] = useState(false);

  return (
    <div className="text-myuze-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Instalações</h1>
        <Button onClick={() => setShowAccordion(!showAccordion)} className="bg-myuze-purple hover:bg-myuze-purple/80 text-myuze-white">
          <Plus className="mr-2 h-4 w-4" /> Instalar Empresa
        </Button>
      </div>
      <p className="text-lg mb-8">Gerencie suas instalações aqui.</p>

      {showAccordion && (
        <div className="mt-8">
          <InstallCompanyAccordion />
        </div>
      )}

      {/* Store management UI will go here */}
    </div>
  );
};

export default Installations;