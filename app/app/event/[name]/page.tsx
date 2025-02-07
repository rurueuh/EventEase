import EventDetailsPage from "./pageClient";

export default async function Home({
  params,
}: Readonly<{
  params: Promise<{ name: string }>;
}>) {
  let eventID = (await params).name;

  if (!eventID) return null;

  return <EventDetailsPage eventID={eventID} />;
}
