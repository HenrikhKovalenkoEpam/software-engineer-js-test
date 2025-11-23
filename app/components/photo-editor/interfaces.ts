import React from "react";

export interface PhotoState {
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface PrintDescription {
  canvas: {
    width: number;
    height: number;
    photo: {
      id: string;
      src: string;
      width: number;
      height: number;
      x: number;
      y: number;
    };
  };
}

export type SetPhotoState = React.Dispatch<
  React.SetStateAction<PhotoState | null>
>;

export interface PhotoUploadParams {
  setImage: React.Dispatch<React.SetStateAction<HTMLImageElement | null>>;
  setPhotoState: SetPhotoState;
}

export interface MovePhotoParams {
  photoState: PhotoState | null;
  setPhotoState: SetPhotoState;
}
