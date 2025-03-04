import Hero from "@/components/Hero";
import { CourseCard } from "@/components/CourseCard";
import { getCourses } from "@/sanity/lib/courses/getCourses";

export const dynamic = "force-static";
export const revalidate = 3600; // revalidate at most every hour

export default async function Home() {
  const courses = await getCourses();

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      {/* <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-center py-20">
        <h1 className="text-3xl font-bold text-white">
          Unlock Your Potential with World-Class Courses
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-white/80 max-w-2xl mx-auto">
          Explore our curated collection of expert-led courses, designed to give
          you the skills and knowledge to thrive in today's fast-paced world.
        </p>
        <button className="mt-8 px-8 py-4 bg-white text-blue-500 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition duration-300">
          Get Started
        </button>
      </div> */}
      {/* Courses Grid */}
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 py-8">
          <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
          <span className="text-sm font-medium text-muted-foreground">
            Featured Courses
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-16">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              href={`/courses/${course.slug}`}
            />
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Trending Course Section */}
        {/* <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4 text-center">Trending Course</h2>
          <div className="overflow-x-auto flex space-x-4 justify-center">
            <div className="min-w-[300px] bg-white rounded shadow-lg p-4">
              <img
                src="/path-to-trending-course-image.jpg"
                alt="Trending Course"
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="mt-2 font-semibold text-lg text-center">Course Title</h3>
              <p className="text-sm text-muted-foreground text-center">Brief description...</p>
            </div>
            <div className="min-w-[300px] bg-white rounded shadow-lg p-4">
              <img
                src="/path-to-trending-course-image.jpg"
                alt="Trending Course"
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="mt-2 font-semibold text-lg text-center">Course Title</h3>
              <p className="text-sm text-muted-foreground text-center">Brief description...</p>
            </div>
            
          </div>
        </section> */}

        {/* Testimonials Section */}
        {/* <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
              <img
                src="/path-to-avatar1.jpg"
                alt="John Doe"
                className="w-16 h-16 rounded-full border-2 border-gray-300 mb-4"
              />
              <p className="text-lg italic mb-4">
                "This platform has transformed my career. Highly recommended!"
              </p>
              <span className="text-sm text-muted-foreground font-semibold">
                - John Doe
              </span>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
              <img
                src="/path-to-avatar2.jpg"
                alt="Jane Smith"
                className="w-16 h-16 rounded-full border-2 border-gray-300 mb-4"
              />
              <p className="text-lg italic mb-4">
                "The courses are insightful and easy to follow."
              </p>
              <span className="text-sm text-muted-foreground font-semibold">
                - Jane Smith
              </span>
            </div>
            
          </div>
        </section> */}

        {/* FAQs Section */}
        {/* <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="border rounded-lg p-6 shadow-md bg-white">
              <h3 className="font-semibold text-xl">
                What courses do you offer?
              </h3>
              <p className="mt-2 text-muted-foreground">
                We offer a variety of courses ranging from technology to
                creative arts.
              </p>
            </div>
            <div className="border rounded-lg p-6 shadow-md bg-white">
              <h3 className="font-semibold text-xl">How do I enroll?</h3>
              <p className="mt-2 text-muted-foreground">
                Simply sign up, select your course, and complete the enrollment
                process online.
              </p>
            </div>
            
          </div>
        </section> */}

        {/* Course Categories & Tags Section */}
        {/* <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Course Categories & Tags
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-5 py-2 bg-blue-500 text-white rounded-full shadow-sm hover:shadow-md transition">
              Technology
            </button>
            <button className="px-5 py-2 bg-green-500 text-white rounded-full shadow-sm hover:shadow-md transition">
              Business
            </button>
            <button className="px-5 py-2 bg-red-500 text-white rounded-full shadow-sm hover:shadow-md transition">
              Design
            </button>
            <button className="px-5 py-2 bg-purple-500 text-white rounded-full shadow-sm hover:shadow-md transition">
              Marketing
            </button>
            <button className="px-5 py-2 bg-yellow-500 text-white rounded-full shadow-sm hover:shadow-md transition">
              Photography
            </button>
            
          </div>
        </section> */}
      </div>
    </div>
  );
}
