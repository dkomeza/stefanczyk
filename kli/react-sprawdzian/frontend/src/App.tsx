import { useEffect, useState } from "react";
import Row from "./Row";
import "./style.scss";

function App() {
  const [opinions, setOpinions] = useState([] as Row[]);
  const [average, setAverage] = useState({
    id: -1,
    desc: 2,
    postTime: 2,
    postPrice: 2,
    buyer: 2,
  });
  useEffect(() => {
    fetch("/api/")
      .then((res) => res.json())
      .then((data) => setOpinions(data));
  }, []);
  async function add() {
    await fetch("/api/add", {
      method: "POST",
    });
    fetch("/api/")
      .then((res) => res.json())
      .then((data) => setOpinions(data));
  }
  async function fetchData() {
    await fetch("/api/")
      .then((res) => res.json())
      .then((data) => setOpinions(data));

    avg();
  }

  useEffect(() => {
    avg();
  }, [opinions]);

  function avg() {
    console.log(average);
    const sum = { id: -1, desc: 0, postTime: 0, postPrice: 0, buyer: 0 };
    for (let i = 0; i < opinions.length; i++) {
      sum.desc += opinions[i].desc;
      sum.postTime += opinions[i].postTime;
      sum.postPrice += opinions[i].postPrice;
      sum.buyer += opinions[i].buyer;
    }
    sum.desc = Math.floor(sum.desc / opinions.length);
    sum.postTime = Math.floor(sum.postTime / opinions.length);
    sum.postPrice = Math.floor(sum.postPrice / opinions.length);
    sum.buyer = Math.floor(sum.buyer / opinions.length);
    setAverage({ ...average, ...sum });
  }
  return (
    <div className="App">
      <button onClick={add}>Add new</button>
      {opinions &&
        opinions.map((opinion, key) => (
          <div key={key}>
            <Row opinion={opinion} fetchData={fetchData} readonly={false} />
          </div>
        ))}
      <div>
        <br />
        <br />
        avg
        <Row opinion={average} fetchData={fetchData} readonly={true} />
      </div>
    </div>
  );
}

export default App;
