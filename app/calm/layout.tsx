import CalmLayoutClient from "./CalmLayoutClient";

export default function CalmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CalmLayoutClient>{children}</CalmLayoutClient>;
}
