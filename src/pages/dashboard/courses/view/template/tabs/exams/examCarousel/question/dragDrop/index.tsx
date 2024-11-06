import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { MultiBackend, TouchTransition } from "react-dnd-multi-backend";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../../../../../store";
import {
  setIsCorrect,
  setSelectedOpt,
} from "../../../../../../../../../../store/reducers/exam";
import DraggableItem from "./DraggableItem";
import DroppableArea from "./DroppableArea";

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
    const isCorrect = queAnswers.queAnsDetails.isCorrect;
    const selectedOpt = JSON.stringify({ draggableItems, droppableAreas });
    dispatch(setIsCorrect({ questionIndex, isCorrect }));
    dispatch(setSelectedOpt({ questionIndex, selectedOpt }));
  }, [dispatch, draggableItems, droppableAreas, queAnswers, questionIndex]);

  return (
    <DndProvider backend={MultiBackend} options={backendOptions}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          {draggableItems.map((item) => (
            <DraggableItem
              key={item.id}
              item={item}
              onDropBack={handleDropBack}
            />
          ))}
        </div>

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
