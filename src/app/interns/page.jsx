import { auth } from "../../auth";
import { redirect } from "next/navigation";
import { prisma } from "../../services/db";
import InternsClient from "./InternsClient";
import Footer from "../../components/Footer";

export default async function InternsPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const profiles = await prisma.studentProfile.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <>
      <main className="flex-1 main-content-padded">
        <InternsClient 
          initialProfiles={JSON.parse(JSON.stringify(profiles))} 
          sessionUser={session.user}
        />
      </main>
      <Footer />
    </>
  );
}
