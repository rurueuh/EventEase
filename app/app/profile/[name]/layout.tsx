export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex flex-col gap-4">
      <div className="inline-block w-lg">{children}</div>
    </section>
  );
}
