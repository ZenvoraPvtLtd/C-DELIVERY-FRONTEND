"use client";
import React, { useEffect } from 'react';
import { AuditLog } from '@/types/audit';
import { X, ArrowRight, User, Hash, Clock, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AuditDetailDrawerProps {
  log: AuditLog | null;
  onClose: () => void;
}

export function AuditDetailDrawer({ log, onClose }: AuditDetailDrawerProps) {
  useEffect(() => {
    if (log) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [log]);

  if (!log) return null;

  const renderValue = (val: any) => {
    if (!val) return <span style={{ color: 'var(--color-text-muted)' }}>None</span>;
    if (typeof val === 'string') return val;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
        {Object.entries(val).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', gap: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>{k}:</span>
            <span style={{ fontWeight: 500 }}>{String(v)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div 
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 90,
          opacity: log ? 1 : 0, transition: 'opacity 0.2s ease',
          pointerEvents: log ? 'auto' : 'none'
        }}
        onClick={onClose}
      />
      <div 
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: '100%', maxWidth: 500, backgroundColor: 'var(--color-surface)',
          boxShadow: 'var(--shadow-xl)', zIndex: 100,
          transform: log ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex', flexDirection: 'column'
        }}
      >
        <div style={{ 
          padding: 'var(--spacing-4) var(--spacing-6)', 
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>Audit Event Details</h2>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>{log.id}</p>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}><X size={16} /></Button>
        </div>

        <div style={{ padding: 'var(--spacing-6)', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <Clock size={16} color="var(--color-text-muted)" />
              <div style={{ flex: 1, fontSize: 'var(--font-size-sm)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Timestamp: </span>
                <span style={{ fontWeight: 500 }}>{new Date(log.timestamp).toLocaleString()}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <User size={16} color="var(--color-text-muted)" />
              <div style={{ flex: 1, fontSize: 'var(--font-size-sm)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Actor: </span>
                <span style={{ fontWeight: 500 }}>{log.actor.name}</span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', marginLeft: 8 }}>({log.actor.role.replace(/_/g, ' ')})</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <FileText size={16} color="var(--color-text-muted)" />
              <div style={{ flex: 1, fontSize: 'var(--font-size-sm)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Action: </span>
                <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{log.action.replace(/_/g, ' ')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <Hash size={16} color="var(--color-text-muted)" />
              <div style={{ flex: 1, fontSize: 'var(--font-size-sm)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Module: </span>
                <span style={{ fontWeight: 500 }}>{log.module}</span>
                {log.recordId && (
                  <span style={{ marginLeft: 8, fontFamily: 'var(--font-mono)' }}>[{log.recordId}]</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-3)', color: 'var(--color-text-secondary)' }}>Changes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <div style={{ padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: '#FEF2F2' }}>
                <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>OLD VALUE</div>
                {renderValue(log.oldValue)}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ArrowRight size={20} color="var(--color-text-muted)" />
              </div>

              <div style={{ padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: '#F0FDF4' }}>
                <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>NEW VALUE</div>
                {renderValue(log.newValue)}
              </div>
            </div>
          </div>

          {log.reason && (
            <div>
              <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-3)', color: 'var(--color-text-secondary)' }}>Reason / Notes</h3>
              <div style={{ display: 'flex', gap: 'var(--spacing-3)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', backgroundColor: '#FFFBEB', border: '1px solid #FEF3C7' }}>
                <AlertCircle size={18} color="#D97706" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 'var(--font-size-sm)', color: '#92400E' }}>{log.reason}</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
