export interface ProviderRecord {
  id: number;
  name: string;
  api_url: string;
  api_key: string;
  status: string;
  balance?: number | null;
  priority?: number | null;
}

export interface ProviderOrderResult {
  providerOrderId: string;
  rawResponse: unknown;
}

function normalizeProviderError(value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    if (typeof record.error === "string") {
      return record.error;
    }

    if (typeof record.message === "string") {
      return record.message;
    }

    if (typeof record.details === "string") {
      return record.details;
    }

    if (Array.isArray(record.error)) {
      return record.error.join(", ");
    }
  }

  return null;
}

function extractProviderOrderId(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const candidate =
    record.order ?? record.order_id ?? record.id ?? record.request_id;

  if (candidate === undefined || candidate === null) {
    return null;
  }

  const value = String(candidate).trim();
  return value === "" ? null : value;
}

export async function submitOrderToProvider(
  provider: ProviderRecord,
  providerServiceId: string,
  link: string,
  quantity: number
): Promise<ProviderOrderResult> {
  const body = new URLSearchParams({
    key: provider.api_key,
    action: "add",
    service: providerServiceId,
    link,
    quantity: String(quantity),
  });

  let response: Response;

  try {
    response = await fetch(provider.api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Provider network error: ${message}`);
  }

  const rawText = await response.text();
  let payload: unknown = rawText;

  try {
    payload = JSON.parse(rawText);
  } catch {
    // Keep raw text for error reporting.
  }

  if (!response.ok) {
    const providerMessage = normalizeProviderError(payload) ?? rawText;
    throw new Error(
      `Provider rejected request: ${providerMessage}`
    );
  }

  const providerError = normalizeProviderError(payload);
  if (providerError) {
    throw new Error(`Provider error: ${providerError}`);
  }

  const providerOrderId = extractProviderOrderId(payload);
  if (!providerOrderId) {
    throw new Error(
      `Invalid provider response: missing order identifier. Response: ${rawText}`
    );
  }

  return {
    providerOrderId,
    rawResponse: payload,
  };
}
