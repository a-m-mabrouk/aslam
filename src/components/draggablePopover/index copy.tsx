import { XMarkIcon } from "@heroicons/react/24/outline";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title = ""
}) => {

  
};

export default Popup;