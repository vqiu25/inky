import { render, waitFor } from "@testing-library/react";
import GoogleSignInButton from "../GoogleSignInButton";
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";

// Mock for the global google object
beforeAll(() => {
  window.google = {
    accounts: {
      id: {
        initialize: vi.fn(),
        renderButton: vi.fn(),
      },
    },
  };
});

afterAll(() => {
  // Clean up mock to avoid leaking into other tests
  delete window.google;
});

describe("GoogleSignInButton", () => {
  it("loads the Google script and calls initialize and renderButton", async () => {
    const mockCallback = vi.fn();

    render(<GoogleSignInButton onSignInSuccess={mockCallback} />);

    // Simulate script load
    await waitFor(() => {
      // Trigger the script's onload by calling the effect manually
      const script = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]',
      ) as HTMLScriptElement;
      expect(script).toBeTruthy();
      script.onload?.(new Event("load"));
    });

    // Check that google.accounts.id.initialize and renderButton were called
    expect(window.google.accounts.id.initialize).toHaveBeenCalledWith(
      expect.objectContaining({
        client_id: expect.anything(),
        callback: mockCallback,
        ux_mode: "popup",
      }),
    );
    expect(window.google.accounts.id.renderButton).toHaveBeenCalled();
  });
});
