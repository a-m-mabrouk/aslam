import { FormEventHandler, useEffect, useState } from "react";
import { Button, Modal, Spinner, TextInput, Tooltip } from "flowbite-react";
import { AccordionCard } from "../../../../../../../components/accordion";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../../../store";
import useGetLang from "../../../../../../../hooks/useGetLang";
import {
  PencilSquareIcon,
  TrashIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import {
  addAssessment,
  addDomain,
  addSubdomain,
  deleteAssessment,
  deleteDomain,
  deleteSubdomain,
  editAssessment,
  editDomain,
  editSubdomain,
  fetchDomains,
} from "../../../../../../../store/reducers/examsDomains";
import { toastifyBox } from "../../../../../../../helper/toastifyBox";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { setActiveAssessment } from "../../../../../../../store/reducers/exams";

export function AddDomainModal({
  modalType,
  obj,
  domainId = null,
  subDomainId = null,
  isEdit = false,
  isButtonDisabled = false,
}: AddNewModalProps) {
  const dispatch = useAppDispatch();
  const isTeacher = useAppSelector(({ auth }) => auth.role) === "teacher";
  const { t } = useTranslation("exams");
  const { id: courseId } = useParams();
  const { lang } = useGetLang();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [nameEn, setNameEn] = useState<string>("");
  const [nameAr, setNameAr] = useState<string>("");
  const [modalKey, setModalKey] = useState<number>(0);

  useEffect(() => {
    if (openModal && obj) {
      setNameEn(obj?.name?.en || "");
      setNameAr(obj?.name?.ar || "");
    }
  }, [openModal, obj]);

  function onOpenModal() {
    setModalKey((prev) => prev + 1);
    setOpenModal(true);
  }
  function onCloseModal() {
    setOpenModal(false);
    setNameEn("");
    setNameAr("");
  }

  const modalObj = {
    modalTitle: isEdit ? t("editDomain") : t("addDomain"),
    fieldEn1: "Domain title",
    fieldAr1: "عنوان النطاق",
  };

  if (modalType === "subdomain") {
    modalObj.modalTitle = isEdit ? t("editSubdomain") : t("addSubdomain");
    modalObj.fieldEn1 = "Subdomain title";
    modalObj.fieldAr1 = "عنوان النطاق الفرعي";
  } else if (modalType === "assessment") {
    modalObj.modalTitle = isEdit ? t("editAssessment") : t("addAssessment");
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
          dispatch(
            editDomain({
              id: obj?.id,
              course_id: obj?.course_id,
              name_en: nameEn,
              name_ar: nameAr,
            }),
          )
            .unwrap()
            .then((data) => {
              toastifyBox("success", data.message);
              dispatch(fetchDomains(obj?.course_id));
            })
            .catch((err) => toastifyBox("error", err.message || "Failed!"));
        }
      } else {
        dispatch(addDomain(modalObj));
      }
    } else if (modalType === "subdomain") {
      if (isEdit) {
        if (obj?.course_id) {
          dispatch(
            editSubdomain({
              id: obj?.id,
              course_id: obj?.course_id,
              name_en: nameEn,
              name_ar: nameAr,
            }),
          )
            .unwrap()
            .then((data) => {
              toastifyBox("success", data.message);
              dispatch(fetchDomains(obj?.course_id));
            })
            .catch((err) => toastifyBox("error", err.message || "Failed!"));
        }
      } else {
        dispatch(addSubdomain(modalObj));
      }
    } else {
      if (isEdit) {
        if (obj?.course_id) {
          dispatch(
            editAssessment({
              id: obj?.id,
              course_id: obj?.course_id,
              name_en: nameEn,
              name_ar: nameAr,
            }),
          )
            .unwrap()
            .then((data) => {
              toastifyBox("success", data.message);
              dispatch(fetchDomains(obj?.course_id));
            })
            .catch((err) => toastifyBox("error", err.message || "Failed!"));
        }
      } else {
        dispatch(addAssessment(modalObj));
      }
    }
    onCloseModal();
  };

  return isTeacher ? (
    <>
      {isEdit ? (
        <PencilSquareIcon
          title={
            isButtonDisabled
              ? lang === "en"
                ? "This assessment is already active"
                : "هذا الامتحان نشط بالفعل"
              : undefined
          }
          className={`size-5 ${isButtonDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
          onClick={(event) => {
            event.stopPropagation();
            if (!isButtonDisabled) {
              onOpenModal();
            }
          }}
        />
      ) : (
        <div
          className="cursor-pointer text-cyan-700 hover:underline"
          onClick={onOpenModal}
        >
          + {modalObj.modalTitle}
        </div>
      )}

      <Modal
        key={modalKey}
        show={openModal}
        size="md"
        onClose={onCloseModal}
        popup
      >
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
                <input
                  type="text"
                  hidden
                  defaultValue={courseId}
                  name="course_id"
                />
              )}
              {domainId && (
                <input
                  type="text"
                  hidden
                  defaultValue={domainId}
                  name="domain_id"
                />
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
    </>
  ) : (
    <></>
  );
}

function ExamIconForStudent({ assessment }: { assessment: AssessmentType }) {
  const hasStudent = assessment.student && assessment.student[0];
  const studentPivot =
    hasStudent && assessment.student ? assessment.student[0].pivot : null;

  const shouldShowBookmarkIcon =
    !hasStudent || (studentPivot && studentPivot.answeredAtLeastOnce === 0);

  const tooltipContent = studentPivot ? `${studentPivot.total_degree}%` : "";

  const shouldShowCheckCircleIcon =
    studentPivot && studentPivot.total_degree >= 75;

  return shouldShowBookmarkIcon ? (
    <BookmarkIcon className="size-7 rounded-full bg-gray-100 p-1" />
  ) : (
    <Tooltip content={tooltipContent}>
      {shouldShowCheckCircleIcon ? (
        <CheckCircleIcon className="size-7 rounded-full p-1 text-green-600" />
      ) : (
        <XCircleIcon className="size-7 rounded-full p-1 text-red-600" />
      )}
    </Tooltip>
  );
}

export default function ExamsSidebar({
  onSelectAssessment,
  mistakesExam,
  showMistakesExam,
  onCheckMistakesExam,
}: {
  onSelectAssessment: (assessment: AssessmentType) => void;
  mistakesExam: null | AssessmentType;
  showMistakesExam: boolean;
  onCheckMistakesExam: (domains: DomainType[]) => void;
}) {
  const { id: course_id } = useParams();
  const dispatch = useAppDispatch();
  const activeAssessmentId = useAppSelector(
    ({ exams }) => exams.activeAssessment?.id,
  );
  const {domains, loading: loadingDomains} = useAppSelector(({ examsDomains }) => examsDomains);
  const { role, id: student_id } = useAppSelector(({ auth }) => auth);
  const isTeacher = role === "teacher";

  const { t } = useTranslation("exams");
  const { t: tBtns } = useTranslation("buttons");
  const { t: tAlert } = useTranslation("alerts");
  const { lang } = useGetLang();

  const handleDeleteDomain = (id: number) => {
    withReactContent(Swal).fire({
      title: tAlert("deleteDomain"),
      preConfirm: async () => {
        dispatch(deleteDomain(id));
      },
      confirmButtonText: tBtns("confirm"),
      icon: "warning",
      denyButtonText: tBtns("cancel"),
      showDenyButton: true,
      showLoaderOnConfirm: true,
    });
  };
  const handleDeleteSubdomain = (id: number) => {
    withReactContent(Swal).fire({
      title: tAlert("deleteSubdomain"),
      preConfirm: async () => {
        dispatch(deleteSubdomain(id));
      },
      confirmButtonText: tBtns("confirm"),
      icon: "warning",
      denyButtonText: tBtns("cancel"),
      showDenyButton: true,
      showLoaderOnConfirm: true,
    });
  };
  const handleDeleteAssessment = (id: number) => {
    withReactContent(Swal).fire({
      title: tAlert("deleteAssessment"),
      preConfirm: async () => {
        dispatch(deleteAssessment(id));
      },
      confirmButtonText: tBtns("confirm"),
      icon: "warning",
      denyButtonText: tBtns("cancel"),
      showDenyButton: true,
      showLoaderOnConfirm: true,
    });
  };

  useEffect(() => {
    dispatch(fetchDomains(Number(course_id!)))
      .unwrap()
      .then(async (data) => {
        // reset exam and clear localStorage if exam was removed by teacher
        const domains: DomainType[] = data.data;
        onCheckMistakesExam(domains);
        const localActiveAssessmentId =
          localStorage.getItem("activeAssessmentId");

        if (localActiveAssessmentId) {
          const id = JSON.parse(localActiveAssessmentId);
          const assessmentInDomains = domains.some((domain: DomainType) =>
            domain.assessments.some((assessment) => assessment.id === id),
          );
          const assessmentInSubdomains = domains.some((domain: DomainType) =>
            domain.subdomains?.some((subdomain) =>
              subdomain.assessments.some((assessment) => assessment.id === id),
            ),
          );
          if (!assessmentInDomains && !assessmentInSubdomains) {
            dispatch(setActiveAssessment(null));
            localStorage.removeItem("activeAssessmentId");
          }
        }
      })
      .catch((err) => toastifyBox("error", err.message || "Failed!"));
  }, [course_id, dispatch, onCheckMistakesExam, student_id]);

  return (
    <div className="flex shrink-0 flex-col gap-2 md:w-72 md:min-w-64">
      {loadingDomains ? (
        <div className="flex flex-wrap gap-2">
          <span>{t("loadingExams")}</span>
          <Spinner aria-label="spinner" />
        </div>
      ) : (
        <>
          {showMistakesExam && mistakesExam && mistakesExam?.questions?.length ? (
            <AccordionCard>
              <AccordionCard.Panel key={12}>
                <AccordionCard.Title className="grow">
                  <div className="flex items-center justify-between gap-4">
                    {t("previousMistakes")}
                  </div>
                </AccordionCard.Title>
                <AccordionCard.Content className="py-0 pe-0">
                  <h3 className="flex gap-2 p-2" key={mistakesExam?.id}>
                    <BookmarkIcon className="size-7 rounded-full bg-gray-100 p-1" />
                    <span
                      title={
                        activeAssessmentId === mistakesExam.id
                          ? lang === "en"
                            ? "This assessment is already active"
                            : "هذا الامتحان نشط بالفعل"
                          : undefined
                      }
                      className={`text-indigo-900 ${activeAssessmentId === mistakesExam.id ? "cursor-not-allowed" : "cursor-pointer hover:underline"}`}
                      onClick={() => {
                        activeAssessmentId !== mistakesExam.id &&
                          onSelectAssessment(mistakesExam);
                      }}
                    >
                      {lang === "en"
                        ? mistakesExam?.name.en
                        : lang === "ar"
                          ? mistakesExam?.name.ar
                          : undefined}
                    </span>
                  </h3>
                </AccordionCard.Content>
              </AccordionCard.Panel>
            </AccordionCard>
          ) : undefined}
          <AccordionCard>
            {domains?.map((domain) => (
              <AccordionCard.Panel key={domain.id}>
                <AccordionCard.Title className="grow">
                  <div className="flex items-center justify-between gap-4">
                    {isTeacher ? (
                      <>
                        <TrashIcon
                          className="size-5 cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteDomain(domain.id);
                          }}
                        />

                        <AddDomainModal
                          modalType="domain"
                          isEdit
                          obj={domain}
                        />
                      </>
                    ) : undefined}
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
                              {isTeacher ? (
                                <>
                                  <TrashIcon
                                    className="size-5 cursor-pointer"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleDeleteSubdomain(subdomain.id);
                                    }}
                                  />
                                  <AddDomainModal
                                    modalType="subdomain"
                                    isEdit
                                    obj={{
                                      ...subdomain,
                                      course_id: domain.course_id,
                                    }}
                                  />
                                </>
                              ) : undefined}
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
                            {subdomain.assessments?.map((assessment) => (
                              <h3
                                className="flex gap-2 p-2"
                                key={assessment.id}
                              >
                                {isTeacher ? (
                                  <>
                                    <TrashIcon
                                      title={
                                        activeAssessmentId === assessment.id
                                          ? lang === "en"
                                            ? "This assessment is already active"
                                            : "هذا الامتحان نشط بالفعل"
                                          : undefined
                                      }
                                      className={`size-5 ${activeAssessmentId === assessment.id ? "cursor-not-allowed" : "cursor-pointer"}`}
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        if (
                                          activeAssessmentId !== assessment.id
                                        ) {
                                          handleDeleteAssessment(assessment.id);
                                        }
                                      }}
                                    />
                                    <AddDomainModal
                                      modalType="assessment"
                                      isEdit
                                      obj={assessment}
                                      isButtonDisabled={
                                        activeAssessmentId === assessment.id
                                      }
                                    />
                                  </>
                                ) : (
                                  <ExamIconForStudent assessment={assessment} />
                                )}
                                <span
                                  title={
                                    activeAssessmentId === assessment.id
                                      ? lang === "en"
                                        ? "This assessment is already active"
                                        : "هذا الامتحان نشط بالفعل"
                                      : undefined
                                  }
                                  className={`text-indigo-900 ${activeAssessmentId === assessment.id ? "cursor-not-allowed" : "cursor-pointer hover:underline"}`}
                                  onClick={() => {
                                    activeAssessmentId !== assessment.id &&
                                      onSelectAssessment(assessment);
                                  }}
                                >
                                  {lang === "en"
                                    ? assessment.name.en
                                    : lang === "ar"
                                      ? assessment.name.ar
                                      : undefined}
                                </span>
                              </h3>
                            ))}
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
                      className={`flex gap-2 p-2  ${activeAssessmentId === assessment.id ? "select-none" : "cursor-pointer"}`}
                      key={assessment.id}
                    >
                      {isTeacher ? (
                        <>
                          <TrashIcon
                            title={
                              activeAssessmentId === assessment.id
                                ? lang === "en"
                                  ? "This assessment is already active"
                                  : "هذا الامتحان نشط بالفعل"
                                : undefined
                            }
                            className={`size-5 ${activeAssessmentId === assessment.id ? "cursor-not-allowed" : "cursor-pointer"}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              if (activeAssessmentId !== assessment.id) {
                                handleDeleteAssessment(assessment.id);
                              }
                            }}
                          />
                          <AddDomainModal
                            modalType="assessment"
                            isEdit
                            obj={assessment}
                            isButtonDisabled={
                              activeAssessmentId === assessment.id
                            }
                          />
                        </>
                      ) : (
                        <ExamIconForStudent assessment={assessment} />
                      )}
                      <span
                        title={
                          activeAssessmentId === assessment.id
                            ? lang === "en"
                              ? "This assessment is already active"
                              : "هذا الامتحان نشط بالفعل"
                            : undefined
                        }
                        className={`text-indigo-900 ${activeAssessmentId === assessment.id ? "cursor-not-allowed" : "cursor-pointer hover:underline"}`}
                        onClick={() => {
                          activeAssessmentId !== assessment.id &&
                            onSelectAssessment(assessment);
                        }}
                      >
                        {lang === "en"
                          ? assessment.name.en
                          : lang === "ar"
                            ? assessment.name.ar
                            : undefined}
                      </span>
                    </h3>
                  ))}
                  {domain.assessments?.length ? undefined : (
                    <AddDomainModal
                      modalType="subdomain"
                      domainId={domain.id}
                    />
                  )}
                  {isTeacher &&
                    !domain.subdomains?.length &&
                    !domain.assessments?.length &&
                    t("or")}
                  {domain.subdomains?.length ? undefined : (
                    <AddDomainModal
                      modalType="assessment"
                      domainId={domain.id}
                    />
                  )}
                </AccordionCard.Content>
              </AccordionCard.Panel>
            ))}
          </AccordionCard>
          <AddDomainModal modalType="domain" />
        </>
      )}
    </div>
  );
}
