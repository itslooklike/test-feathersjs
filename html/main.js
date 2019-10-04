/* global io, feathers */

const socket = io('http://localhost:3030')
const app = feathers()
app.configure(feathers.socketio(socket))

async function sendIdea(e) {
  e.preventDefault()

  const text = document.querySelector('#idea-text')
  const tech = document.querySelector('#idea-tech')
  const viewer = document.querySelector('#idea-viewer')

  app.service('ideas').create({
    text: text.value,
    tech: tech.value,
    viewer: viewer.value,
  })

  text.value = ''
  tech.value = ''
  viewer.value = ''
}

document.querySelector('#form').addEventListener('submit', sendIdea)

function renderIdea(idea) {
  document.querySelector('#ideas').innerHTML += `

  <div class="card bg-secondary my-3">
    <div class="card-body">
      <p class="lead">
        ${idea.text} <strong>(${idea.tech})</strong>
        <br />
        <em>Submitted by ${idea.viewer}</em>
        <br />
        <small>${idea.time}</small>
      </p>
    </div>
  </div>

  `.trim()
}

async function init() {
  const ideas = await app.service('ideas').find()
  ideas.forEach(renderIdea)
  app.service('ideas').on('created', renderIdea)
}

init()
