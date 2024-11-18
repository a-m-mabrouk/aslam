import { FormEventHandler, useEffect, useState } from "react";
import { Button, Modal, TextInput } from "flowbite-react";
import { AccordionCard } from "../../../../../../../components/accordion";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../../../store";
import useGetLang from "../../../../../../../hooks/useGetLang";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { addAssessment, addDomain, addSubdomain, deleteAssessment, deleteDomain, deleteSubdomain, editDomain, fetchDomains } from "../../../../../../../store/reducers/examsDomains";



export function AddDomainModal({
  modalType,
  obj,
  domainId = null,
  subDomainId = null,
  isEdit = false,
}: AddNewModalProps) {
  const dispatch = useAppDispatch();
  const isTeacher = useAppSelector(({ auth }) => auth.role) === "teacher";
  // const domains = useAppSelector(({ examsDomains }) => examsDomains.domains);
  const { t } = useTranslation("exams");
  const { id: courseId } = useParams();
  
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [nameEn, setNameEn] = useState<string>(obj?.name?.en || "");
  const [nameAr, setNameAr] = useState<string>(obj?.name?.ar || "");

  function onCloseModal() {
    setOpenModal(false);
    setNameEn("");
    setNameAr("");
  }

  const modalObj = {
    modalTitle: isEdit? t("editDomain") : t("addDomain"),
    fieldEn1: "Domain title",
    fieldAr1: "عنوان النطاق",
  };

  if (modalType === "subdomain") {
    modalObj.modalTitle = isEdit? t("editSubdomain") : t("addSubdomain");
    modalObj.fieldEn1 = "Subdomain title";
    modalObj.fieldAr1 = "عنوان النطاق الفرعي";
  } else if (modalType === "assessment") {
    modalObj.modalTitle = isEdit? t("editAssessment") : t("addAssessment");
    modalObj.fieldEn1 = "Exam title";
    modalObj.fieldAr1 = "عنوان الامتحان";
  }

  const addNewHandler: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const modalObj: Record<string, unknown> = {};
    formData.forEach((value, key) => {
      modalObj[key] = value;
    });

    if (modalType === "domain") {
      if (isEdit) {
        if (obj?.course_id) {
          dispatch(editDomain({id: obj?.id, course_id: obj?.course_id, name_en: nameEn, name_ar: nameAr}));
        }
      } else {
        dispatch(addDomain(modalObj));
      }
    } else if (modalType === "subdomain") {
      if (isEdit) {
        // dispatch(editSubdomain(modalObj));
      } else {
        dispatch(addSubdomain(modalObj));
      }
    } else {
      if (isEdit) {
        // dispatch(editAssessment(modalObj));
      } else {
        dispatch(addAssessment(modalObj));
      }
    }
    onCloseModal();
  };

  return (
    isTeacher ? (<>
      {isEdit ? <PencilSquareIcon className="size-5" onClick={(event) => {
        event.stopPropagation();
        setOpenModal(true);
      }} /> : <div
        className="cursor-pointer text-cyan-700 hover:underline"
        onClick={() => setOpenModal(true)}
      >
        + {modalObj.modalTitle}
      </div>}

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
                <input type="text" hidden defaultValue={courseId} name="course_id" />
              )}
              {domainId && (
                <input type="text" hidden defaultValue={domainId} name="domain_id" />
              )}
              {subDomainId && (
                <input
                  type="text"
                  hidden
                  defaultValue={subDomainId}
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

export default function ExamsSidebar({ onSelectAssessment }: { onSelectAssessment: (assessment: AssessmentType) => void }) {
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
                {isTeacher ?
                  <>
                    <TrashIcon className="size-5" onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteDomain(domain.id);
                    }} />

                    <AddDomainModal modalType="domain" isEdit obj={domain} />
                  </>
                  : undefined}
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
                          (assessment) => (
                            <h3 className="flex cursor-pointer gap-2 p-2"
                              key={assessment.id}
                            >
                              {isTeacher ? <TrashIcon className="size-5" onClick={(event) => {
                                event.stopPropagation();
                                handleDeleteAssessment(assessment.id);
                              }} /> : undefined}
                              <span className="cursor-pointer text-indigo-900 hover:underline" onClick={() => { onSelectAssessment(assessment); }}>
                                {lang === "en"
                                  ? assessment.name.en
                                  : lang === "ar"
                                    ? assessment.name.ar
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
              {domain.assessments?.map((assessment) => (
                <h3
                  className="flex cursor-pointer gap-2 p-2"
                  key={assessment.id}
                >
                  {isTeacher ? <TrashIcon className="size-5" onClick={(event) => {
                    event.stopPropagation();
                    handleDeleteAssessment(assessment.id);
                  }} /> : undefined}
                  <span className="cursor-pointer text-indigo-900 hover:underline" onClick={() => { onSelectAssessment(assessment); }}>
                    {lang === "en"
                      ? assessment.name.en
                      : lang === "ar"
                        ? assessment.name.ar
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
