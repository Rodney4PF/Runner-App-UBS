import React, { useState, useEffect, useRef } from "react";
import { FaUniversity } from "react-icons/fa";

export default function SavingsRunner() {
  const [playerX, setPlayerX] = useState(50);
  const [coins, setCoins] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameAreaRef = useRef(null);

  // Generate coins and obstacles
  useEffect(() => {
    if (gameOver) return;

    const coinInterval = setInterval(() => {
      setCoins((prev) => [...prev, { x: Math.random() * 90, y: 0 }]);
    }, 1500);

    const obstacleInterval = setInterval(() => {
      setObstacles((prev) => [
        ...prev,
        { x: Math.random() * 90, y: 0 },
        ...(score > 50 ? [{ x: Math.random() * 90, y: 0 }] : []),
      ]);
    }, score > 50 ? 1500 : 2500);

    return () => {
      clearInterval(coinInterval);
      clearInterval(obstacleInterval);
    };
  }, [gameOver, score]);

  // Smooth movement using requestAnimationFrame
  useEffect(() => {
    if (gameOver) return;
    let animationFrame;

    const moveObjects = () => {
      setCoins((prev) =>
        prev
          .map((c) => ({ ...c, y: c.y + 0.5 }))
          .filter((c) => c.y < 100)
      );
      setObstacles((prev) =>
        prev
          .map((o) => ({ ...o, y: o.y + 0.5 }))
          .filter((o) => o.y < 100)
      );
      animationFrame = requestAnimationFrame(moveObjects);
    };

    animationFrame = requestAnimationFrame(moveObjects);
    return () => cancelAnimationFrame(animationFrame);
  }, [gameOver]);

  // Collision detection
  useEffect(() => {
    coins.forEach((c) => {
      if (Math.abs(c.x - playerX) < 10 && c.y > 80 && c.y < 95) {
        setScore((s) => s + 10);
        setCoins((prev) => prev.filter((coin) => coin !== c));
      }
    });
    obstacles.forEach((o) => {
      if (Math.abs(o.x - playerX) < 10 && o.y > 80 && o.y < 95) {
        setGameOver(true);
      }
    });
  }, [coins, obstacles, playerX]);

  // Player controls
  useEffect(() => {
    const handleKey = (e) => {
      if (gameOver) return;
      if (e.key === "ArrowLeft") setPlayerX((x) => Math.max(0, x - 10));
      if (e.key === "ArrowRight") setPlayerX((x) => Math.min(90, x + 10));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameOver]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-100 to-white font-sans">
      <div className="flex items-center gap-2 mb-4">
        <FaUniversity className="text-red-600 text-3xl" />
        <h1 className="text-3xl font-bold text-red-600 tracking-widest">UBS</h1>
      </div>
      <h2 className="text-xl font-semibold mb-2">Savings Runner</h2>
      <p className="mb-2">Score: {score} CHF</p>

      <div
        ref={gameAreaRef}
        className="relative w-64 h-96 bg-white border-8 border-red-600 rounded-2xl overflow-hidden shadow-xl"
      >
        <div
          className="absolute w-8 h-8 bg-red-600 rounded-full border-2 border-white shadow-md transition-transform duration-50"
          style={{ left: `${playerX}%`, bottom: "5%", transform: "translateX(-50%)" }}
        />
        {coins.map((c, i) => (
          <div
            key={i}
            className="absolute w-6 h-6 bg-yellow-400 rounded-full border-2 border-red-600"
            style={{ left: `${c.x}%`, top: `${c.y}%`, transform: "translateX(-50%)" }}
          />
        ))}
        {obstacles.map((o, i) => (
          <div
            key={i}
            className="absolute w-6 h-6 bg-black rounded-md border-2 border-red-600"
            style={{ left: `${o.x}%`, top: `${o.y}%`, transform: "translateX(-50%)" }}
          />
        ))}
      </div>

      {gameOver && (
        <div className="mt-4 text-center bg-white p-4 rounded-xl shadow-md border border-red-200">
          <h2 className="text-xl font-bold text-red-700">Game Over!</h2>
          <p className="mb-2">Du hast {score} CHF gespart 🎉</p>
          <button
            onClick={() => {
              setScore(0);
              setCoins([]);
              setObstacles([]);
              setGameOver(false);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-xl mt-2 hover:bg-red-700 shadow"
          >
            Nochmal Spielen
          </button>
        </div>
      )}
    </div>
  );
}