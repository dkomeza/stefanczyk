import React from "react";

import "../scss/Item.scss";

interface Item {
  id: number;
  product_url: string;
  title: string;
  slogan: string;
  description: string;
  stars: number;
  category: string;
  img_url: string;
  price: number;
}

function Item(props: { product: Item }) {
  const { product } = props;
  return (
    <div className="item">
      <img src={product.product_url} alt={product.title} />
      <h2 className="product-name">{product.title}</h2>
      <div className="desc">
        <p className="price">{product.price}</p>
        <p className="category">{product.category}</p>
      </div>
      <div className="rating-wrapper">
        <p className="rating">Rating ({product.stars})</p>
        <div className="stars">
          {[...Array(product.stars)].map((_, key) => (
            <img src={product.img_url} key={key} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Item;
export type { Item };
