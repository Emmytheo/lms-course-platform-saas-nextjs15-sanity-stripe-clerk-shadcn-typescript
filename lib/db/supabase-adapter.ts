import { LMSDataProvider, Course, LearningPath, Exam, Module, Lesson, UserProfile, BlogPost, PaymentRequest } from './interface';
import { createClient } from '@/lib/server';

export class SupabaseAdapter implements LMSDataProvider {

    // --- Helper to get client ---
    private async getClient() {
        return await createClient(); // Uses server-side client
    }

    // --- COURSES ---

    async getAllCourses(): Promise<Course[]> {
        const supabase = await this.getClient();
        // Fetch courses with modules and lessons deeply nested
        const { data, error } = await supabase
            .from('courses')
            .select(`
                *,
                modules:modules (
                    *,
                    lessons:lessons (*)
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);

        return (data || []).map(item => this.mapCourseFromDB(item));
    }

    async getCourse(slug: string): Promise<Course | null> {
        const supabase = await this.getClient();
        const { data, error } = await supabase
            .from('courses')
            .select(`
                *,
                modules:modules (
                    *,
                    lessons:lessons (*)
                ),
                instructor:instructor_id (
                    full_name,
                    avatar_url
                )
            `)
            .eq('slug', slug)
            .single();

        if (error || !data) return null;
        return this.mapCourseFromDB(data);
    }

    async getCourseById(id: string): Promise<Course | null> {
        const supabase = await this.getClient();
        const { data, error } = await supabase
            .from('courses')
            .select(`
                *,
                modules:modules (
                    *,
                    lessons:lessons (*)
                ),
                instructor:instructor_id (
                    full_name,
                    avatar_url
                )
            `)
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return this.mapCourseFromDB(data);
    }

    async createCourse(course: Partial<Course>): Promise<Course> {
        const supabase = await this.getClient();
        const { data, error } = await supabase
            .from('courses')
            .insert({
                title: course.title,
                slug: course.slug?.current,
                description: course.description,
                price: course.price,
                image_url: course.image,
                category: course.category?.title,
                level: course.level,
                language: course.language,
                prerequisites: course.prerequisites ? JSON.stringify(course.prerequisites) : null,
                objectives: course.objectives ? JSON.stringify(course.objectives) : null,
                includes: course.includes ? JSON.stringify(course.includes) : null,
                tags: course.tags,
                instructor_id: (course.instructor as any)?._id || (course.instructor as any)?.id // Handle both potential ID fields from partial object
            })
            .select()
            .single();

        if (error) throw new Error(error.message);
        return this.mapCourseFromDB(data);
    }

    async updateCourse(id: string, course: Partial<Course>): Promise<Course> {
        const supabase = await this.getClient();

        // 1. Update Course Details
        console.log("Updating course details for:", id);
        const { error: courseError } = await supabase
            .from('courses')
            .update({
                title: course.title,
                description: course.description,
                price: course.price,
                image_url: course.image,
                category: course.category?.title,
                slug: course.slug?.current,
                level: course.level,
                language: course.language,
                prerequisites: course.prerequisites ? JSON.stringify(course.prerequisites) : null,
                objectives: course.objectives ? JSON.stringify(course.objectives) : null,
                includes: course.includes ? JSON.stringify(course.includes) : null,
                tags: course.tags
            })
            .eq('id', id);

        if (courseError) throw new Error(courseError.message);

        // 2. Handle Modules/Lessons (Simplistic replacement strategy for this demo)
        // In a real app, you'd want smart diffing. Here we might assume the UI handles atomic updates
        // or we expect separate calls for modules. 
        // BUT, EditCourseForm sends the whole tree.

        // 2. Smart Sync for Modules and Lessons
        if (course.modules) {
            // Get existing modules
            const { data: existingModules } = await supabase
                .from('modules')
                .select('id, lessons(id)')
                .eq('course_id', id);

            const existingModuleIds = existingModules?.map(m => m.id) || [];
            const incomingModuleIds = course.modules.map(m => m._id).filter(Boolean); // Assuming _id is present for existing

            // A. Update or Insert Modules
            console.log("Syncing modules. Count:", course.modules.length);
            for (const mod of course.modules) {
                console.log("Processing module:", mod.title, "ID:", mod._id);
                let moduleId = mod._id;

                if (moduleId && existingModuleIds.includes(moduleId)) {
                    // Update Module
                    const { error: modErr } = await supabase.from('modules').update({ title: mod.title }).eq('id', moduleId);
                    if (modErr) throw new Error(`Module update failed: ${modErr.message}`);
                } else {
                    // Insert Module
                    const { data: newMod, error: modErr } = await supabase.from('modules').insert({
                        course_id: id,
                        title: mod.title
                    }).select().single();
                    if (modErr) throw new Error(`Module insert failed: ${modErr.message}`);
                    moduleId = newMod.id;
                }

                if (moduleId && mod.lessons) {
                    // Sync Lessons for this module
                    // We need to fetch existing lessons for this module if we didn't just create it
                    let existingLessonIds: any[] = [];
                    if (existingModuleIds.includes(moduleId)) {
                        const modData = existingModules?.find(m => m.id === moduleId);
                        existingLessonIds = modData?.lessons?.map((l: any) => l.id) || [];
                    }

                    const incomingLessonIds = mod.lessons.map(l => l._id).filter(Boolean);

                    for (const lesson of mod.lessons) {
                        const lessonData = {
                            module_id: moduleId,
                            title: lesson.title,
                            type: lesson.type,
                            video_url: lesson.videoUrl, // Note: adapter logic uses videoUrl -> video_url
                            content: lesson.content,
                            questions: lesson.questions ? JSON.stringify(lesson.questions) : null
                        };

                        if (lesson._id && existingLessonIds.includes(lesson._id)) {
                            // Update Lesson
                            const { error: lErr } = await supabase.from('lessons').update(lessonData).eq('id', lesson._id);
                            if (lErr) throw new Error(`Lesson update failed: ${lErr.message}`);
                        } else {
                            // Insert Lesson
                            const { error: lErr } = await supabase.from('lessons').insert(lessonData);
                            if (lErr) throw new Error(`Lesson insert failed: ${lErr.message}`);
                        }
                    }

                    // Delete removed lessons
                    const lessonsToDelete = existingLessonIds.filter(lid => !incomingLessonIds.includes(lid));
                    if (lessonsToDelete.length > 0) {
                        await supabase.from('lessons').delete().in('id', lessonsToDelete);
                    }
                }
            }

            // B. Delete removed modules
            const modulesToDelete = existingModuleIds.filter(mid => !incomingModuleIds.includes(mid));
            if (modulesToDelete.length > 0) {
                // Deleting module should cascade delete lessons, but explicit is safer if needed.
                // Assuming Cascade on DB
                await supabase.from('modules').delete().in('id', modulesToDelete);
            }
        }

        // Return updated
        return (await this.getCourse(course.slug?.current || ''))!; // Re-fetch
    }

    async deleteCourse(id: string): Promise<void> {
        const supabase = await this.getClient();
        const { error } = await supabase.from('courses').delete().eq('id', id);
        if (error) throw new Error(error.message);
    }

    // --- EXAMS ---

    async getAllExams(): Promise<Exam[]> {
        const supabase = await this.getClient();
        const { data, error } = await supabase.from('exams').select('*');
        if (error) throw new Error(error.message);
        return data.map(item => this.mapExamFromDB(item));
    }

    async getExam(slug: string): Promise<Exam | null> {
        const supabase = await this.getClient();
        const { data, error } = await supabase.from('exams').select('*').eq('slug', slug).single();
        if (!data) return null;
        return this.mapExamFromDB(data);
    }

    async getExamById(id: string): Promise<Exam | null> {
        const supabase = await this.getClient();
        const { data, error } = await supabase.from('exams').select('*').eq('id', id).single();
        if (!data) return null;
        return this.mapExamFromDB(data);
    }

    async createExam(exam: Partial<Exam>): Promise<Exam> {
        const supabase = await this.getClient();
        const { data, error } = await supabase
            .from('exams')
            .insert({
                title: exam.title,
                slug: exam.slug?.current,
                description: exam.description,
                duration_minutes: exam.duration_minutes,
                pass_score: exam.pass_score,
                sections: exam.sections ? JSON.stringify(exam.sections) : null,
                instructions: exam.instructions ? JSON.stringify(exam.instructions) : null,
                prerequisites: exam.prerequisites ? JSON.stringify(exam.prerequisites) : null,
                objectives: exam.objectives ? JSON.stringify(exam.objectives) : null,
                tags: exam.tags,
                difficulty: exam.difficulty
            })
            .select()
            .single();
        if (error) throw new Error(error.message);
        return this.mapExamFromDB(data);
    }

    async updateExam(id: string, exam: Partial<Exam>): Promise<Exam> {
        const supabase = await this.getClient();
        const { data, error } = await supabase
            .from('exams')
            .update({
                title: exam.title,
                description: exam.description,
                duration_minutes: exam.duration_minutes,
                pass_score: exam.pass_score,
                sections: exam.sections ? JSON.stringify(exam.sections) : null,
                instructions: exam.instructions ? JSON.stringify(exam.instructions) : null,
                prerequisites: exam.prerequisites ? JSON.stringify(exam.prerequisites) : null,
                objectives: exam.objectives ? JSON.stringify(exam.objectives) : null,
                tags: exam.tags,
                difficulty: exam.difficulty
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return this.mapExamFromDB(data);
    }

    async deleteExam(id: string): Promise<void> {
        const supabase = await this.getClient();
        const { error } = await supabase.from('exams').delete().eq('id', id);
        if (error) throw new Error(error.message);
    }

    // --- LEARNING PATHS ---

    async getAllLearningPaths(): Promise<LearningPath[]> {
        const supabase = await this.getClient();
        const { data, error } = await supabase.from('learning_paths').select(`
            *,
            courses:learning_path_courses(
                course:courses(*),
                exam:exams(*)
            )
        `);
        if (error) return [];
        return data.map(item => this.mapPathFromDB(item));
    }

    async getLearningPath(slug: string): Promise<LearningPath | null> {
        const supabase = await this.getClient();
        const { data, error } = await supabase.from('learning_paths').select(`
            *,
            courses:learning_path_courses(
                sort_order,
                course:courses(*),
                exam:exams(*)
            )
        `).eq('slug', slug).single();
        if (!data) return null;
        return this.mapPathFromDB(data);
    }

    async getLearningPathById(id: string): Promise<LearningPath | null> {
        const supabase = await this.getClient();
        const { data, error } = await supabase.from('learning_paths').select(`
            *,
            courses:learning_path_courses(
                sort_order,
                course:courses(*),
                exam:exams(*)
            )
        `).eq('id', id).single();

        if (error) {
            console.error("SupabaseAdapter.getLearningPathById error:", error);
            return null;
        }
        if (!data) return null;
        return this.mapPathFromDB(data);
    }

    async createLearningPath(path: Partial<LearningPath>): Promise<LearningPath> {
        const supabase = await this.getClient();
        const { data, error } = await supabase.from('learning_paths').insert({
            title: path.title,
            slug: path.slug?.current,
            description: path.description,
            image_url: path.image,
            level: path.level,
            language: path.language,
            objectives: path.objectives ? JSON.stringify(path.objectives) : null,
            prerequisites: path.prerequisites ? JSON.stringify(path.prerequisites) : null
        }).select().single();
        if (error) throw new Error(error.message);
        return this.mapPathFromDB(data);
    }

    async updateLearningPath(id: string, path: Partial<LearningPath>): Promise<LearningPath> {
        const supabase = await this.getClient();
        const { data, error } = await supabase.from('learning_paths').update({
            title: path.title,
            description: path.description,
            image_url: path.image,
            level: path.level,
            language: path.language,
            objectives: path.objectives ? JSON.stringify(path.objectives) : null,
            prerequisites: path.prerequisites ? JSON.stringify(path.prerequisites) : null
        }).eq('id', id).select().single();
        if (error) throw new Error(error.message);

        // Update LP Courses Relationship
        if (path.courses) {
            // Delete existing
            await supabase.from('learning_path_courses').delete().eq('learning_path_id', id);

            if (path.courses.length > 0) {
                // Insert new
                const links = path.courses.map((item, index) => {
                    const isExam = (item as any).pass_score !== undefined || (item as any).duration_minutes !== undefined;
                    const link = {
                        learning_path_id: id,
                        course_id: isExam ? null : item._id,
                        exam_id: isExam ? item._id : null,
                        sort_order: index
                    };
                    return link;
                });
                await supabase.from('learning_path_courses').insert(links);
            }
        }

        // Re-fetch to get full object
        return (await this.getLearningPath((path.slug?.current || data.slug)))!;
    }

    async deleteLearningPath(id: string): Promise<void> {
        const supabase = await this.getClient();
        const { error } = await supabase.from('learning_paths').delete().eq('id', id);
        if (error) throw new Error(error.message);
    }

    // --- ENROLLMENTS & STUDENTS ---

    async enrollStudent(courseId: string, studentId: string): Promise<void> {
        await this.createEnrollment(studentId, courseId);
    }

    async createEnrollment(userId: string, courseId: string): Promise<any> {
        const supabase = await this.getClient();
        const { data, error } = await supabase.from('enrollments').insert({
            user_id: userId,
            course_id: courseId,
            status: 'active'
        }).select().single();
        if (error) throw new Error(error.message);
        return data;
    }

    async createExamEnrollment(userId: string, examId: string): Promise<any> {
        const supabase = await this.getClient();
        const { data, error } = await supabase.from('exam_enrollments').insert({
            user_id: userId,
            exam_id: examId,
            status: 'active'
        }).select().single();
        if (error) throw new Error(error.message);
        return data;
    }

    async createLearningPathEnrollment(userId: string, pathId: string): Promise<any> {
        const supabase = await this.getClient();
        const { data, error } = await supabase.from('learning_path_enrollments').insert({
            user_id: userId,
            learning_path_id: pathId,
            status: 'active'
        }).select().single();
        if (error) throw new Error(error.message);
        return data;
    }

    async updateExamEnrollment(enrollmentId: string, data: any): Promise<any> {
        const supabase = await this.getClient();
        console.log("Updating Exam Enrollment:", enrollmentId, data);
        const { data: updated, error } = await supabase.from('exam_enrollments')
            .update({
                score: data.score,
                status: data.status,
                progress: JSON.stringify(data.answers), // Force JSON string for compatibility
                completed_at: data.status === 'completed' ? new Date().toISOString() : null,
                last_accessed_at: new Date().toISOString()
            })
            .eq('id', enrollmentId)
            .select()
            .single();

        if (error) throw new Error(error.message);

        // Trigger Learning Path Update if this exam is part of one
        if (updated) {
            const { data: lpLinks } = await supabase
                .from('learning_path_courses')
                .select('learning_path_id')
                .eq('exam_id', updated.exam_id); // Use exam_id from updated record

            if (lpLinks && lpLinks.length > 0) {
                const pathIds = [...new Set(lpLinks.map(l => l.learning_path_id))];
                for (const pathId of pathIds) {
                    await this.calculateAndUpdateLearningPathProgress(updated.user_id, pathId);
                }
            }
        }

        return updated;
    }

    async getStudentEnrollments(studentId: string): Promise<Course[]> {
        const supabase = await this.getClient();
        const { data, error } = await supabase.from('enrollments')
            .select('course:courses(*)')
            .eq('user_id', studentId);

        if (error) throw new Error(error.message);
        return (data || []).map((e: any) => this.mapCourseFromDB(e.course));
    }

    async getStudentEnrollmentsWithDetails(studentId: string): Promise<any[]> {
        const supabase = await this.getClient();
        const { data, error } = await supabase.from('enrollments')
            .select('*, course:courses(*, modules(*))')
            .eq('user_id', studentId);
        if (error) throw new Error(error.message);
        return data.map((e: any) => ({
            ...e,
            course: e.course ? this.mapCourseFromDB(e.course) : null
        }));
    }

    async getStudentExamEnrollmentsWithDetails(studentId: string): Promise<any[]> {
        const supabase = await this.getClient();
        const { data, error } = await supabase.from('exam_enrollments')
            .select('*, exam:exams(*)')
            .eq('user_id', studentId);
        if (error) throw new Error(error.message);
        return data.map((e: any) => ({
            ...e,
            exam: e.exam ? this.mapExamFromDB(e.exam) : null
        }));
    }

    async getStudentLearningPathEnrollmentsWithDetails(studentId: string): Promise<any[]> {
        const supabase = await this.getClient();
        const { data, error } = await supabase.from('learning_path_enrollments')
            .select(`
                *,
                learning_path:learning_paths(
                    *,
                    courses:learning_path_courses(
                        course:courses(*),
                        exam:exams(*)
                    )
                )
            `)
            .eq('user_id', studentId);
        if (error) throw new Error(error.message);
        return data.map((e: any) => ({
            ...e,
            learning_path: e.learning_path ? this.mapPathFromDB(e.learning_path) : null
        }));
    }

    // --- ENROLLMENT RETRIEVAL ---

    async getEnrollment(enrollmentId: string): Promise<any> {
        const supabase = await this.getClient();
        // 1. Get basic enrollment info
        const { data: enrollment, error } = await supabase.from('enrollments')
            .select('*')
            .eq('id', enrollmentId)
            .single();

        if (error || !enrollment) return null;

        // 2. Fetch full course details using the proven query
        const course = await this.getCourseById(enrollment.course_id);

        // Merge
        return {
            ...enrollment,
            course
        };
    }

    async getExamEnrollment(enrollmentId: string): Promise<any> {
        const supabase = await this.getClient();
        console.log("Fetching Exam Enrollment:", enrollmentId);

        const { data: enrollment, error } = await supabase.from('exam_enrollments')
            .select('*')
            .eq('id', enrollmentId)
            .single();

        if (error) {
            console.error("Exam Enrollment Fetch Error:", error);
            return null;
        }
        if (!enrollment) {
            console.error("Exam Enrollment Not Found");
            return null;
        }

        console.log("Found Enrollment, fetching exam:", enrollment.exam_id);

        // Fetch full exam details
        // Fixed: Removed join on 'exam_sections' as sections are stored in JSON column
        const { data: examData, error: examError } = await supabase.from('exams')
            .select('*')
            .eq('id', enrollment.exam_id)
            .single();

        if (examError) {
            console.error("Exam Data Fetch Error:", examError);
            // Fallback: Try fetching without complex joins if relations are broken
            const { data: simpleExam } = await supabase.from('exams').select('*').eq('id', enrollment.exam_id).single();
            if (simpleExam) {
                console.log("Recovered with simple exam fetch");
                return { ...enrollment, exam: this.mapExamFromDB(simpleExam) };
            }
        }

        let exam = null;
        if (examData) {
            exam = this.mapExamFromDB(examData);
        } else {
            console.error("Exam Data is Null");
        }

        return {
            ...enrollment,
            answers: typeof enrollment.progress === 'string' ? JSON.parse(enrollment.progress) : enrollment.progress,
            exam
        };
    }

    async getLPEnrollment(enrollmentId: string): Promise<any> {
        const supabase = await this.getClient();
        const { data: enrollment, error } = await supabase.from('learning_path_enrollments')
            .select('*')
            .eq('id', enrollmentId)
            .single();

        if (error || !enrollment) return null;

        // Fetch full path details
        const { data: pathData } = await supabase.from('learning_paths')
            .select(`
                *,
                courses:learning_path_courses(
                    sort_order,
                    course:courses(*),
                    exam:exams(*)
                )
            `)
            .eq('id', enrollment.learning_path_id)
            .single();

        let learning_path = null;
        if (pathData) {
            learning_path = this.mapPathFromDB(pathData);
        }

        return {
            ...enrollment,
            learning_path
        };
    }

    // --- PROFILES ---

    async getProfile(userId: string): Promise<UserProfile | null> {
        const supabase = await this.getClient();
        const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
        if (error || !data) return null;
        return {
            id: data.id,
            email: data.email,
            fullName: data.full_name,
            avatarUrl: data.avatar_url,
            role: data.role
        };
    }

    async getProfileByEmail(email: string): Promise<UserProfile | null> {
        const supabase = await this.getClient();
        const { data, error } = await supabase.from('profiles').select('*').eq('email', email).single();
        if (error || !data) return null;
        return {
            id: data.id,
            email: data.email,
            fullName: data.full_name,
            avatarUrl: data.avatar_url,
            role: data.role
        };
    }

    async getStudentCount(): Promise<number> {
        const supabase = await this.getClient();
        const { count, error } = await supabase.from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'student');

        if (error) return 0;
        return count || 0;
    }

    async getStudents(): Promise<UserProfile[]> {
        const supabase = await this.getClient();
        const { data, error } = await supabase.from('profiles').select('*').eq('role', 'student');

        if (error) return [];

        return data.map(p => ({
            id: p.id,
            email: p.email,
            fullName: p.full_name,
            avatarUrl: p.avatar_url,
            role: p.role
        }));
    }

    async getInstructors(): Promise<UserProfile[]> {
        const supabase = await this.getClient();
        const { data, error } = await supabase.from('profiles').select('*').eq('role', 'instructor');

        if (error) return [];

        return data.map(p => ({
            id: p.id,
            email: p.email,
            fullName: p.full_name,
            avatarUrl: p.avatar_url,
            role: p.role
        }));
    }

    async updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
        const supabase = await this.getClient();
        const { data: updated, error } = await supabase.from('profiles').update({
            full_name: data.fullName,
            avatar_url: data.avatarUrl,
            role: data.role
        }).eq('id', userId).select().single();

        if (error) throw new Error(error.message);
        return {
            id: updated.id,
            email: updated.email,
            fullName: updated.full_name,
            avatarUrl: updated.avatar_url,
            role: updated.role
        };
    }

    // --- PROGRESS ---

    async updateLessonProgress(userId: string, courseId: string, lessonId: string, completed: boolean): Promise<void> {
        const supabase = await this.getClient();
        // Upsert progress
        const { error } = await supabase.from('lesson_progress').upsert({
            user_id: userId,
            lesson_id: lessonId,
            course_id: courseId,
            completed: completed,
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id, lesson_id' });
        if (error) throw new Error(error.message);
    }

    async calculateAndUpdateEnrollmentProgress(userId: string, courseId: string): Promise<void> {
        const supabase = await this.getClient();
        console.log(`Calculating progress for user ${userId} in course ${courseId}`);

        // 1. Get total lessons count (count from modules -> lessons)
        // Since we don't have a direct recursive count query easily, we fetch the course structure lightly
        // Or better, query the 'lessons' table joined with modules where course_id matches
        // Joining tables: lessons -> modules -> course_id

        // Fetch all lessons for this course
        const { data: lessons, error: lessonError } = await supabase
            .from('lessons')
            .select('id, module_id, modules!inner(course_id)')
            .eq('modules.course_id', courseId as any);

        if (lessonError) {
            console.error("Error fetching lessons for progress calc:", lessonError);
            return;
        }

        const totalLessons = lessons?.length || 0;
        const lessonIds = lessons?.map(l => l.id) || [];

        if (totalLessons === 0) return;

        // --- MIGRATION: Check for legacy progress in enrollments table ---
        // Always try to migrate/merge legacy progress to ensure we don't lose it.
        // The upsert with unique constraint handles duplicates gracefully.
        const { data: enrollmentForMigration } = await supabase
            .from('enrollments')
            .select('progress')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .single();

        if (enrollmentForMigration?.progress && Object.keys(enrollmentForMigration.progress).length > 0) {
            // console.log("Checking for legacy progress to migrate...");
            const legacyProgress = enrollmentForMigration.progress as Record<string, { completed: boolean }>;
            const newProgressRecords = [];

            for (const [lId, status] of Object.entries(legacyProgress)) {
                if (status.completed && lessonIds.includes(lId)) {
                    newProgressRecords.push({
                        user_id: userId,
                        course_id: courseId,
                        lesson_id: lId,
                        completed: true,
                        updated_at: new Date().toISOString()
                    });
                }
            }

            if (newProgressRecords.length > 0) {
                // Upsert all found legacy records. 
                // Existing records (like the one just created) will just be updated (safe).
                await supabase.from('lesson_progress').upsert(newProgressRecords, { onConflict: 'user_id, lesson_id' });
            }
        }
        // -----------------------------------------------------------------
        // -----------------------------------------------------------------

        // 2. Get completed lessons count for this user in this course (Re-query after potential migration)
        // We use IN lessonIds instead of eq course_id to rely on the lesson definitions, 
        // which is safer if lesson_progress.course_id is missing or inconsistent.
        const { count: completedCount, error: progressError } = await supabase
            .from('lesson_progress')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .in('lesson_id', lessonIds)
            .eq('completed', true);

        if (progressError) {
            console.error("Error fetching progress for calc:", progressError);
            return;
        }

        const completed = completedCount || 0;
        const progressPercent = Math.round((completed / totalLessons) * 100);
        const isCompleted = progressPercent >= 100;

        console.log(`Progress: ${completed}/${totalLessons} = ${progressPercent}%`);

        // 3. Update Enrollment
        // Find the enrollment first
        const { data: enrollment } = await supabase
            .from('enrollments')
            .select('id, progress')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .single();

        if (enrollment) {
            // Retrieve existing progress map to update it? 
            // Actually, currently 'lesson_progress' table is the source of truth for individual checkmarks.
            // 'enrollments.progress' column might be a JSON summary or just deprecated in favor of 'lesson_progress'.
            // But 'progress_percent' column is definitely needed for dashboard.

            // Let's check schema via what we see in code. The code in 'actions/progress.ts' uses 'enrollments.progress' as a JSONB map.
            // But we want to standarize on 'progress_percent' column if it exists, or update the 'progress' JSON (as summary).
            // Based on 'getEnrollmentProgressAction' in 'actions/progress.ts', 'enrollments.progress' IS the source for checkmarks on older logic?
            // "markLessonCompleteAction" updates 'lesson_progress' table.

            // Wait, 'getEnrollmentProgressAction' reads from 'enrollments.progress' JSON!
            // BUT 'markLessonCompleteAction' updates 'lesson_progress' TABLE!
            // THIS IS THE BUG! 'markLessonCompleteAction' updates one place, 'getEnrollmentProgressAction' reads another!

            // Fix: We should update 'enrollments.progress' JSON to ensure backward compatibility OR update 'getEnrollmentProgressAction' to read from 'lesson_progress'.
            // Given I am "Fixing Progress Tracking", updating the central enrollment record is safer for performance (read one record vs join).

            // Let's rebuild the JSON map from the 'lesson_progress' table.
            const { data: allProgress } = await supabase
                .from('lesson_progress')
                .select('lesson_id, completed')
                .eq('user_id', userId)
                .in('lesson_id', lessonIds);

            const progressMap: Record<string, { completed: boolean }> = {};
            allProgress?.forEach(p => {
                if (p.completed) progressMap[p.lesson_id] = { completed: true };
            });

            await supabase
                .from('enrollments')
                .update({
                    progress_percent: progressPercent,
                    completed: isCompleted,
                    progress: progressMap,
                    last_accessed_at: new Date().toISOString()
                })
                .eq('id', enrollment.id);
        }

        // 4. Trigger Learning Path Progress Update
        // Find which paths contain this course
        const { data: lpLinks } = await supabase
            .from('learning_path_courses')
            .select('learning_path_id')
            .eq('course_id', courseId);

        if (lpLinks && lpLinks.length > 0) {
            const pathIds = [...new Set(lpLinks.map(l => l.learning_path_id))];
            for (const pathId of pathIds) {
                await this.calculateAndUpdateLearningPathProgress(userId, pathId);
            }
        }
    }

    async calculateAndUpdateLearningPathProgress(userId: string, pathId: string): Promise<void> {
        const supabase = await this.getClient();

        // 1. Get all items in the path
        const { data: pathItems, error: itemsError } = await supabase
            .from('learning_path_courses')
            .select('course_id, exam_id')
            .eq('learning_path_id', pathId);

        if (itemsError || !pathItems || pathItems.length === 0) {
            console.log(`[LP Sync] No items found for path ${pathId}`);
            return;
        }

        console.log(`[LP Sync] Found ${pathItems.length} items for path ${pathId}`);

        const totalItems = pathItems.length;
        let completedItems = 0;

        // 2. Check status of each item
        for (const item of pathItems) {
            if (item.course_id) {
                const { data: courseEnrollment } = await supabase
                    .from('enrollments')
                    .select('completed, progress_percent')
                    .eq('user_id', userId)
                    .eq('course_id', item.course_id)
                    .single();

                if (courseEnrollment && (courseEnrollment.completed || courseEnrollment.progress_percent >= 100)) {
                    completedItems++;
                }
            } else if (item.exam_id) {
                const { data: examEnrollment } = await supabase
                    .from('exam_enrollments')
                    .select('status, score, exam:exams(pass_score)')
                    .eq('user_id', userId)
                    .eq('exam_id', item.exam_id)
                    .single();

                if (examEnrollment && examEnrollment.status === 'passed') {
                    completedItems++;
                } else if (examEnrollment && examEnrollment.status === 'completed' && examEnrollment.exam) {
                    // Double check pass score if status is just completed
                    if (examEnrollment.score >= (examEnrollment.exam as any).pass_score) {
                        completedItems++;
                    }
                }
            }
        }

        // 3. Calculate and Update
        const progressPercent = Math.round((completedItems / totalItems) * 100);

        console.log(`[LP Sync] Calculated progress: ${completedItems}/${totalItems} = ${progressPercent}% for user ${userId} path ${pathId}`);

        const { data: updatedRows, error: updateError } = await supabase
            .from('learning_path_enrollments')
            .update({
                progress_percent: progressPercent,
                completed_at: progressPercent === 100 ? new Date().toISOString() : null,
                last_accessed_at: new Date().toISOString()
            })
            .eq('user_id', userId)
            .eq('learning_path_id', pathId)
            .select('id');

        if (updateError) {
            console.error("[LP Sync] Update failed:", updateError);
        } else {
            console.log(`[LP Sync] Update success. Rows affected: ${updatedRows?.length}`);
        }
    }

    // --- MAPPERS ---

    private mapCourseFromDB(data: any): Course {
        return {
            _id: data.id,
            title: data.title,
            slug: { current: data.slug },
            description: data.description,
            price: data.price,
            image: data.image_url,
            category: { title: data.category },
            level: data.level,
            language: data.language,
            prerequisites: typeof data.prerequisites === 'string' ? JSON.parse(data.prerequisites) : data.prerequisites,
            objectives: typeof data.objectives === 'string' ? JSON.parse(data.objectives) : data.objectives,
            includes: typeof data.includes === 'string' ? JSON.parse(data.includes) : data.includes,
            tags: data.tags,
            instructor: data.instructor ? { name: data.instructor.full_name, photo: data.instructor.avatar_url } : { name: 'Unknown' },
            modules: data.modules?.map((m: any) => ({
                _id: m.id,
                title: m.title,
                lessons: m.lessons?.map((l: any) => ({
                    _id: l.id,
                    title: l.title,
                    type: l.type,
                    videoUrl: l.video_url,
                    content: l.content,
                    questions: typeof l.questions === 'string' ? JSON.parse(l.questions) : l.questions
                }))
            })),
            last_updated: data.updated_at,
        };
    }

    private mapExamFromDB(data: any): Exam {
        let sections = data.sections;
        if (typeof sections === 'string') {
            try {
                sections = JSON.parse(sections);
            } catch (e) {
                sections = [];
            }
        }

        // Fallback for questions if stored directly or if empty
        let questions = data.questions;
        if (!questions || questions.length === 0) {
            // If sections exist, flatten them to get questions count capability
            questions = sections?.reduce((acc: any[], sec: any) => [...acc, ...sec.questions], []) || [];
        }

        return {
            _id: data.id,
            title: data.title,
            description: data.description,
            slug: { current: data.slug },
            duration_minutes: data.duration_minutes,
            pass_score: data.pass_score,
            thumbnail_url: data.thumbnail_url,
            difficulty: data.difficulty,
            tags: data.tags,
            prerequisites: typeof data.prerequisites === 'string' ? JSON.parse(data.prerequisites) : data.prerequisites,
            objectives: typeof data.objectives === 'string' ? JSON.parse(data.objectives) : data.objectives,
            sections: sections,
            questions: questions,
            instructions: typeof data.instructions === 'string' ? JSON.parse(data.instructions) : data.instructions
        };
    }

    private mapPathFromDB(data: any): LearningPath {
        // Map joined learning_path_courses to flat list of (Course | Exam)
        const courses = data.courses?.sort((a: any, b: any) => a.sort_order - b.sort_order).map((link: any) => {
            if (link.course) {
                return this.mapCourseFromDB(link.course);
            } else if (link.exam) {
                return this.mapExamFromDB(link.exam);
            }
            return null;
        }).filter(Boolean) || [];

        return {
            _id: data.id,
            title: data.title,
            slug: { current: data.slug },
            description: data.description,
            image: data.image_url,
            level: data.level,
            language: data.language,
            objectives: typeof data.objectives === 'string' ? JSON.parse(data.objectives) : data.objectives,
            prerequisites: typeof data.prerequisites === 'string' ? JSON.parse(data.prerequisites) : data.prerequisites,
            courses: courses
        };
    }

    // --- BLOG ---

    async getAllPosts(): Promise<BlogPost[]> {
        const supabase = await this.getClient();
        const { data, error } = await supabase
            .from('posts')
            .select('*, tags:post_tags(tag)')
            .order('published_at', { ascending: false });

        if (error) throw new Error(error.message);
        return (data || []).map(p => ({
            ...p,
            tags: p.tags?.map((t: any) => t.tag) || []
        }));
    }

    async getPost(slug: string): Promise<BlogPost | null> {
        const supabase = await this.getClient();
        const { data, error } = await supabase
            .from('posts')
            .select('*, tags:post_tags(tag)')
            .eq('slug', slug)
            .single();

        if (error || !data) return null;
        return {
            ...data,
            tags: data.tags?.map((t: any) => t.tag) || []
        };
    }

    async createPost(post: Partial<BlogPost>): Promise<BlogPost> {
        const supabase = await this.getClient();
        const { data, error } = await supabase
            .from('posts')
            .insert({
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                content: post.content,
                author_id: post.author_id,
                cover_image: post.cover_image,
                published: post.published,
                published_at: post.published ? new Date().toISOString() : null
            })
            .select()
            .single();

        if (error) throw new Error(error.message);

        if (post.tags && post.tags.length > 0) {
            const tagInserts = post.tags.map((tag: string) => ({
                post_id: data.id,
                tag
            }));
            await supabase.from('post_tags').insert(tagInserts);
        }

        return (await this.getPost(data.slug))!;
    }

    async updatePost(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
        const supabase = await this.getClient();
        const { data, error } = await supabase
            .from('posts')
            .update({
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                content: post.content,
                cover_image: post.cover_image,
                published: post.published,
                published_at: post.published && !post.published_at ? new Date().toISOString() : post.published_at,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);

        if (post.tags) {
            // Simple sync: delete all and re-add
            await supabase.from('post_tags').delete().eq('post_id', id);
            if (post.tags.length > 0) {
                const tagInserts = post.tags.map((tag: string) => ({
                    post_id: id,
                    tag
                }));
                await supabase.from('post_tags').insert(tagInserts);
            }
        }

        return (await this.getPost(data.slug))!;
    }

    async deletePost(id: string): Promise<void> {
        const supabase = await this.getClient();
        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (error) throw new Error(error.message);
    }

    // --- PAYMENTS ---

    async getPaymentRequests(): Promise<PaymentRequest[]> {
        const supabase = await this.getClient();
        const { data, error } = await supabase
            .from('payment_requests')
            .select('*, user:profiles(*)')
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return (data || []).map(p => ({
            ...p,
            user: p.user ? {
                id: p.user.id,
                email: p.user.email,
                fullName: p.user.full_name,
                avatarUrl: p.user.avatar_url,
                role: p.user.role
            } : undefined
        }));
    }

    async createPaymentRequest(request: Partial<PaymentRequest>): Promise<PaymentRequest> {
        const supabase = await this.getClient();
        const { data, error } = await supabase
            .from('payment_requests')
            .insert({
                user_id: request.user_id,
                item_id: request.item_id,
                item_type: request.item_type,
                amount: request.amount,
                status: 'pending'
            })
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    async updatePaymentRequestStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
        const supabase = await this.getClient();
        
        // 1. Update status
        const { data: request, error } = await supabase
            .from('payment_requests')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);

        // 2. If approved, create enrollment
        if (status === 'approved' && request) {
            if (request.item_type === 'course') {
                await this.createEnrollment(request.user_id, request.item_id);
            } else if (request.item_type === 'exam') {
                await this.createExamEnrollment(request.user_id, request.item_id);
            } else if (request.item_type === 'learning-path') {
                await this.createLearningPathEnrollment(request.user_id, request.item_id);
            }
        }
    }
}
