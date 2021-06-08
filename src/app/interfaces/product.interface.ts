export interface Product {
    id: number,
    categoryId: number,
    objectId: number,
    name: string,
    description: string,
    image: string,
    price: number,
    displayPrice: number,
    available: boolean,
    quantity: number,
    unit: string,
    discount: boolean,
    discountPrice?: number,
    discountDisplayPrice?: number,
    updatedAt: string,
    createdAt: string,
    foodExtras: any;
    product?: any;
    productNote: string;
}