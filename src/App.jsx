import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { async } from "@firebase/util";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const todosCollectionRef = collection(db, "todos");

  useEffect(() => {
    const unsubscribe = onSnapshot(todosCollectionRef, (snapshot) => {
      setTodos(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await addDoc(todosCollectionRef, { title: todo, isComplete: false });

    setTodo("");
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  const handleCheck = async (id) => {
    const todoRef = todos.find((todo) => todo.id === id);

    await updateDoc(doc(db, "todos", id), { isComplete: !todoRef.isComplete });
  };

  return (
    <div className="bg-gradient-to-r from-orange-300 to-red-300 absolute inset-0  flex justify-center items-center">
      <div className="bg-white inline-block p-10 md:w-2/3 w-11/12 rounded-xl opacity-90 max-w-3xl">
        <h1 className="text-4xl font-bold">Todo Lists</h1>
        <form className="py-5 flex" onSubmit={handleAdd}>
          <input
            type="text"
            className="border-2 outline-transparent rounded-l-md p-2 focus:border-red-400 grow"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
          <button className="bg-gradient-to-r from-orange-300 to-red-300 px-5 rounded-r-md text-white hover:from-orange-400 hover:to-red-400 ">
            Add
          </button>
        </form>
        <div className="border py-2 px-2">
          <h2 className="font-bold text-xl">Todos</h2>
          <ul className="border-t max-h-[20rem] overflow-y-auto">
            {todos.map((todo) => (
              <li className="flex items-center my-1" key={todo.id}>
                <p className="flex gap-1 items-start">
                  <span>
                    <input
                      type="checkbox"
                      className="accent-orange-300"
                      checked={todo.isComplete}
                      onChange={() => handleCheck(todo.id)}
                    />
                  </span>

                  <span
                    className="px-1"
                    style={
                      todo.isComplete
                        ? {
                            color: "grey",
                            fontStyle: "italic",
                            textDecorationLine: "line-through",
                          }
                        : {}
                    }
                  >
                    {todo.title}
                  </span>
                </p>

                <button
                  className="ml-auto bg-red-400 rounded p-2 text-white hover:bg-red-500 "
                  onClick={() => handleDelete(todo.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
