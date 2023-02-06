import Task from "./Task";
import TaskForm from "./TaskForm";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Axios from "axios";
import { URL } from "../App";
import loadingImg from "../assests/loader.gif";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [isEditing, setisEditing] = useState(false);
  const [taskID, settaskID] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    completed: false,
  });
  const { name } = formData;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getTasks = async () => {
    setisLoading(true);
    try {
      const { data } = await Axios.get(`${URL}/api/tasks`);
      // console.log(data)
      setTasks(data);
      setisLoading(false);
    } catch (error) {
      toast.error(error.message);
      setisLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Input field cannot be empty");
    }
    try {
      await Axios.post(`${URL}/api/tasks`, formData);
      toast.success("Task added successfully");
      setFormData({ ...formData, name: "" });
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await Axios.delete(`${URL}/api/tasks/${id}`);
      toast.success("Task deleted successfully");
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const cTask = tasks.filter((task) => {
      return task.completed === true;
    });
    setCompletedTasks(cTask);
  }, [tasks]);

  const getSingleTask = async (task) => {
    setFormData({ name: task.name, completed: false });
    settaskID(task._id);
    setisEditing(true);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Input field cannot be empty");
    }
    try {
      await Axios.put(`${URL}/api/tasks/${taskID}`, formData);
      toast.success("Task updated successfully");
      setFormData({ ...formData, name: "" });
      setisEditing(false);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const setToComplete = async (task) => {
    const newFormData = {
      name: task.name,
      completed: true,
    };
    try {
      await Axios.put(`${URL}/api/tasks/${task._id}`, newFormData);
      toast.success("Task completed successfully");
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h2>Tick Tick app</h2>
      <TaskForm
        name={name}
        handleInputChange={handleInputChange}
        createTask={createTask}
        isEditing={isEditing}
        updateTask={updateTask}
      />
      {tasks.length > 0 && (
        <div className="--flex-between --pb">
          <p>
            <b>Total Tasks:</b> {tasks.length}
          </p>
          <p>
            <b>Completed Tasks:</b> {completedTasks.length}
          </p>
        </div>
      )}

      <hr></hr>
      {isLoading && (
        <div className="--flex-center">
          <img src={loadingImg} alt="Loading" />
        </div>
      )}
      {!isLoading && tasks.length === 0 ? (
        <p className="--py">No task added. Please add a task</p>
      ) : (
        <>
          {tasks.map((task, index) => {
            return (
              <Task
                key={task._id}
                task={task}
                index={index}
                deleteTask={deleteTask}
                getSingleTask={getSingleTask}
                setToComplete={setToComplete}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default TaskList;
