const express = require('express')
const bodyParse = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(bodyParse.json())
app.use(cors())

const posts = {}
// example
/*
{
  'djo2904a': {
    id: 'djo2904a',
    title: 'post title',
    coments: [
      {
        id: '39jfaa',
        content: 'commentz!'
      }
    ]
  }
}
*/

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data
    posts[id] = { id, title, comments: [] }
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data
    posts[postId].comments.push({ id, content, status })
  }

  if (type === 'CommentUpdated') {
    const { id, postId, content, status } = data

    const post = posts[postId]
    const comment = post.comments.find(comment => comment.id === id)
    comment.status = status
    comment.content = content
  }
}

app.get('/posts', (req, res) => {
  res.send(posts)
})

// 接收到對應 events 時, 將後續需要 query 的資料儲存起來
app.post('/events', (req, res) => {
  const { type, data } = req.body

  handleEvent(type, data)

  res.send({})
})

app.listen(4002, async () => {
  console.log('Query Listening on 4002')

  // 每次從啟 query service 時跟 event service 取得當前所有 events
  // 並逐一執行將資料補回
  const res = await axios.get('http://localhost:4005/events')
  for (let event of res.data) {
    console.log('Processing event: ', event.type)

    handleEvent(event.type, event.data)
  }
})
