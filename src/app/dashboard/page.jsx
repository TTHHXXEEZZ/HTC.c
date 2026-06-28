import { auth } from "../../auth";
import { redirect } from "next/navigation";
import { prisma } from "../../services/db";
import DashboardClient from "./DashboardClient";
import Footer from "../../components/Footer";

export default async function DashboardPage({ searchParams }) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  // Next.js searchParams resolution
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || "";
  const dept = resolvedParams.dept || "ทั้งหมด";

  // Fetch site view count
  let siteViews = 0;
  try {
    const viewRecord = await prisma.siteView.findUnique({
      where: { id: 1 }
    });
    siteViews = viewRecord ? viewRecord.count : 412;
  } catch (e) {
    siteViews = 412;
  }

  // Fetch establishments from database
  const workplaces = await prisma.workplace.findMany({
    where: { approved: true },
    include: {
      reviews: {
        where: { approved: true }
      },
    },
  });

  // Format workplaces (calculating rating and reviews count)
  const formattedWorkplaces = workplaces.map(wp => {
    const totalReviews = wp.reviews.length;
    const avgRating = totalReviews > 0 
      ? wp.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0.0;
    return {
      ...wp,
      averageRating: avgRating,
      totalReviews,
    };
  });

  return (
    <>
      <main className="flex-1">
        <DashboardClient 
          workplaces={formattedWorkplaces} 
          siteViews={siteViews}
          initialSearchTerm={q}
          initialSelectedDept={dept}
        />
      </main>
      <Footer />
    </>
  );
}
