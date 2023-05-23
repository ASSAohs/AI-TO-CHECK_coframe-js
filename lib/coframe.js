import { replaceText } from './utils';

const ENGAGED_SESSION_THRESHOLD = 10000; // 10 seconds in milliseconds

let startTime = null;
let isEngaged = false;
let isConverted = false;
let isBounced = true;
let coframeSessionIds = [];

// Retrieve variants of your copy for each coframe you've set up from Coframe
export async function getVariants(coframePageId) {
  const queryParams = new URLSearchParams({
    coframe_page_id: coframePageId,
  });

  const apiUrl = "https://coframe.ai/api/v1/retrieve_variants_page?" + queryParams.toString();

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

// Send results of the user's session (engagement, bounce, conversion, etc) to Coframe
export function sendDataToBackend(data) {
  const returnEndpointUrl = "https://coframe.ai/api/v1/session_result";

  data.session_ids = coframeSessionIds;

  fetch(returnEndpointUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).catch((error) => {
    console.error("Failed to send data:", error);
  });
}

export function measureEngagement() {
  const timeSpent = Date.now() - startTime;
  if (timeSpent >= ENGAGED_SESSION_THRESHOLD) {
    isEngaged = true;
    sendDataToBackend({ "engagement": true });
  } else {
    setTimeout(measureEngagement, ENGAGED_SESSION_THRESHOLD - timeSpent);
  }
}

export function measureConversion() {
  isConverted = true;
  isBounced = false;
  sendDataToBackend({ "conversion": true });
}

export function measureBounce() {
  if (isBounced) {
    sendDataToBackend({ "bounced": true });
  }
}

export async function initCoframe(coframePageId) {
  startTime = Date.now();
  window.addEventListener("beforeunload", measureBounce);
  document.addEventListener("visibilitychange", measureEngagement);
  document.addEventListener("conversion", measureConversion);
  setTimeout(measureEngagement, ENGAGED_SESSION_THRESHOLD);

  const variants_response = await getVariants(coframePageId);
  const variants = variants_response.variants;
  coframeSessionIds = variants_response.session_ids;

  variants.forEach(({ original, copy }) => {
    replaceText(original, copy);
  });
}

export function logCoframeConversion() {
  document.dispatchEvent(new CustomEvent('conversion', {}));
}