"use client";
import React from 'react';
import { DeliveryStatusDistribution } from '@/types/reports';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface StatusDistributionChartProps {
  data: DeliveryStatusDistribution[];
}

export function StatusDistributionChart({ data }: StatusDistributionChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card style={{ height: '100%' }}>
        <CardHeader>
          <CardTitle>Delivery Status Distribution</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'var(--color-text-muted)' }}>No delivery data available.</div>
        </CardContent>
      </Card>
    );
  }

  const getColor = (status: string) => {
    switch(status) {
      case 'DELIVERED': return '#10B981';
      case 'FAILED': return '#EF4444';
      case 'CANCELLED': return '#64748B';
      case 'WAITING_FOR_ASSIGNMENT': return '#F59E0B';
      default: return '#F97316'; // Assigned, picked up, out
    }
  };

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, name, value, payload, fill } = props;
    const RADIAN = Math.PI / 180;
    // Push the label outside the pie
    const radius = innerRadius + (outerRadius - innerRadius) + 35;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill={fill} 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central" 
        fontSize={12}
        fontWeight={600}
      >
        {`${String(name).replace(/_/g, ' ')}: ${value} (${payload.percentage || Math.round(percent * 100)}%)`}
      </text>
    );
  };

  return (
    <Card style={{ height: '100%' }}>
      <CardHeader>
        <CardTitle>Delivery Status Distribution</CardTitle>
      </CardHeader>
      <CardContent style={{ height: 350, display: 'flex', flexDirection: 'column' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={2}
              dataKey="count"
              nameKey="status"
              label={renderCustomizedLabel}
              labelLine={{ stroke: 'var(--color-border)', strokeWidth: 1 }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.status)} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any, name: any, props: any) => [`${value} (${props.payload.percentage}%)`, String(name).replace(/_/g, ' ')]}
              contentStyle={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 13 }}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              formatter={(value) => <span style={{ color: 'var(--color-text)', fontSize: 12 }}>{value.replace(/_/g, ' ')}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
