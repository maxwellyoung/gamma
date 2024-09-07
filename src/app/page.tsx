"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Play,
  Pause,
  SkipForward,
  Volume2,
  ChevronLeft,
  Moon,
  Sun,
  Wind,
  Activity,
  LucideIcon,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Meditation {
  id: number;
  title: string;
  duration: number;
  type: string;
  icon: LucideIcon;
}

const meditations: Meditation[] = [
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

interface BreathingVisualProps {
  isBreathing: boolean;
  duration: number;
}

const BreathingVisual: React.FC<BreathingVisualProps> = ({
  isBreathing,
  duration,
}) => {
  const breatheIn = { scale: 1.5, transition: { duration: duration / 2 } };
  const breatheOut = { scale: 1, transition: { duration: duration / 2 } };

  return (
    <motion.div
      className="w-16 h-16 bg-indigo-500 rounded-full mx-auto mb-8"
      animate={isBreathing ? breatheIn : breatheOut}
    />
  );
};

export default function Component() {
  const [activeSession, setActiveSession] = useState<Meditation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [selectedType, setSelectedType] = useState("All");
  const [isBreathing, setIsBreathing] = useState(false);
  const controls = useAnimation();
  const sessionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => time - 1);
        if (activeSession?.type === "Breathing") {
          setIsBreathing((prev) => !prev);
        }
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsPlaying(false);
      controls.start({ opacity: 0, y: -20 });
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, activeSession, controls]);

  useEffect(() => {
    if (sessionRef.current) {
      sessionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeSession]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSessionStart = (session: Meditation) => {
    setActiveSession(session);
    setTimeRemaining(session.duration);
    setIsPlaying(true);
    controls.start({ opacity: 1, y: 0 });
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkip = () => {
    setTimeRemaining(0);
    setIsPlaying(false);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
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
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-start p-8 font-mono overflow-x-hidden">
      <motion.h1
        className="text-4xl mb-12 mt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Gamma: Mindfulness App
      </motion.h1>

      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {!activeSession ? (
            <motion.div
              key="session-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl">Choose a session:</h2>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-white border border-gray-300 rounded-md px-2 py-1"
                >
                  <option value="All">All</option>
                  <option value="Meditation">Meditation</option>
                  <option value="Breathing">Breathing</option>
                  <option value="Body Scan">Body Scan</option>
                </select>
              </div>
              {filteredMeditations.map((meditation) => (
                <Button
                  key={meditation.id}
                  onClick={() => handleSessionStart(meditation)}
                  className="w-full mb-4 py-6 text-left justify-start text-lg hover:bg-indigo-50 transition-colors group"
                  variant="outline"
                >
                  <meditation.icon className="mr-4 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
                  <span className="flex-grow">{meditation.title}</span>
                  <span className="text-sm text-gray-500">
                    {formatTime(meditation.duration)} | {meditation.type}
                  </span>
                </Button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              ref={sessionRef}
              key="active-session"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center relative pb-16"
            >
              <Button
                onClick={handleBack}
                variant="ghost"
                className="absolute top-0 left-0"
              >
                <ChevronLeft size={24} />
                Back
              </Button>
              <h2 className="text-2xl mb-2">{activeSession.title}</h2>
              <p className="text-sm text-gray-500 mb-6">{activeSession.type}</p>
              {activeSession.type === "Breathing" && (
                <BreathingVisual isBreathing={isBreathing} duration={4} />
              )}
              <motion.div className="text-6xl mb-8" animate={controls}>
                {formatTime(timeRemaining)}
              </motion.div>
              <Progress
                value={(1 - timeRemaining / activeSession.duration) * 100}
                className="mb-8"
              />
              <div className="flex justify-center space-x-4 mb-8">
                <Button
                  onClick={handlePlayPause}
                  size="icon"
                  variant="outline"
                  className="w-16 h-16 rounded-full"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </Button>
                <Button
                  onClick={handleSkip}
                  size="icon"
                  variant="outline"
                  className="w-16 h-16 rounded-full"
                >
                  <SkipForward size={24} />
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <Volume2 size={24} />
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
