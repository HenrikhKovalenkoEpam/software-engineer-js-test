import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { PhotoEditor } from "../index";
import { usePhoto } from "../../../hooks/usePhoto";
import { useExportImport } from "../../../hooks/useExportImport";

jest.mock("../../../hooks/usePhoto");
jest.mock("../../../hooks/useExportImport");

describe("PhotoEditor", () => {
  let mockHandlePhotoUploadInner: jest.Mock;
  let mockMovePhotoInner: jest.Mock;
  let mockHandleImportInner: jest.Mock;
  let mockHandleExportInner: jest.Mock;

  beforeEach(() => {
    mockHandlePhotoUploadInner = jest.fn();
    mockMovePhotoInner = jest.fn();
    mockHandleImportInner = jest.fn();
    mockHandleExportInner = jest.fn();

    (usePhoto as jest.Mock).mockReturnValue({
      handlePhotoUpload: jest.fn(() => mockHandlePhotoUploadInner),
      movePhoto: jest.fn(() => mockMovePhotoInner),
    });

    (useExportImport as jest.Mock).mockReturnValue({
      handleImport: jest.fn(() => mockHandleImportInner),
      handleExport: jest.fn(() => mockHandleExportInner),
    });
  });

  it("renders UI structure", () => {
    render(<PhotoEditor />);

    expect(screen.getByText(/photo editor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/upload photo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/import json/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /up/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /left/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /right/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /down/i })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /export json/i })).toBeDisabled();
  });

  it("handles photo upload", () => {
    render(<PhotoEditor />);

    const input = screen.getByLabelText(/upload photo/i) as HTMLInputElement;
    const file = new File(["dummy"], "photo.png", { type: "image/png" });

    fireEvent.change(input, { target: { files: [file] } });

    expect(mockHandlePhotoUploadInner).toHaveBeenCalledTimes(1);
  });

  it("handles json import", () => {
    render(<PhotoEditor />);

    const input = screen.getByLabelText(/import json/i) as HTMLInputElement;
    const file = new File(["{}"], "canvas-photo.json", {
      type: "application/json",
    });

    fireEvent.change(input, { target: { files: [file] } });

    expect(mockHandleImportInner).toHaveBeenCalledTimes(1);
  });

  it("calls movePhoto on arrow button clicks", () => {
    render(<PhotoEditor />);

    fireEvent.click(screen.getByRole("button", { name: /up/i }));
    fireEvent.click(screen.getByRole("button", { name: /left/i }));
    fireEvent.click(screen.getByRole("button", { name: /right/i }));
    fireEvent.click(screen.getByRole("button", { name: /down/i }));

    expect(mockMovePhotoInner).toHaveBeenNthCalledWith(1, 0, -10);
    expect(mockMovePhotoInner).toHaveBeenNthCalledWith(2, -10, 0);
    expect(mockMovePhotoInner).toHaveBeenNthCalledWith(3, 10, 0);
    expect(mockMovePhotoInner).toHaveBeenNthCalledWith(4, 0, 10);
  });
});
