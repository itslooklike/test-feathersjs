const feather = require('@feathersjs/feathers')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')

class IdeaService {
  constructor() {
    this.ideas = []
  }

  async find() {
    return this.ideas
  }

  async create(data) {
    const idea = {
      id: Date.now(),
      text: data.text,
      tech: data.tech,
      viewer: data.viewer,
      time: Date.now(),
    }

    this.ideas.push(idea)

    return idea
  }
}

const app = express(feather())
const PORT = process.env.PORT || 3030

app.use(express.json())
app.configure(socketio())
app.configure(express.rest())
app.use('/ideas', new IdeaService())
app.on('connection', conn => app.channel('stream').join(conn))
app.publish(() => app.channel('stream'))
app.listen(PORT).on('listening', () => console.log(`=>: http://localhost:${PORT}`))
