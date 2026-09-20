/**
 * AI Referral Tracking Script
 * Tracks visits from AI search engines (ChatGPT, Perplexity, Claude, etc.)
 * Add to your analytics setup or use as a standalone tracker.
 *
 * Usage:
 * 1. Include this script in your layout or pages
 * 2. Or use the API endpoint: POST /api/track-ai-referral
 */

export function trackAIReferral() {
  if (typeof window === "undefined") return;

  const referrer = document.referrer;
  const userAgent = navigator.userAgent;

  const aiPatterns = [
    { name: "ChatGPT", patterns: ["chatgpt.com", "openai.com"] },
    { name: "Perplexity", patterns: ["perplexity.ai", "perplexity"] },
    { name: "Claude", patterns: ["claude.ai", "anthropic.com"] },
    { name: "Gemini", patterns: ["gemini.google.com", "bard.google.com"] },
    { name: "You.com", patterns: ["you.com"] },
    { name: "Phind", patterns: ["phind.com"] },
    { name: "Kagi", patterns: ["kagi.com"] },
  ];

  let detectedAI: string | null = null;

  // Check referrer
  for (const ai of aiPatterns) {
    if (ai.patterns.some((p) => referrer.toLowerCase().includes(p))) {
      detectedAI = ai.name;
      break;
    }
  }

  // Check user agent for AI bots
  if (!detectedAI) {
    const botPatterns = [
      { name: "ChatGPT-User", pattern: "ChatGPT-User" },
      { name: "OAI-SearchBot", pattern: "OAI-SearchBot" },
      { name: "ClaudeBot", pattern: "ClaudeBot" },
      { name: "PerplexityBot", pattern: "PerplexityBot" },
      { name: "Anthropic-ai", pattern: "Anthropic-ai" },
      { name: "Google-Extended", pattern: "Google-Extended" },
      { name: "Bingbot", pattern: "Bingbot" },
    ];

    for (const bot of botPatterns) {
      if (userAgent.includes(bot.pattern)) {
        detectedAI = bot.name;
        break;
      }
    }
  }

  if (detectedAI) {
    // Store in sessionStorage for this session
    const data = {
      ai: detectedAI,
      referrer,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    const existing = JSON.parse(sessionStorage.getItem("ai_referrals") || "[]");
    existing.push(data);
    sessionStorage.setItem("ai_referrals", JSON.stringify(existing));

    // Send to analytics endpoint if available
    try {
      const gtag = (window as unknown as Record<string, (...args: unknown[]) => void>).gtag;
      if (typeof gtag === "function") {
        gtag("event", "ai_referral", {
          ai_source: detectedAI,
          page_path: window.location.pathname,
        });
      }
    } catch {
      // gtag not available
    }
  }
}

// Auto-track on load
if (typeof window !== "undefined") {
  window.addEventListener("load", trackAIReferral);
}
