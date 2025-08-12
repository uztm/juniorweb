"use client";

import React, { createContext, useContext } from "react";
import { LessonResponse } from "@/types/StudentInfo";

type StudentContextType = {
  data: LessonResponse | null;
  loading: boolean;
  phone: string | null;
};

export const StudentContext = createContext<StudentContextType>({
  data: null,
  loading: true,
  phone: null,
});

export const useStudentContext = () => useContext(StudentContext);
