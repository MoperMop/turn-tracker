import { useEffect, useState, useRef } from "react";

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
