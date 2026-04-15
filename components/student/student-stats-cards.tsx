import { BookOpen, CheckCircle, Trophy, Activity } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface StudentStatsProps {
    enrolledCount: number;
    completedCount: number;
    avgScore: number;
    certificatesCount: number;
}

export function StudentStatsCards({ enrolledCount, completedCount, avgScore, certificatesCount }: StudentStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Enrolled Courses</CardTitle>
                    <BookOpen className="h-4 w-4 text-cyan-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-foreground">{enrolledCount}</div>
                    <p className="text-xs text-muted-foreground">Active learning</p>
                </CardContent>
            </Card>

            <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-foreground">{completedCount}</div>
                    <p className="text-xs text-muted-foreground">Courses finished</p>
                </CardContent>
            </Card>

            <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
                    <Activity className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-foreground">{avgScore}%</div>
                    <p className="text-xs text-muted-foreground">Across all quizzes</p>
                </CardContent>
            </Card>

            <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Certificates</CardTitle>
                    <Trophy className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-foreground">{certificatesCount}</div>
                    <p className="text-xs text-muted-foreground">Earned so far</p>
                </CardContent>
            </Card>
        </div>
    )
}
