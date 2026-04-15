import { Course, Exam, Enrollment, User, LearningPathEnrollment, ExamEnrollment } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'user_01',
    email: 'student@example.com',
    full_name: 'Alex Chen',
    role: 'student',
    xp: 1250,
    level: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: 'admin_01',
    email: 'master@dojo.com',
    full_name: 'Master Ken',
    role: 'admin',
    xp: 99999,
    level: 100,
    created_at: new Date().toISOString(),
  },
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'c_01',
    title: 'Fundamentals of Movement',
    description: 'Master the core stances, balance, and footwork required for all advanced martial arts techniques.',
    thumbnail_url: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop',
    instructor_id: 'admin_01',
    difficulty: 'Beginner',
    duration_minutes: 45,
    tags: ['Stance', 'Balance', 'Core'],
    published: true,
    price: 49.99,
    slug: 'fundamentals-of-movement',
    created_at: new Date().toISOString(),
    modules: [
      {
        id: 'm_01',
        course_id: 'c_01',
        title: 'The Neutral Stance',
        order_index: 0,
        lessons: [
          { id: 'l_01', module_id: 'm_01', title: 'Introduction to Stance', type: 'video', content_url: 'https://example.com/video1.mp4', duration_minutes: 5, order_index: 0, is_free: true },
          { id: 'l_02', module_id: 'm_01', title: 'Weight Distribution', type: 'text', content_url: 'Keep your weight 50/50...', duration_minutes: 10, order_index: 1, is_free: false },
          { id: 'l_03', module_id: 'm_01', title: 'Live Dojo: Stance Check', type: 'dojo', duration_minutes: 15, order_index: 2, is_free: false },
        ]
      },
      {
        id: 'm_02',
        course_id: 'c_01',
        title: 'Forward Movement',
        order_index: 1,
        lessons: [
          { id: 'l_04', module_id: 'm_02', title: 'The Lunge', type: 'video', duration_minutes: 8, order_index: 0, is_free: false },
          { id: 'l_05', module_id: 'm_02', title: 'Live Dojo: Lunge Drill', type: 'dojo', duration_minutes: 20, order_index: 1, is_free: false },
        ]
      }
    ]
  },
  {
    id: 'c_02',
    title: 'Advanced Striking',
    description: 'Precision striking techniques focusing on speed, power generation, and target acquisition.',
    thumbnail_url: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2072&auto=format&fit=crop',
    instructor_id: 'admin_01',
    difficulty: 'Advanced',
    duration_minutes: 60,
    tags: ['Striking', 'Speed', 'Power'],
    published: true,
    price: 79.99,
    slug: 'advanced-striking',
    created_at: new Date().toISOString(),
    modules: []
  }
];

export const MOCK_ENROLLMENTS: Enrollment[] = [
  {
    user_id: 'user_01',
    course_id: 'c_01',
    progress_percent: 35,
    last_accessed_at: new Date().toISOString(),
    completed: false,
  }
];

export const MOCK_EXAMS: Exam[] = [
  {
    id: 'e_01',
    title: 'Mathematics Practice Test',
    description: 'Test your math skills with this comprehensive practice exam covering algebra, geometry, and advanced mathematics concepts.',
    duration_minutes: 60,
    pass_score: 70,
    created_at: new Date().toISOString(),
    thumbnail_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop',
    difficulty: 'Intermediate',
    instructions: [
      "This exam consists of 30 multiple-choice questions",
      "You have 60 minutes to complete the exam",
      "Each question has only one correct answer",
      "You can navigate between questions using the sidebar",
      "Once submitted, you cannot change your answers"
    ],
    questions: [], // Populated via sections in logic usually, but here we can stick to empty main array if we use sections
    sections: [
      {
        title: "Algebra",
        description: "Linear equations, quadratic formulas, and algebraic expressions",
        questions: [
          { id: 'q_m_01', text: "If 2x + 5 = 15, what is the value of x?", type: 'multiple_choice', options: ["5", "10", "7.5", "20"], correct_option_index: 0, points: 5 },
          { id: 'q_m_02', text: "Factor completely: x² - 9", type: 'multiple_choice', options: ["(x - 3)(x + 3)", "(x - 3)(x - 3)", "(x + 3)(x + 3)", "x(x - 9)"], correct_option_index: 0, points: 5 }
        ]
      },
      {
        title: "Geometry",
        description: "Shapes, angles, areas, and volumes",
        questions: [
          { id: 'q_m_03', text: "What is the area of a circle with radius 5?", type: 'multiple_choice', options: ["10π", "25π", "50π", "100π"], correct_option_index: 1, points: 5 }
        ]
      }
    ]
  },
  {
    id: 'e_02',
    title: 'English Language Test',
    description: 'Assess your English grammar and comprehension skills.',
    duration_minutes: 45,
    pass_score: 80,
    created_at: new Date().toISOString(),
    difficulty: 'Beginner',
    thumbnail_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop',
    questions: [],
    sections: [
      {
        title: 'Grammar',
        description: 'Sentence structure and tenses',
        questions: [
          { id: 'q_e_01', text: "Choose the correct sentence:", type: 'multiple_choice', options: ["She don't like apples.", "She doesn't like apples.", "She isn't like apples."], correct_option_index: 1, points: 5 }
        ]
      }
    ]
  }
];

export const MOCK_LEARNING_PATHS: any[] = [
  {
    id: 'lp_01',
    title: 'Zero to Hero: Full Stack Martial Artist',
    description: 'A comprehensive path taking you from white belt fundamentals to black belt mastery.',
    thumbnail_url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop',
    courses: [MOCK_COURSES[0], MOCK_COURSES[1]],
    duration_minutes: 1800, // 30 hours
    level: 'Beginner',
    created_at: new Date().toISOString(),
  },
  {
    id: 'lp_02',
    title: 'Defensive Mastery',
    description: 'Focus purely on self-defense, blocking, and evasion techniques.',
    thumbnail_url: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop',
    courses: [MOCK_COURSES[0]],
    duration_minutes: 600,
    level: 'Intermediate',
    created_at: new Date().toISOString(),
  }
];

export const MOCK_PATH_ENROLLMENTS: LearningPathEnrollment[] = [
  {
    user_id: 'user_01',
    learning_path_id: 'lp_01',
    progress_percent: 15,
    completed_courses_count: 0,
    joined_at: new Date().toISOString()
  }
];

export const MOCK_EXAM_ENROLLMENTS: ExamEnrollment[] = [
  {
    user_id: 'user_01',
    exam_id: 'e_01',
    status: 'in_progress',
    last_attempt_at: new Date().toISOString()
  }
];
