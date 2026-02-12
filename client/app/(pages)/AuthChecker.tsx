"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import Loading from "@/components/loading";
import { useDispatch } from "react-redux";
import { fetchUser } from "@/features/user/userSlice";
import type { AppDispatch } from "@/utils/store";

const publicRoutes = ["/login", "/login/factor-one"];

export default function AuthChecker({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    setIsChecking(false);

    // إذا كان المستخدم غير مسجل والصفحة الحالية ليست من الصفحات العامة
    if (!user && !publicRoutes.includes(pathname)) {
      router.push("/login");
      return;
    }

    // إذا كان المستخدم مسجلًا وهو في صفحة تسجيل/دخول
    if (user && publicRoutes.includes(pathname)) {
      router.push("/");
      return;
    }
  }, [isLoaded, user, pathname, router]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const token = await getToken();
        if (token) {
          dispatch(fetchUser(token));
        }
      };
      fetchData();
    }
  }, [user, getToken, dispatch]);

  if (!isLoaded || isChecking) {
    if (!isMounted) {
      return null; // Don't render anything on server
    }
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
}
