import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../services/db";
import WorkplaceDetailClient from "../WorkplaceDetailClient";
import Footer from "../../../components/Footer";

export default async function WorkplaceDetailPage({ params }) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  // Next.js dynamic parameters resolution
  const resolvedParams = await params;
  const id = resolvedParams.id;

  let workplace;
  try {
    const checkApproved = await prisma.workplace.findFirst({
      where: { id, approved: true }
    });
    if (checkApproved) {
      workplace = await prisma.workplace.update({
        where: { id },
        data: { views: { increment: 1 } },
        include: {
          reviews: {
            where: { approved: true },
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    } else {
      workplace = null;
    }
  } catch (e) {
    workplace = null;
  }

  if (!workplace) {
    redirect("/dashboard");
  }

  // Calculate average rating
  const totalReviews = workplace.reviews.length;
  const avgRating = totalReviews > 0 
    ? workplace.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0.0;

  const formattedWorkplace = {
    ...workplace,
    averageRating: avgRating,
    totalReviews
  };

  return (
    <>
      <main className="flex-1 main-content-padded">
        <WorkplaceDetailClient 
          workplace={formattedWorkplace} 
          reviews={workplace.reviews} 
        />
      </main>
      <Footer />
    </>
  );
}
