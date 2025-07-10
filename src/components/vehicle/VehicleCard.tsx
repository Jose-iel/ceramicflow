
import React from 'react';
import { Vehicle, VehicleStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Clock, Settings, Calendar } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick?: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onClick }) => {
  const getStatusVariant = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.OPERATIONAL:
        return 'default';
      case VehicleStatus.MAINTENANCE:
        return 'secondary';
      case VehicleStatus.STOPPED:
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div 
      className="glass-card glass-card-hover rounded-xl p-4 cursor-pointer transition-all duration-300 transform hover:translate-y-[-2px]"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold">{vehicle.model}</h3>
        </div>
        <Badge variant={getStatusVariant(vehicle.status)}>
          {vehicle.status}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <Settings className="w-4 h-4 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground mr-2">Tipo:</span>
          <span>{vehicle.type}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground mr-2">Horímetro:</span>
          <span className="font-semibold bg-muted/40 px-2 py-0.5 rounded">
            {vehicle.hourMeter}
          </span>
        </div>
        
        <div className="flex items-center text-sm">
          <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground mr-2">Última manutenção:</span>
          <span>{vehicle.lastMaintenance}</span>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
