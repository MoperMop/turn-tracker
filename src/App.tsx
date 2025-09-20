import { useEffect, useState, useRef } from "react";
import "./App.css";

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


const savedRotation = localStorage.getItem("rotation")?.split("\n")
  .map(item => newItem(item)) ?? [];

const savedAutoRotate =
  !isNaN(new Date(localStorage.getItem("autoRotate") ?? NaN).valueOf());
if (savedAutoRotate) {
  const daysPassed = Math.floor(
    (Date.now() - new Date(localStorage.autoRotate).valueOf()) / 86400000
  );

  const moving = savedRotation.splice(0, daysPassed % (savedRotation.length));
  savedRotation.push(...moving);


  // redundancy
  localStorage.autoRotate = new Date().toDateString();
}


function TurnTracker() {
  const [rotation, setRotation] = useState(savedRotation);
  /** rotation in localStorage ready form */
  function convertRotation() {
    return rotation.map(([item]) => item).join("\n");
  }

  useEffect(() => {
    if (rotation.length === 0) localStorage.removeItem("rotation");
    else localStorage.rotation = convertRotation();
  }, [rotation]);

  function rotate() {
    setRotation([...rotation.slice(1), rotation[0]])
  }


  const [newItemName, setNewItemName] = useState("");
  function addNewItem() {
    setRotation([...rotation, newItem(newItemName)]);
    setNewItemName("");
  }


  const [autoRotate, setAutoRotate] = useState(savedAutoRotate);
  useEffect(() => {
    if (autoRotate) localStorage.autoRotate = new Date().toDateString();
    else localStorage.removeItem("autoRotate");
  }, [autoRotate]);


  return <>
    <ol>
      {rotation.map(([val, key]) => <ListItem val={val} key={key} />)}
    </ol>


    <div>
      <button onClick={rotate} disabled={autoRotate}>Rotate</button>
    </div>
    <div>
      <label><input
        type="checkbox"
        checked={autoRotate}
        onChange={e => setAutoRotate(e.target.checked)}
      /> Auto Rotate</label>
    </div>

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
    <ManualEdit rotation={convertRotation()} setRotation={setRotation} />
  </>;
}
function ListItem({ val }: { val: string }) {
  return <li>{val}</li>;
}


function ManualEdit(
  { rotation, setRotation }:
  { rotation: string, setRotation: (rotation: Item[]) => void }
) {
  const [text, setText] = useState("");
  const dialog = useRef(null as HTMLDialogElement | null);


  function showModal() {
    dialog.current?.showModal();
    setText(rotation); 
  }


  return <div>
    <button onClick={showModal}>Manual Edit</button>
    <dialog ref={dialog} onClose={() => {
      setRotation(text.split("\n").map(
        item => newItem(item)) ?? []
      )
    }}>
      <div>
        <textarea
          rows={10}
          value={text}
          onChange={e => { setText(e.target.value); }}
        ></textarea>
      </div>
      <button onClick={() => { dialog.current?.close(); }}>Close</button>
    </dialog>
  </div>;
}
