
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, Shield, Building2, Route as RouteIcon } from 'lucide-react';
import UserLevelsTab from '@/components/backoffice/UserLevelsTab';
import UsersTab from '@/components/backoffice/UsersTab';
import CeramicsTab from '@/components/backoffice/CeramicsTab';
import RoutesTab from '@/components/backoffice/RoutesTab';

const AdminBackoffice = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Backoffice Administrativo</h1>
          <p className="text-gray-600">Painel de controle completo do sistema CeramicFlow</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="levels" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Níveis de Acesso
            </TabsTrigger>
            <TabsTrigger value="ceramics" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Cerâmicas
            </TabsTrigger>
            <TabsTrigger value="routes" className="flex items-center gap-2">
              <RouteIcon className="h-4 w-4" />
              Rotas do Sistema
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersTab />
          </TabsContent>

          <TabsContent value="levels">
            <UserLevelsTab />
          </TabsContent>

          <TabsContent value="ceramics">
            <CeramicsTab />
          </TabsContent>

          <TabsContent value="routes">
            <RoutesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminBackoffice;
