
import React from 'react';
import { Vehicle, VehicleStatus } from '@/types';
import { cn } from '@/lib/utils';
import Badge from '@/components/common/Badge';
import { Clock, Settings, Calendar } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick?: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onClick }) => {
  const getStatusVariant = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.OPERATIONAL:
        return 'success';
      case VehicleStatus.MAINTENANCE:
        return 'warning';
      case VehicleStatus.STOPPED:
        return 'outline';
      default:
        return 'default';
    }
  };

  const formattedHourMeter = vehicle.hourMeter.toString().padStart(5, '0');

  return (
    <div 
      className="glass-card glass-card-hover rounded-xl p-4 cursor-pointer transition-all duration-300 transform hover:translate-y-[-2px]"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold">{vehicle.id}</h3>
          <p className="text-muted-foreground text-sm">{vehicle.model}</p>
        </div>
        <Badge variant={getStatusVariant(vehicle.status)} withDot={vehicle.status === VehicleStatus.OPERATIONAL}>
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
            {formattedHourMeter}
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
