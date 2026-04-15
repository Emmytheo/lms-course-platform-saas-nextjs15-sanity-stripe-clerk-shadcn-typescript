-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- 1. PROFILES & ROLES
create type user_role as enum ('student', 'instructor', 'admin');

create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role user_role default 'student',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'student');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. COURSES
create table public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  description text,
  price numeric default 0,
  image_url text,
  category text,
  tags text[] default '{}',
  instructor_id uuid references public.profiles(id),
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.courses enable row level security;
create policy "Courses are viewable by everyone." on public.courses for select using (true);
create policy "Admins and Instructors can insert courses." on public.courses for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor'))
);
create policy "Admins and Instructors can update courses." on public.courses for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor'))
);

-- 3. MODULES
create table public.modules (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.modules enable row level security;
create policy "Modules are viewable by everyone." on public.modules for select using (true);
create policy "Admins/Instructors can manage modules." on public.modules for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor'))
);

-- 4. LESSONS
create type lesson_type as enum ('video', 'text', 'quiz', 'game');

create table public.lessons (
  id uuid default gen_random_uuid() primary key,
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  type lesson_type not null default 'text',
  video_url text,
  content text, -- HTML or Markdown
  questions jsonb, -- For quizzes
  game_config jsonb, -- For games
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.lessons enable row level security;
create policy "Lessons are viewable by everyone." on public.lessons for select using (true);
create policy "Admins/Instructors can manage lessons." on public.lessons for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor'))
);

-- 5. EXAMS
create table public.exams (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  description text,
  duration_minutes integer default 60,
  pass_score integer default 70,
  thumbnail_url text,
  difficulty text check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  sections jsonb, -- Storing structural sections/questions as JSONB for flexibility
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.exams enable row level security;
create policy "Exams are viewable by everyone." on public.exams for select using (true);
create policy "Admins/Instructors can manage exams." on public.exams for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor'))
);

-- 6. LEARNING PATHS
create table public.learning_paths (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  description text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.learning_path_courses (
  id uuid default gen_random_uuid() primary key,
  learning_path_id uuid references public.learning_paths(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  exam_id uuid references public.exams(id) on delete cascade,
  sort_order integer default 0
  -- constraint: ensure either course or exam is set (optional, handled by app logic for now to avoid migration headaches)
);

alter table public.learning_paths enable row level security;
alter table public.learning_path_courses enable row level security;

create policy "Learning paths viewable by everyone" on public.learning_paths for select using (true);
create policy "LP courses viewable by everyone" on public.learning_path_courses for select using (true);
create policy "Admins manage LPs" on public.learning_paths for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor'))
);
create policy "Admins manage LP courses" on public.learning_path_courses for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'instructor'))
);

-- 7. ENROLLMENTS
-- Course Enrollments
create table public.enrollments (
  id uuid default gen_random_uuid() primary key, -- Added surrogate key for URL access
  user_id uuid references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  progress jsonb default '{}'::jsonb, -- Store lesson completion status
  price_paid numeric default 0,
  payment_meta jsonb,
  last_accessed_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, course_id) -- Ensure one active enrolment per course per user
);

alter table public.enrollments enable row level security;
create policy "Users can view own enrollments" on public.enrollments for select using (auth.uid() = user_id);
create policy "Users can enroll themselves" on public.enrollments for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on public.enrollments for update using (auth.uid() = user_id);

-- Exam Enrollments
create table public.exam_enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  exam_id uuid references public.exams(id) on delete cascade,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  score integer,
  status text default 'in_progress', -- in_progress, passed, failed
  progress jsonb default '{}'::jsonb, -- Store answers or section progress
  price_paid numeric default 0,
  payment_meta jsonb,
  last_accessed_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, exam_id)
);

alter table public.exam_enrollments enable row level security;
create policy "Users can view own exam enrollments" on public.exam_enrollments for select using (auth.uid() = user_id);
create policy "Users can enroll in exams" on public.exam_enrollments for insert with check (auth.uid() = user_id);
create policy "Users can update own exam progress" on public.exam_enrollments for update using (auth.uid() = user_id);

-- Learning Path Enrollments
create table public.learning_path_enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  learning_path_id uuid references public.learning_paths(id) on delete cascade,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  progress jsonb default '{}'::jsonb,
  price_paid numeric default 0,
  payment_meta jsonb,
  last_accessed_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, learning_path_id)
);

alter table public.learning_path_enrollments enable row level security;
create policy "Users can view own lp enrollments" on public.learning_path_enrollments for select using (auth.uid() = user_id);
create policy "Users can enroll in lps" on public.learning_path_enrollments for insert with check (auth.uid() = user_id);
create policy "Users can update own lp progress" on public.learning_path_enrollments for update using (auth.uid() = user_id);

-- UTILS
create or replace function get_user_role(user_id uuid)
returns text as $$
  select role::text from public.profiles where id = user_id;
$$ language sql security definer;
