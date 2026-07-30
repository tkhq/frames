/**
 * Best-effort telemetry distinguishing modern MessageChannel clients from
 * legacy direct-postMessage clients (@turnkey/iframe-stamper < 2.1.0). This
 * exists to size and monitor the legacy migration for INT-697. It must never
 * interfere with the export/signing flow: failures are swallowed and nothing
 * is sent unless the deployment templates an endpoint into the page.
 */

export const CHANNEL_MESSAGE_CHANNEL = "message_channel";
export const CHANNEL_LEGACY_POST_MESSAGE = "legacy_post_message";

const TELEMETRY_ENDPOINT_META_NAME = "turnkey-telemetry-endpoint";
const TELEMETRY_ENDPOINT_PLACEHOLDER = "__TURNKEY_TELEMETRY_ENDPOINT__";
const VALID_CHANNELS = new Set([
  CHANNEL_MESSAGE_CHANNEL,
  CHANNEL_LEGACY_POST_MESSAGE,
]);
const reportedChannelsByWindow = new WeakMap();

function getTelemetryEndpoint() {
  if (typeof document === "undefined") {
    return null;
  }
  const meta = document.querySelector(
    `meta[name="${TELEMETRY_ENDPOINT_META_NAME}"]`
  );
  if (
    !meta ||
    !meta.content ||
    meta.content === TELEMETRY_ENDPOINT_PLACEHOLDER
  ) {
    return null;
  }
  return meta.content;
}

/**
 * Records the communication channel selected by one iframe document. Each
 * channel is reported at most once per document so arbitrary embedders cannot
 * amplify telemetry by sending repeated operations.
 * @param {string} channel CHANNEL_MESSAGE_CHANNEL or CHANNEL_LEGACY_POST_MESSAGE
 * @param {string} [parentOrigin] origin of the embedding document, if known
 */
export function recordChannelTelemetry(channel, parentOrigin) {
  try {
    if (!VALID_CHANNELS.has(channel) || typeof window === "undefined") {
      return;
    }

    const endpoint = getTelemetryEndpoint();
    if (
      !endpoint ||
      typeof navigator === "undefined" ||
      typeof navigator.sendBeacon !== "function"
    ) {
      return;
    }

    let reportedChannels = reportedChannelsByWindow.get(window);
    if (!reportedChannels) {
      reportedChannels = new Set();
      reportedChannelsByWindow.set(window, reportedChannels);
    }
    if (reportedChannels.has(channel)) {
      return;
    }

    const payload = JSON.stringify({
      frame: "export-and-sign",
      channel,
      parentOrigin: parentOrigin || null,
      timestamp: new Date().toISOString(),
    });
    const accepted = navigator.sendBeacon(
      endpoint,
      new Blob([payload], { type: "application/json" })
    );
    if (accepted !== false) {
      reportedChannels.add(channel);
    }
  } catch {
    // Telemetry must never break the signing flow; drop the sample.
  }
}
