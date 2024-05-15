import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CommentList.scss';
import { API_BASE_URL as BASE, Comments } from '../config/host-config';
import Swal from 'sweetalert2';

function CommentList() {
    const API_BASE_URL = BASE + Comments;
    const { id } = useParams();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/${id}`);
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
        const token = sessionStorage.getItem('token');
        
        if(!token) {
            alert("로그인이 필요 합니다!");
            navigate('/Login');
          } else { 
                try {
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
        }
    };

    const handleCommentDelete = async (commentId) => {
        const confirmDelete = window.confirm("삭제하시겠습니까?");
        const token = sessionStorage.getItem('token');
        if (confirmDelete) {
            if(!token) {
                alert("로그인이 필요 합니다!");
                navigate('/Login');
              } else {
                const response = await fetch(`${API_BASE_URL}/check-permission/${commentId}`, {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  });
                  const permissionData = await response.json();
              
                  if (permissionData.hasPermission) {
                      console.log("회원 인증 성공!")
                      
                      const responsedelete = await fetch(`${API_BASE_URL}/${commentId}`, {
                        method: 'DELETE',
                        headers: {
                          Authorization: `Bearer ${token}`
                        }
                      });
                      if (responsedelete.ok) {
                        Swal.fire({
                          icon: 'success',
                          title: '삭제 성공',
                          text: '댓글이 성공적으로 삭제되었습니다.'
                        }).then(() => {
                            setComments(comments.filter(comment => comment.id !== commentId));
                        });
                      } else {
                        console.error('Error deleting board');
                        alert('댓글 삭제 중 오류가 발생했습니다.');
                      }
                  } else {
                    alert('해당 댓글을 삭제할 수 있는 권한이 없습니다.');
                  }

            }
        }
    };
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString(); 
    };

    return (
        <div className="comment-container">
            <h2>댓글</h2>
            <textarea className="comment-textarea" value={newComment} onChange={handleCommentChange} maxLength={50}
                        placeholder={`최대 50자까지 입력 가능합니다.`}></textarea>
            <button className="comment-button" onClick={handleCommentSubmit}>댓글 추가하기</button>
            <ul className="comment-list">
            {comments.map(comment => (
                    <li className={`comment-item ${comment.deleted ? 'deleted' : ''}`} key={comment.id}>
                        <div className="comment-item-author">닉네임: {comment.author}</div>
                        <div className="comment-item-content">{comment.content}</div>
                        <div className="comment-item-time"> {formatDate(comment.createdAt)}</div>
                        {!comment.deleted && (
                            <button className="delete-button" onClick={() => handleCommentDelete(comment.id)}>삭제</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CommentList;