import { Navbar } from "@/components/Navbar";
import { useGigs } from "@/hooks/use-gigs";
import { useAppSelector } from "@/hooks/use-redux";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { GigCard } from "@/components/GigCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [, setLocation] = useLocation();
  const { data: allGigs, isLoading } = useGigs();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;

  // Client View: Gigs I posted
  const myGigs =
    allGigs?.filter(
      (gig: any) => gig.ownerId === user?._id || gig.owner?._id === user?._id
    ) || [];

  // Sort gigs: open status first, then assigned
  const sortedMyGigs = [...myGigs].sort((a, b) => {
    if (a.status === "open" && b.status !== "open") return -1;
    if (a.status !== "open" && b.status === "open") return 1;
    return 0;
  });

  // Freelancer View: Gigs I'm assigned to (Ideally backend would support a dedicated /api/my-gigs endpoint, filtering here for MVP)
  // Note: We can't easily filter "bids I made" without fetching all bids for all gigs, which is inefficient.
  // For MVP, we'll just show Owned Gigs. Real app would have user.bids relation or dedicated endpoint.

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="bg-white border-b py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
            My Dashboard
          </h1>
          <p className="text-slate-500">
            Manage your projects and track your activity.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="posted" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="posted" className="gap-2">
              <Briefcase className="w-4 h-4" /> My Posted Gigs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posted">
            {isLoading ? (
              <div>Loading...</div>
            ) : myGigs.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  No Gigs Posted Yet
                </h3>
                <p className="text-slate-500 mb-6">
                  Create your first gig to start finding talent.
                </p>
                <Button onClick={() => setLocation("/gigs/new")}>
                  Post a Gig
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedMyGigs.map((gig) => (
                  <GigCard key={gig._id || gig.id} gig={gig} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
