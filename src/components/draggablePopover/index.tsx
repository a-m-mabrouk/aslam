import { XMarkIcon } from "@heroicons/react/24/outline";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

interface DraggablePopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const DraggablePopup: React.FC<DraggablePopupProps> = ({
  isOpen,
  onClose,
  children,
  title = ""
}) => {
  // State to determine if the popup is being dragged
  const [isDragging, setIsDragging] = useState(false);

  // State to keep track of the popup's position
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Ref to store the initial mouse position when dragging starts
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Ref to store the popup element
  const popupRef = useRef<HTMLDivElement | null>(null);

  // Function to handle mouse movement while dragging
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - startPos.current.x,
        y: e.clientY - startPos.current.y,
      });
    },
    [isDragging]
  );

  // Function to handle the end of a drag event
  const onMouseUp = () => {
    setIsDragging(false);
  };

  // Function to handle the start of a drag event
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(true);
    startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  // Effect to add and clean up event listeners for dragging
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove]);

  // Reset position when the popup is closed
  useEffect(() => {
    if (!isOpen) {
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed left-0 top-0 z-50 flex size-full items-center justify-center" onClick={onClose}>
      <div
        className="relative z-50 overflow-hidden rounded-xl bg-white shadow-lg"
        ref={popupRef}  onClick={(e) => e.stopPropagation()}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        <div className="flex cursor-move justify-between bg-gray-300" onMouseDown={onMouseDown}>
            <XMarkIcon className="size-10 cursor-pointer px-2 py-1" onClick={onClose} />
            <h2 className="flex items-center text-xl text-indigo-800">{title}</h2>
            <XMarkIcon className="invisible size-10 px-2 py-1" />
        </div>
        <div className="bg-white p-1 pt-0">{children}</div>
      </div>
    </div>
  );
};

export default DraggablePopup;