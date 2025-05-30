import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { Moon, Sun } from "lucide-react"

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [priority, setPriority] = useState("normal");
  const [dueDate, setDueDate] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editInput, setEditInput] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = tasks.filter((task) => {
    const matchFilter =
      filter === "all"
        ? true
        : filter === "active"
        ? !task.completed
        : task.completed;
    const matchSearch = task.text.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleAddTask = () => {
    if (!input.trim()) return;

    const newTask = {
      id: uuidv4(),
      text: input,
      completed: false,
      priority,
      dueDate,
    };

    setTasks([newTask, ...tasks]);
    setInput("");
    setPriority("normal");
    setDueDate("");
  };

  const handleToggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleDark = () => setDarkMode(!darkMode);


  const handleEdit = (id, text) => {
    setEditId(id);
    setEditInput(text);
  };

  const handleSaveEdit = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, text: editInput } : task
      )
    );
    setEditId(null);
    setEditInput("");
  };

  return (
  <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-green-500 dark:from-black dark:to-orange-500 text-gray-800 dark:text-white transition-all duration-300 px-4 flex justify-center items-center">
        <div className="bg-green-500 dark:bg-grayneon-900 rounded-2xl p-6 shadow-xl w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-500">🌟 My To-Do List 🌟</h1>
            <button onClick={toggleDark} className="text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300">
              {darkMode ? <Sun /> : <Moon />}
            </button>
          </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="w-full px-3 py-2 rounded-xl border dark:bg-gray-800"
            placeholder="What do you need to do?..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleAddTask}
            className="bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-400"
          >
            Add
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-2 py-1 border rounded-xl dark:bg-gray-800"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-2 py-1 border rounded-xl dark:bg-gray-800"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full px-3 py-2 mb-4 border rounded-xl dark:bg-gray-800"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-4 mb-4">
          {["all", "active", "completed"].map((tab) => (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.9 }}
              className={`px-4 py-2 rounded-xl ${
                filter === tab
                  ? "bg-purple-500 text-white"
                  : "bg-gray-400 dark:bg-gray-700 dark:text-white p-3 rounded-xl"
              }`}
              onClick={() => setFilter(tab)}
            >
              {tab[0].toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </div>

        <ul className="space-y-3">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.li
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className={`flex justify-between items-center p-3 rounded-xl shadow ${
                  task.completed
                    ? "bg-green-100 dark:bg-green-800"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                <div>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task.id)}
                    className="mr-2"
                  />
                  {editId === task.id ? (
                    <input
                      className="bg-transparent border-b border-gray-400 focus:outline-none"
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      onBlur={() => handleSaveEdit(task.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit(task.id);
                      }}
                    />
                  ) : (
                    <span
                      className={`${
                        task.completed ? "line-through" : ""
                      } font-medium`}
                    >
                      {task.text}
                    </span>
                  )}
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    Priority: {task.priority} | Due:{" "}
                    {task.dueDate
                      ? format(new Date(task.dueDate), "MMM dd")
                      : "None"}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      editId === task.id
                        ? handleSaveEdit(task.id)
                        : handleEdit(task.id, task.text)
                    }
                    className="text-purple-500 hover:underline"
                  >
                    {editId === task.id ? "Save" : "Edit"}
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
    </div>
  );
}
