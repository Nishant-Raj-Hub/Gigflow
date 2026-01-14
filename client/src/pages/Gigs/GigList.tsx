import { useGigs } from "@/hooks/use-gigs";
import { Navbar } from "@/components/Navbar";
import { GigCard } from "@/components/GigCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function GigList() {
  const [searchTerm, setSearchTerm] = useState("");
  // Simple debounce implementation could go here, but for brevity using direct state
  const { data: gigsData, isLoading } = useGigs(searchTerm);

  // Sort gigs: open status first, then assigned
  const gigs = gigsData
    ? [...gigsData].sort((a, b) => {
        if (a.status === "open" && b.status !== "open") return -1;
        if (a.status !== "open" && b.status === "open") return 1;
        return 0;
      })
    : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="bg-slate-900 py-16 text-center px-4">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
          Browse Available Gigs
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto mb-8">
          Find work that matches your skills and start earning today.
        </p>

        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            className="h-12 pl-12 bg-white/10 border-white/10 text-white placeholder:text-slate-400 focus-visible:ring-indigo-500 rounded-xl"
            placeholder="Search by title or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 bg-slate-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : gigs?.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No gigs found</h3>
            <p className="text-slate-500">Try adjusting your search terms.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {gigs?.map((gig) => (
              <GigCard key={gig._id || gig.id} gig={gig} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
