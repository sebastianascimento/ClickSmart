"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";

interface Clue {
  id: string;
  icon: string;
  name: string;
  discovered: boolean;
  content: string;
}

interface NewsStory {
  id: string;
  title: string;
  content: string;
  isFake: boolean;
  clues: Clue[];
}

export default function DetectiveGame({
  onComplete,
}: {
  onComplete: (score: number) => void;
}) {
  const gameT = useTranslations("game");
  const detectiveT = useTranslations("detective");
  const locale = useLocale(); // Movido para dentro do componente

  const [story, setStory] = useState<NewsStory>({
    id: "celebrity-news",
    title: detectiveT("story.title"),
    content: detectiveT("story.content"),
    isFake: true,
    clues: [
      {
        id: "google",
        icon: "🔍",
        name: detectiveT("clues.google.name"),
        discovered: false,
        content: detectiveT("clues.google.content"),
      },
      {
        id: "author",
        icon: "🖋️",
        name: detectiveT("clues.author.name"),
        discovered: false,
        content: detectiveT("clues.author.content"),
      },
      {
        id: "comments",
        icon: "💬",
        name: detectiveT("clues.comments.name"),
        discovered: false,
        content: detectiveT("clues.comments.content"),
      },
      {
        id: "date",
        icon: "📆",
        name: detectiveT("clues.date.name"),
        discovered: false,
        content: detectiveT("clues.date.content"),
      },
    ],
  });

  const [discoveredClues, setDiscoveredClues] = useState<string[]>([]);
  const [showDecision, setShowDecision] = useState(false);
  const [decision, setDecision] = useState<boolean | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Discover a clue when an action is clicked
  const discoverClue = (clueId: string) => {
    setStory((prev) => ({
      ...prev,
      clues: prev.clues.map((clue) =>
        clue.id === clueId ? { ...clue, discovered: true } : clue
      ),
    }));

    if (!discoveredClues.includes(clueId)) {
      setDiscoveredClues([...discoveredClues, clueId]);
    }

    // Show decision option after discovering at least 2 clues
    if (discoveredClues.length >= 1) {
      setShowDecision(true);
    }
  };

  // Player makes a decision about the news
  const makeDecision = (isFakeNews: boolean) => {
    setDecision(isFakeNews);

    // Calculate score based on correct decision and number of clues discovered
    const isCorrect = isFakeNews === story.isFake;
    const baseScore = isCorrect ? 10 : 0;
    const bonusScore = discoveredClues.length * 2; // More investigation = higher score

    setGameCompleted(true);

    // Wait a bit then complete the game
    setTimeout(() => {
      onComplete(baseScore + bonusScore);
    }, 3000);
  };

  // Calculate investigation progress
  const progressPercentage =
    (discoveredClues.length / story.clues.length) * 100;

  return (
    <div className="space-y-8">
      {/* Game Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-2xl overflow-hidden border border-green-100"
      >
        <div className="p-6 md:p-8">
          <h2 className="text-3xl font-bold text-green-700 mb-4">
            {detectiveT("gameTitle")}
          </h2>
          <p className="text-gray-700">{detectiveT("instructions")}</p>
        </div>
      </motion.div>

      {/* News Story */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white shadow-lg rounded-xl p-6 md:p-8 border border-gray-100"
      >
        <div className="mb-4 flex items-center">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
            {locale === "pt" ? "URGENTE" : "BREAKING"}
          </span>
          <span className="text-gray-500 text-sm">
            {locale === "pt" ? "Publicado hoje" : "Published today"}
          </span>
        </div>

        <h3 className="text-2xl font-bold mb-4 text-gray-900">{story.title}</h3>
        <div className="text-gray-700 mb-4 leading-relaxed">
          {story.content}
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4 text-gray-500 text-sm flex items-center justify-between">
          <div>{locale === "pt" ? "Compartilhar" : "Share This"}</div>
          <div className="flex space-x-2">
            <span className="cursor-pointer hover:text-blue-600">📱</span>
            <span className="cursor-pointer hover:text-blue-600">📧</span>
            <span className="cursor-pointer hover:text-blue-600">🔄</span>
          </div>
        </div>
      </motion.div>

      {/* Investigation Tools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white shadow-lg rounded-xl p-6 md:p-8 border border-gray-100"
      >
        <h3 className="text-xl font-bold mb-4 text-green-700">
          {detectiveT("toolsTitle")}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {story.clues.map((clue, index) => (
            <motion.button
              key={clue.id}
              whileHover={{ scale: clue.discovered ? 1 : 1.05 }}
              whileTap={{ scale: clue.discovered ? 1 : 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              onClick={() => discoverClue(clue.id)}
              disabled={clue.discovered}
              className={`p-4 rounded-lg transition flex flex-col items-center justify-center h-24 border-2
                ${
                  clue.discovered
                    ? "bg-green-50 border-green-500 cursor-default"
                    : "bg-white border-gray-200 hover:border-green-400 hover:bg-green-50 shadow-sm"
                }`}
            >
              <span className="text-3xl mb-2">{clue.icon}</span>
              <span className="text-sm font-medium text-center text-gray-900">
                {clue.name}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Discovered Clues */}
      {discoveredClues.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white shadow-lg rounded-xl p-6 md:p-8 border border-gray-100"
        >
          <h3 className="text-xl font-bold mb-4 text-green-700">
            {detectiveT("cluesTitle")}
          </h3>

          <div className="space-y-4">
            {story.clues
              .filter((c) => c.discovered)
              .map((clue, index) => (
                <motion.div
                  key={clue.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg"
                >
                  <div className="flex">
                    <span className="text-2xl mr-3">{clue.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-900">{clue.name}</h4>
                      <p className="text-gray-700">{clue.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white shadow-lg rounded-xl p-6 md:p-8 border border-gray-100"
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-green-700">
            {locale === "pt" ? "Progresso" : "Progress"}
          </h3>
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progressPercentage)}%
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div
            className="bg-green-600 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          {discoveredClues.length} / {story.clues.length}{" "}
          {locale === "pt" ? "pistas descobertas" : "clues discovered"}
        </div>
      </motion.div>

      {/* Decision */}
      {showDecision && !gameCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white shadow-lg rounded-xl p-6 md:p-8 border border-gray-100"
        >
          <h3 className="text-xl font-bold mb-4 text-green-700">
            {detectiveT("decisionTitle")}
          </h3>
          <p className="text-gray-700 mb-6">{detectiveT("decisionPrompt")}</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => makeDecision(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow transition flex-1 flex justify-center items-center gap-2"
            >
              <span>❌</span>
              {detectiveT("decisionFake")}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => makeDecision(false)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow transition flex-1 flex justify-center items-center gap-2"
            >
              <span>✅</span>
              {detectiveT("decisionReal")}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Result */}
      {gameCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-white shadow-lg rounded-xl p-6 md:p-8 border border-gray-100`}
        >
          <div
            className={`p-6 rounded-lg ${
              decision === story.isFake ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">
                {decision === story.isFake ? "🎉" : "🧐"}
              </span>
              <h3 className="text-xl font-bold text-gray-900">
                {decision === story.isFake
                  ? detectiveT("resultCorrect")
                  : detectiveT("resultWrong")}
              </h3>
            </div>

            <p className="text-gray-700 mb-4">
              {story.isFake
                ? detectiveT("explanationFake")
                : detectiveT("explanationReal")}
            </p>

            <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-900">
                    {locale === "pt" ? "Sua pontuação" : "Your Score"}
                  </h4>
                  <p className="text-gray-600">
                    {decision === story.isFake ? "+" : ""}
                    {(decision === story.isFake ? 10 : 0) +
                      discoveredClues.length * 2}{" "}
                    {locale === "pt" ? "pontos" : "points"}
                  </p>
                </div>
                <div className="text-4xl">
                  {decision === story.isFake ? "🏆" : "📝"}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}