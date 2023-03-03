import { useEffect, useState } from "react";

import List from "./components/List";
import { Item } from "./components/Item";

function App() {
  const [products, setProducts] = useState<Item[]>();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="App">
      {products && <List products={products} />}
      {!products && <div>Loading...</div>}
    </div>
  );
}

export default App;
