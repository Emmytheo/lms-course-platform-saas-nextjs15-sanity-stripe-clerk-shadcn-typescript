import { MOCK_COURSES, MOCK_ENROLLMENTS, MOCK_EXAMS, MOCK_USERS, MOCK_LEARNING_PATHS, MOCK_EXAM_ENROLLMENTS, MOCK_PATH_ENROLLMENTS } from './data';
import { Course, Exam, Enrollment, User, LearningPath, ExamEnrollment, LearningPathEnrollment } from './types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const lmsApi = {
  // Users
  getCurrentUser: async (): Promise<User> => {
    await delay(200);
    return MOCK_USERS[0];
  },

  // Courses
  getAllCourses: async (): Promise<Course[]> => {
    await delay(500);
    return MOCK_COURSES;
  },

  getCourseById: async (id: string): Promise<Course | undefined> => {
    await delay(300);
    return MOCK_COURSES.find(c => c.id === id);
  },

  // Enrollments
  getMyEnrollments: async (): Promise<(Enrollment & { course: Course })[]> => {
    await delay(400);
    return MOCK_ENROLLMENTS.map(e => ({
      ...e,
      course: MOCK_COURSES.find(c => c.id === e.course_id)!
    })).filter(e => e.course);
  },

  getMyExamEnrollments: async (): Promise<(ExamEnrollment & { exam: Exam })[]> => {
    await delay(400);
    return MOCK_EXAM_ENROLLMENTS.map(e => ({
      ...e,
      exam: MOCK_EXAMS.find(ex => ex.id === e.exam_id)!
    })).filter(e => e.exam);
  },

  getMyPathEnrollments: async (): Promise<(LearningPathEnrollment & { path: LearningPath })[]> => {
    await delay(400);
    return MOCK_PATH_ENROLLMENTS.map(e => ({
      ...e,
      path: MOCK_LEARNING_PATHS.find(lp => lp.id === e.learning_path_id)!
    })).filter(e => e.path);
  },

  // Exams
  getExamById: async (id: string): Promise<Exam | undefined> => {
    await delay(300);
    return MOCK_EXAMS.find(e => e.id === id);
  },

  // Learning Paths
  getAllLearningPaths: async (): Promise<LearningPath[]> => {
    await delay(500);
    return MOCK_LEARNING_PATHS;
  },

  getLearningPathById: async (id: string): Promise<LearningPath | undefined> => {
    await delay(300);
    return MOCK_LEARNING_PATHS.find(lp => lp.id === id);
  },

  // Admin Actions (Mock)
  createCourse: async (course: Partial<Course>): Promise<Course> => {
    await delay(800);
    const newCourse = {
      ...course,
      id: `c_${Date.now()}`,
      created_at: new Date().toISOString(),
      modules: []
    } as Course;
    MOCK_COURSES.push(newCourse);
    return newCourse;
  },

  createLearningPath: async (path: Partial<LearningPath>): Promise<LearningPath> => {
    await delay(800);
    const newPath = {
      ...path,
      id: `lp_${Date.now()}`,
      created_at: new Date().toISOString(),
      courses: []
    } as LearningPath;
    MOCK_LEARNING_PATHS.push(newPath);
    return newPath;
  }
};
