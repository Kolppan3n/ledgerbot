export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col size-full items-center pt-[20vh]">
      {children}
    </main>
  );
}
