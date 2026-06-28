import { auth } from "../../auth";
import { redirect } from "next/navigation";
import RegisterClient from "./RegisterClient";
import Footer from "../../components/Footer";

export default async function RegisterWorkplacePage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <main className="flex-1 main-content-padded">
        <RegisterClient />
      </main>
      <Footer />
    </>
  );
}
