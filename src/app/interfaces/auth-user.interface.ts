import { ObjectResource } from "./object.interface";

export interface AuthUser {
    id: number,
    email: string,
    role: number,
    createdAt: string,
    object?: ObjectResource,
    accessToken: string
}