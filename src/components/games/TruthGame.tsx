import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  AlertTriangle,
  Activity,
  HeartPulse,
  Radio,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TruthGameProps {
  darkMode: boolean;
  onBack: () => void;
}

const DEFAULT_QUESTIONS = [
  'Bạn có từng lén nhớ đến Quản Ngục khi ở trong buồng giam tối không?',
  'Bạn có đang che giấu một bí mật nào chưa từng khai báo trong hồ sơ?',
  'Nếu có cơ hội vượt ngục ngay lúc này, bạn có rủ người bên cạnh đi cùng không?',
  'Bạn có từng nói dối để được giảm ngày giam giữ không?',
  'Trong lòng bạn, sự quản thúc ở đây đem lại cảm giác an toàn hay ngột ngạt?',
  'Bạn có rung động trước ánh mắt nghiêm khắc của Quản Ngục không?',
];

type DetectionResult = 'truth' | 'uncertain' | 'lie' | null;

export const TruthGame: React.FC<TruthGameProps> = ({ darkMode, onBack }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(DEFAULT_QUESTIONS[0]);
  const [customQuestion, setCustomQuestion] = useState('');
  const [statement, setStatement] = useState<'yes' | 'no' | 'custom'>('yes');
  const [customStatement, setCustomStatement] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [bpm, setBpm] = useState(72);
  const [stress, setStress] = useState(15);
  const [result, setResult] = useState<DetectionResult>(null);
  const [history, setHistory] = useState<
    { q: string; ans: string; res: DetectionResult; bpm: number }[]
  >([]);

  // Simulation during scan
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          const next = prev + 5;
          setBpm(70 + Math.floor(Math.random() * 85));
          setStress(Math.floor(Math.random() * 95));
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const handleStartScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setResult(null);

    setTimeout(() => {
      setIsScanning(false);
      // Random outcome
      const rand = Math.random();
      let outcome: DetectionResult = 'truth';
      let finalBpm = 75;

      if (rand < 0.4) {
        outcome = 'truth';
        finalBpm = 68 + Math.floor(Math.random() * 10);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } else if (rand < 0.7) {
        outcome = 'uncertain';
        finalBpm = 105 + Math.floor(Math.random() * 20);
      } else {
        outcome = 'lie';
        finalBpm = 145 + Math.floor(Math.random() * 30);
      }

      setResult(outcome);
      setBpm(finalBpm);
      setStress(outcome === 'truth' ? 12 : outcome === 'uncertain' ? 58 : 94);

      const qText = customQuestion.trim() || selectedQuestion;
      const ansText =
        statement === 'yes'
          ? 'CÓ (Chắc Chắn)'
          : statement === 'no'
          ? 'KHÔNG (Phủ Nhận)'
          : customStatement || 'Lời Khai Riêng';

      setHistory((prev) => [{ q: qText, ans: ansText, res: outcome, bpm: finalBpm }, ...prev.slice(0, 7)]);
    }, 2400);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
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

        <div className="px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Chưa có nhân vật nào để thẩm vấn • Đang chạy chế độ máy quét thử nghiệm</span>
        </div>
      </div>

      {/* Banner */}
      <div
        className={`p-6 rounded-3xl border shadow-xl ${
          darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-cyan-100'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-cyan-500/30">
              📊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  MÁY PHÁT HIỆN NÓI THẬT (POLYGRAPH)
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-500">
                  Thẩm Vấn Tâm Lý
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Đo sóng điện não, phân tích nhịp tim và áp lực thần kinh để vạch trần mọi lời dối trá
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Polygraph Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Question & Scanner */}
        <div
          className={`lg:col-span-2 p-6 rounded-3xl border shadow-xl space-y-6 ${
            darkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-cyan-100'
          }`}
        >
          {/* Question Selector */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-500" />
              <span>1. Chọn Câu Hỏi Thẩm Vấn</span>
            </label>
            <select
              value={selectedQuestion}
              onChange={(e) => {
                setSelectedQuestion(e.target.value);
                setCustomQuestion('');
              }}
              className={`w-full p-3 rounded-xl border text-xs font-semibold cursor-pointer outline-none transition-all ${
                darkMode
                  ? 'bg-slate-950 border-slate-700 text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {DEFAULT_QUESTIONS.map((q, idx) => (
                <option key={idx} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          {/* Statement Choice */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-500" />
              <span>2. Câu Trả Lời Của Đối Tượng</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatement('yes')}
                className={`py-2.5 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                  statement === 'yes'
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                CÓ (Đúng vậy)
              </button>
              <button
                type="button"
                onClick={() => setStatement('no')}
                className={`py-2.5 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                  statement === 'no'
                    ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                KHÔNG (Phủ nhận)
              </button>
              <button
                type="button"
                onClick={() => setStatement('custom')}
                className={`py-2.5 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                  statement === 'custom'
                    ? 'bg-cyan-500 text-white border-cyan-500 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Tự khai báo...
              </button>
            </div>
            {statement === 'custom' && (
              <input
                type="text"
                placeholder="Nhập lời khai cụ thể của đối tượng..."
                value={customStatement}
                onChange={(e) => setCustomStatement(e.target.value)}
                className={`w-full mt-2 p-2.5 rounded-xl border text-xs outline-none ${
                  darkMode
                    ? 'bg-slate-950 border-slate-700 text-white'
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              />
            )}
          </div>

          {/* Polygraph Waveform Monitor */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 text-cyan-400 space-y-3 font-mono shadow-inner">
            <div className="flex items-center justify-between text-[11px] border-b border-cyan-500/20 pb-2">
              <span className="flex items-center gap-1.5 font-bold">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                POLYGRAPH BIO-SENSOR #07
              </span>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>

            {/* ECG animated SVG wave */}
            <div className="h-20 w-full overflow-hidden relative flex items-center">
              <svg viewBox="0 0 400 80" className="w-full h-full text-cyan-400">
                <path
                  d="M 0 40 L 40 40 L 50 20 L 60 60 L 70 40 L 120 40 L 130 15 L 140 65 L 150 40 L 220 40 L 230 10 L 240 70 L 250 40 L 320 40 L 330 25 L 340 55 L 350 40 L 400 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={isScanning ? 'animate-pulse' : ''}
                />
              </svg>
            </div>

            {/* Meters */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-500 animate-ping" />
                  Nhịp tim (BPM):
                </span>
                <span className="text-base font-black text-rose-400">{bpm}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Áp lực (Stress):</span>
                <span
                  className={`text-base font-black ${
                    stress > 70 ? 'text-rose-400' : stress > 40 ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {stress}%
                </span>
              </div>
            </div>
          </div>

          {/* Trigger Scan Button */}
          <button
            type="button"
            onClick={handleStartScan}
            disabled={isScanning}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 hover:from-cyan-600 hover:to-blue-700 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Activity className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? `Đang Phân Tích Sóng Não (${scanProgress}%)...` : 'BẮT ĐẦU QUÉT ĐỘ THÀNH THẬT'}</span>
          </button>
        </div>

        {/* Right Col: Result & Verdict */}
        <div className="space-y-4">
          {/* Active Result Box */}
          {result ? (
            <div
              className={`p-6 rounded-3xl border shadow-xl animate-scaleIn text-center space-y-4 ${
                result === 'truth'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                  : result === 'uncertain'
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200'
                  : 'bg-rose-500/10 border-rose-500/40 text-rose-900 dark:text-rose-200'
              }`}
            >
              <div className="inline-block p-4 rounded-full bg-white dark:bg-slate-900 shadow-md">
                {result === 'truth' && <CheckCircle2 className="w-12 h-12 text-emerald-500" />}
                {result === 'uncertain' && <HelpCircle className="w-12 h-12 text-amber-500" />}
                {result === 'lie' && <ShieldAlert className="w-12 h-12 text-rose-500 animate-bounce" />}
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  KẾT QUẢ PHÂN TÍCH
                </span>
                <h3 className="text-xl font-black mt-1">
                  {result === 'truth' && 'CHÂN THẬT 100%'}
                  {result === 'uncertain' && 'NGHI VẤN 50%'}
                  {result === 'lie' && 'DỐI TRÁ TRẮNG TRỢN!'}
                </h3>
              </div>

              <p className="text-xs leading-relaxed opacity-90">
                {result === 'truth' &&
                  'Nhịp tim ổn định và sóng điện não hoàn toàn phẳng. Đối tượng không có bất kỳ dấu hiệu căng thẳng hay che giấu nào.'}
                {result === 'uncertain' &&
                  'Nhịp tim có dao động thất thường và đồng tử hơi co giãn. Có thể đối tượng đang nói nửa sự thật hoặc ngập ngừng.'}
                {result === 'lie' &&
                  'Còi báo động hú vang! Áp lực thần kinh tăng vọt đột ngột, phản xạ cơ giật. Đối tượng hoàn toàn dối trá!'}
              </p>
            </div>
          ) : (
            <div
              className={`p-6 rounded-3xl border text-center shadow-md ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100'
              }`}
            >
              <Activity className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-400">Chờ lệnh quét</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Bấm nút "Bắt Đầu Quét" để tiến hành thẩm vấn tâm lý.
              </p>
            </div>
          )}

          {/* History */}
          <div
            className={`p-5 rounded-3xl border shadow-md space-y-3 ${
              darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100'
            }`}
          >
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Nhật Ký Thẩm Vấn Gần Đây
            </h4>
            {history.length === 0 ? (
              <div className="text-xs text-slate-400 italic text-center py-4">
                Chưa có phiên quét nào được ghi lại
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] space-y-1"
                  >
                    <div className="text-slate-800 dark:text-slate-200 font-medium truncate">
                      {h.q}
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Đáp: {h.ans}</span>
                      <span
                        className={`font-black ${
                          h.res === 'truth'
                            ? 'text-emerald-500'
                            : h.res === 'uncertain'
                            ? 'text-amber-500'
                            : 'text-rose-500'
                        }`}
                      >
                        {h.res === 'truth' ? 'Thật' : h.res === 'uncertain' ? 'Nghi vấn' : 'Dối trá'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
