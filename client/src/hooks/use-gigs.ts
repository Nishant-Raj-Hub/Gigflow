import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, getAuthHeaders } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { createGigSchema, createBidSchema, type CreateGigInput, type CreateBidInput } from "@/lib/validation";
import { mockGigs } from "@/lib/mockData";


export function useGigs(search?: string) {
  return useQuery({
    queryKey: [api.gigs.list.path, search],
    queryFn: async () => {
      try {
        const url = search 
          ? `${buildUrl(api.gigs.list.path)}?search=${encodeURIComponent(search)}` 
          : buildUrl(api.gigs.list.path);
        
        const res = await fetch(url, { 
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error("Failed to fetch gigs");
        return await res.json();
      } catch (error) {
        // Return mock data if backend is not available
        console.log("Using mock data for gigs");
        return mockGigs;
      }
    },
  });
}

export function useGig(id: string | number) {
  return useQuery({
    queryKey: [api.gigs.get.path, id],
    queryFn: async () => {
      try {
        const url = buildUrl(api.gigs.get.path, { id: String(id) });
        const res = await fetch(url, {
          headers: getAuthHeaders(),
        });
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Failed to fetch gig details");
        return await res.json();
      } catch (error) {
        // Return mock data if backend is not available
        const gig = mockGigs.find(g => g.id === String(id) || g._id === String(id));
        console.log("Using mock data for gig");
        return gig || null;
      }
    },
    enabled: !!id,
  });
}

export function useCreateGig() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateGigInput) => {
      // Validate input with Zod
      const validated = createGigSchema.parse(data);
      
      const res = await fetch(buildUrl(api.gigs.create.path), {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create gig");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.gigs.list.path] });
      toast({ title: "Success", description: "Gig posted successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

// === BIDS ===

export function useBids(gigId: string | number) {
  return useQuery({
    queryKey: [api.bids.byGig.path, gigId],
    queryFn: async () => {
      const url = buildUrl(api.bids.byGig.path, { gigId: String(gigId) });
      const res = await fetch(url, { 
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch bids");
      return await res.json();
    },
    enabled: !!gigId,
  });
}

export function useCreateBid() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateBidInput) => {
      // Validate input with Zod
      const validated = createBidSchema.parse(data);
      
      const res = await fetch(buildUrl(api.bids.create.path), {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        throw new Error("Failed to submit bid");
      }
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.bids.byGig.path, variables.gigId] });
      queryClient.invalidateQueries({ queryKey: [api.gigs.get.path, variables.gigId] });
      toast({ title: "Success", description: "Bid submitted successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useHireBid() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ bidId, gigId }: { bidId: string | number; gigId: string | number }) => {
      const url = buildUrl(api.bids.hire.path, { bidId: String(bidId) });
      const res = await fetch(url, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ gigId: String(gigId) }),
      });
      
      if (!res.ok) throw new Error("Failed to hire freelancer");
      return await res.json();
    },
    onSuccess: (_, variables) => {
      // Use variables.gigId since response might not have it
      const gigId = variables.gigId;
      
      // Invalidate both gig and bids queries to fetch latest data
      queryClient.invalidateQueries({ queryKey: [api.gigs.get.path, String(gigId)] });
      queryClient.invalidateQueries({ queryKey: [api.bids.byGig.path, String(gigId)] });
      
      toast({ title: "Success", description: "Freelancer hired!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
