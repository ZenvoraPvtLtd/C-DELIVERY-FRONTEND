"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { DeliveryTrend } from '@/types/dashboard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DeliveryTrendChartProps {
  data: DeliveryTrend[];
}

export function DeliveryTrendChart({ data }: DeliveryTrendChartProps) {
  return (
    <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader>
        <CardTitle>Delivery Trends</CardTitle>
      </CardHeader>
      <CardContent style={{ flex: 1, minHeight: 300, paddingBottom: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAssigned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-md)' }}
              itemStyle={{ fontSize: 14 }}
              labelStyle={{ color: 'var(--color-text)', fontWeight: 600, marginBottom: 8 }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
            <Area type="monotone" dataKey="Delivered" stroke="var(--color-success)" fillOpacity={1} fill="url(#colorDelivered)" strokeWidth={2} />
            <Area type="monotone" dataKey="Assigned" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorAssigned)" strokeWidth={2} />
            <Area type="monotone" dataKey="Out for Delivery" stroke="var(--color-warning)" fill="none" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
