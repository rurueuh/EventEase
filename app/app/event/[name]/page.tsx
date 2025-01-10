import EventDetailsPage from "./pageClient";

export default async function Home({
  params,
}: Readonly<{
  params: Promise<{ name: string }>;
}>) {
  let name = (await params).name;

  if (!name) return null;

  name.replaceAll("_", " ");

  return <EventDetailsPage name={name} />;
}
