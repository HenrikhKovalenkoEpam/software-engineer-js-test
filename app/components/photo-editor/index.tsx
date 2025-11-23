import React, { useState, useRef, useEffect } from "react";
import { CANVAS_HEIGHT_PX, CANVAS_WIDTH_PX } from "./constants";
import { PhotoState } from "./interfaces";
import { useExportImport } from "../../hooks/useExportImport";
import { usePhoto } from "../../hooks/usePhoto";

export const PhotoEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [photoState, setPhotoState] = useState<PhotoState | null>(null);
  const { handleImport, handleExport } = useExportImport();
  const { handlePhotoUpload, movePhoto } = usePhoto();

  useEffect(() => {
    if (!canvasRef.current || !image || !photoState) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH_PX, CANVAS_HEIGHT_PX);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      photoState.x,
      photoState.y,
      photoState.width,
      photoState.height,
    );
  }, [image, photoState]);

  const handleMovePhoto = movePhoto({ photoState, setPhotoState });

  return (
    <div style={{ padding: 16 }}>
      <h1>Photo Editor</h1>

      <div style={{ marginBottom: 12 }}>
        <label>
          Upload photo:&nbsp;
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload({ setImage, setPhotoState })}
          />
        </label>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>
          Import JSON:&nbsp;
          <input
            type="file"
            accept="application/json"
            onChange={handleImport({ setImage, setPhotoState })}
          />
        </label>
      </div>

      <div style={{ marginBottom: 12, display: "flex", gap: 8 }}>
        <button onClick={() => handleMovePhoto(0, -10)}>Up</button>
        <button onClick={() => handleMovePhoto(-10, 0)}>Left</button>
        <button onClick={() => handleMovePhoto(10, 0)}>Right</button>
        <button onClick={() => handleMovePhoto(0, 10)}>Down</button>
        <button onClick={handleExport({ image, photoState })} disabled={!image}>
          Export JSON
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH_PX}
        height={CANVAS_HEIGHT_PX}
        style={{ border: "1px solid #ccc" }}
      />
    </div>
  );
};
