import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../services/db";
import InternsPostClient from "./InternsPostClient";
import Footer from "../../../components/Footer";

export default async function InternsPostPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  // Fetch student profile if it exists for this user email
  const profile = await prisma.studentProfile.findUnique({
    where: { email: session.user.email }
  });

  return (
    <>
      <main className="flex-1 main-content-padded">
        <InternsPostClient 
          initialProfile={JSON.parse(JSON.stringify(profile))} 
          user={session.user}
        />
      </main>
      <Footer />
    </>
  );
}