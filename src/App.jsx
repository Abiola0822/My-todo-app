import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("normal");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const addTask = () => {
    if (!input.trim()) return;
    const newTask = {
      text: input,
      completed: false,
      dueDate,
      priority,
    };
    setTasks([...tasks, newTask]);
    setInput("");
    setDueDate("");
    setPriority("normal");
  };

  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "active") return !task.completed;
      return true;
    })
    .filter((task) =>
      task.text.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-gray-100"} flex items-center justify-center px-4`}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">To-Do List</h1>
          <button onClick={toggleTheme} className="text-gray-800 dark:text-white">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="mb-4 space-y-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="What do you need to do?"
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="normal">Normal Priority</option>
            <option value="high">High Priority</option>
          </select>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={addTask}
            className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-xl transition"
          >
            Add Task
          </motion.button>
        </div>

        <div className="flex gap-2 mb-4 text-sm">
          {["all", "active", "completed"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-xl ${
                filter === type
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 dark:text-white"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="w-full px-3 py-2 mb-4 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />

        <ul className="space-y-3 max-h-80 overflow-y-auto pr-1">
          <AnimatePresence>
            {filteredTasks.map((task, index) => (
              <motion.li
                key={task.text + index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className={`flex justify-between items-start p-3 rounded-xl ${
                  task.completed ? "bg-green-100 dark:bg-green-800" : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                <div>
                  <p className={`font-medium ${task.completed ? "line-through text-gray-400 dark:text-gray-300" : "text-gray-800 dark:text-white"}`}>
                    {task.text}
                  </p>
                  <small className="block text-sm text-gray-500 dark:text-gray-300">
                    {task.dueDate && `Due: ${task.dueDate}`} {task.priority === "high" && "• High Priority"}
                  </small>
                </div>
                <div className="flex gap-2 mt-1">
                  <button onClick={() => toggleTask(index)} className="text-green-600 dark:text-green-400 text-xs">
                    {task.completed ? "Undo" : "Done"}
                  </button>
                  <button onClick={() => deleteTask(index)} className="text-red-500 dark:text-red-400 text-xs">
                    Delete
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </motion.div>
    </div>
  );
};

export default App;
