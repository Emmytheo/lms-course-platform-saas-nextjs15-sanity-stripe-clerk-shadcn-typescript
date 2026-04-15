'use client'
// app/learning-paths/page.js
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Clock, PlayCircle, BookOpen, Target } from "lucide-react";
import Link from "next/link";
import learningPaths from "@/public/data/learning-paths.json";
import { useState } from "react";


export default function LearningPathsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = ['all', 'Self Paced', 'Instructor Led'];
  const tags = [...new Set(learningPaths.flatMap(path => path.tags))];

  const filteredPaths = selectedCategory === 'all' 
    ? learningPaths 
    : learningPaths.filter(path => path.type === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Learning Paths
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Structured programs to master new skills and advance your career
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Featured Tags */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {tags.slice(0, 8).map(tag => (
            <Badge key={tag} variant="secondary" className="text-sm">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Learning Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPaths.map(path => (
            <Card key={path.id} className="hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="pb-4 p-0">
                <div className="relative h-48 rounded-t-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute top-4 left-4 z-20">
                    <Badge variant={path.type === 'Self Paced' ? "default" : "secondary"}>
                      {path.type}
                    </Badge>
                  </div>
                  <CardTitle className="absolute bottom-4 left-4 text-white z-20 text-xl">
                    {path.title}
                  </CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4 py-3">
                <CardDescription className="line-clamp-2">
                  {path.description}
                </CardDescription>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{path.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{path.enrollmentCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{path.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {path.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-foreground">
                    ${path.price}
                  </div>
                  <Button asChild className="gap-2">
                    <Link href={`/learning-paths/${path.slug}`}>
                      <PlayCircle className="h-4 w-4" />
                      Explore Path
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}