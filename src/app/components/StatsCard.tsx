import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  change?: string;
  color: string;
}

export function StatsCard({ title, value, unit, icon: Icon, change, color }: StatsCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-2">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl">{value}</span>
            {unit && <span className="text-lg text-gray-500">{unit}</span>}
          </div>
          {change && (
            <p className={`text-sm mt-2 ${parseFloat(change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {parseFloat(change) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(change))}% from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
}
