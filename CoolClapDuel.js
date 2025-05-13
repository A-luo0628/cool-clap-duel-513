
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CoolClapDuel() {
  const [phase, setPhase] = useState("ready");
  const [count, setCount] = useState(3);
  const [playerMove, setPlayerMove] = useState(null);
  const [opponentMove, setOpponentMove] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ player: 0, opponent: 0 });

  useEffect(() => {
    if (phase === "countdown" && count > 0) {
      const timer = setTimeout(() => setCount((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (phase === "countdown" && count === 0) {
      setPhase("action");
    }
  }, [phase, count]);

  function startRound() {
    setPlayerMove(null);
    setOpponentMove(null);
    setResult(null);
    setCount(3);
    setPhase("countdown");
  }

  function smarterOpponentMove(playerPrediction) {
    const rand = Math.random();
    if (rand < 0.7) {
      return playerPrediction === "clap" ? "cool" : "clap";
    }
    return Math.random() < 0.5 ? "clap" : "cool";
  }

  function submitMove(move) {
    if (phase !== "action") return;

    const opponent = smarterOpponentMove(move);
    setPlayerMove(move);
    setOpponentMove(opponent);

    resolveRound(move, opponent);
  }

  function resolveRound(player, opponent) {
    let winner = null;

    if (player === "clap" && opponent === "clap") {
      winner = null;
    } else if (player === "clap" && opponent === "cool") {
      winner = "player";
    } else if (player === "cool" && opponent === "clap") {
      winner = "player";
    } else if (player === "cool" && opponent === "cool") {
      winner = "opponent";
    }

    if (winner) {
      setScore((prev) => ({ ...prev, [winner]: prev[winner] + 1 }));
    }

    setResult(winner);
    setPhase("result");
    setTimeout(() => {
      setPhase("ready");
    }, 2000);
  }

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: 20 }}>
      <motion.h1
        style={{ fontSize: "2em", fontWeight: "bold" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        帅掌博弈（Cool Clap Duel）
      </motion.h1>

      <p style={{ fontSize: "1.2em" }}>
        {phase === "countdown"
          ? `准备中... ${count}`
          : phase === "action"
          ? "请选择你的动作"
          : phase === "result"
          ? result === null
            ? "平局！"
            : result === "player"
            ? "你赢了！"
            : "你输了！"
          : "点击开始游戏"}
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: 20 }}>
        <div>
          <h2>你</h2>
          <div>得分: {score.player}</div>
          {phase === "action" && (
            <div style={{ marginTop: 10 }}>
              <button onClick={() => submitMove("clap")}>👏 击掌</button>{" "}
              <button onClick={() => submitMove("cool")}>😎 耍帅</button>
            </div>
          )}
          {playerMove && <div style={{ marginTop: 10 }}>你的动作: {playerMove}</div>}
        </div>

        <div>
          <h2>对手</h2>
          <div>得分: {score.opponent}</div>
          {phase === "result" && opponentMove && (
            <motion.div
              style={{ marginTop: 10 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              对手动作: {opponentMove}
            </motion.div>
          )}
          {phase !== "result" && <div style={{ marginTop: 10, fontStyle: "italic" }}>隐藏中</div>}
        </div>
      </div>

      {phase === "ready" && (
        <motion.div style={{ marginTop: 20 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button onClick={startRound}>开始新一轮</button>
        </motion.div>
      )}
    </div>
  );
}
