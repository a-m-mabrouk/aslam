import { type ReactNode, useState } from "react";
import { PlayCircleIcon, DocumentTextIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { Modal } from "flowbite-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import useGetLang from "../../../hooks/useGetLang";

// Set the worker URL for `react-pdf` with the correct version (2.15.349)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const LoginHelp = () => {
  const [pages, setPages] = useState<number[]>([]);
  const { lang } = useGetLang();
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    for (let i: number = 1; i <= numPages; i++) {
      setPages((prev) => [...prev, i]);
    }
  }
  return (
    <fieldset className="justify-self-center rounded-lg border-2 px-6 py-1">
      <legend className="flex gap-1">
        <QuestionMarkCircleIcon className="mt-1 size-5" />
        <span className="mx-1">{lang === "ar" ? "مساعدة" : "Help"}</span>
      </legend>
      <div className="flex justify-evenly gap-4">
        {/* Video Help */}
        <HelpModal icon={<PlayCircleIcon className="size-6 cursor-pointer" />}>
          <video controls src="/help.mp4" />
        </HelpModal>

        {/* PDF Help */}
        <HelpModal icon={<DocumentTextIcon className="size-6 cursor-pointer" />}>
          <div>
            <Document file="/help.pdf" onLoadSuccess={onDocumentLoadSuccess}>
              {pages.map((page) => (
                <Page key={page} pageNumber={page} />
              ))}
            </Document>
          </div>
        </HelpModal>
      </div>
    </fieldset>
  );
};

const HelpModal = ({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) => {
    const { lang } = useGetLang();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <span
        className="flex items-center text-gray-600 hover:text-teal-500"
        onClick={() => setIsOpen(true)}
      >
        {icon}
      </span>
      <Modal dismissible show={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Header>{lang === "ar" ? "مساعدة" : "Help"}</Modal.Header>
        <Modal.Body className="p-0">{children}</Modal.Body>
      </Modal>
    </>
  );
};

export default LoginHelp;
