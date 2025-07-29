// hooks/useAuth.ts
const TOKEN_KEY = "auth_token";
const STUDENT_ID_KEY = "student_id";

export const auth = {
  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STUDENT_ID_KEY);
  },

  setStudentId: (studentId: string) => {
    localStorage.setItem(STUDENT_ID_KEY, studentId);
  },

  getStudentId: (): string | null => {
    return localStorage.getItem(STUDENT_ID_KEY);
  },

  removeStudentId: () => {
    localStorage.removeItem(STUDENT_ID_KEY);
  },
};
