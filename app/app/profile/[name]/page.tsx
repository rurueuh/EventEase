import UserProfilePage from "./pageClient";

export default async function Home({
  params,
}: Readonly<{
  params: Promise<{ name: string }>;
}>) {
  const name = (await params).name;

  if (!name) return null;

  return <UserProfilePage name={name} />;
}
