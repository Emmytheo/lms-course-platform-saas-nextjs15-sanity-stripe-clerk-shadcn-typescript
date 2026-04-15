export type Role = 'student' | 'admin' | 'instructor';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: Role;
  xp: number;
  level: number;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  instructor_id: string;
  difficulty: 'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced';
  duration_minutes: number;
  tags: string[];
  published: boolean;
  created_at: string;
  price?: number;
  slug?: string;
  modules?: Module[]; // Joined view
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  lessons?: Lesson[]; // Joined view
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'dojo';
  content_url?: string; // Video URL or text content
  duration_minutes: number;
  order_index: number;
  is_free: boolean;
}

export interface Enrollment {
  id: string; // Surrogate key
  user_id: string;
  course_id: string;
  progress_percent: number;
  last_accessed_at: string;
  completed: boolean;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  pass_score: number;
  questions: Question[]; // Flat list if no sections
  sections?: ExamSection[]; // Structured view
  instructions?: string[];
  thumbnail_url?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  created_at: string;
  slug?: string;
  price?: number;
  isEnrolled?: boolean;
}

export interface ExamSection {
  title: string;
  description: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false';
  options: string[];
  correct_option_index: number;
  points: number;
}

export interface ExamResult {
  id: string;
  user_id: string;
  exam_id: string;
  score: number;
  passed: boolean;
  completed_at: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  courses: Course[]; // Ordered list of courses
  duration_minutes: number;
  level: string;
  created_at: string;
  slug?: string;
  price?: number;
  isEnrolled?: boolean;
}

export interface LearningPathEnrollment {
  user_id: string;
  learning_path_id: string;
  progress_percent: number;
  completed_courses_count: number;
  joined_at: string;
}

export interface ExamEnrollment {
  user_id: string;
  exam_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number;
  passed?: boolean;
  last_attempt_at?: string;
}
