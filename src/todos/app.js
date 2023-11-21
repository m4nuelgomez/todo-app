import todoStore, { Filters } from '../store/todo.store';
import html from './app.html?raw';
import { renderTodos, renderPending } from './use-cases';

const ElementIDs = {
	ClearCompletedButton: '.clear-completed',
	TodoList: '.todo-list',
	NewTodoInput: '#new-todo-input',
	TodoFilters: '.filtro',
	PendingCountLabel: '#pending-count'
};

/**
 *
 * @param {String} elementId
 */
export const App = (elementId) => {
	const displayTodos = () => {
		const todos = todoStore.getTodos(todoStore.getCurrentFilter());
		renderTodos(ElementIDs.TodoList, todos);
		updatePendingCount();
	};

	const updatePendingCount = () => {
		renderPending(ElementIDs.PendingCountLabel);
	};

	// Cuando la función App() se llama
	(() => {
		const app = document.createElement('div');
		app.innerHTML = html;
		document.querySelector(elementId).append(app);
		displayTodos();
	})();

	// Referencias HTML
	const newDescriptionInput = document.querySelector(ElementIDs.NewTodoInput);
	const todoListUL = document.querySelector(ElementIDs.TodoList);
	const clearCompletedButton = document.querySelector(
		ElementIDs.ClearCompletedButton
	);
	const filtersLIs = document.querySelectorAll(ElementIDs.TodoFilters);

	// Listeners
	newDescriptionInput.addEventListener('keyup', (e) => {
		if (e.keyCode !== 13) return;
		if (e.target.value.trim().length === 0) return;

		todoStore.addTodo(e.target.value);
		displayTodos();
		e.target.value = '';
	});

	todoListUL.addEventListener('click', (e) => {
		const element = e.target.closest('[data-id]');
		todoStore.toggleTodo(element.getAttribute('data-id'));
		displayTodos();
	});

	todoListUL.addEventListener('click', (e) => {
		const isDestroyElement = e.target.className === 'destroy';
		const element = e.target.closest('[data-id]');
		if (!element || !isDestroyElement) return;
		todoStore.deleteTodo(element.getAttribute('data-id'));
		displayTodos();
	});

	clearCompletedButton.addEventListener('click', () => {
		todoStore.deleteCompleted();
		displayTodos();
	});

	filtersLIs.forEach((element) => {
		element.addEventListener('click', (element) => {
			filtersLIs.forEach((element) =>
				element.classList.remove('selected')
			);
			element.target.classList.add('selected');

			switch (element.target.text) {
				case 'Todos':
					todoStore.setFilter(Filters.All);
					break;
				case 'Pendientes':
					todoStore.setFilter(Filters.Pending);
					break;
				case 'Completados':
					todoStore.setFilter(Filters.Completed);
					break;
			}

			displayTodos();
		});
	});
};
