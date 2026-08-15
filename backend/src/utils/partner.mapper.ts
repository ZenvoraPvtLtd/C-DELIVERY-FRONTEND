import { IDeliveryPartner } from '../models/DeliveryPartner.model';

export const mapPartnerToDTO = (partner: IDeliveryPartner, todaysDeliveries?: number) => {
  return {
    _id: partner._id?.toString(),
    partner_code: partner.partnerId,
    full_name: partner.name,
    contact_number: partner.mobile,
    email_address: partner.email,
    availability_status: partner.availability,
    account_status: partner.status,
    created_at: partner.createdAt?.toISOString(),
    updated_at: partner.updatedAt?.toISOString(),
    todays_deliveries: todaysDeliveries || partner.todaysDeliveries || 0
  };
};
