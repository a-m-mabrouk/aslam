import { AccordionCard } from "../../../accordion";

type MenuItem = {
    id: number;
    title: string;
    children?: MenuItem[];
  };
  
  const menuStructure: MenuItem[] = [
    {
      id: 1,
      title: "المجالات المعرفية",
      children: [
        { id: 2, title: "Item 1" },
        { id: 3, title: "Item 2" },
        { id: 4, title: "Item 3" },
      ],
    },
    {
      id: 5,
      title: "النطاقات",
      children: [
        {
          id: 12,
          title: "الأشخاص",
          children: [
            { id: 13, title: "Part 1" },
            { id: 14, title: "Part 2" },
            { id: 15, title: "Part 3" },
          ],
        },
        {
          id: 16,
          title: "العملية",
          children: [
            { id: 17, title: "Step 1" },
            { id: 18, title: "Step 2" },
          ],
        },
        {
          id: 19,
          title: "بيئة العمل",
          children: [
            { id: 20, title: "Environment 1" },
            { id: 21, title: "Environment 2" },
          ],
        },
      ],
    },
  
    {
      id: 22,
      title: "الإختبارات الكاملة",
      children: [
        { id: 23, title: "Test 1" },
        { id: 24, title: "Test 2" },
        { id: 25, title: "Test 3" },
      ],
    },
  ];
  
  const hasSubcategories = (item: MenuItem): boolean => {
    return (
      item.children?.some(
        (child) => child.children && child.children.length > 0,
      ) ?? false
    );
  };

export default function ExamsSidebar() {
  return (
    <AccordionCard className="hidden">
        {
          menuStructure?.map((mainItem) => (
            <AccordionCard.Panel key={mainItem.id}>
              <AccordionCard.Title className="grow">
                <div className="flex items-center justify-between gap-4">
                  <span className="">{mainItem?.title}</span>
                </div>
              </AccordionCard.Title>
              <AccordionCard.Content>
                {hasSubcategories(mainItem) ? (
                  <AccordionCard>
                    {
                      mainItem?.children?.map((subItem) => (
                        <AccordionCard.Panel key={subItem.id}>
                          <AccordionCard.Title className="grow">
                            <div className="flex items-center justify-between gap-4">
                              <span className="">{subItem?.title}</span>
                            </div>
                          </AccordionCard.Title>
                          <AccordionCard.Content>
                            <div className="grid gap-4">
                              {subItem?.children?.map((item) => (
                                <h1>{item.title}</h1>
                              ))}
                            </div>
                          </AccordionCard.Content>
                        </AccordionCard.Panel>
                      )) as unknown as React.ReactElement
                    }
                  </AccordionCard>
                ) : (
                  <div className="grid gap-4">
                    {mainItem?.children?.map((item) => <h1>{item.title}</h1>)}
                  </div>
                )}

                {/* {mainItem?.children?.length === 0 && (
                  <p className="text-center text-gray-400">{t("noLessons")}</p>
                )} */}
              </AccordionCard.Content>
            </AccordionCard.Panel>
          )) as unknown as React.ReactElement
        }
      </AccordionCard>
  )
}
