export interface Student {
    id: string;
    fullName: string;
    photoId: string | null;
  }
  
  export interface Lesson {
    status: string;
    id: string;
    coin: number;
    lessonDate: [number, number, number]; // [year, month, day]
    attendance: string;
  }
  
  export interface ModuleBarchart {
    timeTableId: string;
    timeTableName: string;
    averagePercentage: number;
    coins: number;
  }

  export interface StudentDebtor {
    invoiceId: string;
    leftoverAmount: number;
  }
  
  export interface LessonResponseData {
    lessonEndTime: string;
    allDebtor: number;
    student: Student;
    lesson: Lesson;
    activeCoin: number;
    lessonStartTime: string;
    moduleBarchart: ModuleBarchart[];
    attendanceAveragePercent: number;
    group: string;
    studentDebtors: StudentDebtor[];
  }
  
  export interface LessonResponse {
    success: boolean;
    data: LessonResponseData;
  }
  