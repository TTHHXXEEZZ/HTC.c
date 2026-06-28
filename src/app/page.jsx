import { auth } from "../auth";
import { redirect } from "next/navigation";
import { prisma } from "../services/db";
import HomeClient from "./HomeClient";
import Footer from "../components/Footer";

export default async function IndexPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  // Increment total site views on startup page rendering
  let viewRecord;
  try {
    viewRecord = await prisma.siteView.update({
      where: { id: 1 },
      data: { count: { increment: 1 } },
    });
  } catch (e) {
    // Fallback if not seeded
    viewRecord = { count: 412 };
  }

  // Fetch establishments
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
        <HomeClient 
          workplaces={formattedWorkplaces} 
          siteViews={viewRecord.count} 
        />
      </main>
      <Footer />
    </>
  );
}
