import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Trophy,
  ArrowLeft,
  User,
  Bot,
  Sparkles,
  AlertTriangle,
  Play,
  RotateCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Character } from '../../types';

interface CaroGameProps {
  darkMode: boolean;
  onBack: () => void;
  character?: Character | null;
}

const BOARD_SIZE = 12; // 12x12 grid suitable for both mobile and desktop

type CellValue = 'X' | 'O' | null;

export const CaroGame: React.FC<CaroGameProps> = ({ darkMode, onBack, character }) => {
  const [board, setBoard] = useState<CellValue[][]>(() =>
    Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(null))
  );
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<'X' | 'O' | 'Draw' | null>(null);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [gameMode, setGameMode] = useState<'bot' | 'pvp'>('bot');
  const [moveHistory, setMoveHistory] = useState<{ r: number; c: number; val: CellValue }[]>([]);
  const [scores, setScores] = useState({ x: 0, o: 0, draws: 0 });

  // Check 5 in a row
  const checkWinner = (grid: CellValue[][], lastR: number, lastC: number, player: CellValue) => {
    if (!player) return null;
    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal \
      [1, -1], // diagonal /
    ];

    for (const [dr, dc] of directions) {
      const line: [number, number][] = [[lastR, lastC]];

      // Positive direction
      let r = lastR + dr;
      let c = lastC + dc;
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && grid[r][c] === player) {
        line.push([r, c]);
        r += dr;
        c += dc;
      }

      // Negative direction
      r = lastR - dr;
      c = lastC - dc;
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && grid[r][c] === player) {
        line.push([r, c]);
        r -= dr;
        c -= dc;
      }

      if (line.length >= 5) {
        return line;
      }
    }
    return null;
  };

  const handleCellClick = (r: number, c: number) => {
    if (board[r][c] || winner) return;

    const currentVal = isXNext ? 'X' : 'O';
    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = currentVal;
    setBoard(newBoard);
    setMoveHistory((prev) => [...prev, { r, c, val: currentVal }]);

    const winLine = checkWinner(newBoard, r, c, currentVal);
    if (winLine) {
      setWinner(currentVal);
      setWinningCells(winLine);
      setScores((prev) => ({
        ...prev,
        [currentVal === 'X' ? 'x' : 'o']: prev[currentVal === 'X' ? 'x' : 'o'] + 1,
      }));
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      return;
    }

    // Check draw
    const isFull = newBoard.every((row) => row.every((cell) => cell !== null));
    if (isFull) {
      setWinner('Draw');
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      return;
    }

    setIsXNext(!isXNext);
  };

  // Bot move (O)
  useEffect(() => {
    if (gameMode === 'bot' && !isXNext && !winner) {
      const timer = setTimeout(() => {
        makeBotMove();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isXNext, gameMode, winner, board]);

  const makeBotMove = () => {
    // Find empty cells adjacent to existing moves, or center
    const candidateMoves: { r: number; c: number; score: number }[] = [];

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (!board[r][c]) {
          let score = 0;
          // check distance to center
          const distToCenter = Math.abs(r - BOARD_SIZE / 2) + Math.abs(c - BOARD_SIZE / 2);
          score += 15 - distToCenter;

          // check neighboring pieces
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc]) {
                score += board[nr][nc] === 'O' ? 8 : 6;
              }
            }
          }

          if (score > 0) {
            candidateMoves.push({ r, c, score: score + Math.random() * 4 });
          }
        }
      }
    }

    if (candidateMoves.length > 0) {
      candidateMoves.sort((a, b) => b.score - a.score);
      const chosen = candidateMoves[0];
      handleCellClick(chosen.r, chosen.c);
    } else {
      // First move near center
      const mid = Math.floor(BOARD_SIZE / 2);
      handleCellClick(mid, mid);
    }
  };

  const resetGame = () => {
    setBoard(
      Array(BOARD_SIZE)
        .fill(null)
        .map(() => Array(BOARD_SIZE).fill(null))
    );
    setIsXNext(true);
    setWinner(null);
    setWinningCells([]);
    setMoveHistory([]);
  };

  const undoMove = () => {
    if (moveHistory.length === 0 || winner) return;
    const stepsToUndo = gameMode === 'bot' && moveHistory.length >= 2 ? 2 : 1;
    const newHistory = moveHistory.slice(0, -stepsToUndo);
    const newBoard: CellValue[][] = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(null));

    newHistory.forEach(({ r, c, val }) => {
      newBoard[r][c] = val;
    });

    setBoard(newBoard);
    setMoveHistory(newHistory);
    setIsXNext(newHistory.length % 2 === 0);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Top Header & Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
            darkMode
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              : 'bg-white border-rose-200 text-slate-700 hover:bg-rose-50'
          }`}
        >
          <ArrowLeft className="w-4 h-4 text-rose-500" />
          <span>Về Khu Trò Chơi</span>
        </button>

        {/* Notice */}
        {character ? (
          <div className="px-3 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-rose-500" />
            <span>Đang thách đấu cùng: {character.name} ({character.rarity || 'Tù nhân'})</span>
          </div>
        ) : (
          <div className="px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Chưa có nhân vật nào để chơi • Đang chạy chế độ Luyện Tập / Bot Giám Thị</span>
          </div>
        )}
      </div>

      {/* Hero card */}
      <div
        className={`p-5 rounded-3xl border shadow-lg ${
          darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-rose-100'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center font-black text-2xl shadow-md">
              #
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  TRÒ CHƠI CỜ CARO (GOMOKU)
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500">
                  Chuẩn 5 Nước Thắng
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bàn cờ 12x12 • Đấu trí căng thẳng giữa Quản Ngục và đối thủ
              </p>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setGameMode('bot');
                resetGame();
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                gameMode === 'bot'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Đấu Bot Tạm Thời
            </button>
            <button
              type="button"
              onClick={() => {
                setGameMode('pvp');
                resetGame();
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                gameMode === 'pvp'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              2 Người Chơi
            </button>
          </div>
        </div>

        {/* Players Bar */}
        <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Player X */}
          <div
            className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
              isXNext && !winner
                ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 shadow-sm ring-2 ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white font-black text-xl flex items-center justify-center shadow">
                X
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Quản Ngục (Bạn)</span>
                  {isXNext && !winner && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Thắng: {scores.x} ván</div>
              </div>
            </div>
            {isXNext && !winner && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500 text-white">
                Lượt đi
              </span>
            )}
          </div>

          {/* Player O (Opponent Slot) */}
          <div
            className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
              !isXNext && !winner
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-sm ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-300 dark:bg-slate-800 text-indigo-500 dark:text-indigo-400 font-black text-xl flex items-center justify-center border border-dashed border-slate-400 dark:border-slate-600">
                O
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="text-slate-400 italic">
                    {gameMode === 'bot' ? 'Bot Giám Thị (Tạm thời)' : 'Người chơi 2'}
                  </span>
                  {!isXNext && !winner && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  )}
                </div>
                <div className="text-[10px] text-amber-500 font-medium">
                  {gameMode === 'bot' ? '⚠️ Chưa có nhân vật' : `Thắng: ${scores.o} ván`}
                </div>
              </div>
            </div>
            {!isXNext && !winner && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500 text-white">
                Lượt đi
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Winner Announcement */}
      {winner && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-white text-center shadow-xl animate-bounce flex items-center justify-center gap-3">
          <Trophy className="w-6 h-6 animate-spin" />
          <span className="text-base font-black uppercase tracking-wider">
            {winner === 'Draw'
              ? 'HÒA CỜ! KHÔNG AI THUA CUỘC'
              : winner === 'X'
              ? '🎉 QUẢN NGỤC (X) CHIẾN THẮNG TUYỆT ĐỐI!'
              : '⚡ ĐỐI THỦ (O) ĐÃ THẮNG TRẬN NÀY!'}
          </span>
          <button
            type="button"
            onClick={resetGame}
            className="ml-3 px-3 py-1 rounded-xl bg-white text-slate-900 text-xs font-black shadow hover:bg-slate-100 cursor-pointer"
          >
            Chơi ván mới
          </button>
        </div>
      )}

      {/* Caro Board Container */}
      <div
        className={`p-4 sm:p-6 rounded-3xl border shadow-xl flex flex-col items-center justify-center ${
          darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-amber-50/40 border-amber-200/80'
        }`}
      >
        <div className="inline-block p-2 rounded-2xl bg-amber-100 dark:bg-slate-900 border-2 border-amber-300 dark:border-slate-800 shadow-inner overflow-x-auto max-w-full">
          <div
            className="grid gap-[2px] sm:gap-1 bg-amber-200 dark:bg-slate-800 p-1 rounded-xl"
            style={{
              gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
              width: 'min(92vw, 480px)',
              height: 'min(92vw, 480px)',
            }}
          >
            {board.map((row, r) =>
              row.map((cell, c) => {
                const isWinningCell = winningCells.some(([wr, wc]) => wr === r && wc === c);
                const isLastMove =
                  moveHistory.length > 0 &&
                  moveHistory[moveHistory.length - 1].r === r &&
                  moveHistory[moveHistory.length - 1].c === c;

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onClick={() => handleCellClick(r, c)}
                    disabled={!!cell || !!winner || (gameMode === 'bot' && !isXNext)}
                    className={`aspect-square rounded flex items-center justify-center font-black transition-all cursor-pointer relative ${
                      isWinningCell
                        ? 'bg-amber-400 text-slate-950 scale-105 z-10 shadow-lg ring-2 ring-white animate-pulse'
                        : cell
                        ? darkMode
                          ? 'bg-slate-950'
                          : 'bg-white'
                        : darkMode
                        ? 'bg-slate-900/90 hover:bg-slate-800'
                        : 'bg-amber-50/90 hover:bg-amber-100'
                    } ${isLastMove && !isWinningCell ? 'ring-2 ring-indigo-500' : ''}`}
                    style={{ fontSize: 'clamp(12px, 3vw, 18px)' }}
                  >
                    {cell === 'X' && (
                      <span className="text-rose-500 dark:text-rose-400 font-black animate-scaleIn">
                        X
                      </span>
                    )}
                    {cell === 'O' && (
                      <span className="text-indigo-600 dark:text-indigo-400 font-black animate-scaleIn">
                        O
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Board Controls */}
        <div className="flex items-center gap-3 mt-4">
          <button
            type="button"
            onClick={resetGame}
            className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
              darkMode
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
            <span>Ván Mới</span>
          </button>
          <button
            type="button"
            onClick={undoMove}
            disabled={moveHistory.length === 0 || !!winner}
            className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              darkMode
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5 text-indigo-500" />
            <span>Hoàn Nước Đi ({moveHistory.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
