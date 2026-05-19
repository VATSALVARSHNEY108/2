export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  subjectId: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  name: string;
  topicId: string;
  subjectId: string;
  path: string;
}
