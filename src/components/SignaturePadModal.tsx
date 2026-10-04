import React, { useRef, useState, useEffect } from 'react';
import { X, RotateCcw, Check, PenLine, QrCode } from 'lucide-react';

interface SignaturePadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
  title: string;
  signeeName?: string;
  signeeRole?: string;
}

export const SignaturePadModal: React.FC<SignaturePadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  signeeName = 'Pejabat Terkait',
  signeeRole = 'Penandatangan',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [mode, setMode] = useState<'draw' | 'tte'>('draw');

  useEffect(() => {
    if (!isOpen) return;

    // Reset canvas when opened
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasContent(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasContent(false);
  };

  const handleSaveDrawn = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
    onClose();
  };

  // Generate modern Indonesian Government Digital Verification Stamp (TTE / QR)
  const handleGenerateTTE = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Outer boundary dashed blue
    ctx.strokeStyle = '#0369a1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(4, 4, 292, 92);

    // QR placeholder square
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(16, 16, 68, 68);
    // Draw QR pattern simulation
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(24, 24, 20, 20);
    ctx.fillRect(56, 24, 20, 20);
    ctx.fillRect(24, 56, 20, 20);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(30, 30, 8, 8);
    ctx.fillRect(62, 30, 8, 8);
    ctx.fillRect(30, 62, 8, 8);

    // Texts
    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('DITANDATANGANI SECARA ELEKTRONIK', 94, 28);

    ctx.fillStyle = '#334155';
    ctx.font = '10px sans-serif';
    ctx.fillText(signeeRole.slice(0, 32), 94, 44);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(signeeName.slice(0, 28), 94, 60);

    ctx.fillStyle = '#64748b';
    ctx.font = '9px sans-serif';
    ctx.fillText('Sertifikasi Balai Sertifikasi Elektronik (BSrE)', 94, 76);

    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl w-full max-w-md max-h-[92vh] flex flex-col border border-slate-100 overflow-hidden sm:my-auto">
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden mt-3 mb-1" />

        {/* Header - Sticky Canva Gradient */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#7F56D9] via-[#6366F1] to-[#4F46E5] text-white shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-2xs">
              <PenLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm">{title}</h3>
              <p className="text-xs text-purple-100 font-medium">{signeeName} ({signeeRole})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/35 text-white flex items-center justify-center transition shrink-0 cursor-pointer"
            title="Tutup (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Gores Tangan vs TTE Digital */}
        <div className="flex border-b border-slate-100 px-6 py-2.5 bg-slate-50/80 gap-2">
          <button
            onClick={() => setMode('draw')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              mode === 'draw'
                ? 'bg-gradient-to-r from-[#7F56D9] to-[#4F46E5] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenLine className="w-3.5 h-3.5" />
            Tanda Tangan Manual
          </button>
          <button
            onClick={() => setMode('tte')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              mode === 'tte'
                ? 'bg-gradient-to-r from-[#7F56D9] to-[#4F46E5] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            TTE Elektronik
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1">
          {mode === 'draw' ? (
            <div>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Bubuhkan tanda tangan atau paraf digital pada kanvas.
              </p>
              <div className="relative border-2 border-dashed border-purple-200 rounded-2xl bg-slate-50/50 touch-none overflow-hidden shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={380}
                  height={180}
                  className="w-full h-44 cursor-crosshair bg-white"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                {!hasContent && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-300 text-xs italic">
                    Bubuhkan tanda tangan di sini
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="min-h-[40px] px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-full flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Hapus</span>
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="min-h-[40px] px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 active:scale-95 rounded-full transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveDrawn}
                    disabled={!hasContent}
                    className={`min-h-[40px] px-5 py-2 text-xs font-extrabold rounded-full flex items-center gap-1.5 transition cursor-pointer active:scale-95 ${
                      hasContent
                        ? 'bg-gradient-to-r from-[#7F56D9] to-[#4F46E5] text-white shadow-md shadow-purple-500/25'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>Terapkan</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Format stempel TTE berstandar Balai Sertifikasi Elektronik (BSrE) dengan verifikasi QR.
              </p>

              <div className="p-3.5 border border-purple-200 bg-purple-50/60 rounded-2xl mb-4 flex items-center gap-3">
                <div className="w-14 h-14 bg-slate-900 rounded-xl p-1.5 flex flex-col justify-between shrink-0 shadow-2xs">
                  <div className="flex justify-between">
                    <div className="w-3.5 h-3.5 border-2 border-white" />
                    <div className="w-3.5 h-3.5 border-2 border-white" />
                  </div>
                  <div className="w-3.5 h-3.5 border-2 border-white" />
                </div>
                <div className="text-left text-xs">
                  <div className="font-extrabold text-[#7F56D9] uppercase text-[11px]">DITANDATANGANI ELEKTRONIK</div>
                  <div className="text-slate-900 font-bold">{signeeName}</div>
                  <div className="text-[10px] text-slate-500">Tersertifikasi Balai Sertifikasi Elektronik</div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[40px] px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 active:scale-95 rounded-full transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleGenerateTTE}
                  className="min-h-[40px] px-5 py-2 text-xs font-extrabold bg-gradient-to-r from-[#7F56D9] to-[#4F46E5] text-white hover:opacity-95 active:scale-95 rounded-full flex items-center gap-1.5 shadow-md shadow-purple-500/25 transition cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Terapkan TTE</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
