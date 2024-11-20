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

  // Ref to store the initial mouse or touch position when dragging starts
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Ref to store the popup element
  const popupRef = useRef<HTMLDivElement | null>(null);

  // Function to handle mouse or touch movement while dragging
  const onMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      // Determine if it's a mouse or touch event
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      setPosition({
        x: clientX - startPos.current.x,
        y: clientY - startPos.current.y,
      });
    },
    [isDragging]
  );

  // Function to handle the end of a drag event
  const onEnd = () => {
    setIsDragging(false);
  };

  // Function to handle the start of a drag event
  const onStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(true);

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    startPos.current = { x: clientX - position.x, y: clientY - position.y };
  };

  // Effect to add and clean up event listeners for dragging
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => onMove(e);
    const onTouchMove = (e: TouchEvent) => onMove(e);
    const onMouseUp = () => onEnd();
    const onTouchEnd = () => onEnd();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onMove]);

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
        ref={popupRef}  
        onClick={(e) => e.stopPropagation()}  // Prevent closing when clicking inside the popup
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        <div
          className="flex cursor-move justify-between bg-gray-300"
          onMouseDown={onStart}  // Mouse down event for desktop
          onTouchStart={onStart} // Touch start event for mobile
        >
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
