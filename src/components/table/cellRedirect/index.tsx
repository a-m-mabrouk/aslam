import { Link } from "react-router-dom";
export default function CellRedirect({
  children,
  url,
}: {
  children: React.ReactNode;
  url: string;
}) {
  return (
    <Link to={url} className="-z-10 before:absolute before:inset-0">
      {children}
    </Link>
  );
}
