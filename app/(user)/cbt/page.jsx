// pages/index.js
'use client'
import { useState, useEffect } from 'react';
import Head from 'next/head';
import TestSelection from '@/components/exam/TestSelection';
import ExamInterface from '@/components/exam/ExamInterface';
import { redirect } from 'next/navigation';

export default function Home() {
  const [selectedExam, setSelectedExam] = useState(null);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    // Load exam data from local file
    const loadExams = async () => {
      try {
        const response = await fetch('/data/exam.json');
        const examData = await response.json();
        setExams(examData);
      } catch (error) {
        console.error('Failed to load exams:', error);
      }
    };

    loadExams();
  }, []);

  const handleExamSelect = (exam) => {
    // setSelectedExam(exam);
    redirect(`/cbt/exam/${exam.id}`)
  };

  const handleExitExam = () => {
    setSelectedExam(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>Practice CBT Platform</title>
        <meta name="description" content="Computer-Based Testing Platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {selectedExam ? (
          <ExamInterface exam={selectedExam} onExit={handleExitExam} />
        ) : (
          <TestSelection exams={exams} onExamSelect={handleExamSelect} />
        )}
      </main>
    </div>
  );
}