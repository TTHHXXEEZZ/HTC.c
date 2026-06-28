import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../services/db";
import JobPostClient from "./JobPostClient";
import Footer from "../../../components/Footer";

export default async function JobPostPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  // Fetch all workplaces to populate the selection list
  const workplaces = await prisma.workplace.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <>
      <main className="flex-1 main-content-padded">
        <JobPostClient 
          workplaces={JSON.parse(JSON.stringify(workplaces))} 
          user={session.user}
        />
      </main>
      <Footer />
    </>
  );
}