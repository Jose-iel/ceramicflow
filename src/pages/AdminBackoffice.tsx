import { Users, Shield, Building2, Route as RouteIcon } from 'lucide-react';
import { useState } from 'react';

import CeramicsTab from '@/components/backoffice/CeramicsTab';
import RoutesTab from '@/components/backoffice/RoutesTab';
import UserLevelsTab from '@/components/backoffice/UserLevelsTab';
import UsersTab from '@/components/backoffice/UsersTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminBackoffice = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Backoffice Administrativo</h1>
          <p className="text-sm sm:text-base text-gray-600">Painel de controle completo do sistema CeramicFlow</p>
        </div>

        <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4 sm:mb-6 h-auto p-1">
            <TabsTrigger
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3"
              value="users"
            >
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Usuários</span>
              <span className="xs:hidden">Users</span>
            </TabsTrigger>
            <TabsTrigger
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3"
              value="levels"
            >
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Níveis</span>
              <span className="xs:hidden">Levels</span>
            </TabsTrigger>
            <TabsTrigger
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3"
              value="ceramics"
            >
              <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Cerâmicas</span>
              <span className="xs:hidden">Units</span>
            </TabsTrigger>
            <TabsTrigger
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3"
              value="routes"
            >
              <RouteIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Rotas</span>
              <span className="xs:hidden">Routes</span>
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
