const TOKEN_KEY = "auth_token";
const STUDENT_INFO_KEY = "student_info";

interface StudentInfo {
  id: string;
  phoneNumber: string;
  // Add more fields as needed
}

export const auth = {
  // Token methods
  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STUDENT_INFO_KEY);
  },

  // Student Info methods
  setStudentInfo: (info: StudentInfo) => {
    localStorage.setItem(STUDENT_INFO_KEY, JSON.stringify(info));
  },

  getStudentInfo: (): StudentInfo | null => {
    const data = localStorage.getItem(STUDENT_INFO_KEY);
    return data ? JSON.parse(data) : null;
  },

  removeStudentInfo: () => {
    localStorage.removeItem(STUDENT_INFO_KEY);
  },
};
