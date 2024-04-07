import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CommentList.scss';

function CommentList() {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        axios.get('/api/comments')
            .then(response => {
                setComments(response.data);
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
            });
    }, []);

    return (
        <div>
            <h2>Comments</h2>
            <ul>
                {comments.map(comment => (
                    <li key={comment.id}>{comment.content} - {comment.author}</li>
                ))}
            </ul>
        </div>
    );
}

export default CommentList;