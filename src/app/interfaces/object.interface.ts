import { User } from "./user.interface";

export interface ObjectResource {
    id: number,
    name: string,
    description: string,
    deliveryDays: {},
    type: number,
    city: string,
    delivery: true,
    email: string,
    image: string,
    minimumDelivery: number,
    rate: number,
    phone: string,
    status: number,
    address: string,
    totalCanceled: number,
    totalDelivered: number,
    totalEarned: number,
    totalProducts: number,
    visible: true,
    updatedAt: string,
    createdAt: string,
    admin: User,
    deliveryPrice: number;
    approximateDeliveryTime: string;
    extraPhone?: string;
}