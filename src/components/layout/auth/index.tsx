import LangBtn from "../../button/langBtn";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto grid grid-cols-1 grid-rows-[auto_1fr] gap-4">
      <div className="flex justify-end py-4">
        <LangBtn />
      </div>
      <div className="flex justify-center pb-4">
        <div className="mx-auto mb-4 flex w-full max-w-[1000px] grow overflow-hidden rounded-xl shadow-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
