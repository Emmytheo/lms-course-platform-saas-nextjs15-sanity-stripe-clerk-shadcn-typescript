import { Course, LearningPath, Exam } from "./interface";

export const MOCK_COURSES: Course[] = [
    {
        _id: "course-1",
        title: "BJJ Fundamentals: White Belt to Blue Belt",
        slug: { current: "bjj-fundamentals" },
        description: "Master the essential techniques required to earn your blue belt in Brazilian Jiu-Jitsu. Covers positions, escapes, and basic submissions.",
        price: 0,
        image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop",
        category: { title: "Grappling" },
        instructor: { name: "Prof. Marco Silva", photo: "https://randomuser.me/api/portraits/men/32.jpg" },
        modules: [
            {
                _id: "mod-1",
                title: "Module 1: Positions & Control",
                lessons: [
                    { _id: "les-1", title: "The Mount", type: "video", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
                    { _id: "les-2", title: "Side Control", type: "video", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
                    {
                        _id: "les-3",
                        title: "Guard Retention Quiz",
                        type: "quiz",
                        questions: [
                            {
                                id: "q1",
                                text: "What are the four points of contact in guard?",
                                type: "multiple_choice",
                                options: ["Hands and knees", "Hands and feet", "Elbows and knees", "Shoulders and hips"],
                                correct_option_index: 1,
                                points: 10
                            },
                            {
                                id: "q2",
                                text: "True or False: You should keep your back flat on the mat in guard.",
                                type: "true_false",
                                options: ["True", "False"],
                                correct_option_index: 1,
                                points: 10
                            }
                        ]
                    },
                    {
                        _id: "les-3b",
                        title: "Position Terminology Game",
                        type: "game",
                        content: "flashcards" // Game Type
                    }
                ]
            },
            {
                _id: "mod-2",
                title: "Module 2: Escapes",
                lessons: [
                    { _id: "les-4", title: "Escaping Mount", type: "video" },
                    { _id: "les-5", title: "Escaping Side Control", type: "video" }
                ]
            }
        ]
    },
    {
        _id: "course-2",
        title: "Muay Thai Striking Basics",
        slug: { current: "muay-thai-basics" },
        description: "Learn the art of eight limbs. Punching, kicking, knees, and elbows. Perfect for beginners looking to improve striking.",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?q=80&w=2000&auto=format&fit=crop",
        category: { title: "Striking" },
        instructor: { name: "Kru Somsak", photo: "https://randomuser.me/api/portraits/men/45.jpg" },
        modules: [
            {
                _id: "mod-3",
                title: "Stance & Footwork",
                lessons: [
                    { _id: "les-6", title: "Fighting Stance", type: "video" },
                    { _id: "les-7", title: "Movement Drills", type: "game" }
                ]
            }
        ]
    },
    {
        _id: "course-3",
        title: "Wrestling for MMA",
        slug: { current: "wrestling-mma" },
        description: "Dominate the takedown game. Learn detailed wrestling techniques adapted specifically for Mixed Martial Arts.",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1626227049581-c1e137688220?q=80&w=2070&auto=format&fit=crop",
        category: { title: "Wrestling" },
        instructor: { name: "Coach Dan", photo: "https://randomuser.me/api/portraits/men/11.jpg" },
        modules: []
    },
    {
        _id: "course-4",
        title: "Advanced Judo Throws",
        slug: { current: "advanced-judo" },
        description: "High amplitude throws for competition Judo. Requires basic breakfall knowledge.",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1564415315949-7a0c4c73aab8?q=80&w=1974&auto=format&fit=crop",
        category: { title: "Grappling" },
        instructor: { name: "Sensei Kenji", photo: "https://randomuser.me/api/portraits/men/22.jpg" },
        modules: []
    }
];

export const MOCK_EXAMS: Exam[] = [
    {
        _id: 'e_01',
        title: 'Mathematics Practice Test',
        description: 'Test your math skills with this comprehensive practice exam.',
        slug: { current: 'mathematics-practice-test' },
        duration_minutes: 60,
        pass_score: 70,
        created_at: new Date().toISOString(),
        thumbnail_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop',
        difficulty: 'Intermediate',
        questions: [],
        sections: [
            {
                id: "sec_1",
                title: "Algebra",
                description: "Linear equations, quadratic formulas",
                questions: [
                    { id: 'q_m_01', text: "If 2x + 5 = 15, what is the value of x?", type: 'multiple_choice', options: ["5", "10", "7.5", "20"], correct_option_index: 0, points: 5 },
                    { id: 'q_m_02', text: "Factor completely: x² - 9", type: 'multiple_choice', options: ["(x - 3)(x + 3)", "(x - 3)(x - 3)", "(x + 3)(x + 3)", "x(x - 9)"], correct_option_index: 0, points: 5 }
                ]
            }
        ]
    },
    {
        _id: 'e_02',
        title: 'English Language Test',
        description: 'Assess your English grammar and comprehension skills.',
        slug: { current: 'english-language-test' },
        duration_minutes: 45,
        pass_score: 80,
        created_at: new Date().toISOString(),
        difficulty: 'Beginner',
        thumbnail_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop',
        questions: [],
        sections: [
            {
                id: "sec_2",
                title: 'Grammar',
                description: 'Sentence structure and tenses',
                questions: [
                    { id: 'q_e_01', text: "Choose the correct sentence:", type: 'multiple_choice', options: ["She don't like apples.", "She doesn't like apples.", "She isn't like apples."], correct_option_index: 1, points: 5 }
                ]
            }
        ]
    }
];

export const MOCK_LEARNING_PATHS: LearningPath[] = [
    {
        _id: "path-1",
        title: "Zero to Hero: MMA Striking",
        slug: { current: "zero-to-hero-mma" },
        description: "A comprehensive roadmap to becoming a proficient striker for MMA. Includes boxing, muay thai, and footwork courses.",
        image: "https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?q=80&w=2070&auto=format&fit=crop",
        courses: [MOCK_COURSES[1]] // Muay Thai
    },
    {
        _id: "path-2",
        title: "Submission Grappling Mastery",
        slug: { current: "submission-grappling" },
        description: "The ultimate guide to ground fighting. Combines BJJ, Wrestling, and Catch Wrestling focuses.",
        image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?q=80&w=1952&auto=format&fit=crop",
        courses: [MOCK_COURSES[0], MOCK_COURSES[2]] // BJJ & Wrestling
    }
];
