import { Navbar } from "@/components/Navbar";
import { useCreateGig } from "@/hooks/use-gigs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useAppSelector } from "@/hooks/use-redux";
import { useEffect } from "react";
import { Briefcase, IndianRupee } from "lucide-react";

const GigSchema = Yup.object().shape({
  title: Yup.string().required("Title is required").min(5, "Title is too short"),
  description: Yup.string().required("Description is required").min(20, "Please provide more detail"),
  budget: Yup.number().required("Budget is required").min(100, "Budget must be at least ₹100"),
});

export default function CreateGig() {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const [, setLocation] = useLocation();
  const createGig = useCreateGig();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 p-8 text-center">
            <div className="w-12 h-12 bg-indigo-500 rounded-xl mx-auto flex items-center justify-center mb-4 text-white shadow-lg shadow-indigo-500/50">
              <Briefcase className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white mb-2">Post a New Gig</h1>
            <p className="text-slate-400 text-sm">Describe your project and find the perfect talent.</p>
          </div>

          <div className="p-8">
            <Formik
              initialValues={{ title: '', description: '', budget: '' }}
              validationSchema={GigSchema}
              onSubmit={(values) => {
                createGig.mutate({
                  ...values,
                  budget: Number(values.budget),
                }, {
                  onSuccess: () => setLocation('/gigs')
                });
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Project Title</label>
                    <Field 
                      name="title" 
                      as={Input} 
                      placeholder="e.g. Build a React Ecommerce Website" 
                      className="h-12 text-base"
                    />
                    {errors.title && touched.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                    <Field 
                      name="description" 
                      as={Textarea} 
                      placeholder="Detail your requirements, skills needed, and timeline..." 
                      className="min-h-[150px] text-base resize-none"
                    />
                    {errors.description && touched.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Budget (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Field 
                        name="budget" 
                        as={Input} 
                        type="number" 
                        placeholder="5000" 
                        className="pl-10 h-12 text-base font-mono"
                      />
                    </div>
                    {errors.budget && touched.budget && <div className="text-red-500 text-xs mt-1">{errors.budget}</div>}
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
                      disabled={isSubmitting || createGig.isPending}
                    >
                      {createGig.isPending ? "Publishing..." : "Post Gig Now"}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
