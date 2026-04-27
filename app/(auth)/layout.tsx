import Logo from "@/components/logo";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-[32rem] w-[32rem] rounded-full bg-secondary/16 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-surface/30" />
      </div>

      <div className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6">
        <Logo className="text-2xl sm:text-3xl" />
      </div>
      <div className="relative mx-auto flex min-h-dvh max-w-6xl items-center justify-center px-4 py-14 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
