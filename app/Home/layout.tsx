import Nav from "./Nav";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* FIXED: Added min-h-screen to prevent layout collapse */
    <main className="bg-slate-100 min-h-screen">
      <header>
        <Nav />
      </header>
      {children}
    </main>
  );
}
