import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.model';
import DeliveryPartner from '../src/models/DeliveryPartner.model';
import Order from '../src/models/Order.model';
import Delivery from '../src/models/Delivery.model';
import Assignment from '../src/models/Assignment.model';
import TimelineEvent from '../src/models/TimelineEvent.model';
import AuditLog from '../src/models/AuditLog.model';
import { ROLES } from '../src/constants/roles';
import { PERMISSIONS } from '../src/constants/permissions';

const seedDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/delivery_management';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding...');

    // WARNING: This clears the database before seeding! 
    // Only run this in development/demo environments.
    if (process.env.NODE_ENV === 'production') {
      console.error('Cannot run seed script in production environment.');
      process.exit(1);
    }

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Order.deleteMany({});
    await Delivery.deleteMany({});
    await DeliveryPartner.deleteMany({});
    await Assignment.deleteMany({});
    await TimelineEvent.deleteMany({});
    await AuditLog.deleteMany({});
    console.log('Existing data cleared.');

    console.log('Creating Admin User...');
    const adminPassword = process.env.ADMIN_PASSWORD || 'Demo@123456';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    const admin = await User.create({
      name: 'Demo Admin',
      email: 'admin@cdelivery.demo', // Match the exact email expected by the mock for a smooth transition
      passwordHash,
      role: ROLES.SUPER_ADMIN,
      permissions: Object.values(PERMISSIONS),
      isActive: true
    });
    console.log('Admin user created successfully.');

    console.log('Creating Mock Delivery Partners...');
    const partner1 = await DeliveryPartner.create({
      partnerId: 'DP-001',
      name: 'Michael Knight',
      mobile: '+1234567891',
      email: 'michael.k@cdelivery.demo',
      availability: 'AVAILABLE',
      status: 'ACTIVE'
    });

    const partner2 = await DeliveryPartner.create({
      partnerId: 'DP-002',
      name: 'Sarah Connor',
      mobile: '+1234567892',
      email: 'sarah.c@cdelivery.demo',
      availability: 'BUSY',
      status: 'ACTIVE'
    });

    const partner3 = await DeliveryPartner.create({
      partnerId: 'DP-003',
      name: 'Tony Stark',
      mobile: '+1234567893',
      email: 'tony.s@cdelivery.demo',
      availability: 'UNAVAILABLE',
      status: 'SUSPENDED'
    });
    
    console.log('Mock deliveries created successfully.');
    
    // Waiting for assignment
    const orderWaiting = await Order.create({
      orderId: 'ORD-1001',
      customerName: 'John Doe',
      customerPhone: '+1234567890',
      deliveryAddress: '123 Main St, Cityville',
      orderAmount: 45.50,
      orderDate: new Date(),
      status: 'PREPARING'
    });

    const deliveryWaiting = await Delivery.create({
      orderId: 'ORD-1001',
      customerName: 'John Doe',
      customerPhone: '+1234567890',
      deliveryAddress: '123 Main St, Cityville',
      orderAmount: 45.50,
      orderDate: orderWaiting.orderDate,
      priority: 'HIGH',
      status: 'WAITING_FOR_ASSIGNMENT'
    });
    
    await TimelineEvent.create({
      deliveryId: deliveryWaiting._id,
      orderId: deliveryWaiting.orderId,
      status: 'WAITING_FOR_ASSIGNMENT',
      eventType: 'STATUS_CHANGE',
      actorId: 'SYSTEM',
      actorRole: 'SYSTEM',
      notes: 'Order placed, waiting for assignment',
      timestamp: deliveryWaiting.orderDate
    });

    // Assigned
    const orderAssigned = await Order.create({
      orderId: 'ORD-1002',
      customerName: 'Jane Smith',
      customerPhone: '+1987654321',
      deliveryAddress: '456 Oak Ave, Townsburg',
      orderAmount: 32.00,
      orderDate: new Date(Date.now() - 3600000),
      status: 'READY'
    });

    const deliveryAssigned = await Delivery.create({
      orderId: 'ORD-1002',
      customerName: 'Jane Smith',
      customerPhone: '+1987654321',
      deliveryAddress: '456 Oak Ave, Townsburg',
      orderAmount: 32.00,
      orderDate: orderAssigned.orderDate,
      priority: 'STANDARD',
      status: 'ASSIGNED',
      partnerId: partner1._id,
      assignedAt: new Date(Date.now() - 1800000)
    });
    
    await Assignment.create({
      orderId: deliveryAssigned.orderId,
      deliveryId: deliveryAssigned._id,
      partnerId: partner1._id,
      assignedAt: deliveryAssigned.assignedAt,
      status: 'ACTIVE',
      assignmentType: 'MANUAL'
    });

    await TimelineEvent.create([
      {
        deliveryId: deliveryAssigned._id,
        orderId: deliveryAssigned.orderId,
        status: 'WAITING_FOR_ASSIGNMENT',
        eventType: 'STATUS_CHANGE',
        actorId: 'SYSTEM',
        timestamp: deliveryAssigned.orderDate
      },
      {
        deliveryId: deliveryAssigned._id,
        orderId: deliveryAssigned.orderId,
        status: 'ASSIGNED',
        previousStatus: 'WAITING_FOR_ASSIGNMENT',
        eventType: 'STATUS_CHANGE',
        actorId: admin._id,
        actorRole: 'SUPER_ADMIN',
        timestamp: deliveryAssigned.assignedAt
      }
    ]);

    // Out for delivery
    const orderOut = await Order.create({
      orderId: 'ORD-1003',
      customerName: 'Bob Johnson',
      customerPhone: '+1555555555',
      deliveryAddress: '789 Pine Rd, Villageton',
      orderAmount: 112.75,
      orderDate: new Date(Date.now() - 7200000),
      status: 'HANDED_OVER'
    });

    const deliveryOut = await Delivery.create({
      orderId: 'ORD-1003',
      customerName: 'Bob Johnson',
      customerPhone: '+1555555555',
      deliveryAddress: '789 Pine Rd, Villageton',
      orderAmount: 112.75,
      orderDate: orderOut.orderDate,
      priority: 'URGENT',
      status: 'OUT_FOR_DELIVERY',
      partnerId: partner2._id,
      assignedAt: new Date(Date.now() - 5400000),
      pickupAt: new Date(Date.now() - 3600000),
      outForDeliveryAt: new Date(Date.now() - 1800000)
    });

    await Assignment.create({
      orderId: deliveryOut.orderId,
      deliveryId: deliveryOut._id,
      partnerId: partner2._id,
      assignedAt: deliveryOut.assignedAt,
      status: 'ACTIVE',
      assignmentType: 'MANUAL'
    });

    await TimelineEvent.create([
      {
        deliveryId: deliveryOut._id, orderId: deliveryOut.orderId, status: 'WAITING_FOR_ASSIGNMENT', eventType: 'STATUS_CHANGE', timestamp: deliveryOut.orderDate, actorId: 'SYSTEM'
      },
      {
        deliveryId: deliveryOut._id, orderId: deliveryOut.orderId, status: 'ASSIGNED', previousStatus: 'WAITING_FOR_ASSIGNMENT', eventType: 'STATUS_CHANGE', timestamp: deliveryOut.assignedAt, actorId: admin._id, actorRole: 'SUPER_ADMIN'
      },
      {
        deliveryId: deliveryOut._id, orderId: deliveryOut.orderId, status: 'PICKED_UP', previousStatus: 'ASSIGNED', eventType: 'STATUS_CHANGE', timestamp: deliveryOut.pickupAt, actorId: partner2._id, actorRole: 'DELIVERY_PARTNER'
      },
      {
        deliveryId: deliveryOut._id, orderId: deliveryOut.orderId, status: 'OUT_FOR_DELIVERY', previousStatus: 'PICKED_UP', eventType: 'STATUS_CHANGE', timestamp: deliveryOut.outForDeliveryAt, actorId: partner2._id, actorRole: 'DELIVERY_PARTNER'
      }
    ]);

    // Delivered
    const orderDelivered = await Order.create({
      orderId: 'ORD-1004',
      customerName: 'Alice Brown',
      customerPhone: '+1444444444',
      deliveryAddress: '321 Elm St, Hamlet',
      orderAmount: 15.25,
      orderDate: new Date(Date.now() - 86400000 * 2), // 2 days ago
      status: 'HANDED_OVER'
    });

    const deliveryDelivered = await Delivery.create({
      orderId: 'ORD-1004',
      customerName: 'Alice Brown',
      customerPhone: '+1444444444',
      deliveryAddress: '321 Elm St, Hamlet',
      orderAmount: 15.25,
      orderDate: orderDelivered.orderDate,
      priority: 'STANDARD',
      status: 'DELIVERED',
      partnerId: partner1._id,
      assignedAt: new Date(Date.now() - 86400000 * 2 + 1800000),
      pickupAt: new Date(Date.now() - 86400000 * 2 + 3600000),
      outForDeliveryAt: new Date(Date.now() - 86400000 * 2 + 5400000),
      deliveredAt: new Date(Date.now() - 86400000 * 2 + 7200000)
    });

    await Assignment.create({
      orderId: deliveryDelivered.orderId,
      deliveryId: deliveryDelivered._id,
      partnerId: partner1._id,
      assignedAt: deliveryDelivered.assignedAt,
      status: 'ACTIVE',
      assignmentType: 'MANUAL'
    });

    await TimelineEvent.create([
      {
        deliveryId: deliveryDelivered._id, orderId: deliveryDelivered.orderId, status: 'WAITING_FOR_ASSIGNMENT', eventType: 'STATUS_CHANGE', timestamp: deliveryDelivered.orderDate, actorId: 'SYSTEM'
      },
      {
        deliveryId: deliveryDelivered._id, orderId: deliveryDelivered.orderId, status: 'ASSIGNED', previousStatus: 'WAITING_FOR_ASSIGNMENT', eventType: 'STATUS_CHANGE', timestamp: deliveryDelivered.assignedAt, actorId: admin._id, actorRole: 'SUPER_ADMIN'
      },
      {
        deliveryId: deliveryDelivered._id, orderId: deliveryDelivered.orderId, status: 'PICKED_UP', previousStatus: 'ASSIGNED', eventType: 'STATUS_CHANGE', timestamp: deliveryDelivered.pickupAt, actorId: partner1._id, actorRole: 'DELIVERY_PARTNER'
      },
      {
        deliveryId: deliveryDelivered._id, orderId: deliveryDelivered.orderId, status: 'OUT_FOR_DELIVERY', previousStatus: 'PICKED_UP', eventType: 'STATUS_CHANGE', timestamp: deliveryDelivered.outForDeliveryAt, actorId: partner1._id, actorRole: 'DELIVERY_PARTNER'
      },
      {
        deliveryId: deliveryDelivered._id, orderId: deliveryDelivered.orderId, status: 'DELIVERED', previousStatus: 'OUT_FOR_DELIVERY', eventType: 'STATUS_CHANGE', timestamp: deliveryDelivered.deliveredAt, actorId: partner1._id, actorRole: 'DELIVERY_PARTNER'
      }
    ]);

    // Failed
    const orderFailed = await Order.create({
      orderId: 'ORD-1005',
      customerName: 'Charlie Davis',
      customerPhone: '+1666666666',
      deliveryAddress: '654 Maple Dr, Countryside',
      orderAmount: 55.00,
      orderDate: new Date(Date.now() - 86400000), // 1 day ago
      status: 'HANDED_OVER'
    });

    const deliveryFailed = await Delivery.create({
      orderId: 'ORD-1005',
      customerName: 'Charlie Davis',
      customerPhone: '+1666666666',
      deliveryAddress: '654 Maple Dr, Countryside',
      orderAmount: 55.00,
      orderDate: orderFailed.orderDate,
      priority: 'HIGH',
      status: 'FAILED',
      partnerId: partner2._id,
      assignedAt: new Date(Date.now() - 86400000 + 1800000),
      pickupAt: new Date(Date.now() - 86400000 + 3600000),
      outForDeliveryAt: new Date(Date.now() - 86400000 + 5400000),
      failedAt: new Date(Date.now() - 86400000 + 7200000),
      failureReason: 'Customer not available',
      attemptCount: 1
    });

    await Assignment.create({
      orderId: deliveryFailed.orderId,
      deliveryId: deliveryFailed._id,
      partnerId: partner2._id,
      assignedAt: deliveryFailed.assignedAt,
      status: 'ACTIVE',
      assignmentType: 'MANUAL'
    });

    await TimelineEvent.create([
      {
        deliveryId: deliveryFailed._id, orderId: deliveryFailed.orderId, status: 'WAITING_FOR_ASSIGNMENT', eventType: 'STATUS_CHANGE', timestamp: deliveryFailed.orderDate, actorId: 'SYSTEM'
      },
      {
        deliveryId: deliveryFailed._id, orderId: deliveryFailed.orderId, status: 'ASSIGNED', previousStatus: 'WAITING_FOR_ASSIGNMENT', eventType: 'STATUS_CHANGE', timestamp: deliveryFailed.assignedAt, actorId: admin._id, actorRole: 'SUPER_ADMIN'
      },
      {
        deliveryId: deliveryFailed._id, orderId: deliveryFailed.orderId, status: 'PICKED_UP', previousStatus: 'ASSIGNED', eventType: 'STATUS_CHANGE', timestamp: deliveryFailed.pickupAt, actorId: partner2._id, actorRole: 'DELIVERY_PARTNER'
      },
      {
        deliveryId: deliveryFailed._id, orderId: deliveryFailed.orderId, status: 'OUT_FOR_DELIVERY', previousStatus: 'PICKED_UP', eventType: 'STATUS_CHANGE', timestamp: deliveryFailed.outForDeliveryAt, actorId: partner2._id, actorRole: 'DELIVERY_PARTNER'
      },
      {
        deliveryId: deliveryFailed._id, orderId: deliveryFailed.orderId, status: 'FAILED', previousStatus: 'OUT_FOR_DELIVERY', eventType: 'STATUS_CHANGE', timestamp: deliveryFailed.failedAt, actorId: partner2._id, actorRole: 'DELIVERY_PARTNER', notes: deliveryFailed.failureReason
      }
    ]);

    console.log('Mock deliveries created successfully.');

    // Audit Logs
    console.log('Creating Mock Audit Logs...');
    const adminActor = { userId: admin._id?.toString(), name: admin.name, role: admin.role };
    const systemActor = { userId: 'SYSTEM', name: 'SYSTEM', role: 'SYSTEM' };

    await AuditLog.create([
      {
        timestamp: new Date(Date.now() - 86400000 * 3),
        actor: adminActor,
        action: 'UPDATE_PARTNER',
        module: 'DELIVERY_PARTNERS',
        recordId: partner1._id?.toString(),
        oldValue: null,
        newValue: { name: partner1.name, status: partner1.status },
        reason: 'Partner Created'
      },
      {
        timestamp: new Date(Date.now() - 86400000 * 3),
        actor: adminActor,
        action: 'UPDATE_PARTNER',
        module: 'DELIVERY_PARTNERS',
        recordId: partner2._id?.toString(),
        oldValue: null,
        newValue: { name: partner2.name, status: partner2.status },
        reason: 'Partner Created'
      },
      {
        timestamp: deliveryAssigned.assignedAt,
        actor: adminActor,
        action: 'ASSIGN_DELIVERY',
        module: 'ASSIGNMENTS',
        recordId: deliveryAssigned._id?.toString(),
        oldValue: null,
        newValue: { partnerId: partner1._id?.toString(), deliveryId: deliveryAssigned._id?.toString() },
        reason: 'Assigned to ' + partner1.name
      },
      {
        timestamp: deliveryDelivered.deliveredAt,
        actor: systemActor, // usually the partner doing it via app
        action: 'COMPLETE_DELIVERY',
        module: 'DELIVERY',
        recordId: deliveryDelivered._id?.toString(),
        oldValue: { status: 'OUT_FOR_DELIVERY' },
        newValue: { status: 'DELIVERED' },
        reason: 'Delivery status changed from OUT_FOR_DELIVERY to DELIVERED'
      },
      {
        timestamp: deliveryFailed.failedAt,
        actor: systemActor,
        action: 'MARK_DELIVERY_FAILED',
        module: 'DELIVERY',
        recordId: deliveryFailed._id?.toString(),
        oldValue: { status: 'OUT_FOR_DELIVERY' },
        newValue: { status: 'FAILED' },
        reason: 'Delivery status changed from OUT_FOR_DELIVERY to FAILED'
      }
    ]);
    console.log('Mock Audit Logs created successfully.');

    // Notifications
    console.log('Creating Mock Notifications...');
    const Notification = (await import('../src/models/Notification.model')).default;
    await Notification.deleteMany({});
    
    await Notification.create([
      {
        recipientId: admin._id?.toString(),
        type: 'DELIVERY_ASSIGNED',
        title: 'Delivery Assigned',
        message: `Delivery ${orderAssigned.orderId} has been assigned to ${partner1.name}.`,
        entityType: 'DELIVERY',
        entityId: deliveryAssigned._id?.toString(),
        priority: 'NORMAL',
        isRead: true,
        createdAt: new Date(Date.now() - 1700000)
      },
      {
        recipientId: admin._id?.toString(),
        type: 'DELIVERY_STATUS_UPDATE',
        title: 'Delivery Out for Delivery',
        message: `Delivery ${orderOut.orderId} is now OUT FOR DELIVERY.`,
        entityType: 'DELIVERY',
        entityId: deliveryOut._id?.toString(),
        priority: 'NORMAL',
        isRead: false,
        createdAt: new Date(Date.now() - 1800000)
      },
      {
        recipientId: admin._id?.toString(),
        type: 'DELIVERY_FAILED',
        title: 'Delivery Failed',
        message: `Delivery ${orderFailed.orderId} failed. Reason: ${deliveryFailed.failureReason}`,
        entityType: 'DELIVERY',
        entityId: deliveryFailed._id?.toString(),
        priority: 'HIGH',
        isRead: false,
        createdAt: new Date(Date.now() - 86400000 + 7200000)
      },
      {
        recipientId: admin._id?.toString(),
        type: 'SYSTEM_ALERT',
        title: 'System Maintenance',
        message: 'Scheduled maintenance this Sunday at 2 AM.',
        priority: 'LOW',
        isRead: false,
        createdAt: new Date()
      }
    ]);
    console.log('Mock Notifications created successfully.');

    console.log('Seeding completed successfully (Framework ready).');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
