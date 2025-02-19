export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { suffix } = req.query;

  if (!suffix) {
    return res.status(400).json({ error: "suffix is required" });
  }

  try {
    console.log("Fetching Enka API..."); // Debugging log

    const response = await fetch(`https://enka.network/api/${suffix}`, {
      headers: {
        "User-Agent": "rating-pistol-proxy/1.0",
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch Enka API:", response.status, response.statusText);
      return res.status(response.status).json({ error: "Failed to fetch Enka API" });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching Enka API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
