-- SEED DATA FOR LMS

-- 1. Create Profiles (Admin & Instructor)
-- NOTE: In Supabase, auth.users must exist first. This script assumes you have created users 
-- with these specific IDs in your Auth. If not, these inserts will fail due to FK constraints.
-- REPLACE THESE UUIDs with actual User IDs from your Supabase Auth dashboard if running manually.

-- Example: insert into public.profiles (id, email, full_name, role) values ('UUID', 'admin@example.com', 'Admin User', 'admin');


-- 2. COURSES

-- Course 1: BJJ Fundamentals
INSERT INTO public.courses (id, title, slug, description, price, category, image_url, published)
VALUES 
(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- Fixed UUID for reference
    'BJJ Fundamentals: White Belt to Blue Belt',
    'bjj-fundamentals',
    'Master the essential techniques required to earn your blue belt in Brazilian Jiu-Jitsu. Covers positions, escapes, and basic submissions.',
    0,
    'Grappling',
    'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop',
    true
);

-- Modules for Course 1
INSERT INTO public.modules (id, course_id, title, sort_order)
VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Module 1: Positions & Control', 1),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Module 2: Escapes', 2);

-- Lessons for Module 1
INSERT INTO public.lessons (module_id, title, type, video_url, sort_order)
VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'The Mount', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'Side Control', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 2);

-- Quiz Lesson for Module 1
INSERT INTO public.lessons (module_id, title, type, questions, sort_order)
VALUES
(
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 
    'Guard Retention Quiz', 
    'quiz', 
    '[
        {"id": "q1", "text": "What are the four points of contact in guard?", "type": "multiple_choice", "options": ["Hands and knees", "Hands and feet", "Elbows and knees", "Shoulders and hips"], "correct_option_index": 1, "points": 10},
        {"id": "q2", "text": "True or False: Shoulders should be off the mat.", "type": "true_false", "options": ["True", "False"], "correct_option_index": 0, "points": 10}
    ]'::jsonb,
    3
);

-- Game Lesson for Module 1
INSERT INTO public.lessons (module_id, title, type, game_config, sort_order)
VALUES
(
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
    'Position Terminology Game',
    'game',
    '{"gameType": "flashcards"}'::jsonb,
    4
);


-- Course 2: Muay Thai
INSERT INTO public.courses (id, title, slug, description, price, category, image_url, published)
VALUES 
(
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44',
    'Muay Thai Striking Basics',
    'muay-thai-basics',
    'Learn the art of eight limbs. Punching, kicking, knees, and elbows.',
    49.99,
    'Striking',
    'https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?q=80&w=2000&auto=format&fit=crop',
    true
);

INSERT INTO public.modules (id, course_id, title, sort_order)
VALUES ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e55', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'Stance & Footwork', 1);

INSERT INTO public.lessons (module_id, title, type, video_url, sort_order)
VALUES ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e55', 'Fighting Stance', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1);


-- 3. EXAMS

INSERT INTO public.exams (id, title, slug, description, duration_minutes, pass_score, thumbnail_url, difficulty, sections)
VALUES
(
    'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f66',
    'Grappling Theory Final',
    'grappling-theory-final',
    'Comprehensive exam on BJJ and Wrestling theory.',
    60,
    70,
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop',
    'Intermediate',
    '[
        {
            "id": "sec_1",
            "title": "BJJ History",
            "description": "Orgins and evolution",
            "questions": [
                {"id": "q_ex_1", "text": "Who brought Jiu-Jitsu to Brazil?", "type": "multiple_choice", "options": ["Mitsuyo Maeda", "Jigoro Kano", "Helio Gracie"], "correct_option_index": 0, "points": 5}
            ]
        },
        {
            "id": "sec_2",
            "title": "Ruleset",
            "description": "IBJJF Rules",
            "questions": [
                {"id": "q_ex_2", "text": "How many points is a sweep?", "type": "multiple_choice", "options": ["2", "3", "4"], "correct_option_index": 0, "points": 5}
            ]
        }
    ]'::jsonb
);


-- 4. LEARNING PATHS

INSERT INTO public.learning_paths (id, title, slug, description, image_url)
VALUES
(
    'g0eebc99-9c0b-4ef8-bb6d-6bb9bd380g77',
    'Zero to Hero: MMA Striking',
    'zero-to-hero-mma',
    'A comprehensive roadmap to becoming a proficient striker for MMA.',
    'https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?q=80&w=2070&auto=format&fit=crop'
);

INSERT INTO public.learning_path_courses (learning_path_id, course_id, sort_order)
VALUES
('g0eebc99-9c0b-4ef8-bb6d-6bb9bd380g77', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 1); -- Muay Thai course in LP
