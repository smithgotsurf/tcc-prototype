import { useRef, useEffect, useState, useCallback } from "react";

export default function SignaturePad({ onChange }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isDrawing = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ w: 300, h: 160 });

  // Resize canvas to match container width at device pixel ratio
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const update = () => {
      const w = container.clientWidth;
      setCanvasSize({ w, h: 160 });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Redraw canvas resolution when size changes (clears canvas)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize.w * dpr;
    canvas.height = canvasSize.h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    // If there was a signature, it's now cleared by resize
    if (hasSignature) {
      setHasSignature(false);
      onChange?.(false);
    }
  }, [canvasSize.w, canvasSize.h]); // intentionally omit hasSignature/onChange to avoid loop

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = useCallback((e) => {
    isDrawing.current = true;
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    canvasRef.current.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    ctx.strokeStyle = "#4A4A4A";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    if (!hasSignature) {
      setHasSignature(true);
      onChange?.(true);
    }
  }, [hasSignature, onChange]);

  const handlePointerUp = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHasSignature(false);
    onChange?.(false);
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          width: "100%",
          height: 160,
          background: "#fff",
          border: "1px solid #E0DCD0",
          borderRadius: 8,
          cursor: "crosshair",
          touchAction: "none",
          display: "block",
        }}
      />
      {/* Placeholder text */}
      {!hasSignature && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 160,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#AAAAAA",
            fontSize: 14,
            pointerEvents: "none",
          }}
        >
          Sign here
        </div>
      )}
      {/* Clear button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
        <button
          type="button"
          onClick={clearCanvas}
          style={{
            background: "none",
            border: "none",
            color: "#999",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            padding: "4px 8px",
          }}
        >
          Clear Signature
        </button>
      </div>
    </div>
  );
}
