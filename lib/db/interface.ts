export interface Course {
    _id: string;
    title: string;
    slug: { current: string };
    price?: number;
    description?: string;
    image?: string; // URL
    category?: { title: string };
    tags?: string[];
    instructor?: { name: string; photo?: string };
    modules?: Module[];
    // New fields
    level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
    prerequisites?: string[];
    objectives?: string[]; // What you'll learn
    language?: string;
    includes?: string[];
    last_updated?: string;
}

export interface Module {
    _id: string;
    title: string;
    lessons?: Lesson[];
}

export interface Lesson {
    _id: string;
    title: string;
    videoUrl?: string; // For video lessons
    content?: string; // For text/article lessons
    type: 'video' | 'text' | 'quiz' | 'game';
    questions?: Question[]; // For quiz lessons
}

export interface LearningPath {
    _id: string;
    title: string;
    slug: { current: string };
    description?: string;
    image?: string;
    courses?: (Course | Exam)[]; // Polymorphic list
    // New fields
    level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
    language?: string;
    objectives?: string[];
    prerequisites?: string[];
}

// ... (Question and ExamSection remain unchanged)

export interface Question {
    id: string;
    text: string;
    type: 'multiple_choice' | 'true_false';
    options: string[];
    correct_option_index: number;
    points: number;
}

export interface ExamSection {
    id: string;
    title: string;
    description: string;
    questions: Question[];
}

export interface Exam {
    _id: string;
    title: string;
    description: string;
    slug: { current: string };
    duration_minutes: number;
    pass_score: number; // Percentage
    thumbnail_url?: string;
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
    sections?: ExamSection[];
    instructions?: string[];
    questions?: Question[]; // Fallback for simple exams
    created_at?: string;
    // New fields
    prerequisites?: string[];
    objectives?: string[];
    tags?: string[];
}

export interface LMSDataProvider {
    // Course Methods
    getAllCourses(): Promise<Course[]>;
    getCourse(slug: string): Promise<Course | null>;
    getCourseById(id: string): Promise<Course | null>;
    createCourse(course: Partial<Course>): Promise<Course>;
    updateCourse(id: string, course: Partial<Course>): Promise<Course>;
    deleteCourse(id: string): Promise<void>;

    // Learning Path Methods
    getAllLearningPaths(): Promise<LearningPath[]>;
    getLearningPath(slug: string): Promise<LearningPath | null>;
    getLearningPathById(id: string): Promise<LearningPath | null>;
    createLearningPath(path: Partial<LearningPath>): Promise<LearningPath>;
    updateLearningPath(id: string, path: Partial<LearningPath>): Promise<LearningPath>;
    deleteLearningPath(id: string): Promise<void>;

    // Student Methods
    enrollStudent(courseId: string, studentId: string): Promise<void>;
    getStudentEnrollments(studentId: string): Promise<Course[]>; // Legacy
    getStudentEnrollmentsWithDetails(studentId: string): Promise<any[]>; // Returns Enrollment joined with Course

    // New Enrollment Methods
    createEnrollment(userId: string, courseId: string): Promise<any>;
    createExamEnrollment(userId: string, examId: string): Promise<any>;
    getStudentExamEnrollmentsWithDetails(studentId: string): Promise<any[]>;
    createLearningPathEnrollment(userId: string, pathId: string): Promise<any>;
    createLearningPathEnrollment(userId: string, pathId: string): Promise<any>;
    getStudentLearningPathEnrollmentsWithDetails(studentId: string): Promise<any[]>;
    updateExamEnrollment(enrollmentId: string, data: any): Promise<any>;

    // Retrieval with Progress
    getEnrollment(enrollmentId: string): Promise<any>;
    getExamEnrollment(enrollmentId: string): Promise<any>;
    getLPEnrollment(enrollmentId: string): Promise<any>;



    // Exam Methods
    getAllExams(): Promise<Exam[]>;
    getExam(slug: string): Promise<Exam | null>;
    getExamById(id: string): Promise<Exam | null>;
    createExam(exam: Partial<Exam>): Promise<Exam>;
    updateExam(id: string, exam: Partial<Exam>): Promise<Exam>;
    deleteExam(id: string): Promise<void>;

    // Profile Methods
    getProfile(userId: string): Promise<UserProfile | null>;
    getProfileByEmail(email: string): Promise<UserProfile | null>;
    updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile>;
    getStudentCount(): Promise<number>;
    getInstructors(): Promise<UserProfile[]>;
    getStudents(): Promise<UserProfile[]>;

    // Progress Methods
    updateLessonProgress(userId: string, courseId: string, lessonId: string, completed: boolean): Promise<void>;
    calculateAndUpdateEnrollmentProgress(userId: string, courseId: string): Promise<void>;
    calculateAndUpdateLearningPathProgress(userId: string, pathId: string): Promise<void>;

    // Blog Methods
    getAllPosts?(): Promise<BlogPost[]>;
    getPost?(slug: string): Promise<BlogPost | null>;
    createPost?(post: Partial<BlogPost>): Promise<BlogPost>;
    updatePost?(id: string, post: Partial<BlogPost>): Promise<BlogPost>;
    deletePost?(id: string): Promise<void>;

    // Payment Methods
    getPaymentRequests?(): Promise<PaymentRequest[]>;
    createPaymentRequest?(request: Partial<PaymentRequest>): Promise<PaymentRequest>;
    updatePaymentRequestStatus?(id: string, status: 'approved' | 'rejected'): Promise<void>;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    author_id?: string;
    cover_image?: string;
    published: boolean;
    published_at?: string;
    created_at: string;
    tags?: string[];
}

export interface PaymentRequest {
    id: string;
    user_id: string;
    item_id: string;
    item_type: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
    user?: UserProfile;
}

export interface UserProfile {
    id: string;
    email?: string;
    fullName?: string;
    avatarUrl?: string;
    role: 'student' | 'instructor' | 'admin';
}
