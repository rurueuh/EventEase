import _home from "./pageClient";

export default async function Home({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const name = (await params).name;
  if (!name) return null;
  return <_home name={name} />;
};
