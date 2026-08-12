"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DeliveryPartner } from '@/types/partner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Edit, Phone, Mail, Calendar, Package, Clock, MapPin } from 'lucide-react';

interface PartnerDetailProps {
  partner: DeliveryPartner;
  onEdit: () => void;
  onDeactivate: () => void;
}

export function PartnerDetail({ partner, onEdit, onDeactivate }: PartnerDetailProps) {
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const getAvailabilityVariant = (a: string) => {
    switch (a) {
      case 'AVAILABLE': return 'success';
      case 'BUSY': return 'warning';
      default: return 'waiting';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      {/* Header Profile Card */}
      <Card>
        <CardContent style={{ padding: 'var(--spacing-6)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
              <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
                {/* Avatar */}
                <div style={{ 
                  width: 64, height: 64, borderRadius: 'var(--radius-full)', 
                  backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-hover)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 'var(--font-size-xl)', fontWeight: 600
                }}>
                  {getInitials(partner.name)}
                </div>
                
                <div>
                  <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 600, color: 'var(--color-text)', margin: 0, marginBottom: 'var(--spacing-1)' }}>
                    {partner.name}
                  </h2>
                  <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                      {partner.partnerId}
                    </span>
                    <StatusBadge status={partner.availability.charAt(0) + partner.availability.slice(1).toLowerCase()} variant={getAvailabilityVariant(partner.availability)} />
                    <StatusBadge status={partner.status === 'ACTIVE' ? 'Active' : 'Inactive'} variant={partner.status === 'ACTIVE' ? 'success' : 'waiting'} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
                <Button variant="outline" onClick={onEdit}>
                  <Edit size={16} /> Edit Profile
                </Button>
                {partner.status === 'ACTIVE' && (
                  <Button variant="danger" onClick={onDeactivate}>
                    Deactivate
                  </Button>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center', color: 'var(--color-text)' }}>
                <Phone size={16} color="var(--color-text-secondary)" />
                <span style={{ fontSize: 'var(--font-size-sm)' }}>{partner.mobile}</span>
              </div>
              {partner.email && (
                <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center', color: 'var(--color-text)' }}>
                  <Mail size={16} color="var(--color-text-secondary)" />
                  <span style={{ fontSize: 'var(--font-size-sm)' }}>{partner.email}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center', color: 'var(--color-text)' }}>
                <Calendar size={16} color="var(--color-text-secondary)" />
                <span style={{ fontSize: 'var(--font-size-sm)' }}>Joined {new Date(partner.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operational Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
        
        <Card>
          <CardHeader>
            <CardTitle>Operational Summary</CardTitle>
          </CardHeader>
          <CardContent style={{ padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Today's Deliveries</span>
              <span style={{ fontWeight: 600 }}>{partner.todaysDeliveries || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Active Deliveries</span>
              <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{partner.availability === 'BUSY' ? 1 : 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Completed Deliveries</span>
              <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>{partner.todaysDeliveries || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Delivery Activity</CardTitle>
          </CardHeader>
          <CardContent style={{ padding: 'var(--spacing-4)' }}>
            {partner.todaysDeliveries ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
                  <div style={{ padding: 'var(--spacing-2)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
                    <Package size={16} color="var(--color-primary)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Delivered Order #ORD-8921</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', display: 'flex', gap: 'var(--spacing-2)' }}>
                      <span style={{display: 'flex', alignItems: 'center', gap: 4}}><Clock size={12}/> Today, 10:45 AM</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
                  <div style={{ padding: 'var(--spacing-2)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
                    <MapPin size={16} color="var(--color-success)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Reached Customer Location</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', display: 'flex', gap: 'var(--spacing-2)' }}>
                      <span style={{display: 'flex', alignItems: 'center', gap: 4}}><Clock size={12}/> Today, 10:30 AM</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 'var(--spacing-4)', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                No recent activity today.
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
