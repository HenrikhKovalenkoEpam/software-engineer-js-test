import {
  CANVAS_HEIGHT_IN,
  CANVAS_HEIGHT_PX,
  CANVAS_WIDTH_IN,
  CANVAS_WIDTH_PX,
} from "../components/photo-editor/constants";
import {
  PhotoState,
  PhotoUploadParams,
  PrintDescription,
} from "../components/photo-editor/interfaces";
import { ChangeEvent } from "react";

export const useExportImport = () => {
  const handleExport =
    ({
      image,
      photoState,
    }: {
      image: HTMLImageElement | null;
      photoState: PhotoState | null;
    }) =>
    () => {
      if (!image || !photoState) return;

      const pxToInchX = CANVAS_WIDTH_IN / CANVAS_WIDTH_PX;
      const pxToInchY = CANVAS_HEIGHT_IN / CANVAS_HEIGHT_PX;

      const description: PrintDescription = {
        canvas: {
          width: CANVAS_WIDTH_IN,
          height: CANVAS_HEIGHT_IN,
          photo: {
            id: String(Date.now()),
            src: image.src,
            width: Number((photoState.width * pxToInchX).toFixed(4)),
            height: Number((photoState.height * pxToInchY).toFixed(4)),
            x: Number((photoState.x * pxToInchX).toFixed(4)),
            y: Number((photoState.y * pxToInchY).toFixed(4)),
          },
        },
      };

      const blob = new Blob([JSON.stringify(description, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "canvas-photo.json";
      link.click();
      URL.revokeObjectURL(url);
    };

  const handleImport =
    ({ setImage, setPhotoState }: PhotoUploadParams) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const raw = typeof reader.result === "string" ? reader.result : "";

        let parsed;
        try {
          parsed = JSON.parse(raw);
        } catch (err) {
          console.error("JSON parse error:", err);
          alert("Not valid JSON: parsing error");
          e.target.value = "";
          return;
        }

        const canvas = parsed.canvas;
        const photo = parsed.canvas.photo;

        const img = new Image();
        img.src = photo.src;
        img.onload = () => {
          setImage(img);

          const inchToPxX = CANVAS_WIDTH_PX / canvas.width;
          const inchToPxY = CANVAS_HEIGHT_PX / canvas.height;

          const width = photo.width * inchToPxX;
          const height = photo.height * inchToPxY;
          const x = photo.x * inchToPxX;
          const y = photo.y * inchToPxY;

          setPhotoState({ width, height, x, y });
        };

        e.target.value = "";
      };

      reader.readAsText(file);
    };

  return {
    handleImport,
    handleExport,
  };
};
