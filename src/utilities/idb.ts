import { openDB, IDBPDatabase } from "idb";


export type IDBAssessmentType = AssessmentType & {
  currentQuestionIndex: number;
  examTimeRemaining: number;
  review: boolean;
  examAnswers: ExamAnswer[];
  didAssessmentStart: boolean;
};

interface MyDatabaseSchema {
  exams: IDBAssessmentType;
}

const initIDBAssessment: IDBAssessmentType = {
  id: 0,
  module_id: null,
  course_id: 0,
  domain_id: null,
  subdomain_id: null,
  name: {
    ar: "",
    en: "",
  },
  questions: [],
  currentQuestionIndex: 0,
  examTimeRemaining: 0,
  review: false,
  examAnswers: [],
  didAssessmentStart: false,
};

let db: IDBPDatabase<MyDatabaseSchema> | undefined;

export async function initializeDB() {
  if (!db) {
    db = await openDB<MyDatabaseSchema>("AslamExams", 1, {
      upgrade(database) {
        if (!database.objectStoreNames.contains("exams")) {
          database.createObjectStore("exams", { keyPath: "id" });
        }
      },
    });
  }
  return db;
}

export async function getAllItems(): Promise<MyDatabaseSchema["exams"][]> {
  const db = await initializeDB();
  return db.getAll("exams");
}
export async function getItemById(
  id: number,
): Promise<MyDatabaseSchema["exams"] | undefined> {
  const db = await initializeDB();  
  return db.get("exams", id);
}
export async function addItem(item: MyDatabaseSchema["exams"]) {
  const db = await initializeDB();
  await db.put("exams", item);
}
export async function updateItem(id: number, keyValuepairs: object) {
  const db = await initializeDB();
  if (id) {
    let iDBAssessment = await db.get("exams", id);
    console.log(iDBAssessment);
    
    if (!iDBAssessment) {
      console.log('not init');
      
      iDBAssessment = { ...initIDBAssessment, id };
    }
    const keys = Object.keys(keyValuepairs);
    keys.forEach((key) => {
      const myKey = key as keyof object;
      iDBAssessment[key] = keyValuepairs[myKey];
      console.log(myKey, keyValuepairs[myKey]);
      
    });
    await db.put("exams", iDBAssessment);
  }
}
export async function deleteItem(id: number): Promise<void> {
  const db = await initializeDB();
  await db.delete("exams", id);
}
