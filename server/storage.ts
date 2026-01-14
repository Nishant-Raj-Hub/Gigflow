import { User, Gig, Bid } from "./shared/schema.js";
import { IUser, IGig, IBid } from "./shared/types.js";
import { connectDb } from "./db.js";
import mongoose from "mongoose";

export interface IStorage {
  // Users
  getUser(id: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  createUser(user: Partial<IUser>): Promise<IUser>;

  // Gigs
  getGigs(search?: string): Promise<Array<any>>;
  getGig(id: string): Promise<any | null>;
  createGig(gig: { title: string; description: string; budget: number; ownerId: string }): Promise<IGig>;
  updateGigStatus(id: string, status: "open" | "assigned"): Promise<IGig | null>;

  // Bids
  createBid(bid: { gigId: string; freelancerId: string; message: string; price: number }): Promise<IBid>;
  getBidsByGig(gigId: string): Promise<Array<any>>;
  hireBid(bidId: string, gigId: string): Promise<IBid>;
}

export class MongoStorage implements IStorage {
  constructor() {
    // ensure DB connection
    connectDb().catch((err) => console.error("Mongo connect error:", err));
  }

  async getUser(id: string) {
    return await User.findById(id).lean().exec();
  }

  async getUserByUsername(username: string) {
    return await User.findOne({ username }).lean().exec();
  }

  async createUser(user: Partial<IUser>) {
    const doc = await User.create(user as any);
    return doc.toObject() as IUser;
  }

  async getGigs(search?: string) {
    const filter: any = {};
    if (search) filter.title = { $regex: search, $options: "i" };
    const gigs = await Gig.find(filter).populate("owner").sort({ createdAt: -1 }).lean().exec();
    // add bidCount
    const results = await Promise.all(
      gigs.map(async (g) => {
        const count = await Bid.countDocuments({ gig: g._id });
        return { ...g, bidCount: count };
      }),
    );
    return results;
  }

  async getGig(id: string) {
    return await Gig.findById(id).populate("owner").lean().exec();
  }

  async createGig(gig: { title: string; description: string; budget: number; ownerId: string }) {
    const doc = await Gig.create({
      title: gig.title,
      description: gig.description,
      budget: gig.budget,
      owner: new mongoose.Types.ObjectId(gig.ownerId),
    } as any);
    return doc.toObject() as IGig;
  }

  async updateGigStatus(id: string, status: "open" | "assigned") {
    const doc = await Gig.findByIdAndUpdate(id, { status }, { new: true }).lean().exec();
    return doc as IGig | null;
  }

  async createBid(bid: { gigId: string; freelancerId: string; message: string; price: number }) {
    const doc = await Bid.create({
      gig: new mongoose.Types.ObjectId(bid.gigId),
      freelancer: new mongoose.Types.ObjectId(bid.freelancerId),
      message: bid.message,
      price: bid.price,
    } as any);
    return doc.toObject() as IBid;
  }

  async getBidsByGig(gigId: string) {
    return await Bid.find({ gig: gigId }).populate("freelancer").sort({ createdAt: -1 }).lean().exec();
  }

  async hireBid(bidId: string, gigId: string) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const hired = await Bid.findByIdAndUpdate(bidId, { status: "hired" }, { new: true, session }).exec();
      if (!hired) throw new Error("Bid not found");

      await Bid.updateMany({ gig: gigId, _id: { $ne: hired._id } }, { status: "rejected" }, { session }).exec();

      await Gig.findByIdAndUpdate(gigId, { status: "assigned" }, { session }).exec();

      await session.commitTransaction();
      return hired.toObject() as IBid;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
}

export const storage = new MongoStorage();
