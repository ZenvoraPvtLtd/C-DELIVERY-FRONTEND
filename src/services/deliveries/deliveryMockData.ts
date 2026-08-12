import { DeliveryOrder, DeliveryTimelineEvent, AssignmentHistoryRecord } from '@/types/delivery';

const getPastDate = (minutes: number) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - minutes);
  return d.toISOString();
};

const createTimelineEvent = (status: any, minutesAgo: number, notes?: string): DeliveryTimelineEvent => ({
  id: Math.random().toString(36).substring(7),
  status,
  timestamp: getPastDate(minutesAgo),
  actor: 'System',
  notes
});

const createAssignment = (orderId: string, partnerId: string, minutesAgo: number, status: 'ACTIVE' | 'SUPERSEDED' | 'CLOSED' = 'ACTIVE', closedAgo?: number, reason?: string): AssignmentHistoryRecord => ({
  id: Math.random().toString(36).substring(7),
  orderId,
  partnerId,
  assignedAt: getPastDate(minutesAgo),
  closedAt: closedAgo ? getPastDate(closedAgo) : undefined,
  status,
  reason
});

export let mockDeliveries: DeliveryOrder[] = [
  {
    id: 'd1', orderId: 'ORD-9001', customerName: 'Anil Kapoor', customerPhone: '+919876543001', deliveryAddress: '14, Palm Grove, Bandra West', orderAmount: 1450.00, orderDate: getPastDate(45), priority: 'HIGH', status: 'WAITING_FOR_ASSIGNMENT',
    timeline: [createTimelineEvent('WAITING_FOR_ASSIGNMENT', 45)],
    assignmentHistory: []
  },
  {
    id: 'd2', orderId: 'ORD-9002', customerName: 'Priya Desai', customerPhone: '+919876543002', deliveryAddress: 'A-201, Sunrise Apts, Andheri East', orderAmount: 850.50, orderDate: getPastDate(120), priority: 'MEDIUM', status: 'WAITING_FOR_ASSIGNMENT',
    timeline: [createTimelineEvent('WAITING_FOR_ASSIGNMENT', 120)],
    assignmentHistory: []
  },
  {
    id: 'd3', orderId: 'ORD-9003', customerName: 'Ramesh Singh', customerPhone: '+919876543003', deliveryAddress: 'Shop No 4, Main Market, Dadar', orderAmount: 3200.00, orderDate: getPastDate(15), priority: 'LOW', status: 'WAITING_FOR_ASSIGNMENT',
    timeline: [createTimelineEvent('WAITING_FOR_ASSIGNMENT', 15)],
    assignmentHistory: []
  },
  // Some assigned and active orders
  {
    id: 'd6', orderId: 'ORD-8990', customerName: 'John Doe', customerPhone: '+919876543006', deliveryAddress: 'MG Road, Pune', orderAmount: 500.00, orderDate: getPastDate(300), priority: 'MEDIUM', status: 'ASSIGNED', partnerId: '1', assignedAt: getPastDate(280),
    timeline: [createTimelineEvent('WAITING_FOR_ASSIGNMENT', 300), createTimelineEvent('ASSIGNED', 280)],
    assignmentHistory: [createAssignment('ORD-8990', '1', 280)]
  },
  {
    id: 'd7', orderId: 'ORD-8991', customerName: 'Jane Smith', customerPhone: '+919876543007', deliveryAddress: 'Koregaon Park, Pune', orderAmount: 750.00, orderDate: getPastDate(180), priority: 'HIGH', status: 'OUT_FOR_DELIVERY', partnerId: '2', assignedAt: getPastDate(170), pickupAt: getPastDate(150), outForDeliveryAt: getPastDate(120),
    timeline: [createTimelineEvent('WAITING_FOR_ASSIGNMENT', 180), createTimelineEvent('ASSIGNED', 170), createTimelineEvent('PICKED_UP', 150), createTimelineEvent('OUT_FOR_DELIVERY', 120)],
    assignmentHistory: [createAssignment('ORD-8991', '2', 170)]
  },
  {
    id: 'd8', orderId: 'ORD-8992', customerName: 'Vikas Sharma', customerPhone: '+919876543008', deliveryAddress: 'Baner, Pune', orderAmount: 1100.00, orderDate: getPastDate(90), priority: 'MEDIUM', status: 'PICKED_UP', partnerId: '3', assignedAt: getPastDate(80), pickupAt: getPastDate(30),
    timeline: [createTimelineEvent('WAITING_FOR_ASSIGNMENT', 90), createTimelineEvent('ASSIGNED', 80), createTimelineEvent('PICKED_UP', 30)],
    assignmentHistory: [createAssignment('ORD-8992', '3', 80)]
  }
  ,
  {
    id: 'd9', orderId: 'ORD-8901', customerName: 'Sanjay Dutt', customerPhone: '+919876543009', deliveryAddress: 'Marine Drive, Mumbai', orderAmount: 4500.00, orderDate: getPastDate(1440), priority: 'LOW', status: 'DELIVERED', partnerId: '4', assignedAt: getPastDate(1400), pickupAt: getPastDate(1380), outForDeliveryAt: getPastDate(1350), deliveredAt: getPastDate(1300),
    timeline: [createTimelineEvent('WAITING_FOR_ASSIGNMENT', 1440), createTimelineEvent('ASSIGNED', 1400), createTimelineEvent('PICKED_UP', 1380), createTimelineEvent('OUT_FOR_DELIVERY', 1350), createTimelineEvent('DELIVERED', 1300)],
    assignmentHistory: [createAssignment('ORD-8901', '4', 1400, 'CLOSED', 1300, 'Delivered')]
  },
  {
    id: 'd10', orderId: 'ORD-8902', customerName: 'Deepika Padukone', customerPhone: '+919876543010', deliveryAddress: 'Bandra Bandstand', orderAmount: 999.00, orderDate: getPastDate(2880), priority: 'HIGH', status: 'FAILED', partnerId: '1', assignedAt: getPastDate(2860), pickupAt: getPastDate(2840), outForDeliveryAt: getPastDate(2800), failedAt: getPastDate(2700), failureReason: 'Customer unavailable', failureNotes: 'Door was locked, no answer on phone.',
    timeline: [createTimelineEvent('WAITING_FOR_ASSIGNMENT', 2880), createTimelineEvent('ASSIGNED', 2860), createTimelineEvent('PICKED_UP', 2840), createTimelineEvent('OUT_FOR_DELIVERY', 2800), createTimelineEvent('FAILED', 2700, 'Customer unavailable - Door was locked, no answer on phone.')],
    assignmentHistory: [createAssignment('ORD-8902', '1', 2860, 'CLOSED', 2700, 'Delivery Failed')]
  }
];
