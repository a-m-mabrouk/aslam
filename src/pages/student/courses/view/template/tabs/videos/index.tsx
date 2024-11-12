import { useTranslation } from "react-i18next";
import { AccordionCard } from "../../../../../../../components/accordion";
import { useContext } from "react";
import { ViewCourseContext } from "../../..";
import useGetLang from "../../../../../../../hooks/useGetLang";
import PlayerModal from "../../../../../../../components/popupModal/player";
import TitleSection from "../../../../../../../components/title";
import DescriptionLesson from "./description";

export default function Videos() {
  const { course } = useContext(ViewCourseContext);
  const { modules, expire } = course || {};
  const { t } = useTranslation("viewCourse");
  const { lang } = useGetLang();
  return (
    <div className="grid gap-4">
      <div className="flex justify-between gap-2">
        <TitleSection title={t("videos")} />
      </div>

      <AccordionCard>
        {
          modules?.map((module) => (
            <AccordionCard.Panel key={module.id}>
              <AccordionCard.Title className="grow">
                <div className="flex items-center justify-between gap-4">
                  <span className="">{module?.name[lang]}</span>
                </div>
              </AccordionCard.Title>
              <AccordionCard.Content>
                <div className="grid gap-4">
                  {module?.lessons?.map((lesson, index) => (
                    <div className="flex items-center gap-4">
                      {expire ? (
                        <PlayerModal
                          key={index}
                          btn={
                            <div className="flex items-center gap-4">
                              <span className="text-primary hover:underline">
                                {index + 1} - {lesson.name[lang]}
                              </span>
                              <DescriptionLesson
                                title={lesson.name[lang]}
                                desc={lesson.description[lang]}
                              />
                            </div>
                          }
                          title={lesson.name[lang]}
                          url={lesson.resources[0].path}
                        />
                      ) : (
                        <span>
                          {index + 1} - {lesson.name[lang]}
                        </span>
                      )}
                    </div>
                  )) || <></>}
                </div>
                {module?.lessons?.length === 0 && (
                  <p className="text-center text-gray-400">{t("noLessons")}</p>
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
    </div>
  );
}
