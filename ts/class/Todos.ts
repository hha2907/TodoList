import { Task } from "./Task.js"

class Todos {
    tasks: Array<Task> = []
    #backend_url = ''

    constructor(url) {
        this.#backend_url = url;
    }

    getTask = async() => {
        return new Promise(async (resolve, reject) => {
            fetch(this.#backend_url)
                .then(response => response.json())
                .then((response) => {
                    this.#readJson(response)
                    resolve(this.tasks)
                }, (error) => {
                    reject(error)
                })
        })
    }

    #readJson(taskAsJson: any): void {
        taskAsJson.forEach(node => {
            const task = new Task(node.id, node.description)
            this.tasks.push(task)
        })
    }

    #addToArray(id: number, text: string) {
        const task = new Task(id, text)
        this.tasks.push(task)
        return task
    }

    
    addTask = async(text:string) => {
        return new Promise(async(resolve, reject) => {
            const json = JSON.stringify({description: text})
            fetch(this.#backend_url + '/new', {
                method: 'post',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: json
            })
            .then(response => response.json())
            .then((response) => {
                resolve(this.#addToArray(response.id, text))
            }), (error) => {
                reject(error)
            }
        })
    }

    #removeFromArray(id: number): void {
        const arrayWithoutRemoved = this.tasks.filter(task => task.id !== id)
        this.tasks = arrayWithoutRemoved
    }

    removeTask = (id: number) => {
        return new Promise(async(resolve, reject) => {
            fetch(this.#backend_url + '/delete/' + id, {
                method: 'delete'
            })

            .then(response => response.json())
            .then((response) => {
                resolve(response.id)
            }, (error) => {
                reject(error)
            })
        })
    }

}




export { Todos }