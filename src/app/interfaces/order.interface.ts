import { ObjectResource } from "./object.interface";
import { Product } from "./product.interface";
import { User } from "./user.interface";

export interface Order {
    id: number,
    objectId: number,
    object?: ObjectResource,
    currierId: number,
    userId: number,
    user?: User,
    orderCancelledUserId: number,
    products?: Product[],
    orderItems?: Product[],
    order: number,
    status: number,
    totalPrice: number,
    cancelNote: string,
    deliveryAddress: string,
    deliveryNote: string,
    updatedAt: string,
    createdAt: string,
    commission: any,
    pickupType: number
    totalDisplayPrice: any
}