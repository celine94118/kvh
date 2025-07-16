import fs from "fs";
import Link from "next/link";

export default function Home({ catalog }) {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">AIDigitalForge - Produits numériques</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {catalog.map((product) => (
          <div key={product.id} className="border rounded p-4 shadow">
            <h2 className="text-xl font-semibold">{product.title}</h2>
            <p className="mt-2">{product.description}</p>
            <p className="mt-4 font-bold text-green-600">{product.price} €</p>
            <Link
              href={`/checkout?id=${product.id}`}
              className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded"
            >
              Acheter
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}

export async function getStaticProps() {
  const catalog = JSON.parse(fs.readFileSync("public/catalog.json", "utf8"));
  return { props: { catalog } };
}
