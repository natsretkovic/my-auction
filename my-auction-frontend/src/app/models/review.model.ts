import { User } from "./user.model";

export interface Review {
    id: number,
    ocena: number;
    komentar: string;
    seller: User;
    user: User;
}