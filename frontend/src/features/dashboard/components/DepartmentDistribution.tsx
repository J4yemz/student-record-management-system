import React from 'react';
import { Card } from '../../../shared/components/ui/Card';

interface Props {
  data: { department: string; count: number }[];
}

export const DepartmentDistribution: React.FC<Props> = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.count, 0) || 1;

  const colors = [
    'bg-brand-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-purple-500',
    'bg-rose-500',
    'bg-indigo-500',
  ];

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-slate-800">Department Enrollment</h4>
        <span className="text-xs text-slate-400 font-medium">{total} Total Students</span>
      </div>

      <div className="space-y-3.5">
        {data.map((item, index) => {
          const percent = Math.round((item.count / total) * 100);
          const color = colors[index % colors.length];

          return (
            <div key={item.department}>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-slate-700">{item.department}</span>
                <span className="text-slate-500 font-semibold">
                  {item.count} ({percent}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${color}`}
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
