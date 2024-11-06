import { useDrop } from "react-dnd";
import DraggableItem from "./DraggableItem";

export default function DroppableArea({
    id,
    label,
    items,
    onDropItem,
    onDropBack,
  }: DroppableAreaComponentProps) {
    const [{ isOver }, drop] = useDrop({
      accept: "dragItem",
      drop: (item: DraggableAreaProps) => onDropItem(id, item),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });
  
    return (
      <div
        ref={drop}
        className={`flex min-h-[60px] flex-col rounded-lg p-4 text-white shadow-md transition-colors ${
          isOver ? "bg-blue-400" : "bg-blue-600"
        }`}
      >
        <h4 className="font-bold">{label}</h4>
        {items.map((item) => (
          <DraggableItem key={item.id} item={item} onDropBack={onDropBack} />
        ))}
      </div>
    );
  }