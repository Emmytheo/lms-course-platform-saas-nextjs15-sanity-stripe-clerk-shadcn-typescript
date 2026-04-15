
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
    const enrollmentId = '88bb2b26-a2a6-440a-8482-c7fb35f430b8';
    console.log("Fetching enrollment:", enrollmentId);

    const { data, error } = await supabase.from('enrollments')
            .select(`
                *,
                course:courses(
                    *,
                    modules:modules(
                        *,
                        lessons:lessons(*)
                    ),
                    instructor:instructor_id(
                        full_name,
                        avatar_url
                    )
                )
            `)
            .eq('id', enrollmentId)
            .single();

    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Course Found:", data?.course?.title);
        console.log("Modules Count:", data?.course?.modules?.length);
        if (data?.course?.modules?.length > 0) {
            console.log("First Module Lessons:", data.course.modules[0].lessons?.length);
        }
    }
}

testFetch();
