import React from "react";
import Stars from "./Stars";

interface Row {
  id: number;
  desc: number;
  postTime: number;
  postPrice: number;
  buyer: number;
}

const titles = [
  "Zgodność z opisem",
  "Czas wysyłki",
  "Koszt wysyłki",
  "Obsługa kupującego",
];

function Row({
  opinion,
  fetchData,
  readonly,
}: {
  opinion: Row;
  fetchData: () => void;
  readonly: boolean;
}) {
  const dataArr = [
    opinion.desc,
    opinion.postTime,
    opinion.postPrice,
    opinion.buyer,
  ];

  if (readonly) {
  }

  const updateRating = async (rating: number, index: number) => {
    await fetch("/api/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: opinion.id,
        key: Object.keys(opinion)[index + 1],
        value: rating + 1,
      }),
    });
  };

  async function deleteRow() {
    await fetch(`/api/delete/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: opinion.id,
      }),
    });
    fetchData();
  }

  return (
    <div className="row">
      {dataArr &&
        dataArr.map((value, key) => (
          <div key={key}>
            <h2>{titles[key]}</h2>
            <Stars
              data={value}
              callback={updateRating}
              index={key}
              readonly={readonly}
            />
          </div>
        ))}
      {!readonly && <button onClick={() => deleteRow()}>Delete</button>}
    </div>
  );
}

export default Row;
export type { Row };
