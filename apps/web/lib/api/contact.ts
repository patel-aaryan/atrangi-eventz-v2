/**
 * API Client for Contact Form
 */

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface ContactFormResponse {
  message: string;
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

/**
 * Submit contact form data
 * @param data - Contact form data (name, email, message)
 * @returns Success message
 */
export async function submitContactForm(
  data: ContactFormData,
): Promise<ContactFormResponse> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiErrorResponse = await response
      .json()
      .catch(() => ({ message: "Failed to send message. Please try again." }));
    throw new Error(
      error.message ||
        error.error ||
        "Failed to send message. Please try again.",
    );
  }

  return await response.json();
}
