export default async function handler(req, res) {
  const url = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?lang=en&region=us";

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "ESPN API error" });
    }

    const data = await response.json();
    res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=60");
    return res.status(200).json(data);
  } catch (err) {
    console.error("ESPN proxy error:", err);
    return res.status(500).json({ error: "Failed to fetch ESPN data" });
  }
}