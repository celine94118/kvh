export async function getServerSideProps() {
  const filePath = path.join(process.cwd(), 'public', 'catalog.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const products = JSON.parse(jsonData);

  return {
    props: { products },
  };
}
