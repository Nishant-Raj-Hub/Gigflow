import { type GigWithUser } from "@/lib/types";
import { Link } from "wouter";
import { User, Clock, IndianRupee } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { formatDistanceToNow } from "date-fns";

export function GigCard({ gig }: { gig: GigWithUser }) {
  return (
    <Link href={`/gigs/${gig._id || gig.id}`}>
      <div className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <StatusBadge status={gig.status as any} />
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {gig.createdAt
              ? formatDistanceToNow(new Date(gig.createdAt), {
                  addSuffix: true,
                })
              : "Recently"}
          </span>
        </div>

        <h3 className="text-lg font-display font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {gig.title}
        </h3>

        <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-grow">
          {gig.description}
        </p>

        <div className="pt-4 border-t flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500">Posted by</span>
              <span className="text-xs font-semibold text-slate-900">
                {gig.owner && typeof gig.owner === "object"
                  ? gig.owner.name || "Unknown"
                  : "Unknown"}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500">Budget</span>
            <div className="flex items-center text-indigo-600 font-bold font-mono">
              <IndianRupee className="w-3.5 h-3.5" />
              {gig.budget.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
