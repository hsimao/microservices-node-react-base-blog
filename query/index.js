const express = require('express')
const bodyParse = require('body-parser')
const cors = require('cors')

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

app.get('/posts', (req, res) => {
  res.send(posts)
})

// 接收到對應 events 時, 將後續需要 query 的資料儲存起來
app.post('/events', (req, res) => {
  const { type, data } = req.body

  if (type === 'PostCreated') {
    const { id, title } = data
    posts[id] = { id, title, comments: [] }
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data
    posts[postId].comments.push({ id, content, status })
  }

  console.log(posts)

  res.send({})
})

app.listen(4002, () => {
  console.log('Query Listening on 4002')
})
