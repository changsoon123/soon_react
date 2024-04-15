import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/CommentList.scss';
import { API_BASE_URL as BASE, Comments } from '../config/host-config';

function CommentList() {
    const API_BASE_URL = BASE + Comments;
    const { id } = useParams();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`${API_BASE_URL}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };
    
        fetchComments();
    }, [API_BASE_URL, id]);

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleCommentSubmit = async () => {
        try {
            const token = sessionStorage.getItem('token'); 
            const response = await axios.post(`${API_BASE_URL}/add/${id}`, {
                content: newComment,
            }, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            setComments([response.data, ...comments]); 
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    // Function to format the date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString(); 
    };

    return (
        <div className="comment-container">
            <h2>댓글</h2>
            <textarea className="comment-textarea" value={newComment} onChange={handleCommentChange}></textarea>
            <button className="comment-button" onClick={handleCommentSubmit}>댓글 추가하기</button>
            <ul className="comment-list">
                {comments.map(comment => (
                    <li className="comment-item" key={comment.id}>
                        <div className="comment-item-author">닉네임: {comment.author}</div>
                        <div className="comment-item-content">{comment.content}</div>
                        <div className="comment-item-time"> {formatDate(comment.createdAt)}</div> {}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CommentList;