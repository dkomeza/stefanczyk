import React, { useEffect, useState } from "react";

import full from "./assets/star-full.png";
import empty from "./assets/star-empty.jpg";

const desc = ["a", "B", "C", "d", "e"];

function Stars({
  data,
  callback,
  index,
  readonly,
}: {
  data: number;
  callback: (index1: number, index: number) => void;
  index: number;
  readonly: boolean;
}) {
  const [stars, setStars] = useState([0, 0, 0, 0, 0] as number[]);
  const [ind, setInd] = useState(data - 1);
  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 5; i++) {
      if (i < data) {
        arr[i] = 1;
      } else {
        arr[i] = 0;
      }
    }
    setStars(arr);
  }, []);

  const handleClick = (index1: number) => {
    if (readonly) return;
    setInd(index1);
    setStars((stars) => {
      const copy = [...stars];
      for (let i = 0; i < stars.length; i++) {
        if (i <= index1) {
          copy[i] = 1;
        } else {
          copy[i] = 0;
        }
      }
      return copy;
    });
    callback(index1, index);
  };

  return (
    <div className="stars">
      {stars &&
        stars.map((value, key) => (
          <div className="star" key={key} onClick={() => handleClick(key)}>
            {value === 1 && <img src={full} />}
            {value === 0 && <img src={empty} />}
          </div>
        ))}
      {desc[ind]}
    </div>
  );
}

export default Stars;
