import { ChangeEvent } from "react";
import {
  CANVAS_HEIGHT_PX,
  CANVAS_WIDTH_PX,
} from "../components/photo-editor/constants";
import { allowedFileFormats } from "../constants/photos";
import {
  MovePhotoParams,
  PhotoUploadParams,
  SetPhotoState,
} from "../components/photo-editor/interfaces";

export const usePhoto = () => {
  const initializePhotoState = (
    img: HTMLImageElement,
    setPhotoState: SetPhotoState,
  ) => {
    const scale = Math.max(
      CANVAS_WIDTH_PX / img.naturalWidth,
      CANVAS_HEIGHT_PX / img.naturalHeight,
    );

    const width = img.naturalWidth * scale;
    const height = img.naturalHeight * scale;

    const x = (CANVAS_WIDTH_PX - width) / 2;
    const y = (CANVAS_HEIGHT_PX - height) / 2;

    setPhotoState({ width, height, x, y });
  };

  const handlePhotoUpload =
    ({ setImage, setPhotoState }: PhotoUploadParams) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!allowedFileFormats.includes(file.type)) {
        alert("Allowed formats jpeg/png/gif");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          setImage(img);
          initializePhotoState(img, setPhotoState);
        };
      };
      reader.readAsDataURL(file);
    };

  const movePhoto =
    ({ photoState, setPhotoState }: MovePhotoParams) =>
    (dx: number, dy: number) => {
      if (!photoState) return;

      const minX = CANVAS_WIDTH_PX - photoState.width;
      const maxX = 0;
      const minY = CANVAS_HEIGHT_PX - photoState.height;
      const maxY = 0;

      setPhotoState({
        ...photoState,
        x: Math.min(maxX, Math.max(minX, photoState.x + dx)),
        y: Math.min(maxY, Math.max(minY, photoState.y + dy)),
      });
    };

  return {
    handlePhotoUpload,
    movePhoto,
  } as const;
};
