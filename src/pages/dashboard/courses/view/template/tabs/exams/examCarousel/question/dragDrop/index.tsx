import { useEffect, useRef, useState } from "react";
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
  const {examAnswers, review} = useAppSelector(({ exams }) => exams);
  const thisQueAnswers = examAnswers[questionIndex];

  const dragArray: DraggableAreaProps[] = question.options.map(
    ({ option: label }, id) => ({ id, label }),
  );

  const dropArray: DroppableAreaProps[] = question.options.map(
    ({ answer: label }, id) => ({ id, label, items: [] }),
  );

  const selectedOpt =
    thisQueAnswers?.selectedOpt && JSON.parse(thisQueAnswers?.selectedOpt);
    const checkDisabled = examAnswers[questionIndex]?.showAnsClicked || review;

  const draggables = selectedOpt?.draggableItems || dragArray;
  const droppables = selectedOpt?.droppableAreas || dropArray;

  const [draggableItems, setDraggableItems] =
    useState<DraggableAreaProps[]>(draggables);
  const [droppableAreas, setDroppableAreas] =
    useState<DroppableAreaProps[]>(droppables);

  const [queAnswers, setQueAnswers] = useState({
    questionIndex,
    queAnsDetails: {
      selectedOpt: thisQueAnswers?.selectedOpt,
      showAnsClicked: thisQueAnswers?.showAnsClicked || false,
      answerstate: "skipped"
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
    const answerstate = draggableItems.length? "skipped": validateItemsArray.every((e) => e)? "correct": "wrong";

    setQueAnswers((prev) => ({
      ...prev,
      queAnsDetails: {
        ...prev.queAnsDetails,
        answerstate,
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
  const isAnsweredRef = useRef<boolean>(false);
  useEffect(()=> {
    if (checkDisabled && !isAnsweredRef.current) {
      setDraggableItems([]);
      setDroppableAreas(question.options.map(({ answer }, id) => ({ id, label: answer, items: question.options.filter((_, i) => id === i).map(({option}, index) => ({id: index, label: option})) })));
      isAnsweredRef.current = true;
    }
    if (!droppableAreas.some(area => area.items.length)) {
      dispatch(setAnswerState({questionIndex, answerstate: "skipped"}))
    } else {
      if (droppableAreas.some(({items, id}) => items.some(inner => inner.id !== id))) {
        dispatch(setAnswerState({questionIndex, answerstate: "wrong"}))
      } else {
        dispatch(setAnswerState({questionIndex, answerstate: "correct"}))
      }
    }
  }, [checkDisabled, dispatch, droppableAreas, droppables, question.options, questionIndex])

  useEffect(() => {
    const answerstate = queAnswers.queAnsDetails.answerstate as "wrong" | "correct" | "skipped"; 
    const selectedOpt = JSON.stringify({ draggableItems, droppableAreas });
    dispatch(setAnswerState({ questionIndex, answerstate }));
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
              checkDisabled={checkDisabled}
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
              checkDisabled={checkDisabled}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
