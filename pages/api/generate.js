import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI();

export default async function handler(req, res) {
  if (req.query.secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content:
            "Donne un titre et une courte description d’un produit numérique tendance à vendre. Format: titre ligne 1, description lignes suivantes.",
        },
      ],
    });

    const text = completion.choices[0].message.content;
    const [title, ...desc] = text.split("\n");
    const catalogPath = path.join(process.cwd(), "public/catalog.json");
    const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));

    catalog.push({
      id: Date.now(),
      title: title.trim(),
      description: desc.join(" ").trim(),
      price: 9.99,
    });

    fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message || "Error generating product" });
  }
}
