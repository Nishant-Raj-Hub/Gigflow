import { useGig, useBids, useCreateBid, useHireBid } from "@/hooks/use-gigs";
import { useAppSelector } from "@/hooks/use-redux";
import { Navbar } from "@/components/Navbar";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useRoute, Link } from "wouter";
import {
  IndianRupee,
  Clock,
  User,
  Briefcase,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useState } from "react";

const BidSchema = Yup.object().shape({
  price: Yup.number()
    .required("Price is required")
    .min(1, "Price must be positive"),
  message: Yup.string()
    .required("Proposal message is required")
    .min(10, "Message too short"),
});

export default function GigDetail() {
  const [, params] = useRoute("/gigs/:id");
  const gigId = params?.id || ""; // Keep as string
  const [processingBidId, setProcessingBidId] = useState<string | null>(null);

  const { data: gig, isLoading: gigLoading } = useGig(gigId);
  const { data: bids, isLoading: bidsLoading } = useBids(gigId);
  const createBid = useCreateBid();
  const hireBid = useHireBid();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const isOwner = user?._id === (gig?.ownerId || gig?.owner?._id);
  const hasBid = bids?.some(
    (b: (typeof bids)[number]) => b.freelancerId === user?._id
  );
  const isGigOpen = gig?.status === "open";

  if (gigLoading)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        Loading...
      </div>
    );
  if (!gig)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        Gig not found
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />

      <div className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <Link
            href="/gigs"
            className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Gigs
          </Link>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <StatusBadge status={gig.status as any} />
                <span className="text-slate-400 text-sm flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Posted{" "}
                  {gig.createdAt
                    ? formatDistanceToNow(new Date(gig.createdAt))
                    : ""}{" "}
                  ago
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
                {gig.title}
              </h1>
              {gig.owner && typeof gig.owner === "object" && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                    {gig.owner.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {gig.owner.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      @{gig.owner.username}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border min-w-[200px] text-center md:text-right">
              <div className="text-sm text-slate-500 mb-1">Budget</div>
              <div className="text-3xl font-mono font-bold text-indigo-600 flex items-center justify-center md:justify-end">
                <IndianRupee className="w-6 h-6" />
                {gig.budget.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="font-display font-bold text-xl border-b pb-4">
              Project Description
            </CardHeader>
            <CardContent className="pt-6 text-slate-600 leading-relaxed whitespace-pre-wrap">
              {gig.description}
            </CardContent>
          </Card>

          {/* Bidding Section for Freelancers */}
          {!isOwner && isAuthenticated && isGigOpen && !hasBid && (
            <Card className="shadow-md border-indigo-100 overflow-hidden">
              <div className="bg-indigo-600 p-4 text-white font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5" /> Submit a Proposal
              </div>
              <CardContent className="pt-6">
                <Formik
                  initialValues={{ price: gig.budget, message: "" }}
                  validationSchema={BidSchema}
                  onSubmit={(values, { resetForm }) => {
                    createBid.mutate({
                      gigId,
                      price: Number(values.price),
                      message: values.message,
                    });
                    resetForm();
                  }}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">
                          Your Bid Amount (₹)
                        </label>
                        <Field
                          name="price"
                          as={Input}
                          type="number"
                          placeholder="Enter amount"
                        />
                        {errors.price && touched.price && (
                          <div className="text-red-500 text-xs mt-1">
                            {String(errors.price)}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">
                          Cover Letter
                        </label>
                        <Field
                          name="message"
                          as={Textarea}
                          placeholder="Why are you the best fit for this gig?"
                          className="h-32"
                        />
                        {errors.message && touched.message && (
                          <div className="text-red-500 text-xs mt-1">
                            {String(errors.message)}
                          </div>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                        disabled={createBid.isPending}
                      >
                        {createBid.isPending ? "Submitting..." : "Place Bid"}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </Card>
          )}

          {/* User Feedback States */}
          {!isAuthenticated && (
            <div className="bg-slate-100 p-8 rounded-xl text-center">
              <p className="text-slate-600 mb-4">
                Log in to bid on this project
              </p>
              <Link href="/login">
                <Button>Log In</Button>
              </Link>
            </div>
          )}

          {hasBid && (
            <div className="bg-green-50 border border-green-200 p-6 rounded-xl flex items-center gap-4 text-green-800">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-bold">Proposal Submitted</div>
                <div className="text-sm opacity-80">
                  You have already placed a bid on this gig.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bids List (Visible to Owner) */}
        {isOwner && (
          <div className="lg:col-span-1">
            <h3 className="font-display font-bold text-xl mb-4 flex items-center justify-between">
              Received Bids
              <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs">
                {bids?.length || 0}
              </span>
            </h3>

            <div className="space-y-4">
              {bidsLoading ? (
                <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
              ) : bids?.length === 0 ? (
                <div className="text-slate-500 text-sm italic border-dashed border-2 border-slate-200 rounded-xl p-8 text-center">
                  No bids yet.
                </div>
              ) : (
                bids?.map((bid: (typeof bids)[number]) => (
                  <div
                    key={bid._id || bid.id}
                    className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                          {bid.freelancer.username[0].toUpperCase()}
                        </div>
                        <div className="font-semibold text-sm">
                          {bid.freelancer.username}
                        </div>
                      </div>
                      <StatusBadge status={bid.status as any} />
                    </div>

                    <div className="text-2xl font-mono font-bold text-slate-900 mb-3 flex items-center">
                      <IndianRupee className="w-4 h-4 text-slate-400" />
                      {bid.price.toLocaleString()}
                    </div>

                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg mb-4 italic">
                      "{bid.message}"
                    </p>

                    {bid.status === "pending" && isGigOpen && (
                      <Button
                        size="sm"
                        className="w-full bg-slate-900 hover:bg-slate-800"
                        onClick={() => {
                          setProcessingBidId(bid._id || bid.id);
                          hireBid.mutate(
                            {
                              bidId: bid._id || bid.id,
                              gigId: gig._id || gig.id,
                            },
                            {
                              onSuccess: () => {
                                setProcessingBidId(null);
                              },
                              onError: () => {
                                setProcessingBidId(null);
                              },
                            }
                          );
                        }}
                        disabled={processingBidId === (bid._id || bid.id)}
                      >
                        {processingBidId === (bid._id || bid.id)
                          ? "Processing..."
                          : "Hire Freelancer"}
                      </Button>
                    )}
                    {bid.status === "hired" && (
                      <div className="flex items-center gap-2 bg-green-50 border border-green-200 p-3 rounded-lg text-green-700 font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        Hired
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
