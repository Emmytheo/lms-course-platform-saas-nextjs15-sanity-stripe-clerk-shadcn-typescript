import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    CheckCircle, Clock, BookOpen,
    Target, Star, User, Shield, Award, ArrowLeft, Share2
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function LearningPathDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

    let path;
    if (isUuid) {
        path = await db.getLearningPathById(slug);
    } else {
        path = await db.getLearningPath(slug);
    }

    if (!path) return notFound();

    // Mock/Default data for fields not yet in DB schema
    const level = "Intermediate";
    const rating = 4.9;
    const ratingCount = 120;
    const enrolledCount = 1234;
    const totalDuration = 0; // functional calculation if course durations available
    const price = 199.00;

    const courseCount = path.courses?.filter((c: any) => !('pass_score' in c)).length || 0;
    const examCount = path.courses?.filter((c: any) => 'pass_score' in c).length || 0;
    const totalItems = (path.courses?.length || 0);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">

            {/* Hero Section */}
            <div className="relative h-fit w-full border-b border-border">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/50" />
                <div className="absolute inset-0 z-0 opacity-30">
                    {path.image ? (
                        <img src={path.image} className="w-full h-full object-cover" alt={path.title} />
                    ) : (
                        <div className="w-full h-full bg-muted" />
                    )}
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row justify-between items-end gap-8">
                    <div className="space-y-4 max-w-3xl">
                        <Link href="/lms/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                        </Link>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="border-primary text-primary">{level}</Badge>
                            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">Certification Path</Badge>
                            <div className="flex items-center gap-1 text-yellow-500 text-sm ml-2">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="font-bold">{rating}</span>
                                <span className="text-muted-foreground">({ratingCount} ratings)</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">{path.title}</h1>
                        <p className="text-xl text-muted-foreground">{path.description}</p>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
                            <div className="flex items-center gap-2"><User className="w-4 h-4" /> {enrolledCount.toLocaleString()} Enrolled</div>
                            <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> ~10 Hours</div>
                            <div className="flex items-center gap-2"><Globe className="w-4 h-4" /> English</div>
                        </div>
                    </div>

                    <div className="w-full md:w-80 shrink-0">
                        <Card className="bg-card/90 border-border backdrop-blur-md shadow-2xl">
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <div className="text-3xl font-bold text-foreground">${price.toFixed(2)}</div>
                                    <div className="text-sm text-muted-foreground">or 3 installments of ${(price / 3).toFixed(0)}</div>
                                </div>

                                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-12 text-lg">
                                    Enroll Now
                                </Button>

                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CheckCircle className="w-4 h-4 text-green-500" /> <span>Full lifetime access</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Award className="w-4 h-4 text-yellow-500" /> <span>Certificate of completion</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Shield className="w-4 h-4 text-primary" /> <span>30-Day Money-Back Guarantee</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Learning Objectives */}
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
                                <Target className="w-5 h-5 text-primary" /> What you'll learn
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {['Master fundamental concepts', 'Execute advanced techniques',
                                    'Understand core principles', 'Develop practical skills',
                                    'Improve professional workflow', 'Prepare for certification'
                                ].map((obj, i) => (
                                    <li key={i} className="flex gap-3 text-muted-foreground">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                        <span className="text-sm">{obj}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Curriculum */}
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
                                <BookOpen className="w-5 h-5 text-primary" /> Curriculum
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                {courseCount} courses • {examCount} exams • {totalItems} steps
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {path.courses?.map((item, idx) => {
                                // Determine type
                                const isExam = 'pass_score' in item;
                                const href = isExam
                                    ? `/lms/exams/${item.slug.current}`
                                    : `/lms/courses/${item.slug.current}`;
                                const typeLabel = isExam ? "Exam" : "Course";
                                const meta = isExam
                                    ? `${(item as any).pass_score}% Pass Score`
                                    : `60 min`; // Mock duration for course if not available

                                return (
                                    <div key={item._id} className={`group border rounded-lg bg-card hover:border-primary/50 transition-all p-4 flex flex-col md:flex-row items-center justify-between gap-4 ${isExam ? 'border-primary/30' : 'border-border'}`}>
                                        <div className="flex items-center gap-4 w-full">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center border text-sm font-mono ${isExam ? 'bg-primary/20 border-primary text-primary' : 'bg-muted border-border text-muted-foreground'}`}>
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                                                    {isExam && <Badge className="bg-primary text-primary-foreground h-5 text-[10px] px-1">Exam</Badge>}
                                                </div>
                                                <div className="text-xs text-muted-foreground flex gap-2">
                                                    <span>{typeLabel}</span> • <span>{meta}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link href={href}>
                                            <Button variant="outline" size="sm" className={`w-full md:w-auto text-muted-foreground hover:text-foreground ${isExam ? 'border-primary hover:bg-primary/30' : 'border-border'}`}>
                                                {isExam ? 'Start Exam' : 'View Course'}
                                            </Button>
                                        </Link>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-foreground">Instructors</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                                    <User className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <div>
                                    <div className="font-bold text-foreground">Lead Instructor</div>
                                    <div className="text-xs text-primary">Subject Matter Expert</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-foreground">Path Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Duration</span>
                                <span className="font-bold text-foreground">~10 Hours</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Skill Level</span>
                                <span className="font-bold text-foreground">{level}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Students</span>
                                <span className="font-bold text-foreground">{enrolledCount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Certificates</span>
                                <span className="font-bold text-foreground">Yes, Included</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}

function Globe(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" x2="22" y1="12" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    )
}
