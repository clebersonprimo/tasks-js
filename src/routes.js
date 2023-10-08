import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";
import { Database } from "./database.js";

const database = new Database();

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (request, response) => {
            const { search } = request.query;

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null);

            return response.end(JSON.stringify(tasks));
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (request, response) => {
            const { title, description } = request.body;

            if(!title) {
                return response.end(
                    JSON.stringify(
                        {'error': 'Informe o título da task'}
                    )
                );
            }

            if(!description) {
                return response.end(
                    JSON.stringify(
                        {'error': 'Informe a descrição da task'}
                ));
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()
            }

            database.insert('tasks', task);

            return response.writeHead(201).end();
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (request, response) => {
            const { id } = request.params;
            const { title, description } = request.body;

            if(!title) {
                return response.end(
                    JSON.stringify(
                        {'error': 'Informe o título da task'}
                    )
                );
            }

            if(!description) {
                return response.end(
                    JSON.stringify(
                        {'error': 'Informe a descrição da task'}
                ));
            }

            const [task] = database.select('tasks', {id});
            if(!task) {
                return response.end(JSON.stringify({
                    'erro': 'Task não encontrada'
                }));
            }

            task.title = title;
            task.description = description;

            database.update('tasks', id, task);

            return response.writeHead(204).end();
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (request, response) => {
            const { id } = request.params;
            const [task] = database.select('tasks', {id});

            if(!task) {
                return response.end(JSON.stringify({
                    'erro': 'Task não encontrada'
                }));
            }
            task.completed_at = new Date();

            database.update('tasks', id, task);

            return response.writeHead(204).end();
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (request, response) => {
            const { id } = request.params;
            const [task] = database.select('tasks', {id});

            if(!task) {
                return response.end(JSON.stringify({
                    'erro': 'Task não encontrada'
                }));
            }

            database.delete('tasks', id);

            return response.writeHead(204).end();
        }
    }
]