
interface Question {
  type: "mcq" | "dragdrop";
  chapter?: string;
  domain?: string;
  name: string;
  description: string;
  degree: number;
  options: {
    option: string;
    answer: string;
  }[];
}

interface DraggableAreaProps {
  id: number;
  label: string;
}

interface DroppableAreaProps {
  id: number;
  label: string;
  items: DraggableAreaProps[];
}

interface DraggableItemComponentProps {
  item: DraggableAreaProps;
  onDropBack: (item: DraggableAreaProps) => void;
}

interface DroppableAreaComponentProps {
  id: number;
  label: string;
  items: DraggableAreaProps[];
  onDropItem: (areaId: number, item: DraggableAreaProps) => void;
  onDropBack: (item: DraggableAreaProps) => void;
}