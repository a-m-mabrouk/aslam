import { useEffect, useState, useMemo } from "react";
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
import {
  getItemById,
  updateItem,
} from "../../../../../../../../../../utilities/idb";

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
  isDescShow,
}: {
  question: Question;
  questionIndex: number;
  isDescShow: boolean;
}) {
  const dispatch = useAppDispatch();
  const { examAnswers, showReview, activeAssessment } = useAppSelector(
    ({ exams }) => exams,
  );
  const thisQueAnswers = examAnswers[questionIndex]?.selectedOpt;

  const [draggableItems, setDraggableItems] = useState<DraggableAreaProps[]>(
    [],
  );
  const [droppableAreas, setDroppableAreas] = useState<DroppableAreaProps[]>(
    [],
  );
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const checkDisabled = useMemo(
    () =>
      (question.question.description === ""
        ? examAnswers[questionIndex]?.showAnsClicked && isDescShow
        : examAnswers[questionIndex]?.showAnsClicked) || showReview,
    [
      examAnswers,
      isDescShow,
      question.question.description,
      questionIndex,
      showReview,
    ],
  );

  const handleDropItem = (areaId: number, item: DraggableAreaProps) => {
    if (droppableAreas[areaId].items.length) return;

    const updatedDroppableAreas = droppableAreas.map((area) => {
      area.items[0]?.id === item.id && area.items.pop();
      return area.id === areaId ? { ...area, items: [item] } : area;
    });

    const updatedDraggableItems = draggableItems.filter(
      (draggableItem) => draggableItem.id !== item.id,
    );

    setDroppableAreas(updatedDroppableAreas);
    setDraggableItems(updatedDraggableItems);

    const answerstate = updatedDroppableAreas.every(
      (area) => area.items.length === 0,
    )
      ? "skipped"
      : updatedDroppableAreas.every(
            ({ items, id }) => items.length === 1 && items[0].id === id,
          )
        ? "correct"
        : "wrong";

    if (activeAssessment?.id) {
      dispatch(
        setAnswerState({
          questionIndex,
          answerstate,
        }),
      );
      dispatch(
        setSelectedOpt({
          questionIndex,
          selectedOpt: JSON.stringify({
            draggableItems: updatedDraggableItems,
            droppableAreas: updatedDroppableAreas,
          }),
        }),
      );
      getItemById(activeAssessment?.id).then((assessment) => {
        if (assessment) {
          const examAnswers = [...assessment.examAnswers];
          examAnswers[questionIndex].answerstate = answerstate;
          examAnswers[questionIndex].selectedOpt = JSON.stringify({
            draggableItems: updatedDraggableItems,
            droppableAreas: updatedDroppableAreas,
          });
          updateItem(activeAssessment?.id, { examAnswers });
        }
      });
    }
  };

  const handleDropBack = (item: DraggableAreaProps) => {
    if (!draggableItems.some((draggableItem) => draggableItem.id === item.id)) {
      const updatedDraggableItems = [...draggableItems, item];

      const updatedDroppableAreas = droppableAreas.map((area) => ({
        ...area,
        items: area.items.filter((areaItem) => areaItem.id !== item.id),
      }));

      setDraggableItems(updatedDraggableItems);
      setDroppableAreas(updatedDroppableAreas);

      if (activeAssessment?.id) {
        dispatch(
          setSelectedOpt({
            questionIndex,
            selectedOpt: JSON.stringify({
              draggableItems: updatedDraggableItems,
              droppableAreas: updatedDroppableAreas,
            }),
          }),
        );
        getItemById(activeAssessment?.id).then((assessment) => {
          if (assessment) {
            const examAnswers = [...assessment.examAnswers];
            examAnswers[questionIndex].selectedOpt = JSON.stringify({
              draggableItems: updatedDraggableItems,
              droppableAreas: updatedDroppableAreas,
            });
            updateItem(activeAssessment?.id, { examAnswers });
          }
        });
      }
    }
  };

  useEffect(() => {
    const parsedAnswers = thisQueAnswers ? JSON.parse(thisQueAnswers) : null;

    setDraggableItems(
      shuffle(
        parsedAnswers?.draggableItems ||
          question?.question?.options.map(({ option: label }, id) => ({
            id,
            label,
          })),
      ),
    );

    setDroppableAreas(
      parsedAnswers?.droppableAreas ||
        question?.question?.options.map(({ answer: label }, id) => ({
          id,
          label,
          items: [],
        })),
    );
    setIsAnswered(false); // Reset isAnswered for each question
  }, [thisQueAnswers, question?.question?.options]);

  useEffect(() => {
    if (checkDisabled && !isAnswered) {
      const updatedDroppableAreas = question?.question?.options.map(
        ({ answer }, id) => ({
          id,
          label: answer,
          items: [{ id, label: question?.question?.options[id].option }],
        }),
      );

      setDraggableItems([]); // Clear draggable items
      setDroppableAreas(updatedDroppableAreas); // Set correct answers
      setIsAnswered(true);

      // Dispatch updated state to save answers
      if (activeAssessment?.id) {
        dispatch(
          setSelectedOpt({
            questionIndex,
            selectedOpt: JSON.stringify({
              draggableItems: [],
              droppableAreas: updatedDroppableAreas,
            }),
          }),
        );
        getItemById(activeAssessment?.id).then((assessment) => {
          if (assessment) {
            const examAnswers = [...assessment.examAnswers];
            // examAnswers[questionIndex].answerstate = answerstate;
            examAnswers[questionIndex].selectedOpt = JSON.stringify({
              draggableItems: [],
              droppableAreas: updatedDroppableAreas,
            });
            updateItem(activeAssessment?.id, { examAnswers });
          }
        });
      }
    }
  }, [
    checkDisabled,
    question?.question?.options,
    dispatch,
    questionIndex,
    isAnswered,
    activeAssessment?.id,
  ]);

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
