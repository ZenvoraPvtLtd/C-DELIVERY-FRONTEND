import Assignment, { IAssignment } from '../models/Assignment.model';
import { AssignmentStatus } from '../constants/assignmentStatus';
import { FilterQuery, Types } from 'mongoose';

export class AssignmentRepository {
  async getActiveAssignmentByDeliveryId(deliveryId: string): Promise<IAssignment | null> {
    return await Assignment.findOne({ 
      deliveryId: new Types.ObjectId(deliveryId), 
      status: 'ACTIVE', 
      isDeleted: false 
    });
  }

  async getAssignmentsByDeliveryId(deliveryId: string): Promise<IAssignment[]> {
    return await Assignment.find({ 
      deliveryId: new Types.ObjectId(deliveryId), 
      isDeleted: false 
    }).sort({ assignedAt: -1 });
  }

  async create(data: Partial<IAssignment>): Promise<IAssignment> {
    return await Assignment.create(data);
  }

  async markAsSuperseded(assignmentId: string, reason: string, notes?: string): Promise<IAssignment | null> {
    return await Assignment.findByIdAndUpdate(
      assignmentId,
      { 
        $set: { 
          status: 'SUPERSEDED' as AssignmentStatus, 
          closedAt: new Date(),
          reason,
          notes
        } 
      },
      { new: true }
    );
  }
}

export const assignmentRepository = new AssignmentRepository();
