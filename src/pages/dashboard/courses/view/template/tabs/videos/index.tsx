import { useTranslation } from "react-i18next";
import CreateChapter from "./create";
import { AccordionCard } from "../../../../../../../components/accordion";
import { useContext } from "react";
import { ViewCourseContext } from "../../..";
import useGetLang from "../../../../../../../hooks/useGetLang";
import PlayerModal from "../../../../../../../components/popupModal/player";
import CreateLesson from "./createLesson";
import DeleteChapter from "./deleteChapter";
import DeleteLesson from "./deleteLesson";
import TitleSection from "../../../../../../../components/title";

export default function Chapters() {
  const { course } = useContext(ViewCourseContext);
  const { modules } = course || {};
  const { t } = useTranslation("viewCourse");
  const { lang } = useGetLang();
  return (
    <div className="grid gap-4">
      <div className="flex justify-between gap-2">
        <TitleSection title={t("videos")} />
        <CreateChapter />
      </div>
      {modules ? (
        <AccordionCard>
          {
            modules?.map((module) => (
              <AccordionCard.Panel key={module.id}>
                <AccordionCard.Title className="grow">
                  <div className="flex items-center justify-between gap-4">
                    <span className="">{module?.name[lang]}</span>

                    <div className="flex gap-2">
                      <CreateLesson moduleIndex={module.id} />
                      <DeleteChapter id={module.id} />
                    </div>
                  </div>
                </AccordionCard.Title>
                <AccordionCard.Content>
                  <div className="grid gap-4">
                    {module?.lessons?.map((lesson, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <PlayerModal
                          key={index}
                          btn={
                            <span className="text-primary hover:underline">
                              {lesson.name[lang]}
                            </span>
                          }
                          title={lesson.name[lang]}
                          url={lesson.resources[0].path}
                        />
                        <DeleteLesson id={lesson.id} moduleId={module.id} />
                      </div>
                    )) || <></>}
                  </div>
                  {module?.lessons?.length === 0 && (
                    <p className="text-center text-gray-400">
                      {t("noLessons")}
                    </p>
                  )}
                </AccordionCard.Content>
              </AccordionCard.Panel>
            )) as unknown as React.ReactElement
          }
          <>
            {modules?.length === 0 && (
              <p className="py-4 text-center text-gray-400">{t("noVideos")}</p>
            )}
          </>
        </AccordionCard>
      ) : undefined}
    </div>
  );
}
