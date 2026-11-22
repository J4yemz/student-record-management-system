import React from 'react';
import { Card } from '../../../shared/components/ui/Card';
import { cn } from '../../../shared/utils/helpers';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorScheme?: 'brand' | 'emerald' | 'amber' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  colorScheme = 'brand',
}) => {
  const iconBg = {
    brand: 'bg-brand-50 text-brand-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <div className={cn('p-2.5 rounded-xl', iconBg[colorScheme])}>{icon}</div>
      </div>
      <div className="mt-3">
        <h4 className="text-2xl font-bold text-slate-800 tracking-tight">{value}</h4>
        <div className="flex items-center gap-2 mt-1">
          {trend && (
            <span
              className={cn(
                'text-xs font-semibold',
                trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
              )}
            >
              {trend.value}
            </span>
          )}
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
      </div>
    </Card>
  );
};
