import Footer from "@/components/footer";
import NavBar from "@/components/navbar";

import EventDetailScreen from "./event-detail-screen";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-dvh">
      <NavBar />
      <main className="pt-24">
        <EventDetailScreen eventId={id} />
      </main>
      <Footer />
    </div>
  );
}
