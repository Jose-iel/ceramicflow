import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  valueFormatter?: (value: string | number) => string;
}

const StatsCard = ({ 
  title, 
  value, 
  unit, 
  subtitle, 
  icon: Icon, 
  iconColor = "text-primary", 
  iconBgColor = "bg-primary/10",
  valueFormatter
}: StatsCardProps) => {
  const formattedValue = valueFormatter ? valueFormatter(value) : value;
  
  return (
    <div className="bg-card border rounded-lg p-3 md:p-4 shadow">
      <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg md:text-2xl font-bold">{formattedValue}</p>
          {unit && <p className="text-xs text-muted-foreground">{unit}</p>}
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`p-1.5 md:p-2 ${iconBgColor} rounded-full`}>
          <Icon className={`w-4 h-4 md:w-5 md:h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
