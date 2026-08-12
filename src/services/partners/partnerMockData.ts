import { DeliveryPartner } from '@/types/partner';

// In-memory mutable array for the session
export let mockPartners: DeliveryPartner[] = [
  {
    id: '1',
    partnerId: 'DP-1001',
    name: 'Rahul Singh',
    mobile: '+919876543210',
    email: 'rahul.s@example.com',
    availability: 'AVAILABLE',
    status: 'ACTIVE',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
    todaysDeliveries: 12
  },
  {
    id: '2',
    partnerId: 'DP-1002',
    name: 'Amit Verma',
    mobile: '+919876543211',
    email: 'amit.v@example.com',
    availability: 'BUSY',
    status: 'ACTIVE',
    createdAt: '2023-02-20T11:30:00Z',
    updatedAt: '2023-02-20T11:30:00Z',
    todaysDeliveries: 8
  },
  {
    id: '3',
    partnerId: 'DP-1003',
    name: 'Vikram Sharma',
    mobile: '+919876543212',
    availability: 'INACTIVE',
    status: 'ACTIVE',
    createdAt: '2023-03-05T09:15:00Z',
    updatedAt: '2023-03-05T09:15:00Z',
    todaysDeliveries: 0
  },
  {
    id: '4',
    partnerId: 'DP-1004',
    name: 'Suresh Kumar',
    mobile: '+919876543213',
    email: 'suresh.k@example.com',
    availability: 'INACTIVE',
    status: 'INACTIVE',
    createdAt: '2023-04-10T14:45:00Z',
    updatedAt: '2023-04-10T14:45:00Z',
    todaysDeliveries: 0
  },
  {
    id: '5',
    partnerId: 'DP-1005',
    name: 'Deepak Patil',
    mobile: '+919876543214',
    availability: 'AVAILABLE',
    status: 'ACTIVE',
    createdAt: '2023-05-12T08:20:00Z',
    updatedAt: '2023-05-12T08:20:00Z',
    todaysDeliveries: 5
  },
  {
    id: '6',
    partnerId: 'DP-1006',
    name: 'Manoj Tiwari',
    mobile: '+919876543215',
    email: 'manoj.t@example.com',
    availability: 'BUSY',
    status: 'ACTIVE',
    createdAt: '2023-06-18T16:10:00Z',
    updatedAt: '2023-06-18T16:10:00Z',
    todaysDeliveries: 15
  },
  {
    id: '7',
    partnerId: 'DP-1007',
    name: 'Prakash Rao',
    mobile: '+919876543216',
    availability: 'AVAILABLE',
    status: 'ACTIVE',
    createdAt: '2023-07-22T13:05:00Z',
    updatedAt: '2023-07-22T13:05:00Z',
    todaysDeliveries: 2
  }
];
