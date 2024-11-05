import { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop, DragSourceMonitor } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { MultiBackend, TouchTransition } from "react-dnd-multi-backend";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../../../../store";
import { setAnswer } from "../../../../../../../../../store/reducers/exam";

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

function DraggableItem({ item, onDropBack }: DraggableItemComponentProps) {
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
}

function DroppableArea({
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

const backendOptions = {
  backends: [
    { id: 1, backend: HTML5Backend },
    {
      id: 2,
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true,
      transition: TouchTransition,
    },
  ],
};

export default function QuestionDragDrop({
  question,
  questionIndex,
}: {
  question: Question;
  questionIndex: number;
}) {
  const dispatch = useAppDispatch();
  const examAnswers = useAppSelector(({ exam }) => exam.examAnswers);
  const thisQueAnswers = examAnswers[questionIndex];

  const dragArray: DraggableAreaProps[] = question.options.map(
    ({ option: label }, id) => ({ id, label }),
  );

  const dropArray: DroppableAreaProps[] = question.options.map(
    ({ answer: label }, id) => ({ id, label, items: [] }),
  );

  const selectedOpt =
    thisQueAnswers?.selectedOpt && JSON.parse(thisQueAnswers?.selectedOpt);

  const draggables = selectedOpt?.draggableItems || dragArray;
  const droppables = selectedOpt?.droppableAreas || dropArray;

  const [draggableItems, setDraggableItems] =
    useState<DraggableAreaProps[]>(draggables);
  const [droppableAreas, setDroppableAreas] =
    useState<DroppableAreaProps[]>(droppables);

  const [queAnswers, setQueAnswers] = useState({
    questionIndex,
    queAnsDetails: {
      isCorrect: thisQueAnswers?.isCorrect || false,
      selectedOpt: thisQueAnswers?.selectedOpt,
      showAnsClicked: thisQueAnswers?.showAnsClicked || false,
    },
  });

  const handleDropItem = (areaId: number, item: DraggableAreaProps) => {
    if (droppableAreas[areaId].items.length) return;

    setDroppableAreas((prevAreas) =>
      prevAreas.map((area) =>
        area.id === areaId
          ? { ...area, items: [...area.items, item] }
          : { ...area, items: area.items.filter((i) => i.id !== item.id) },
      ),
    );

    setDraggableItems((items) =>
      items.filter((draggableItem) => draggableItem.id !== item.id),
    );

    const validateItemsArray = droppableAreas.map(
      (droppableArea) => droppableArea.id === droppableArea.items[0]?.id,
    );
    validateItemsArray[areaId] = areaId === item.id;
    const isCorrect = validateItemsArray.every((e) => e);

    setQueAnswers((prev) => ({
      ...prev,
      queAnsDetails: {
        ...prev.queAnsDetails,
        isCorrect,
      },
    }));

  };

  const handleDropBack = (item: DraggableAreaProps) => {
    if (!draggableItems.some((draggableItem) => draggableItem.id === item.id)) {
      setDraggableItems((prevItems) => [...prevItems, item]);
      setDroppableAreas((prevAreas) =>
        prevAreas.map((area) => ({
          ...area,
          items: area.items.filter((areaItem) => areaItem.id !== item.id),
        })),
      );
    }
  };

  useEffect(() => {
    dispatch(
      setAnswer({
        questionIndex,
        queAnsDetails: {
          isCorrect: queAnswers.queAnsDetails.isCorrect,
          selectedOpt: JSON.stringify({ draggableItems, droppableAreas }),
          showAnsClicked: queAnswers.queAnsDetails.showAnsClicked,
        },
      }),
    );
  }, [dispatch, draggableItems, droppableAreas, queAnswers, questionIndex]);

  return (
    <DndProvider backend={MultiBackend} options={backendOptions}>
      <div className="grid gap-4 md:grid-cols-2">
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
              id={area.id}
              label={area.label}
              items={area.items}
              onDropItem={handleDropItem}
              onDropBack={handleDropBack}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
