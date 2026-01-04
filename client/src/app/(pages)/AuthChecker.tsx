"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import Loading from "../components/loading";

const publicRoutes = ["/login", "/login/factor-one"];

export default function AuthChecker({ children }: { children: React.ReactNode }) {
  const { isLoaded, user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

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
  }, [isLoaded, user, pathname]);

  useEffect(() => {
    if (user) {
      getToken().then((token) => {
        console.log("User token:", token);
      });
    }
  }, [user])

  if (!isLoaded || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
}