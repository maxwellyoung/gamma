"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useAnimation,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import {
  Play,
  Pause,
  SkipForward,
  ChevronLeft,
  Sun,
  Moon,
  Wind,
  Activity,
} from "lucide-react";

interface MeditationSession {
  id: number;
  title: string;
  duration: number;
  type: string;
  icon: React.ElementType;
}

const meditations: MeditationSession[] = [
  {
    id: 1,
    title: "Morning Calm",
    duration: 600,
    type: "Meditation",
    icon: Sun,
  },
  {
    id: 2,
    title: "Stress Relief",
    duration: 900,
    type: "Meditation",
    icon: Wind,
  },
  {
    id: 3,
    title: "Deep Focus",
    duration: 1200,
    type: "Meditation",
    icon: Activity,
  },
  {
    id: 4,
    title: "Before Sleep",
    duration: 1500,
    type: "Meditation",
    icon: Moon,
  },
  {
    id: 5,
    title: "4-7-8 Breathing",
    duration: 300,
    type: "Breathing",
    icon: Wind,
  },
  {
    id: 6,
    title: "Box Breathing",
    duration: 480,
    type: "Breathing",
    icon: Wind,
  },
  {
    id: 7,
    title: "Quick Body Scan",
    duration: 300,
    type: "Body Scan",
    icon: Activity,
  },
  {
    id: 8,
    title: "Full Body Relaxation",
    duration: 1200,
    type: "Body Scan",
    icon: Moon,
  },
];

const BreathingVisual: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const circleAnimation = useAnimation();
  const breathProgress = useMotionValue(0);
  const breathPhase = useTransform(
    breathProgress,
    [0, 0.33, 0.66, 1],
    ["Inhale...", "Hold...", "Exhale...", "Inhale..."]
  );

  useEffect(() => {
    if (isPlaying) {
      circleAnimation.start({
        scale: [1, 1.2, 1.2, 1],
        opacity: [0.7, 1, 1, 0.7],
        transition: {
          duration: 8,
          times: [0, 0.25, 0.75, 1],
          repeat: Infinity,
          ease: "easeInOut",
        },
      });
      breathProgress.set(0);
      animate(breathProgress, 1, {
        duration: 8,
        repeat: Infinity,
        ease: "linear",
      });
    } else {
      circleAnimation.stop();
      breathProgress.stop();
    }
  }, [isPlaying, circleAnimation, breathProgress]);

  return (
    <div className="relative w-48 h-48 mx-auto mb-8">
      <motion.div
        className="absolute inset-0 bg-gray-200 rounded-full"
        animate={circleAnimation}
      />
      <motion.div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm font-light">
        <motion.span>{breathPhase}</motion.span>
      </motion.div>
    </div>
  );
};

export default function Component() {
  const [activeSession, setActiveSession] = useState<MeditationSession | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSessionStart = (session: MeditationSession) => {
    setActiveSession(session);
    setTimeRemaining(session.duration);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkip = () => {
    setTimeRemaining(0);
    setIsPlaying(false);
  };

  const handleBack = () => {
    setActiveSession(null);
    setIsPlaying(false);
  };

  const filteredMeditations =
    selectedType === "All"
      ? meditations
      : meditations.filter((m) => m.type === selectedType);

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center justify-start p-8 font-sans">
      <motion.h1
        className="text-4xl mb-12 font-light"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
      >
        mindful
      </motion.h1>

      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {!activeSession ? (
            <motion.div
              key="session-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="flex justify-between items-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-light">Choose a session:</h2>
                <motion.select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-white border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <option value="All">All</option>
                  <option value="Meditation">Meditation</option>
                  <option value="Breathing">Breathing</option>
                  <option value="Body Scan">Body Scan</option>
                </motion.select>
              </motion.div>
              {filteredMeditations.map((meditation, index) => (
                <motion.button
                  key={meditation.id}
                  onClick={() => handleSessionStart(meditation)}
                  className="w-full mb-4 py-4 px-6 text-left text-lg bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg flex items-center"
                  whileHover={{ x: 5, backgroundColor: "#f3f4f6" }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <meditation.icon className="mr-4 text-gray-500" size={20} />
                  <span className="font-medium flex-grow">
                    {meditation.title}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatTime(meditation.duration)}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="active-session"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center relative"
            >
              <motion.button
                onClick={handleBack}
                className="absolute top-0 left-0 p-2 text-gray-500 hover:text-gray-700"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={24} />
              </motion.button>
              <motion.h2
                className="text-2xl mb-2 font-light"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {activeSession.title}
              </motion.h2>
              <motion.p
                className="text-sm text-gray-500 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {activeSession.type}
              </motion.p>
              {activeSession.type === "Breathing" && (
                <BreathingVisual isPlaying={isPlaying} />
              )}
              <motion.div
                className="text-6xl mb-8 font-light"
                key={timeRemaining}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {formatTime(timeRemaining)}
              </motion.div>
              <motion.div
                className="w-full h-1 bg-gray-200 mb-8 rounded-full overflow-hidden"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="h-full bg-gray-500"
                  style={{
                    width: `${
                      (1 - timeRemaining / activeSession.duration) * 100
                    }%`,
                    transition: "width 1s linear",
                  }}
                />
              </motion.div>
              <div className="flex justify-center space-x-4 mb-8">
                <motion.button
                  onClick={handlePlayPause}
                  className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full"
                  whileHover={{ scale: 1.1, backgroundColor: "#e5e7eb" }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </motion.button>
                <motion.button
                  onClick={handleSkip}
                  className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full"
                  whileHover={{ scale: 1.1, backgroundColor: "#e5e7eb" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <SkipForward size={24} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
