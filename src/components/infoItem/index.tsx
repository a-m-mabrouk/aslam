export default function InfoItem({
  title,
  value,
}: {
  title: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <p className="capitalize text-gray-500">{title}</p>
      <p className="capitalize">{value}</p>
    </div>
  );
}
