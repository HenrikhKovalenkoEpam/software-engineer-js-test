import { ChangeEvent } from "react";
import { useExportImport } from "../useExportImport";
import {
  CANVAS_HEIGHT_IN,
  CANVAS_HEIGHT_PX,
  CANVAS_WIDTH_IN,
  CANVAS_WIDTH_PX,
} from "../../components/photo-editor/constants";
import {
  PhotoState,
  PhotoUploadParams,
  PrintDescription,
} from "../../components/photo-editor/interfaces";

describe("useExportImport", () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;
  const originalCreateElement = document.createElement;
  const originalFileReader = global.FileReader;
  const originalImage = global.Image;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    document.createElement = originalCreateElement;
    global.FileReader = originalFileReader;
    global.Image = originalImage;
  });

  describe("handleExport", () => {
    it("does nothing when image or photoState is null", () => {
      const { handleExport } = useExportImport();

      const createObjectURLMock = jest.fn(() => "blob:mock");
      URL.createObjectURL =
        createObjectURLMock as unknown as typeof URL.createObjectURL;

      const createElementMock = jest.spyOn(document, "createElement");

      const photoState: PhotoState = {
        width: 100,
        height: 100,
        x: 0,
        y: 0,
      };
      const image = { src: "data:image/png;base64,xxx" } as HTMLImageElement;

      const exportWithoutImage = handleExport({ image: null, photoState });
      const exportWithoutState = handleExport({ image, photoState: null });

      exportWithoutImage();
      exportWithoutState();

      expect(createObjectURLMock).not.toHaveBeenCalled();
      expect(createElementMock).not.toHaveBeenCalled();
    });

    it("creates print description and triggers download", () => {
      const { handleExport } = useExportImport();

      const stringifySpy = jest.spyOn(JSON, "stringify");

      const createObjectURLMock = jest.fn(() => "blob:mock");
      const revokeObjectURLMock = jest.fn();

      URL.createObjectURL =
        createObjectURLMock as unknown as typeof URL.createObjectURL;
      URL.revokeObjectURL =
        revokeObjectURLMock as unknown as typeof URL.revokeObjectURL;

      const clickMock = jest.fn();
      jest
        .spyOn(document, "createElement")
        .mockImplementation((tagName: string): HTMLElement => {
          const element = originalCreateElement.call(document, tagName);
          if (tagName === "a") {
            (element as HTMLAnchorElement).click = clickMock;
          }
          return element;
        });

      const image = { src: "data:image/png;base64,xxx" } as HTMLImageElement;
      const photoState: PhotoState = {
        width: 300,
        height: 200,
        x: -10,
        y: -20,
      };

      const exportHandler = handleExport({ image, photoState });
      exportHandler();

      expect(createObjectURLMock).toHaveBeenCalledTimes(1);
      expect(clickMock).toHaveBeenCalledTimes(1);
      expect(revokeObjectURLMock).toHaveBeenCalledTimes(1);
      expect(stringifySpy).toHaveBeenCalled();

      const descriptionArg = stringifySpy.mock.calls[0][0] as PrintDescription;

      expect(descriptionArg.canvas.width).toBe(CANVAS_WIDTH_IN);
      expect(descriptionArg.canvas.height).toBe(CANVAS_HEIGHT_IN);
      expect(descriptionArg.canvas.photo.src).toBe(image.src);

      const pxToInchX = CANVAS_WIDTH_IN / CANVAS_WIDTH_PX;
      const pxToInchY = CANVAS_HEIGHT_IN / CANVAS_HEIGHT_PX;

      expect(descriptionArg.canvas.photo.width).toBeCloseTo(
        Number((photoState.width * pxToInchX).toFixed(4)),
      );
      expect(descriptionArg.canvas.photo.height).toBeCloseTo(
        Number((photoState.height * pxToInchY).toFixed(4)),
      );
      expect(descriptionArg.canvas.photo.x).toBeCloseTo(
        Number((photoState.x * pxToInchX).toFixed(4)),
      );
      expect(descriptionArg.canvas.photo.y).toBeCloseTo(
        Number((photoState.y * pxToInchY).toFixed(4)),
      );
    });
  });

  describe("handleImport", () => {
    it("does nothing when no file is provided", () => {
      const { handleImport } = useExportImport();

      const setImageMock = jest.fn();
      const setPhotoStateMock = jest.fn();

      const setImage: PhotoUploadParams["setImage"] = (value) => {
        if (typeof value === "function") {
          const current = null as HTMLImageElement | null;
          const next = value(current);
          setImageMock(next);
        } else {
          setImageMock(value);
        }
      };

      const setPhotoState: PhotoUploadParams["setPhotoState"] = (value) => {
        if (typeof value === "function") {
          const current = null as PhotoState | null;
          const next = value(current);
          setPhotoStateMock(next);
        } else {
          setPhotoStateMock(value);
        }
      };

      const handler = handleImport({ setImage, setPhotoState });

      const event = {
        target: { files: null },
      } as unknown as ChangeEvent<HTMLInputElement>;

      handler(event);

      expect(setImageMock).not.toHaveBeenCalled();
      expect(setPhotoStateMock).not.toHaveBeenCalled();
    });
  });
});
