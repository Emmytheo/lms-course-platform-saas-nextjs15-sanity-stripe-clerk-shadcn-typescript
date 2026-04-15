import { LMSDataProvider, Course, LearningPath, Exam, UserProfile } from './interface';
import { MOCK_COURSES, MOCK_LEARNING_PATHS, MOCK_EXAMS, MOCK_USERS, MOCK_ENROLLMENTS, MOCK_EXAM_ENROLLMENTS, MOCK_PATH_ENROLLMENTS } from '@/lib/lms/data';

export class DummyAdapter implements LMSDataProvider {
    private courses: Course[];
    private learningPaths: LearningPath[];
    private exams: Exam[];

    constructor() {
        // Initialize with mock data
        // In a real server-side context per request, this resets every time.
        // For a true singleton "in-memory" DB across requests in Next.js dev, 
        // we'd need a global singleton, but for basic navigating this is okay 
        // OR we can make the arrays in dummy-data.ts mutable and import them directly.
        // We will modify the imported arrays directly for "persistence" during the server lifecycle.
        this.courses = MOCK_COURSES as any[];
        this.learningPaths = MOCK_LEARNING_PATHS as any[];
        this.exams = MOCK_EXAMS as any[];
    }

    async getAllCourses(): Promise<Course[]> {
        return this.courses;
    }

    async getCourse(slug: string): Promise<Course | null> {
        return this.courses.find(c => c.slug.current === slug) || null;
    }

    async createCourse(course: Partial<Course>): Promise<Course> {
        const newCourse = {
            ...course,
            _id: `course-${Date.now()}`,
            slug: { current: course.slug?.current || `course-${Date.now()}` },
            modules: []
        } as Course;
        this.courses.push(newCourse);
        return newCourse;
    }

    async updateCourse(id: string, updates: Partial<Course>): Promise<Course> {
        const index = this.courses.findIndex(c => c._id === id);
        if (index === -1) throw new Error("Course not found");

        const updatedCourse = { ...this.courses[index], ...updates };
        this.courses[index] = updatedCourse;
        return updatedCourse;
    }

    async deleteCourse(id: string): Promise<void> {
        const index = this.courses.findIndex(c => c._id === id);
        if (index !== -1) {
            this.courses.splice(index, 1);
        }
    }

    async getAllLearningPaths(): Promise<LearningPath[]> {
        return this.learningPaths;
    }

    async getLearningPath(slug: string): Promise<LearningPath | null> {
        return this.learningPaths.find(p => p.slug.current === slug) || null;
    }

    async getLearningPathById(id: string): Promise<LearningPath | null> {
        return this.learningPaths.find(p => p._id === id) || null;
    }

    async createLearningPath(path: Partial<LearningPath>): Promise<LearningPath> {
        const newPath = {
            ...path,
            _id: `path-${Date.now()}`,
            slug: { current: path.slug?.current || `path-${Date.now()}` }
        } as LearningPath;
        this.learningPaths.push(newPath);
        return newPath;
    }

    async updateLearningPath(id: string, updates: Partial<LearningPath>): Promise<LearningPath> {
        const index = this.learningPaths.findIndex(p => p._id === id);
        if (index === -1) throw new Error("Learning Path not found");

        const updatedPath = { ...this.learningPaths[index], ...updates };
        this.learningPaths[index] = updatedPath;
        return updatedPath;
    }

    async deleteLearningPath(id: string): Promise<void> {
        const index = this.learningPaths.findIndex(p => p._id === id);
        if (index !== -1) {
            this.learningPaths.splice(index, 1);
        }
    }

    async enrollStudent(courseId: string, studentId: string): Promise<void> {
        console.log(`[DummyDB] Enrolled student ${studentId} in course ${courseId}`);
        // No-op for dummy mode, or could store in a separate MOCK_ENROLLMENTS array
    }

    async getStudentEnrollments(studentId: string): Promise<Course[]> {
        // Return all courses for testing purposes, or empty
        return this.courses.slice(0, 2);
    }

    // Exam Methods
    async getAllExams(): Promise<Exam[]> {
        return this.exams;
    }

    async getExam(slug: string): Promise<Exam | null> {
        return this.exams.find(e => e.slug.current === slug) || null;
    }

    async createExam(exam: Partial<Exam>): Promise<Exam> {
        const newExam = {
            ...exam,
            _id: `exam-${Date.now()}`,
            slug: { current: exam.slug?.current || `exam-${Date.now()}` },
            questions: exam.questions || [],
            sections: exam.sections || []
        } as Exam;
        this.exams.push(newExam);
        return newExam;
    }

    async updateExam(id: string, updates: Partial<Exam>): Promise<Exam> {
        const index = this.exams.findIndex(e => e._id === id);
        if (index === -1) throw new Error("Exam not found");

        const updatedExam = { ...this.exams[index], ...updates };
        this.exams[index] = updatedExam;
        return updatedExam;
    }

    async deleteExam(id: string): Promise<void> {
        const index = this.exams.findIndex(e => e._id === id);
        if (index !== -1) {
            this.exams.splice(index, 1);
        }
    }
    async getCourseById(id: string): Promise<Course | null> {
        return this.courses.find(c => c._id === id) || null;
    }

    async getExamById(id: string): Promise<Exam | null> {
        return this.exams.find(e => e._id === id) || null;
    }

    // Enrollment Methods
    async createEnrollment(userId: string, courseId: string): Promise<any> {
        return { id: `enr_${Date.now()}`, user_id: userId, course_id: courseId };
    }

    async createExamEnrollment(userId: string, examId: string): Promise<any> {
        return { id: `ex_enr_${Date.now()}`, user_id: userId, exam_id: examId };
    }

    async updateExamEnrollment(enrollmentId: string, data: any): Promise<any> {
        const enrollment = MOCK_EXAM_ENROLLMENTS.find((e: any) => e.id === enrollmentId);
        if (enrollment) {
            Object.assign(enrollment, data);
            return enrollment;
        }
        return null;
    }

    async createLearningPathEnrollment(userId: string, pathId: string): Promise<any> {
        return { id: `lp_enr_${Date.now()}`, user_id: userId, learning_path_id: pathId };
    }

    async getStudentEnrollmentsWithDetails(studentId: string): Promise<any[]> {
        return MOCK_ENROLLMENTS.filter(e => e.user_id === studentId).map(e => ({
            ...e,
            course: this.courses.find(c => c._id === e.course_id)
        })).filter(e => e.course);
    }

    async getStudentExamEnrollmentsWithDetails(studentId: string): Promise<any[]> {
        return MOCK_EXAM_ENROLLMENTS.filter(e => e.user_id === studentId).map(e => ({
            ...e,
            exam: this.exams.find(ex => ex._id === e.exam_id)
        })).filter(e => e.exam);
    }

    async getStudentLearningPathEnrollmentsWithDetails(studentId: string): Promise<any[]> {
        return MOCK_PATH_ENROLLMENTS.filter(e => e.user_id === studentId).map(e => ({
            ...e,
            learning_path: this.learningPaths.find(lp => lp._id === e.learning_path_id)
        })).filter(e => e.learning_path);
    }

    // Retrieval
    async getEnrollment(id: string): Promise<any> {
        return MOCK_ENROLLMENTS.find(e => (e as any).id === id) || null;
    }
    async getExamEnrollment(id: string): Promise<any> {
        return MOCK_EXAM_ENROLLMENTS.find(e => (e as any).id === id) || null;
    }
    async getLPEnrollment(id: string): Promise<any> {
        return MOCK_PATH_ENROLLMENTS.find(e => (e as any).id === id) || null;
    }

    // Progress
    async updateLessonProgress(userId: string, courseId: string, lessonId: string, completed: boolean): Promise<void> {
        console.log("Mock update lesson progress");
    }

    async getProfile(userId: string): Promise<UserProfile | null> {
        return MOCK_USERS.find(u => u.id === userId) || null;
    }

    async getProfileByEmail(email: string): Promise<UserProfile | null> {
        return MOCK_USERS.find(u => u.email === email) || null;
    }

    async updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
        return { ...MOCK_USERS[0], ...data };
    }

    async getStudentCount(): Promise<number> {
        return MOCK_USERS.filter(u => u.role === 'student').length;
    }

    async getStudents(): Promise<UserProfile[]> {
        return MOCK_USERS.filter(u => u.role === 'student');
    }

    async getInstructors(): Promise<UserProfile[]> {
        return [];
    }

    async calculateAndUpdateEnrollmentProgress(userId: string, courseId: string): Promise<void> {
        console.log("Mock calculateAndUpdateEnrollmentProgress");
    }

    async calculateAndUpdateLearningPathProgress(userId: string, pathId: string): Promise<void> {
        console.log("Mock calculateAndUpdateLearningPathProgress");
    }
}
