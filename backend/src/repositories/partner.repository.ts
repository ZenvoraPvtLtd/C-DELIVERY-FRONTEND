import DeliveryPartner, { IDeliveryPartner } from '../models/DeliveryPartner.model';
import Delivery from '../models/Delivery.model';
import { FilterQuery } from 'mongoose';
import { PartnerStatus, PartnerAvailability } from '../constants/partnerStatus';

export class PartnerRepository {
  async getPartners(filters: any, page: number, limit: number) {
    const query: FilterQuery<IDeliveryPartner> = { isDeleted: false };

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { mobile: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { partnerId: { $regex: filters.search, $options: 'i' } }
      ];
    }

    if (filters.status && filters.status !== 'ALL') {
      query.status = filters.status;
    }

    if (filters.availability && filters.availability !== 'ALL') {
      query.availability = filters.availability;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      DeliveryPartner.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      DeliveryPartner.countDocuments(query)
    ]);

    return {
      data,
      meta: {
        total,
        page,
        pageSize: limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findById(id: string): Promise<IDeliveryPartner | null> {
    return await DeliveryPartner.findOne({ _id: id, isDeleted: false });
  }

  async findByMobile(mobile: string, excludeId?: string): Promise<IDeliveryPartner | null> {
    const query: any = { mobile, isDeleted: false };
    if (excludeId) query._id = { $ne: excludeId };
    return await DeliveryPartner.findOne(query);
  }

  async findByEmail(email: string, excludeId?: string): Promise<IDeliveryPartner | null> {
    const query: any = { email: email.toLowerCase(), isDeleted: false };
    if (excludeId) query._id = { $ne: excludeId };
    return await DeliveryPartner.findOne(query);
  }

  async findByPartnerCode(partnerId: string): Promise<IDeliveryPartner | null> {
    return await DeliveryPartner.findOne({ partnerId, isDeleted: false });
  }

  async create(data: Partial<IDeliveryPartner>): Promise<IDeliveryPartner> {
    return await DeliveryPartner.create(data);
  }

  async update(id: string, updates: Partial<IDeliveryPartner>): Promise<IDeliveryPartner | null> {
    return await DeliveryPartner.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updates },
      { new: true }
    );
  }

  async updateStatus(id: string, status: PartnerStatus): Promise<IDeliveryPartner | null> {
    return await DeliveryPartner.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { status } },
      { new: true }
    );
  }

  async updateAvailability(id: string, availability: PartnerAvailability): Promise<IDeliveryPartner | null> {
    return await DeliveryPartner.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { availability } },
      { new: true }
    );
  }

  async countTodaysDeliveries(partnerObjectId: string): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return await Delivery.countDocuments({
      partnerId: partnerObjectId,
      assignedAt: { $gte: startOfDay, $lte: endOfDay }
    });
  }
}

export const partnerRepository = new PartnerRepository();
