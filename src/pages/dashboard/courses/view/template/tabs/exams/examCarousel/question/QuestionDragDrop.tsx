import { useState } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider, DragSourceMonitor, useDrag, useDrop } from "react-dnd";
import { Card } from "flowbite-react";

const ItemTypes = {
    ITEM: "item",
};

// Define types for items and areas
interface DraggableItemProps {
    id: number;
    label: string;
}

interface DroppableAreaProps {
    id: number;
    label: string;
    items: DraggableItemProps[];
}

interface DraggableItemComponentProps {
    item: DraggableItemProps;
    onDropBack: (item: DraggableItemProps) => void;
}

interface DroppableAreaComponentProps {
    label: string;
    items: DraggableItemProps[];
    onDropItem: (item: DraggableItemProps) => void;
}

// Draggable item component
const DraggableItem: React.FC<DraggableItemComponentProps> = ({ item, onDropBack }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.ITEM,
        item,
        end: (droppedItem: DraggableItemProps, monitor: DragSourceMonitor) => {
            if (!monitor.didDrop()) {
                onDropBack(droppedItem); // Handle item drop back to the container
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div
            ref={drag}
            style={{
                transform: isDragging ? 'scale(1.1)' : 'none', // Slightly scale the item while dragging
                cursor: "move",
                border: "1px solid gray",
                padding: "8px 16px",
                backgroundColor: "white",
                boxShadow: isDragging ? "0px 0px 10px rgba(0, 0, 0, 0.2)" : "none", // Add shadow while dragging
            }}
        >
            {item.label}
        </div>
    );
};

// Droppable area component
const DroppableArea: React.FC<DroppableAreaComponentProps> = ({ label, items, onDropItem }) => {
    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.ITEM,
        drop: (item: DraggableItemProps) => onDropItem(item),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    return (
        <Card
            ref={drop}
            style={{
                backgroundColor: isOver ? '#4a90e2' : '#007bff',
                minHeight: "60px",
                padding: "16px",
                color: "white",
                transition: "background-color 0.2s ease",
            }}
            className="flex flex-col"
        >
            <h4>{label}</h4>
            {items.map((item) => (
                <div key={item.id}>{item.label}</div>
            ))}
        </Card>
    );
};

export default function QuestionDragDrop({
    question,
    questionIndex,
}: {
    question: any; // Replace `any` with the actual type of question if available
    questionIndex: number;
}) {
    const [draggableItems, setDraggableItems] = useState<DraggableItemProps[]>([
        { id: 1, label: "وظيف" },
        { id: 2, label: "مصنف - متوازن" },
        { id: 3, label: "مصنف - ضعيف" },
        { id: 4, label: "مصنف - قوي" },
        { id: 5, label: "موجه نحو المشروع" },
    ]);

    const [droppableAreas, setDroppableAreas] = useState<DroppableAreaProps[]>([
        { id: 1, label: "معتدلة إلى مرتفعة", items: [] },
        { id: 2, label: "منخفضة", items: [] },
        { id: 3, label: "مرتفعة إلى كاملة تقريبا", items: [] },
        { id: 4, label: "منخفضة إلى معتدلة", items: [] },
        { id: 5, label: "قليلة أو لا توجد", items: [] },
    ]);

    // Handle dropping an item into a droppable area
    const handleDropItem = (areaId: number, item: DraggableItemProps) => {
        setDroppableAreas((prevAreas) =>
            prevAreas.map((area) =>
                area.id === areaId ? { ...area, items: [...area.items, item] } : area
            )
        );
        setDraggableItems((items) => items.filter((draggableItem) => draggableItem.id !== item.id));
    };

    // Handle returning item to the draggable container
    const handleDropBack = (item: DraggableItemProps) => {
        if (!draggableItems.some((draggableItem) => draggableItem.id === item.id)) {
            setDraggableItems((prevItems) => [...prevItems, item]);
            setDroppableAreas((prevAreas) =>
                prevAreas.map((area) => ({
                    ...area,
                    items: area.items.filter((areaItem) => areaItem.id !== item.id),
                }))
            );
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex gap-4">
                {/* Draggable Items */}
                <div className="flex flex-col gap-2">
                    {draggableItems.map((item) => (
                        <DraggableItem
                            key={item.id}
                            item={item}
                            onDropBack={handleDropBack}
                        />
                    ))}
                </div>

                {/* Droppable Areas */}
                <div className="flex flex-col gap-2">
                    {droppableAreas.map((area) => (
                        <DroppableArea
                            key={area.id}
                            label={area.label}
                            items={area.items}
                            onDropItem={(item) => handleDropItem(area.id, item)}
                        />
                    ))}
                </div>
            </div>
        </DndProvider>
    );
}
