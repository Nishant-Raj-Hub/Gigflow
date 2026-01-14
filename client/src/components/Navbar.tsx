import { Link, useLocation } from "wouter";
import { useAppSelector } from "@/hooks/use-redux";
import { useLogout } from "@/hooks/use-auth";
import { useGigs } from "@/hooks/use-gigs";
import { Briefcase, LogOut, LayoutDashboard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const logout = useLogout();
  const [location] = useLocation();
  const { data: allGigs } = useGigs();

  const isActive = (path: string) => location === path;

  // Check if user has posted any gigs
  const userGigsCount =
    allGigs?.filter(
      (gig: any) => gig.ownerId === user?._id || gig.owner?._id === user?._id
    ).length || 0;
  const showDashboard = userGigsCount > 0;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-xl font-display font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              GigFlow
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/gigs">
            <div
              className={`text-sm font-medium transition-colors cursor-pointer ${
                isActive("/gigs")
                  ? "text-indigo-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Browse Gigs
            </div>
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                {showDashboard && (
                  <div
                    className={`text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                      isActive("/dashboard")
                        ? "text-indigo-600"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </div>
                )}
              </Link>

              <Link href="/gigs/new">
                <Button
                  size="sm"
                  className="hidden md:flex gap-2 bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4" /> Post Gig
                </Button>
              </Link>

              <div className="flex items-center gap-4 pl-4 border-l">
                <div className="flex flex-col text-right hidden sm:block">
                  <span className="text-xs font-medium text-slate-500">
                    Logged in as 
                  </span>
                  <span className="text-sm font-semibold text-slate-900 leading-none">
                    <span> </span> {user?.username}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logout.mutate()}
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-slate-500 hover:text-red-600 transition-colors" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-slate-600 hover:text-indigo-600"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-md">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
