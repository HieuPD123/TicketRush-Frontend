import BookingDetailsScreen from "@/features/booking/components/booking-details-screen";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <BookingDetailsScreen eventId={id} />;
}
