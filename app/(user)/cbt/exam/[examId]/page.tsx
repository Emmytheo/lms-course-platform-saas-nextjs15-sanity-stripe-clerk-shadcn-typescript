import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, HelpCircle, BarChart3, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import exams from "@/public/data/exam.json"

// Mock function to fetch exam data - replace with your actual data fetching
async function getExamBySlug(examId: number) {
  // This would typically fetch from your database
  // const exams = [
  //   {
  //     id: 1,
  //     slug: "mathematics-practice-test",
  //     title: "Mathematics Practice Test",
  //     description: "Test your math skills with this comprehensive practice exam covering algebra, geometry, and advanced mathematics concepts.",
  //     duration: 60,
  //     totalQuestions: 30,
  //     categories: ["mathematics", "quantitative"],
  //     difficulty: "Intermediate",
  //     image: "/images/math-exam.jpg",
  //     sections: [
  //       {
  //         title: "Algebra",
  //         questions: 15,
  //         description: "Linear equations, quadratic formulas, and algebraic expressions"
  //       },
  //       {
  //         title: "Geometry",
  //         questions: 10,
  //         description: "Shapes, angles, areas, and volumes"
  //       },
  //       {
  //         title: "Advanced Mathematics",
  //         questions: 5,
  //         description: "Calculus and trigonometry problems"
  //       }
  //     ],
  //     instructions: [
  //       "This exam consists of 30 multiple-choice questions",
  //       "You have 60 minutes to complete the exam",
  //       "Each question has only one correct answer",
  //       "You can navigate between questions using the sidebar or footer",
  //       "Once submitted, you cannot change your answers"
  //     ]
  //   },
  //   {
  //     id: 2,
  //     slug: "english-language-test",
  //     title: "English Language Test",
  //     description: "Assess your English grammar and comprehension skills with this comprehensive language exam.",
  //     duration: 45,
  //     totalQuestions: 25,
  //     categories: ["english", "language"],
  //     difficulty: "Beginner",
  //     image: "/images/english-exam.jpg",
  //     sections: [
  //       {
  //         title: "Grammar",
  //         questions: 10,
  //         description: "Sentence structure, tenses, and parts of speech"
  //       },
  //       {
  //         title: "Vocabulary",
  //         questions: 8,
  //         description: "Word meanings, synonyms, and antonyms"
  //       },
  //       {
  //         title: "Comprehension",
  //         questions: 7,
  //         description: "Reading passages and questions"
  //       }
  //     ],
  //     instructions: [
  //       "This exam consists of 25 multiple-choice questions",
  //       "You have 45 minutes to complete the exam",
  //       "Each question has only one correct answer",
  //       "You can navigate between questions using the sidebar or footer",
  //       "Once submitted, you cannot change your answers"
  //     ]
  //   }
  // ];

  
  
  return exams.find(exam => {
    console.log(examId, exam.id, exam.id == examId);
    return exam.id == examId
  });
}

interface ExamPageProps {
  params: {
    slug: string;
    examId: number;
  };
}

export default async function ExamPage({ params }: any) {
  await params;
  const exam = await getExamBySlug(params.examId);

  if (!exam) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-4xl font-bold">Exam not found</h1>
        <Link href="/exam-library" className="text-primary mt-4 inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Exam Library
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[63vh] xs:h-[55vh] sm:h-[55vh] md:h-[45vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-background" />
        <div className="absolute inset-0 container mx-auto px-8 flex flex-col justify-end pb-12">
          <Link
            href="/exam-library"
            className="text-foreground text-sm md:text-md mb-8 flex items-center hover:text-primary transition-colors w-fit"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Exam Library
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Badge variant="secondary" className="text-sm font-medium">
                  {exam.difficulty}
                </Badge>
                {exam.categories.map((category, index) => (
                  <Badge key={index} variant="outline" className="text-sm font-medium">
                    {category}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {exam.title}
              </h1>
              <p className="text-md md:text-lg text-muted-foreground max-w-2xl">
                {exam.description}
              </p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 md:min-w-[300px] border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-medium">Duration</span>
                </div>
                <span className="text-lg font-bold">{exam.duration} minutes</span>
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <span className="font-medium">Questions</span>
                </div>
                <span className="text-lg font-bold">{exam.totalQuestions}</span>
              </div>
              <Button asChild className="w-full">
                <Link href={`/cbt/exam/${exam.id}/start`}>Start Exam</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Exam Sections */}
            <Card className="border shadow-sm rounded-lg">
              <CardHeader className="!pb-4">
                <CardTitle>Exam Structure</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Breakdown of sections and questions in this exam
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {exam.sections.map((section, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-lg">
                          Section {index + 1}: {section.title}
                        </h3>
                        <Badge variant="outline" className="whitespace-nowrap">
                          {section.questions.length} questions
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {section.description}
                      </p>
                      <Progress value={(section.questions.length / exam.totalQuestions) * 100} className="mt-4" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="border shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle>Exam Instructions</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Please read these instructions carefully before starting the exam
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {exam.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-xs mt-0.5 mr-3">
                        {index + 1}
                      </div>
                      <span className="text-foreground">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="border shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle>Exam Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Avg. Score</span>
                  </div>
                  <span className="font-medium">72%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Completion Rate</span>
                  </div>
                  <span className="font-medium">89%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Attempts</span>
                  </div>
                  <span className="font-medium">1,243</span>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle>Preparation Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">Review Key Concepts</h4>
                    <p className="text-sm text-muted-foreground">
                      Focus on algebraic formulas and geometric theorems
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">Time Management</h4>
                    <p className="text-sm text-muted-foreground">
                      Spend about 2 minutes per question to complete on time
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">Answer Strategically</h4>
                    <p className="text-sm text-muted-foreground">
                      Skip difficult questions and return to them later
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}