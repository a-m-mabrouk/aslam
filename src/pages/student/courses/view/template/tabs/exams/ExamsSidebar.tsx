import { FormEventHandler, useEffect, useState } from "react";
import { Button, Modal, TextInput } from "flowbite-react";

import { API_EXAMS } from "../../../../../../../router/routes/apiRoutes";
import { AccordionCard } from "../../../../../../../components/accordion";
import axiosDefault from "../../../../../../../utilities/axios";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../../../store";
import {
  setExamQuestions,
  setDomains,
  setAssessmentId,
} from "../../../../../../../store/reducers/exams";
import { toastifyBox } from "../../../../../../../helper/toastifyBox";
import useGetLang from "../../../../../../../hooks/useGetLang";

export interface DomainType {
  id: number;
  course_id: 1;
  name: {
    ar: string;
    en: string;
  };
  assessments: AssessmentType[];
  subdomains?: DomainType[];
}
export interface AssessmentType {
  id: number;
  module_id: null;
  course_id: number;
  domain_id: number | null;
  subdomain_id: number | null;
  name: {
    ar: string;
    en: string;
  };
  questions: Question[];
}

interface AddNewModalProps {
  modalType: "assessment" | "subdomain" | "domain";
  domainId?: number | null;
  subDomainId?: number | null;
}

export function AddDomainModal({
  modalType,
  domainId = null,
  subDomainId = null,
}: AddNewModalProps) {
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
    const url =
      modalType === "domain"
        ? API_EXAMS.domains
        : modalType === "subdomain"
          ? API_EXAMS.subdomain
          : API_EXAMS.assessments;
    const { data } = await axiosDefault.post(url, obj);
    toastifyBox("success", data.message);
    onCloseModal();
  };

  return (
    <>
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
    </>
  );
}

export default function ExamsSidebar() {
  const { id: course_id } = useParams();
  const dispatch = useAppDispatch();
  const domains = useAppSelector(({ exams }) => exams.domains);
  const { t } = useTranslation("exams");
  const { lang } = useGetLang();

  useEffect(() => {
    const fetchDomains = async () => {
      const { data } = await axiosDefault.get(
        `${API_EXAMS.domains}?course_id=${course_id}`,
      );
      const domainsArr = [...data.data];
      dispatch(setDomains(domainsArr));
    };
    fetchDomains();
  }, [course_id, dispatch]);

  return (
    <>
      <AccordionCard>
        {domains.map((domain) => (
          <AccordionCard.Panel key={domain.id}>
            <AccordionCard.Title className="grow">
              <div className="flex items-center justify-between gap-4">
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
                            <h3
                              className="cursor-pointer text-indigo-900 hover:underline"
                              key={id}
                              onClick={() =>
                                {dispatch(setExamQuestions(questions));dispatch(setAssessmentId(id))}
                              }
                            >
                              {lang === "en"
                                ? name.en
                                : lang === "ar"
                                  ? name.ar
                                  : undefined}
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
                  className="cursor-pointer text-indigo-900 hover:underline"
                  key={id}
                  onClick={() => {dispatch(setExamQuestions(questions));dispatch(setAssessmentId(id))}}
                >
                  {lang === "en"
                    ? name.en
                    : lang === "ar"
                      ? name.ar
                      : undefined}
                </h3>
              ))}
              {domain.assessments?.length ? undefined : (
                <AddDomainModal modalType="subdomain" domainId={domain.id} />
              )}
              {!domain.subdomains?.length &&
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
    </>
  );
}
