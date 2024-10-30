import Loading from "..";

export default function PlaceHolderLoading({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) {
  return loading ? <Loading position="absolute" /> : children;
}
