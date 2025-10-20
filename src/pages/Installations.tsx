"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Store, Globe, WifiOff } from 'lucide-react';
import InstallCompanyAccordion from '@/components/InstallCompanyAccordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMyuze } from '@/context/MyuzeContext';

const Installations = () => {
  const [showAccordion, setShowAccordion] = useState(false);
  const { stores, currentUser } = useMyuze();

  const totalInstallations = stores.length;
  const onlineInstallations = stores.filter(store => store.status === 'online').length;
  const offlineInstallations = totalInstallations - onlineInstallations;
  const companyName = currentUser?.email ? currentUser.email.split('@')[0] : 'Sua Empresa';

  return (
    <div className="text-myuze-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Instalações</h1>
        <Button onClick={() => setShowAccordion(!showAccordion)} className="bg-myuze-purple hover:bg-myuze-purple/80 text-myuze-white">
          <Plus className="mr-2 h-4 w-4" /> Instalar Empresa
        </Button>
      </div>
      <p className="text-lg mb-8">Gerencie suas instalações aqui.</p>

      <Card className="bg-myuze-gray-translucent text-myuze-white border-none shadow-xl backdrop-blur-sm mb-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold text-myuze-white flex items-center">
            <Store className="h-6 w-6 mr-3 text-myuze-purple" />
            {companyName}
          </CardTitle>
          <CardDescription className="text-gray-300">Visão Geral das Instalações</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-3 bg-myuze-black/50 rounded-md border border-myuze-purple/30">
            <p className="text-3xl font-bold text-myuze-purple">{totalInstallations}</p>
            <p className="text-sm text-gray-300">Total</p>
          </div>
          <div className="flex flex-col items-center p-3 bg-myuze-black/50 rounded-md border border-myuze-purple/30">
            <p className="text-3xl font-bold text-green-400">{onlineInstallations}</p>
            <p className="text-sm text-gray-300 flex items-center"><Globe className="h-4 w-4 mr-1" /> Online</p>
          </div>
          <div className="flex flex-col items-center p-3 bg-myuze-black/50 rounded-md border border-myuze-purple/30">
            <p className="text-3xl font-bold text-red-400">{offlineInstallations}</p>
            <p className="text-sm text-gray-300 flex items-center"><WifiOff className="h-4 w-4 mr-1" /> Offline</p>
          </div>
        </CardContent>
      </Card>

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