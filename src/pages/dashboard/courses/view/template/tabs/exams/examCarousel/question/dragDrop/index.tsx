import { useEffect, useRef, useState, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { MultiBackend, TouchTransition } from "react-dnd-multi-backend";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../../../../../store";
import {
  setAnswerState,
  setSelectedOpt,
} from "../../../../../../../../../../store/reducers/exams";
import DraggableItem from "./DraggableItem";
import DroppableArea from "./DroppableArea";
import { shuffle } from "../../../../../../../../../../utilities/shuffleArray";

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
  const { examAnswers, review } = useAppSelector(({ exams }) => exams);
  const thisQueAnswers = examAnswers[questionIndex];

  const selectedOpt = useMemo(
    () => (thisQueAnswers?.selectedOpt ? JSON.parse(thisQueAnswers.selectedOpt) : null),
    [thisQueAnswers]
  );

  const checkDisabled = useMemo(
    () => examAnswers[questionIndex]?.showAnsClicked || review,
    [examAnswers, questionIndex, review]
  );

  const initialDraggables = useMemo(
    () => selectedOpt?.draggableItems || question?.question?.options.map(({ option: label }, id) => ({ id, label })),
    [question?.question?.options, selectedOpt]
  );

  const initialDroppables = useMemo(
    () =>
      selectedOpt?.droppableAreas ||
      question?.question?.options.map(({ answer: label }, id) => ({ id, label, items: [] })),
    [question?.question?.options, selectedOpt]
  );

  const [draggableItems, setDraggableItems] = useState<DraggableAreaProps[]>(initialDraggables);
  const [droppableAreas, setDroppableAreas] = useState<DroppableAreaProps[]>(initialDroppables);

  const isAnsweredRef = useRef<boolean>(false);

  const handleDropItem = (areaId: number, item: DraggableAreaProps) => {
    if (droppableAreas[areaId].items.length) return;

    setDroppableAreas((prevAreas) =>
      prevAreas.map((area) =>
        area.id === areaId
          ? { ...area, items: [...area.items, item] }
          : { ...area, items: area.items.filter((i) => i.id !== item.id) }
      )
    );
    setDraggableItems((items) => items.filter((draggableItem) => draggableItem.id !== item.id));

    const prevAreasArr = droppableAreas.map((area) =>
      area.id === areaId
        ? { ...area, items: [...area.items, item] }
        : { ...area, items: area.items.filter((i) => i.id !== item.id) }
    );
    const answerstate = prevAreasArr.every((area) => area.items.length === 0)? "skipped":
    prevAreasArr.every(({ items, id }) => items.length === 1 && items[0].id === id) ? "correct" : "wrong";
    dispatch(setAnswerState({ questionIndex, answerstate }));
  };

  const handleDropBack = (item: DraggableAreaProps) => {
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

  useEffect(() => {
    if (checkDisabled && !isAnsweredRef.current) {
      setDraggableItems([]);
      setDroppableAreas(
        question?.question?.options.map(({ answer }, id) => ({
          id,
          label: answer,
          items: [{ id, label: question?.question?.options[id].option }],
        }))
      );
      isAnsweredRef.current = true;
    }

    
  }, [checkDisabled, dispatch, droppableAreas, question?.question?.options, questionIndex]);
  useEffect(() => {
    const selectedOpt = JSON.stringify({ draggableItems, droppableAreas });
    dispatch(setSelectedOpt({ questionIndex, selectedOpt }));
  }, [dispatch, draggableItems, droppableAreas, questionIndex]);

  return (
    <DndProvider backend={MultiBackend} options={backendOptions}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          {shuffle(draggableItems.map((item) => (
            <DraggableItem
              key={item.id}
              item={item}
              onDropBack={handleDropBack}
              checkDisabled={checkDisabled}
            />
          )))}
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
              checkDisabled={checkDisabled}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
