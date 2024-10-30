/* eslint-disable tailwindcss/no-custom-classname */
export default function Loading({
  position = "fixed",
}: {
  position?: "fixed" | "absolute";
}) {
  return (
    <div
      className={`${position} inset-0 z-50 grid min-h-screen place-content-center bg-white`}
    >
      <span className="loader relative inline-block size-[48px] rotate-45"></span>
    </div>
  );
}
