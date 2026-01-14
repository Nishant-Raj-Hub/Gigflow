export interface IUser {
  _id?: string;
  username: string;
  password?: string;
  name: string;
  email: string;
  createdAt?: Date;
}

export interface IGig {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  budget: number;
  owner?: IUser | string;
  ownerId?: string;
  status: "open" | "assigned";
  createdAt?: Date;
}

export interface IBid {
  _id?: string;
  id?: string;
  gig?: IGig | string;
  gigId?: string;
  freelancer?: IUser | string;
  freelancerId?: string;
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
