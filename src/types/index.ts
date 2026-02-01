export interface Student {
  id: string;
  name: string;
  class: string;
  totalCount: number;
}

export interface CrepeType {
  name: string;
  imageUrl: string;
}

export interface Settings {
  crepeTypes: Record<string, CrepeType>;
  classes: string[];
}

export interface DailyReport {
  id: string;
  date: string;
  salesMap: Record<string, number>;
}

export interface ClassRanking {
  className: string;
  totalCount: number;
  studentCount: number;
}
