import type { Express } from "express";
import type { Server } from "http";
import { setupAuth } from "./auth.js";
import { storage } from "./storage.js";
import { api } from "./shared/routes.js";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth (JWT via HttpOnly cookie)
  setupAuth(app);

  // Gigs Routes
  app.get(api.gigs.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const gigs = await storage.getGigs(search);
    res.json(gigs);
  });

  app.get(api.gigs.get.path, async (req, res) => {
    const id = req.params.id as string;
    if (!id) return res.status(404).json({ message: "Invalid ID" });

    const gig = await storage.getGig(id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    res.json(gig);
  });

  app.post(api.gigs.create.path, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { title, description, budget } = req.body;
    
    // Basic validation
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ message: "Invalid title", field: "title" });
    }
    if (!description || typeof description !== 'string') {
      return res.status(400).json({ message: "Invalid description", field: "description" });
    }
    if (typeof budget !== 'number' || budget < 0) {
      return res.status(400).json({ message: "Invalid budget", field: "budget" });
    }

    try {
      const gig = await storage.createGig({ title, description, budget, ownerId: String((req.user as any)._id) });
      res.status(201).json(gig);
    } catch (err) {
      return res.status(500).json({ message: "Failed to create gig" });
    }
  });

  // Bids Routes
  app.post(api.bids.create.path, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { gigId, message, price } = req.body;
    
    // Basic validation
    if (!gigId || typeof gigId !== 'string') {
      return res.status(400).json({ message: "Invalid gig ID", field: "gigId" });
    }
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: "Invalid message", field: "message" });
    }
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ message: "Invalid price", field: "price" });
    }

    try {
      const bid = await storage.createBid({ gigId, message, price, freelancerId: String((req.user as any)._id) });
      res.status(201).json(bid);
    } catch (err) {
      return res.status(500).json({ message: "Failed to create bid" });
    }
  });

  app.get(api.bids.byGig.path, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const gigId = req.params.gigId as string;
    if (!gigId) return res.status(404).json({ message: "Invalid Gig ID" });

    // Check ownership
    const gig = await storage.getGig(gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    if (String((gig as any).owner?._id || (gig as any).owner) !== String((req.user as any)._id)) {
       return res.status(403).json({ message: "Only the gig owner can view bids" });
    }

    const bids = await storage.getBidsByGig(gigId);
    res.json(bids);
  });

  app.patch(api.bids.hire.path, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const bidId = req.params.bidId as string;
    if (!bidId) return res.status(404).json({ message: "Invalid Bid ID" });
    
    try {
      const { gigId } = req.body;
      if (!gigId) return res.status(400).json({ message: "gigId is required in body" });

      // ensure requester is owner of gig
      const gig = await storage.getGig(gigId);
      if (!gig) return res.status(404).json({ message: "Gig not found" });
      if (String((gig as any).owner?._id || (gig as any).owner) !== String((req.user as any)._id)) {
        return res.status(403).json({ message: "Only the gig owner can hire" });
      }

      const updatedBid = await storage.hireBid(bidId, gigId);
      res.json(updatedBid);
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  });

  // Seed Data (if empty)
    const existingUsers = await storage.getUserByUsername("client");
    if (!existingUsers) {
    const { hashPassword } = await import("./auth");
    const password = await hashPassword("password");
    
    // Create Users
    const client = await storage.createUser({
      username: "client",
      password,
      name: "Client User",
      email: "client@example.com",
    });
    const freelancer = await storage.createUser({
      username: "freelancer",
      password,
      name: "Freelancer User",
      email: "freelancer@example.com",
    });

    // Create Gigs
    const gig1 = await storage.createGig({
      title: "Build a React Website",
      description: "Need a modern React website with Tailwind CSS.",
      budget: 50000,
      ownerId: String((client as any)._id),
    });
    const gig2 = await storage.createGig({
      title: "Logo Design",
      description: "Minimalist logo for a tech startup.",
      budget: 15000,
      ownerId: String((client as any)._id),
    });

    // Create Bid
    await storage.createBid({
      gigId: String((gig1 as any)._id),
      freelancerId: String((freelancer as any)._id),
      message: "I can build this in 3 days. I have 5 years of experience.",
      price: 45000,
    });
    }

  return httpServer;
}
