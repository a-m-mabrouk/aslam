import { Suspense, useState } from "react";
import PopupModal from "..";
import ReactPlayer from "react-player/lazy";
import Loading from "../../loading";

export default function PlayerModal({
  btn,
  title,
  url = "https://www.youtube.com/watch?v=E5xpipmBrKM&ab_channel=AnasAlhajj",
}: {
  title: string;
  btn: React.ReactNode;
  url?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {btn}
      </div>
      <PopupModal isOpen={open} closeModal={() => setOpen(false)} title={title}>
        <div className="relative grow">
          <Suspense fallback={<Loading position="absolute" />}>
            <ReactPlayer
              url={url}
              controls
              width="100%"
              config={{ file: { attributes: { controlsList: "nodownload" } } }}
            />
          </Suspense>
        </div>
      </PopupModal>
    </>
  );
}
