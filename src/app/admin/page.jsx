import { auth } from "../../auth";
import { redirect } from "next/navigation";
import { prisma } from "../../services/db";
import AdminClient from "./AdminClient";
import Footer from "../../components/Footer";

export default async function AdminPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  // Check if session email is a registered admin
  const isMainAdmin = session.user.email === "67219010003@htc.ac.th";
  const adminDbRecord = await prisma.adminEmail.findUnique({
    where: { email: session.user.email }
  });

  if (!isMainAdmin && !adminDbRecord) {
    return (
      <>
        <main className="flex-1 main-content-padded" style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ padding: "80px 24px", textAlign: "center", maxWidth: "480px", background: "white", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
            <h2 style={{ fontSize: "1.8rem", color: "var(--danger)", fontWeight: "800" }}>🔒 Access Denied</h2>
            <p style={{ marginTop: "12px", color: "var(--slate)", fontSize: "0.95rem", lineHeight: "1.6" }}>
              หน้าเว็บนี้สำหรับผู้ดูแลระบบเท่านั้น อีเมลของคุณไม่มีสิทธิ์ในการเข้าถึงส่วนแอดมิน
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Fetch all workplaces (both pending and approved)
  const workplaces = await prisma.workplace.findMany({
    orderBy: { createdAt: "desc" },
    include: { reviews: true }
  });

  // Fetch all reviews (both pending and approved)
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { workplace: true }
  });

  // Fetch allowed admin emails
  const adminEmails = await prisma.adminEmail.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <>
      <main className="flex-1 main-content-padded">
        <AdminClient 
          workplaces={JSON.parse(JSON.stringify(workplaces))} 
          reviews={JSON.parse(JSON.stringify(reviews))} 
          adminEmails={JSON.parse(JSON.stringify(adminEmails))}
          currentUserEmail={session.user.email}
        />
      </main>
      <Footer />
    </>
  );
}
