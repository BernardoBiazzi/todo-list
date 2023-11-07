import './App.css';
import { useState, useEffect } from 'react';
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from 'react-icons/bs';

const API = 'http://localhost:5000';

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load todos on page load
  useEffect(() => {
    const loadData = async() => {
      setLoading(true);
      const res =  await fetch(`${API}/todos`)
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err));

      setLoading(false);
      setTodos(res);
    }
    loadData();
  }, []);
  // esse array vazio como segundo argumento 
  // faz com que execute apenas quando a pagina recarrega ou um valor é atualizado

  const handleSubmit = async (e) => {
    e.preventDefault();

    const todo = {
      id: Math.round(Math.random()*1000),
      title: e.target.title.value,
      time: e.target.time.value,
      done: false,
    }

    await fetch(`${API}/todos`, {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      }
    });

    setTodos((prevState) => [...prevState, todo]);

    setTime("");
    setTitle("");
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/todos/${id}`, {
      method: "DELETE"
    });
    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  };

  const handleEdit = async (todo) => {
    todo.done = !todo.done;
    const res = await fetch(`${API}/todos/${todo.id}`, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      }
    });
    setTodos((prevState) => prevState.map((todo) => todo.id === res.id ? res : todo));
  };

  return (
    <div className="App">
      <div className="todo-header">
        <h1>Todo header</h1>
      </div>

      <div className="form-todo">
        <h2>Formulario</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">O que você vai fazer?</label>
            <input 
              name="title"
              type="text"
              placeholder="Título da tarefa" 
              onChange={(e) => setTitle(e.target.value)} 
              value={title || ""} 
              required
            />
          </div>

          <div className="form-control">
            <label htmlFor="time">Duração:</label>
            <input 
              name="time"
              type="text"
              placeholder="Tempo estimado (em horas)" 
              onChange={(e) => setTime(e.target.value)} 
              value={time || ""} 
              required
            />
          </div>

          <input type="submit" value="Criar tarefa"></input>
        </form>
      </div>

      <div className="list-todo">
        <h2>Lista de tarefas:</h2>
        {loading ? <p>Carregando...</p> :
        todos.length === 0 
        ? <p>Não há tarefas!</p> 
        : todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? 'todo-done' : ''}>{todo.title}</h3>
            <p>Duração: {todo.time}</p>
            <div className="actions">
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck/> : <BsBookmarkCheckFill/>}
              </span>
              <span>
                <BsTrash onClick={() => handleDelete(todo.id)}/>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
