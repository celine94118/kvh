import fs from "fs";

export default function Admin({ catalog, secret }) {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <p>Total produits générés : {catalog.length}</p>
      <p>Revenu potentiel (à 9.99€ / produit) : {(catalog.length * 9.99).toFixed(2)} €</p>
      <a
        href={`/api/generate?secret=${secret}`}
        className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Générer un produit numérique manuellement
      </a>
    </main>
  );
}

export async function getServerSideProps({ query }) {
  if (query.secret !== process.env.ADMIN_SECRET) {
    return { notFound: true };
  }
  const catalog = JSON.parse(fs.readFileSync("public/catalog.json", "utf8"));
  return { props: { catalog, secret: query.secret } };
}
