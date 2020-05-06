import React from 'react'

export default ({ comments }) => {
  const renderComments = comments.map(comment => {
    let content

    switch (comment.status) {
      case 'approved':
        content = comment.content
        break
      case 'rejected':
        content = 'This comment has been rejected'
        break
      case 'pending':
        content = 'This comment is awaiting moderation'
        break
      default:
        content = 'This comment is awaiting moderation'
    }

    return <li key={comment.id}>{content}</li>
  })
  return <ul>{renderComments}</ul>
}
