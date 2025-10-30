import { User } from "./user.model";

export interface Review {
    id: number,
    ocena: number;
    comment: string;
    seller: User;
    user: User;
}