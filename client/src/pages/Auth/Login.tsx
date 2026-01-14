import { useLogin } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link } from "wouter";
import { Briefcase } from "lucide-react";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
});

export default function Login() {
  const login = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10">
        <div className="text-center mb-8">
          <Link href="/">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg mx-auto mb-4 cursor-pointer">
              <Briefcase className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="text-2xl font-display font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 text-sm mt-2">Log in to manage your gigs and bids</p>
        </div>

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={(values) => login.mutate(values)}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">Username</label>
                <Field name="username" as={Input} className="h-11" placeholder="Enter your username" />
                {errors.username && touched.username && <div className="text-red-500 text-xs mt-1">{errors.username}</div>}
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">Password</label>
                <Field name="password" type="password" as={Input} className="h-11" placeholder="Enter your password" />
                {errors.password && touched.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-lg shadow-indigo-500/20"
                disabled={login.isPending}
              >
                {login.isPending ? "Logging in..." : "Log In"}
              </Button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-center text-sm text-slate-500">
          Don't have an account? <Link href="/register" className="text-indigo-600 font-semibold hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
