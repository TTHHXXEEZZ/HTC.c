import { auth } from "../../auth";
import { redirect } from "next/navigation";
import { prisma } from "../../services/db";
import JobsClient from "./JobsClient";
import Footer from "../../components/Footer";

export default async function JobsPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const jobs = await prisma.internshipJob.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <>
      <main className="flex-1 main-content-padded">
        <JobsClient 
          initialJobs={JSON.parse(JSON.stringify(jobs))} 
          user={session.user}
        />
      </main>
      <Footer />
    </>
  );
}
