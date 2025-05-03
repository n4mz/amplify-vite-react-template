import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

// Initialize the client
const client = generateClient<Schema>();

function App() {
  const { signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });

    // Cleanup the subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      client.models.Todo.create({ content }).then(() => {
        // Optionally refetch or add the new todo to the state
        setTodos((prevTodos) => [
          ...prevTodos,
          { id: String(prevTodos.length + 1), content }, // Dummy id for illustration
        ]);
      });
    }
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id }).then(() => {
      // Update the state to remove the deleted todo
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    });
  }

  return (
    <main>
      <button onClick={signOut}>Sign out</button>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} onClick={() => deleteTodo(todo.id)}>
            {todo.content}
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;
