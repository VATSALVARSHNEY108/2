"use client";

import { useState, useEffect } from "react";

export function useProgress() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("o1_progress");
    if (saved) {
      try {
        setCompletedLessons(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
  }, []);

  const toggleLesson = (lessonId: string) => {
    setCompletedLessons((prev) => {
      const next = prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId];
      localStorage.setItem("o1_progress", JSON.stringify(next));
      return next;
    });
  };

  const isCompleted = (lessonId: string) => completedLessons.includes(lessonId);

  return { completedLessons, toggleLesson, isCompleted };
}
