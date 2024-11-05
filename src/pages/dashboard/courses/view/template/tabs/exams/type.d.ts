
interface Question {
  type: "mcq" | "dragdrop";
  chapter?: string;
  domain?: string;
  name: string;
  description: string;
  degree: number;
  options: {
    option: string;
    answer: string;
  }[];
}
interface QuestionMCQ {
  type: "mcq";
  questionText: string;
  description: string;
  degree: number;
  a: string;
  b: string;
  c?: string;
  d?: string;
  e?: string;
  f?: string;
  answer: string;
}
interface QuestionDragDrop {
  type: "dragdrop";
  questionText: string;
  description: string;
  degree: number;
  drag1: string;
  drag2: string;
  drag3?: string;
  drag4?: string;
  drag5?: string;
  drag6?: string;
  drop1: string;
  drop2: string;
  drop3?: string;
  drop4?: string;
  drop5?: string;
  drop6?: string;
}

type Question = QuestionMCQ | QuestionDragDrop;
