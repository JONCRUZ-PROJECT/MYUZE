"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Copy } from 'lucide-react';
import { useMyuze } from '@/context/MyuzeContext';
import { Client } from '@/lib/data';
import { toast } from 'sonner';

interface EditClientDialogProps {
  children: React.ReactNode;
  client: Client;
}

const EditClientDialog = ({ children, client }: EditClientDialogProps) => {
  const { updateClient, getClientUserByClientId } = useMyuze();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(client.name);
  const [contactEmail, setContactEmail] = useState(client.contactEmail);
  const [contactPhone, setContactPhone] = useState(client.contactPhone || '');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | undefined>(client.logoUrl);
  const [clientLoginEmail, setClientLoginEmail] = useState('');
  const [clientLoginPassword, setClientLoginPassword] = useState('');

  // Reset form fields when dialog opens or client prop changes
  useEffect(() => {
    if (isOpen) {
      setName(client.name);
      setContactEmail(client.contactEmail);
      setContactPhone(client.contactPhone || '');
      setLogoFile(null); // Clear file input on open
      setLogoPreviewUrl(client.logoUrl);

      // Load client user credentials
      if (client.clientUserId) {
        const clientUser = getClientUserByClientId(client.id);
        if (clientUser) {
          setClientLoginEmail(clientUser.email);
          setClientLoginPassword(clientUser.passwordHash); // Em um app real, isso não seria pré-preenchido
        }
      } else {
        setClientLoginEmail('');
        setClientLoginPassword('');
      }
    }
  }, [isOpen, client, getClientUserByClientId]);

  const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setLogoFile(file);
      setLogoPreviewUrl(URL.createObjectURL(file));
      toast.info(`Novo logo "${file.name}" selecionado.`);
    } else {
      setLogoFile(null);
      setLogoPreviewUrl(client.logoUrl); // Reverte para o original se nenhum novo arquivo
    }
  };

  const handleCopyCredentials = () => {
    const credentials = `E-mail: ${clientLoginEmail}\nSenha: ${clientLoginPassword}`;
    navigator.clipboard.writeText(credentials)
      .then(() => toast.success('Credenciais copiadas para a área de transferência!'))
      .catch(() => toast.error('Falha ao copiar credenciais.'));
  };

  const handleSubmit = () => {
    if (!name || !contactEmail) {
      toast.error('Por favor, preencha o nome do cliente e o e-mail de contato.');
      return;
    }

    const updatedClientData: Partial<Client> = {
      name,
      contactEmail,
      contactPhone: contactPhone || undefined,
      logoUrl: logoPreviewUrl, // Usa a URL de prévia gerada ou a existente
    };

    updateClient(client.id, updatedClientData); // Credenciais não são mais passadas aqui
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-myuze-black text-myuze-white border-myuze-purple">
        <DialogHeader>
          <DialogTitle className="text-myuze-white">Editar Cliente</DialogTitle>
          <DialogDescription className="text-gray-400">
            Modifique os detalhes do cliente existente. As credenciais de login são geradas automaticamente e não podem ser editadas diretamente.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-myuze-white">
              Nome do Cliente *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Empresa XYZ"
              className="bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail" className="text-myuze-white">
              E-mail de Contato *
            </Label>
            <Input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="contato@empresa.com"
              className="bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPhone" className="text-myuze-white">
              Telefone de Contato
            </Label>
            <Input
              id="contactPhone"
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="(XX) XXXXX-XXXX"
              className="bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo-upload" className="text-myuze-white">
              Logo da Empresa (opcional)
            </Label>
            <Input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleLogoFileChange}
              className="bg-myuze-black/50 border-myuze-purple text-myuze-white file:text-myuze-white file:bg-myuze-purple hover:file:bg-myuze-purple/80 file:border-none"
            />
            {logoPreviewUrl && (
              <img src={logoPreviewUrl} alt="Prévia do Logo" className="w-24 h-24 object-contain rounded-md mt-2 border border-myuze-purple/50 p-1" />
            )}
          </div>
          <div className="space-y-2 border-t border-myuze-purple/50 pt-4 mt-4">
            <h3 className="text-lg font-semibold text-myuze-white">Credenciais de Login do Cliente</h3>
            <div className="flex items-center justify-between bg-myuze-black/50 border border-myuze-purple/50 rounded-md p-3">
              <div>
                <p className="text-sm text-gray-400">E-mail:</p>
                <p className="font-medium text-myuze-white">{clientLoginEmail}</p>
                <p className="text-sm text-gray-400 mt-2">Senha:</p>
                <p className="font-medium text-myuze-white">{clientLoginPassword}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCopyCredentials} className="text-myuze-purple hover:text-myuze-purple/80">
                <Copy className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setIsOpen(false)} className="text-gray-400 hover:bg-myuze-gray-translucent hover:text-myuze-white">
            <X className="mr-2 h-4 w-4" /> Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit} className="bg-myuze-purple hover:bg-myuze-purple/80 text-myuze-white">
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientDialog;