import { FormEventHandler, useEffect, useState } from "react";
import { Button, Modal, TextInput } from "flowbite-react";
import { AccordionCard } from "../../../../../../../components/accordion";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../../../store";
import {
  setExamQuestions,
  setAssessmentId,
} from "../../../../../../../store/reducers/exams";
import useGetLang from "../../../../../../../hooks/useGetLang";
import { TrashIcon } from "@heroicons/react/24/outline";
import { addAssessment, addDomain, addSubdomain, deleteAssessment, deleteDomain, deleteSubdomain, fetchDomains } from "../../../../../../../store/reducers/examsDomains";



export function AddDomainModal({
  modalType,
  domainId = null,
  subDomainId = null,
}: AddNewModalProps) {
  const dispatch = useAppDispatch();
  const isTeacher = useAppSelector(({ auth }) => auth.role) === "teacher";
  const { t } = useTranslation("exams");
  const { id: courseId } = useParams();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [nameEn, setNameEn] = useState<string>("");
  const [nameAr, setNameAr] = useState<string>("");

  function onCloseModal() {
    setOpenModal(false);
    setNameEn("");
    setNameAr("");
  }

  const modalObj = {
    modalTitle: t("addDomain"),
    fieldEn1: "Domain title",
    fieldAr1: "عنوان النطاق",
  };

  if (modalType === "subdomain") {
    modalObj.modalTitle = t("addSubdomain");
    modalObj.fieldEn1 = "Subdomain title";
    modalObj.fieldAr1 = "عنوان النطاق الفرعي";
  } else if (modalType === "assessment") {
    modalObj.modalTitle = t("addAssessment");
    modalObj.fieldEn1 = "Exam title";
    modalObj.fieldAr1 = "عنوان الامتحان";
  }

  const addNewHandler: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const obj: Record<string, unknown> = {};
    formData.forEach((value, key) => {
      obj[key] = value;
    });

    if (modalType === "domain") {
      dispatch(addDomain(obj));
    } else if (modalType === "subdomain") {
      dispatch(addSubdomain(obj));
    } else {
      dispatch(addAssessment(obj));
    }
    onCloseModal();
  };

  return (
    isTeacher ? (<>
      <div
        className="cursor-pointer text-cyan-700 hover:underline"
        onClick={() => setOpenModal(true)}
      >
        + {modalObj.modalTitle}
      </div>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              {modalObj.modalTitle}
            </h3>
            <form className="grid gap-3" onSubmit={addNewHandler}>
              <TextInput
                placeholder={modalObj.fieldEn1}
                value={nameEn}
                name="name_en"
                onChange={(event) => setNameEn(event.target.value)}
                required
              />
              <TextInput
                placeholder={modalObj.fieldAr1}
                value={nameAr}
                name="name_ar"
                onChange={(event) => setNameAr(event.target.value)}
                required
              />
              {courseId && (
                <input type="text" hidden value={courseId} name="course_id" />
              )}
              {domainId && (
                <input type="text" hidden value={domainId} name="domain_id" />
              )}
              {subDomainId && (
                <input
                  type="text"
                  hidden
                  value={subDomainId}
                  name="subdomain_id"
                />
              )}
              <Button type="submit">+ {modalObj.modalTitle}</Button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>) : <></>
  );
}

export default function ExamsSidebar() {
  const { id: course_id } = useParams();
  const dispatch = useAppDispatch();
  const domains = useAppSelector(({ examsDomains }) => examsDomains.domains);

  const isTeacher = useAppSelector(({ auth }) => auth.role) === "teacher";

  const { t } = useTranslation("exams");
  const { lang } = useGetLang();

  const handleDeleteDomain = (id: number) => {
    dispatch(deleteDomain(id));
  }
  const handleDeleteSubdomain = (id: number) => {
    dispatch(deleteSubdomain(id));
  }
  const handleDeleteAssessment = (id: number) => {
    console.log(id);

    dispatch(deleteAssessment(id));
  }

  useEffect(() => {
    dispatch(fetchDomains(+course_id!));
  }, [course_id, dispatch]);

  return (
    <div>
      <AccordionCard>
        {domains?.map((domain) => (
          <AccordionCard.Panel key={domain.id}>
            <AccordionCard.Title className="grow">
              <div className="flex items-center justify-between gap-4">
                {isTeacher ? <TrashIcon className="size-5" onClick={(event) => {
                  event.stopPropagation();
                  handleDeleteDomain(domain.id);
                }} /> : undefined}
                <span className="">
                  {lang === "en"
                    ? domain.name.en
                    : lang === "ar"
                      ? domain.name.ar
                      : undefined}
                </span>
              </div>
            </AccordionCard.Title>
            <AccordionCard.Content className="py-0 pe-0">
              {domain.subdomains?.length ? (
                <AccordionCard>
                  {domain.subdomains.map((subdomain) => (
                    <AccordionCard.Panel key={subdomain.id}>
                      <AccordionCard.Title className="grow">
                        <div className="flex items-center justify-between gap-4">
                          {isTeacher ? <TrashIcon className="size-5" onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteSubdomain(subdomain.id);
                          }} /> : undefined}
                          <span className="">
                            {lang === "en"
                              ? subdomain.name.en
                              : lang === "ar"
                                ? subdomain.name.ar
                                : undefined}
                          </span>
                        </div>
                      </AccordionCard.Title>
                      <AccordionCard.Content>
                        {subdomain.assessments?.map(
                          ({ id, name, questions }) => (
                            <h3 className="flex cursor-pointer gap-2 p-2"
                              key={id}
                            >
                              {isTeacher ? <TrashIcon className="size-5" onClick={(event) => {
                                event.stopPropagation();
                                handleDeleteAssessment(id);
                              }} /> : undefined}
                              <span className="cursor-pointer text-indigo-900 hover:underline" onClick={() => { dispatch(setExamQuestions(questions)); dispatch(setAssessmentId(id)) }}>
                                {lang === "en"
                                  ? name.en
                                  : lang === "ar"
                                    ? name.ar
                                    : undefined}
                              </span>
                            </h3>
                          ),
                        )}
                        <AddDomainModal
                          modalType="assessment"
                          subDomainId={subdomain.id}
                        />
                      </AccordionCard.Content>
                    </AccordionCard.Panel>
                  ))}
                </AccordionCard>
              ) : undefined}
              {domain.assessments?.map(({ id, name, questions }) => (
                <h3
                  className="flex cursor-pointer gap-2 p-2"
                  key={id}
                >
                  {isTeacher ? <TrashIcon className="size-5" onClick={(event) => {
                    event.stopPropagation();
                    handleDeleteAssessment(id);
                  }} /> : undefined}
                  <span className="cursor-pointer text-indigo-900 hover:underline" onClick={() => { dispatch(setExamQuestions(questions)); dispatch(setAssessmentId(id)) }}>
                    {lang === "en"
                      ? name.en
                      : lang === "ar"
                        ? name.ar
                        : undefined}
                  </span>
                </h3>
              ))}
              {domain.assessments?.length ? undefined : (
                <AddDomainModal modalType="subdomain" domainId={domain.id} />
              )}
              {isTeacher && !domain.subdomains?.length &&
                !domain.assessments?.length &&
                t("or")}
              {domain.subdomains?.length ? undefined : (
                <AddDomainModal modalType="assessment" domainId={domain.id} />
              )}
            </AccordionCard.Content>
          </AccordionCard.Panel>
        ))}
      </AccordionCard>
      <AddDomainModal modalType="domain" />
    </div>
  );
}
