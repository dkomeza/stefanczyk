import React from "react";

import Item from "./Item";
import "../scss/List.scss";

function List(props: { products: Item[] }) {
  return (
    <main className="list">
      {props.products.map((product) => (
        <Item key={product.id} product={product} />
      ))}
    </main>
  );
}

export default List;
