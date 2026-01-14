import { useRegister } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link } from "wouter";
import { Briefcase } from "lucide-react";

const RegisterSchema = Yup.object().shape({
  username: Yup.string().required("Required").min(3, "Too short"),
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required").min(6, "Must be at least 6 characters"),
});

export default function Register() {
  const register = useRegister();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10">
        <div className="text-center mb-8">
           <Link href="/">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg mx-auto mb-4 cursor-pointer">
              <Briefcase className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="text-2xl font-display font-bold text-slate-900">Create Account</h1>
          <p className="text-slate-500 text-sm mt-2">Join GigFlow to find work or hire talent</p>
        </div>

        <Formik
          initialValues={{ username: '', name: '', email: '', password: '' }}
          validationSchema={RegisterSchema}
          onSubmit={(values) => register.mutate(values)}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">Username</label>
                  <Field name="username" as={Input} className="h-11" />
                  {errors.username && touched.username && <div className="text-red-500 text-xs mt-1">{errors.username}</div>}
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">Full Name</label>
                  <Field name="name" as={Input} className="h-11" />
                  {errors.name && touched.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">Email</label>
                <Field name="email" type="email" as={Input} className="h-11" />
                {errors.email && touched.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">Password</label>
                <Field name="password" type="password" as={Input} className="h-11" />
                {errors.password && touched.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 font-semibold shadow-lg"
                disabled={register.isPending}
              >
                {register.isPending ? "Creating Account..." : "Sign Up"}
              </Button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link href="/login" className="text-indigo-600 font-semibold hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}
