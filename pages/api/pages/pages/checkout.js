import { useRouter } from "next/router";
import fs from "fs";
import { useEffect, useState } from "react";

export default function Checkout({ product }) {
  const router = useRouter();
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    const addPaypalSdk = async () => {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${process.env.NEXT_PUBLIC_PAYPAL_CURRENCY}`;
      script.async = true;
      script.onload = () => setSdkReady(true);
      document.body.appendChild(script);
    };
    if (!window.paypal) {
      addPaypalSdk();
    } else {
      setSdkReady(true);
    }
  }, []);

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{ amount: { value: product.price.toString() } }],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(() => {
      alert("Merci pour votre achat !");
      router.push("/");
    });
  };

  if (!product) return <p>Produit introuvable</p>;

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Acheter: {product.title}</h1>
      <p className="mb-6">{product.description}</p>
      {sdkReady ? (
        <div id="paypal-button-container"></div>
      ) : (
        <p>Chargement du paiement...</p>
      )}

      <style jsx>{`
        #paypal-button-container {
          max-width: 300px;
        }
      `}</style>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            if(window.paypal) {
              paypal.Buttons({
                createOrder: ${createOrder.toString()},
                onApprove: ${onApprove.toString()}
              }).render('#paypal-button-container');
            }
          `,
        }}
      />
    </main>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const catalog = JSON.parse(fs.readFileSync("public/catalog.json", "utf8"));
  const product = catalog.find((p) => p.id.toString() === id);
  return {
    props: { product: product || null },
  };
}
