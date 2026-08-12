"use client";
import React from 'react';
import { DeliveryTrendPoint } from '@/types/reports';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DeliveryTrendChartProps {
  data: DeliveryTrendPoint[];
}

export function DeliveryTrendChart({ data }: DeliveryTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card style={{ height: '100%' }}>
        <CardHeader>
          <CardTitle>Delivery Performance Trend</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'var(--color-text-muted)' }}>No delivery data available for selected period.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card style={{ height: '100%' }}>
      <CardHeader>
        <CardTitle>Delivery Performance Trend</CardTitle>
      </CardHeader>
      <CardContent style={{ height: 350, paddingBottom: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAssigned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} tickMargin={10} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              itemStyle={{ fontSize: 13, fontWeight: 500 }}
              labelStyle={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 8 }}
            />
            <Legend wrapperStyle={{ fontSize: 13, paddingTop: 20 }} />
            <Area type="monotone" dataKey="total" name="Total Orders" stroke="#94A3B8" fill="transparent" strokeDasharray="3 3" />
            <Area type="monotone" dataKey="assigned" name="Assigned/Active" stroke="#F97316" fillOpacity={1} fill="url(#colorAssigned)" />
            <Area type="monotone" dataKey="delivered" name="Delivered" stroke="#10B981" fillOpacity={1} fill="url(#colorDelivered)" />
            <Area type="monotone" dataKey="failed" name="Failed/Exception" stroke="#EF4444" fill="transparent" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
