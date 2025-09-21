// components/TestSelection.js
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Button } from "@/components/ui/ButtonNew";

const TestSelection = ({ exams, onExamSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    ...new Set(exams.flatMap((exam) => exam.categories)),
  ];

  const filteredExams =
    selectedCategory === "all"
      ? exams
      : exams.filter((exam) => exam.categories.includes(selectedCategory));

  return (
    <div className="relative h-[63vh] xs:h-[55vh] sm:h-[55vh] md:h-[45vh] w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/55 dark:from-white/15 dark:to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
      <div className="container mx-auto px-4 py-16 w-full relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Practice CBT Tests
          </h1>
          <p className="text-lg text-muted-foreground">
            Select an exam to test your knowledge
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <Card
              key={exam.id}
              className="hover:shadow-lg transition-shadow bg-card rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:translate-y-[-4px] border border-border flex flex-col flex-1"
            >
              
              <CardHeader>
                <CardTitle className="line-clamp-1 elipsis text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">{exam.title}</CardTitle>
                <CardDescription className="text-muted-foreground mb-4 line-clamp-2 flex-1">{exam.description}</CardDescription>
              </CardHeader>
              

              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">
                    {exam.totalQuestions} questions
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {exam.duration} minutes
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {exam.categories.map((category) => (
                    <span
                      key={category}
                      // className="px-2 py-1 bg-primary text-background text-xs rounded-full "
                      className="text-white text-xs px-3 py-1 bg-black/50 dark:bg-white/20 rounded-full backdrop-blur-sm"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <Button onClick={() => onExamSelect(exam)} className="w-full">
                  Explore
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestSelection;
