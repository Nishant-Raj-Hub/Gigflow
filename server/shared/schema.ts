import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser, IGig, IBid } from "./types";

// TypeScript interfaces for input validation
export interface InsertUser {
  username: string;
  password: string;
  name: string;
  email: string;
}

export interface InsertGig {
  title: string;
  description: string;
  budget: number;
}

export interface InsertBid {
  gigId: string;
  message: string;
  price: number;
}

// Mongoose schemas
const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: () => new Date() },
});

const GigSchema = new Schema<IGig>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["open", "assigned"], default: "open" },
  createdAt: { type: Date, default: () => new Date() },
});

const BidSchema = new Schema<IBid>({
  gig: { type: Schema.Types.ObjectId, ref: "Gig", required: true },
  freelancer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ["pending", "hired", "rejected"], default: "pending" },
  createdAt: { type: Date, default: () => new Date() },
});

export const User = mongoose.models.User as Model<IUser> || mongoose.model<IUser>("User", UserSchema);
export const Gig = mongoose.models.Gig as Model<IGig> || mongoose.model<IGig>("Gig", GigSchema);
export const Bid = mongoose.models.Bid as Model<IBid> || mongoose.model<IBid>("Bid", BidSchema);
