/**
 * Extracts YouTube video ID from a full URL or returns the value if it's already just an ID.
 * Supports: watch?v=, youtu.be/, embed/, and raw 11-char ID.
 */
export function getYoutubeVideoId(urlOrId) {
  if (!urlOrId || typeof urlOrId !== "string") return null;
  const s = urlOrId.trim();
  if (!s) return null;
  // Already just an ID (typical 11 chars, no slashes)
  if (/^[\w-]{10,12}$/.test(s) && !s.includes("/") && !s.includes("=")) return s;
  try {
    // youtu.be/VIDEO_ID
    const beMatch = s.match(/(?:youtu\.be\/)([\w-]{10,12})(?:\?|$)/i);
    if (beMatch) return beMatch[1];
    // youtube.com/embed/VIDEO_ID or watch?v=VIDEO_ID
    const url = new URL(s.startsWith("http") ? s : `https://${s}`);
    if (url.hostname.replace("www.", "") === "youtube.com") {
      const v = url.searchParams.get("v");
      if (v) return v;
      const embedMatch = url.pathname.match(/\/embed\/([\w-]{10,12})/);
      if (embedMatch) return embedMatch[1];
    }
    if (url.hostname === "youtu.be") {
      const id = url.pathname.slice(1).split("?")[0];
      if (id) return id;
    }
  } catch (_) {}
  return null;
}
