import Link from "next/link";

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="TicketRush"
      className={
        "inline-flex select-none items-center font-extrabold tracking-tight transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 " +
        (className ?? "")
      }
    >
      <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        TicketRush
      </span>
    </Link>
  );
}
