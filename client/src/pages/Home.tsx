import { useGigs } from "@/hooks/use-gigs";
import { Navbar } from "@/components/Navbar";
import { GigCard } from "@/components/GigCard";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, CheckCircle2, Zap, Shield } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: gigs, isLoading } = useGigs();
  const [search, setSearch] = useState("");

  const recentGigs = gigs?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-6 border border-indigo-100">
              #1 Marketplace for Indian Freelancers
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 tracking-tight mb-8">
              Find the perfect <span className="text-indigo-600">freelance services</span> for your business
            </h1>
            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with talented freelancers to get your projects done. Secure payments, professional quality, and timely delivery.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
              <Link href="/gigs">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-lg shadow-lg shadow-indigo-500/30">
                  Find Work
                </Button>
              </Link>
              <Link href="/gigs/new">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-lg border-2 hover:bg-slate-50">
                  Post a Gig
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Fast Delivery", desc: "Get your work done quickly with our verified talent pool." },
              { icon: Shield, title: "Secure Payments", desc: "Your money is held safely until you approve the work." },
              { icon: CheckCircle2, title: "Quality Assured", desc: "Review portfolios and ratings before hiring." },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Gigs */}
      <div className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Latest Opportunities</h2>
              <p className="text-slate-500">Fresh gigs posted by top clients</p>
            </div>
            <Link href="/gigs">
              <Button variant="ghost" className="hidden sm:flex group text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                View all gigs <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentGigs.map((gig: any) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/gigs">
              <Button className="w-full">View all gigs</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
