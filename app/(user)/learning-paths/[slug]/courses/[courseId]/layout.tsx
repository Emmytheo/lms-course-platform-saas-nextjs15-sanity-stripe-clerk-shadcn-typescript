import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth-wrapper";
import DashboardHeader from "@/components/DashboardHeader";

interface CourseLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseLayout({
  children,
  params,
}: CourseLayoutProps) {
  const { userId } = await getAuth();
  const { courseId } = await params;

  if (!userId) {
    return redirect("/sign-in");
  }

  return (
    <div className="h-full">
      <DashboardHeader />
      <main className="h-full mt-16 pt-4">{children}</main>
    </div>
  );
}
