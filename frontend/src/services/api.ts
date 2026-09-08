import type {
  AskRequest,
  AskResponse,
} from "../types";

const API_BASE_URL = "http://127.0.0.1:8000";

export async function askRuleGuard(
  question: string
): Promise<AskResponse> {
  const payload: AskRequest = {
    question,
  };

  let response: Response;

  try {
    response = await fetch("/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    response = await fetch(`${API_BASE_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }

  if (!response.ok) {
    let message = `Backend returned HTTP ${response.status}`;

    try {
      const errorData = await response.json();

      if (errorData?.detail) {
        message = String(errorData.detail);
      }
    } catch {
      // Keep the default message.
    }

    throw new Error(message);
  }

  const data = await response.json();

  return data as AskResponse;
}

export async function checkBackendConnection(): Promise<boolean> {
  try {
    const response = await fetch("/health", {
      method: "GET",
    });

    if (response.ok) {
      return true;
    }
  } catch {
    // Try direct backend URL below.
  }

  try {
    const response = await fetch(`${API_BASE_URL}/docs`, {
      method: "GET",
    });

    return response.ok;
  } catch {
    return false;
  }
}