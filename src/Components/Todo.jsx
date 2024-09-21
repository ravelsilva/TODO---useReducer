import React, { useReducer, useState } from 'react';
import '../Assets/Todo.css';
import { IoMdClose } from 'react-icons/io';
import { CiEdit } from 'react-icons/ci';

// Reducer function to manage task state
const reducer = (state, action) => {
	switch (action.type) {
		case 'add-task':
			// Adds a new task to the list
			return {
				tasks: [
					...state.tasks,
					{
						name: action.inputValue,
						isCompleted: false,
					},
				],
			};
		case 'remove-task':
			// Removes a task from the list based on its name
			return {
				...state,
				tasks: state.tasks.filter(
					(task) => task.name !== action.inputValue
				),
			};
		case 'edit-task':
			// Edits an existing task's name
			return {
				...state,
				tasks: state.tasks.map((task) =>
					task.name === action.oldName
						? { ...task, name: action.newName }
						: task
				),
			};
		default:
			return state; // Returns the current state for unrecognized actions
	}
};

const Todo = () => {
	// State management using useReducer for tasks and useState for input values
	const [state, dispatch] = useReducer(reducer, { tasks: [] });
	const [inputValue, setInputValue] = useState('');
	const [editingTask, setEditingTask] = useState(null);
	const [editInputValue, setEditInputValue] = useState('');
	const [isEditing, setIsEditing] = useState(true);

	// Initiates the editing process for a task
	const handleEdit = (taskName) => {
		setEditingTask(taskName);
		setEditInputValue(taskName);
		setIsEditing(false); // Sets editing state to true
	};

	// Saves the edited task when the input loses focus or Enter is pressed
	const handleSaveEdit = () => {
		if (editingTask) {
			dispatch({
				type: 'edit-task',
				oldName: editingTask,
				newName: editInputValue,
			});
			setEditingTask(null); // Resets editing task state
			setEditInputValue(''); // Clears edit input
			setIsEditing(true); // Resets editing state
		}
	};

	return (
		<>
			<h1>Todo List</h1>
			<div className="input-task">
				<form className="form-container">
					<label htmlFor="task">What’s your plan for the day? </label>
					<input
						type="text"
						id="task"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)} // Updates input value
						placeholder="Your plan..."
					/>

					<button
						className="btn-post"
						onClick={(e) => {
							e.preventDefault(); // Prevents form submission
							if (inputValue) {
								dispatch({ type: 'add-task', inputValue }); // Dispatches action to add task
								setInputValue(''); // Clears input after adding task
							}
						}}
					>
						Post Task
					</button>
				</form>
				<div className="post-tasks">
					<ul>
						{state.tasks.map((task, index) => (
							<li key={task.name + index} className="todo-item">
								{editingTask === task.name ? (
									// Renders an input for editing if this task is being edited
									<input
										type="text"
										value={editInputValue}
										onChange={(e) =>
											setEditInputValue(e.target.value)
										} // Updates edit input value
										onBlur={handleSaveEdit} // Saves on blur
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												handleSaveEdit(); // Saves on Enter key
											}
										}}
										autoFocus // Focuses the input automatically
									/>
								) : (
									// Renders the task name and allows editing on click
									<span
										className="task-name"
										onClick={() => handleEdit(task.name)}
									>
										{task.name}
									</span>
								)}
								{isEditing ? (
									// Renders the remove button if not editing
									<button
										type="button"
										className="btn-task erase-task"
										onClick={() => {
											dispatch({
												type: 'remove-task',
												inputValue: task.name,
											}); // Dispatches action to remove task
										}}
									>
										<IoMdClose />
									</button>
								) : null}
								{isEditing ? (
									// Renders the edit button if not editing
									<button
										onClick={() => handleEdit(task.name)}
										className="btn-task edit-task"
									>
										<CiEdit />
									</button>
								) : null}
							</li>
						))}
					</ul>
				</div>
			</div>
		</>
	);
};

export default Todo;
