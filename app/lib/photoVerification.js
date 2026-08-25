// Mock stand-in for a real vision/OCR API (e.g. a vision-capable LLM call, or a dedicated
// OCR service like Google Cloud Vision) that would read the distance/time shown in an
// athlete's screenshot of their run app or watch face.
//
// TODO(real API): wire this up to an actual vision endpoint before relying on this for real
// verification — this needs a real API key/endpoint (and should run server-side, not with a
// client-exposed key, since it'll be handling user-uploaded images). Until then this returns
// a deterministic fake reading derived from the image bytes, purely so the surrounding
// confirm / needs-review flow has something to react to. Callers only depend on the
// { detectedValue, detectedTime, confidence } shape below, so swapping the body out for a
// real call later shouldn't require touching any caller.
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export async function analyzePhoto(imageDataUrl) {
  await new Promise((resolve) => setTimeout(resolve, 700)); // simulate network latency

  const hash = hashString(imageDataUrl.slice(0, 8000));

  // Simulates a photo that's too blurry/cropped for the stats to be read at all. Real OCR
  // fails this way too — the caller must treat it as "needs review", never a silent drop.
  if (hash % 7 === 0) {
    return { detectedValue: null, detectedTime: null, confidence: 0 };
  }

  const detectedValue = Math.round((hash % 6000) / 10) / 10; // fake mileage reading, one decimal
  return { detectedValue, detectedTime: null, confidence: 0.82 };
}

// Shared tolerance check so the modal and any future re-verification path agree on what
// "close enough" means.
export function valuesMatch(entered, detected, { relativeTolerance = 0.1, minTolerance = 0.3 } = {}) {
  if (detected == null || Number.isNaN(detected)) return false;
  const tolerance = Math.max(minTolerance, Math.abs(entered) * relativeTolerance);
  return Math.abs(entered - detected) <= tolerance;
}
