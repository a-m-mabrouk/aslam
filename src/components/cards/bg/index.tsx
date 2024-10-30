export default function BgCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white p-4">{children}</div>
  );
}
