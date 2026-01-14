// Type definitions that are safe for both client and server to import.
// No Mongoose or server-side runtime code here.

export interface IUser {
  _id?: string;
  username: string;
  password?: string; // excluded from client responses
  name: string;
  email: string;
  createdAt?: Date;
}

export interface IGig {
  _id?: string;
  title: string;
  description: string;
  budget: number;
  owner?: IUser | string; // can be populated or just ID
  status: "open" | "assigned";
  createdAt?: Date;
}

export interface IBid {
  _id?: string;
  gig?: IGig | string;
  freelancer?: IUser | string;
  message: string;
  price: number;
  status: "pending" | "hired" | "rejected";
  createdAt?: Date;
}

// Extended types for API responses
export type GigWithUser = IGig & { owner: IUser; bidCount?: number };
export type BidWithUser = IBid & { freelancer: IUser };

// Type aliases for convenience
export type UserType = IUser;
export type GigType = IGig;
export type BidType = IBid;
