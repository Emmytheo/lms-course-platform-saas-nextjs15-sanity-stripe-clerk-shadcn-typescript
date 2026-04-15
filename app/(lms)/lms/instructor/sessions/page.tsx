import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, Calendar, Video } from 'lucide-react';
import { getUpcomingSessions } from '@/actions/live-sessions';

export default async function LiveSessionsPage() {
    const sessions = await getUpcomingSessions();

    return (
        <div className="p-6 space-y-6 bg-background min-h-screen text-foreground">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Live Sessions</h1>
                    <p className="text-muted-foreground">Manage and join upcoming live sessions.</p>
                </div>
                <Link href="/lms/instructor/sessions/create">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Plus className="w-4 h-4 mr-2" /> Schedule New
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session) => (
                    <Card key={session.id} className="bg-card border-border hover:border-primary/50 transition-colors group">
                        <CardHeader>
                            <CardTitle className="text-foreground flex justify-between items-start">
                                <span>{session.title}</span>
                                <Video className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(session.scheduledAt).toLocaleString()}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Users className="w-4 h-4 mr-2" />
                                {session.participants} Registered
                            </div>

                            <div className="pt-2">
                                <Button size="sm" className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border">
                                    Join Room
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
