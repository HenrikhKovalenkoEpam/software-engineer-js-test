import { ChangeEvent } from "react";
import { usePhoto } from "../usePhoto";
import {
  CANVAS_HEIGHT_PX,
  CANVAS_WIDTH_PX,
} from "../../components/photo-editor/constants";
import {
  PhotoState,
  SetPhotoState,
} from "../../components/photo-editor/interfaces";

describe("usePhoto", () => {
  const mockAlert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = mockAlert as unknown as typeof alert;
  });

  describe("movePhoto", () => {
    it("returns early when photoState is null", () => {
      const setPhotoState = jest.fn<
        ReturnType<SetPhotoState>,
        Parameters<SetPhotoState>
      >();
      const { movePhoto } = usePhoto();

      const move = movePhoto({ photoState: null, setPhotoState });
      move(10, 10);

      expect(setPhotoState).not.toHaveBeenCalled();
    });

    it("clamps movement to minimum values", () => {
      const setPhotoState = jest.fn<
        ReturnType<SetPhotoState>,
        Parameters<SetPhotoState>
      >();
      const photoState: PhotoState = {
        width: CANVAS_WIDTH_PX * 2,
        height: CANVAS_HEIGHT_PX * 2,
        x: 0,
        y: 0,
      };

      const { movePhoto } = usePhoto();
      const move = movePhoto({ photoState, setPhotoState });

      move(-9999, -9999);

      const newState = setPhotoState.mock.calls[0][0] as PhotoState;
      expect(newState.x).toBe(CANVAS_WIDTH_PX - photoState.width);
      expect(newState.y).toBe(CANVAS_HEIGHT_PX - photoState.height);
    });

    it("clamps movement to maximum values", () => {
      const setPhotoState = jest.fn<
        ReturnType<SetPhotoState>,
        Parameters<SetPhotoState>
      >();
      const photoState: PhotoState = {
        width: 200,
        height: 200,
        x: -100,
        y: -100,
      };

      const { movePhoto } = usePhoto();
      const move = movePhoto({ photoState, setPhotoState });

      move(9999, 9999);

      const newState = setPhotoState.mock.calls[0][0] as PhotoState;
      expect(newState.x).toBe(0);
      expect(newState.y).toBe(0);
    });
  });

  describe("handlePhotoUpload", () => {
    it("does nothing when file is missing", () => {
      const setImage = jest.fn();
      const setPhotoState = jest.fn<
        ReturnType<SetPhotoState>,
        Parameters<SetPhotoState>
      >();

      const { handlePhotoUpload } = usePhoto();
      const handler = handlePhotoUpload({ setImage, setPhotoState });

      const event = {
        target: { files: null },
      } as unknown as ChangeEvent<HTMLInputElement>;

      handler(event);

      expect(setImage).not.toHaveBeenCalled();
      expect(setPhotoState).not.toHaveBeenCalled();
    });

    it("shows alert when file format is not allowed", () => {
      const setImage = jest.fn();
      const setPhotoState = jest.fn<
        ReturnType<SetPhotoState>,
        Parameters<SetPhotoState>
      >();

      const { handlePhotoUpload } = usePhoto();
      const handler = handlePhotoUpload({ setImage, setPhotoState });

      const file = new File(["dummy"], "file.txt", { type: "text/plain" });
      const event = {
        target: { files: [file] },
      } as unknown as ChangeEvent<HTMLInputElement>;

      handler(event);

      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(setImage).not.toHaveBeenCalled();
      expect(setPhotoState).not.toHaveBeenCalled();
    });
  });
});
