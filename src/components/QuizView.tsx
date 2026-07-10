/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { quizQuestions } from '../data/quizData';
import { Award, RefreshCw, ChevronRight, HelpCircle, CheckCircle, XCircle, FileText } from 'lucide-react';

interface QuizViewProps {
  darkMode: boolean;
}

export default function QuizView({ darkMode }: QuizViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<({ questionId: number; selectedIndex: number; isCorrect: boolean })[]>([]);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleAnswerSelection = (optionIdx: number) => {
    if (isAnswered) return; // Prevent double clicking

    const isCorrect = optionIdx === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setSelectedAnswer(optionIdx);
    setIsAnswered(true);
    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedIndex: optionIdx,
        isCorrect
      }
    ]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
    setUserAnswers([]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16 text-left" id="quiz-view">
      {/* Quiz Header */}
      <div className="space-y-1">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white font-sans tracking-tight flex items-center gap-2">
          <Award className="h-6 w-6 text-yellow-500 animate-bounce" />
          <span>Practice Revision Quiz</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Reinforce your process scheduling knowledge with 20 curated multiple-choice questions. Get instant feedback and full academic explanations.
        </p>
      </div>

      {quizFinished ? (
        /* Final Results Screen */
        <div className={`p-8 rounded-2xl border text-center space-y-6 ${
          darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
        }`} id="quiz-results-screen">
          <div className="inline-flex p-4 rounded-full bg-yellow-500/15 text-yellow-500 mb-2">
            <Award className="h-12 w-12" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white font-sans">Quiz Completed!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Here is your final performance scorecard for the Operating Systems scheduling modules.
            </p>
          </div>

          {/* Large score display */}
          <div className="inline-block p-6 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border dark:border-slate-800">
            <span className="text-4xl font-black text-indigo-500 font-mono">{score}</span>
            <span className="text-slate-400 dark:text-slate-500 font-bold"> / {quizQuestions.length}</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-2">
              Percentage: {Math.round((score / quizQuestions.length) * 100)}%
            </p>
          </div>

          <div className="text-xs text-slate-500 leading-normal max-w-md mx-auto">
            {score >= 18 ? (
              <span className="text-emerald-500 font-bold block">★ Stellar Performance!</span>
            ) : score >= 14 ? (
              <span className="text-blue-500 font-bold block">✓ Excellent understanding!</span>
            ) : (
              <span className="text-amber-500 font-bold block">ℹ Good attempt! We suggest reviewing the algorithm steps.</span>
            )}
            You can reset the deck to try and lock in a perfect score.
          </div>

          {/* Action button */}
          <button
            id="restart-quiz-btn"
            onClick={handleRestartQuiz}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all flex items-center space-x-2 mx-auto shadow-md"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Restart Revision Deck</span>
          </button>
        </div>
      ) : (
        /* Question Active Card */
        <div className="space-y-6" id="quiz-active-screen">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400">
              <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
              <span className="font-mono">Completed: {Math.round((currentQuestionIndex / quizQuestions.length) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-300" 
                style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Box */}
          <div className={`p-6 sm:p-8 rounded-2xl border ${
            darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
          }`} id="question-panel">
            <div className="flex items-start space-x-3 mb-6">
              <HelpCircle className="h-5.5 w-5.5 text-indigo-500 mt-0.5 flex-shrink-0" />
              <h3 className="text-base sm:text-lg font-black text-black dark:text-white font-sans leading-snug">
                {currentQuestion.question}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-3" id="options-container">
              {currentQuestion.options.map((option, idx) => {
                let optionStyle = `w-full text-left p-4 rounded-xl border text-xs font-bold font-sans transition-all flex items-center justify-between `;
                
                if (!isAnswered) {
                  optionStyle += darkMode 
                    ? 'border-slate-800 bg-slate-950/40 hover:bg-slate-800 hover:border-slate-700 text-slate-300' 
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-950';
                } else {
                  if (idx === currentQuestion.correctAnswerIndex) {
                    // Correct option (glows green)
                    optionStyle += 'border-emerald-500 bg-emerald-500/10 text-emerald-750 dark:text-emerald-400 font-extrabold';
                  } else if (idx === selectedAnswer) {
                    // Selected wrong option (glows red)
                    optionStyle += 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400 font-extrabold';
                  } else {
                    // Unselected options when answered
                    optionStyle += darkMode 
                      ? 'border-slate-850 bg-slate-950/20 text-slate-500' 
                      : 'border-slate-100 bg-slate-50/50 text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    id={`quiz-option-btn-${idx}`}
                    disabled={isAnswered}
                    onClick={() => handleAnswerSelection(idx)}
                    className={optionStyle}
                  >
                    <span>{option}</span>
                    {isAnswered && idx === currentQuestion.correctAnswerIndex && (
                      <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 ml-2" />
                    )}
                    {isAnswered && idx === selectedAnswer && idx !== currentQuestion.correctAnswerIndex && (
                      <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation panel (Fades in on answer submission) */}
            {isAnswered && (
              <div 
                className={`mt-6 p-4 rounded-xl border leading-relaxed text-xs transition-opacity duration-300 ${
                  darkMode ? 'bg-slate-950 border-slate-800' : 'bg-indigo-50/50 border-indigo-100'
                }`}
                id="explanation-panel"
              >
                <div className="flex items-center space-x-1.5 mb-2">
                  <FileText className="h-4 w-4 text-indigo-500" />
                  <span className="font-extrabold text-indigo-500 uppercase tracking-wider text-[10px]">REVISION EXPLANATION</span>
                </div>
                <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Navigation buttons */}
            {isAnswered && (
              <div className="mt-6 flex justify-end">
                <button
                  id="quiz-next-btn"
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center space-x-1.5 transition-all"
                >
                  <span>{currentQuestionIndex === quizQuestions.length - 1 ? 'Show Results' : 'Next Question'}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
