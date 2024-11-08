import { DragSourceMonitor, useDrag } from "react-dnd";
import React from "react";

const DraggableItem = React.memo(({ item, onDropBack }: DraggableItemComponentProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: "dragItem",
    item,
    end: (droppedItem: DraggableAreaProps, monitor: DragSourceMonitor) => {
      if (!monitor.didDrop()) {
        onDropBack(droppedItem);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`mb-2 cursor-move border border-gray-400 p-2 transition-transform ${
        isDragging ? "scale-110 shadow-md" : ""
      }`}
    >
      {item.label}
    </div>
  );
});

export default DraggableItem;
