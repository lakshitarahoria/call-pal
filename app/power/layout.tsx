import PowerLayoutClient from "./PowerLayoutClient";

export default function PowerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PowerLayoutClient>{children}</PowerLayoutClient>;
}
