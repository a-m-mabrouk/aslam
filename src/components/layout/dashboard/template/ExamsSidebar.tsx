import { FormEventHandler, useEffect, useState } from "react";
import { Button, Modal, TextInput } from "flowbite-react";

import { API_EXAMS } from "../../../../router/routes/apiRoutes";
import { AccordionCard } from "../../../accordion";
import axiosDefault from "../../../../utilities/axios";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

interface DomainType {
  id: number;
  course_id: 1;
  name: {
    ar: string;
    en: string;
  };
  assessments: string[];
  subdomains?: DomainType[];
}

export function DomainAccordionCard({ domain }: { domain: DomainType }) {
  return (
    <AccordionCard>
      <AccordionCard.Panel key={domain.id}>
        <AccordionCard.Title className="grow">
          <div className="flex items-center justify-between gap-4">
            <span className="">{domain?.name.ar}</span>
          </div>
        </AccordionCard.Title>
        <AccordionCard.Content>
          {domain.subdomains?.map((subdomain) => (
            <DomainAccordionCard domain={subdomain} />
          ))}
          {domain.assessments.map(() => (
            <h1>dsfdsdf</h1>
          ))}
        </AccordionCard.Content>
      </AccordionCard.Panel>
    </AccordionCard>
  );
}

interface AddNewModalProps {
  modalType: "assessment" | "subdomain" | "domain";
  domainId?: string | null;
  subDomainId?: string | null;
}

export function AddDomainModal({
  modalType,
  domainId = null,
  subDomainId = null,
}: AddNewModalProps) {
  const { t } = useTranslation("exams");
  const {id: courseId} = useParams();
  
  const [openModal, setOpenModal] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");

  function onCloseModal() {
    setOpenModal(false);
    setNameEn("");
    setNameAr("");
  }

  const addNewHandler: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    formData.forEach((value, key) => {
      console.log(key, value);
    });
  };

  const modalTitle =
    modalType === "domain"
      ? t("addDomain")
      : modalType === "subdomain"
        ? t("addSubdomain")
        : t("addAssessment");

  const fieldEn1 =
    modalType === "domain"
      ? "Domain title"
      : modalType === "subdomain"
        ? "Subdomain title"
        : "Exam title";

  const fieldAr1 =
    modalType === "domain"
      ? "عنوان النطاق"
      : modalType === "subdomain"
        ? "عنوان النطاق الفرعي"
        : "عنوان الامتحان";

  return (
    <>
      <span
        className="cursor-pointer text-cyan-700 hover:underline"
        onClick={() => setOpenModal(true)}
      >
        + {modalTitle}
      </span>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              {modalTitle}
            </h3>
            <form className="grid gap-3" onSubmit={addNewHandler}>
              <TextInput
                placeholder={fieldEn1}
                value={nameEn}
                name="nameEn"
                onChange={(event) => setNameEn(event.target.value)}
                required
              />
              <TextInput
                placeholder={fieldAr1}
                value={nameAr}
                name="nameAr"
                onChange={(event) => setNameAr(event.target.value)}
                required
              />
            {courseId && <input type="text" hidden value={courseId} name="courseId" />}
            {domainId && <input type="text" hidden value={domainId} name="domainId" />}
            {subDomainId && <input type="text" hidden value={subDomainId} name="subDomainId" />}
              <Button type="submit">+ {modalTitle}</Button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default function ExamsSidebar() {
  const { id: course_id } = useParams();
  const [domains, setDomains] = useState<DomainType[]>([]);

  useEffect(() => {
    const fetchDomains = async () => {
      const { data } = await axiosDefault.get(
        `${API_EXAMS.domains}?course_id=${course_id}`,
      );
      const domains = [...data.data];
      setDomains(domains);
    };
    fetchDomains();
  }, [course_id]);

  return domains.map((domain) => (
    <>
      <DomainAccordionCard key={domain.id} domain={domain} />
      <AddDomainModal modalType="domain" />
    </>
  ));
}
