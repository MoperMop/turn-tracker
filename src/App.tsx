import { useEffect, useState } from "react";

export default function App() {
  return <TurnTracker />;
}


const newId = (() => {
  let id = 0;
  return () => id++;
})()
function newItem(name: string): Item {
  return [name, newId()];
}
type Item = [string, number]


const savedRotation = (localStorage.getItem("rotation") as string)?.split("\n")
  .map(item => newItem(item)) ?? [];


function TurnTracker() {
  const [rotation, setRotation] = useState(savedRotation);
  useEffect(() => {
    if (rotation.length === 0) localStorage.removeItem("rotation");
    else localStorage.rotation = rotation.map(([item]) => item).join("\n");
  }, [rotation]);

  function rotate() {
    setRotation([...rotation.slice(1), rotation[0]])
  }


  const [newItemName, setNewItemName] = useState("");
  function addNewItem() {
    setRotation([...rotation, newItem(newItemName)]);
    setNewItemName("");
  }


  return <>
    <ol>
      {rotation.map(([val, key]) => <ListItem val={val} key={key} />)}
    </ol>


    <button onClick={rotate}>Rotate</button>

    <div>
      <label>New item:&nbsp;
        <input
          type="text"
          value={newItemName}
          onChange={e => setNewItemName(e.target.value)}
          onKeyDown={e => { if (e.code === "Enter") addNewItem(); }}
        />
      </label>&nbsp;
      <button onClick={addNewItem}>Add</button>
    </div>
  </>;
}
function ListItem({ val }: { val: string }) {
  return <li>{val}</li>;
}
