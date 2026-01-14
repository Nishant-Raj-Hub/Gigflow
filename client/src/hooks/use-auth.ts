import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@/lib/api";
import { useAppDispatch } from "./use-redux";
import { setCredentials, logout } from "../store/authSlice";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@/lib/validation";

export function useAuth() {
  const dispatch = useAppDispatch();
  
  // This query runs on mount to check session
  return useQuery({
    queryKey: ["/api/user"],
    queryFn: async () => {
      const res = await fetch(buildUrl(api.auth.me.path), { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error("Failed to fetch user");
      }
      const user = await res.json();
      dispatch(setCredentials(user));
      return user;
    },
    retry: false,
    staleTime: Infinity,
  });
}

export function useLogin() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      // Validate input with Zod
      const validated = loginSchema.parse(data);
      
      const res = await fetch(buildUrl(api.auth.login.path), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
      }
      return await res.json();
    },
    onSuccess: (user) => {
      dispatch(setCredentials(user));
      toast({ title: "Welcome back!", description: `Logged in as ${user.username}` });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    },
  });
}

export function useRegister() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      // Validate input with Zod
      const validated = registerSchema.parse(data);
      
      const res = await fetch(buildUrl(api.auth.register.path), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
      }
      return await res.json();
    },
    onSuccess: (user) => {
      dispatch(setCredentials(user));
      toast({ title: "Account created!", description: "Welcome to GigFlow" });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    },
  });
}

export function useLogout() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await fetch(buildUrl(api.auth.logout.path), { 
        method: "POST",
        credentials: "include"
      });
    },
    onSuccess: () => {
      dispatch(logout());
      queryClient.clear();
      toast({ title: "Logged out", description: "Come back soon!" });
      setLocation("/login");
    },
  });
}
