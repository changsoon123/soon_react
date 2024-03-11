import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL as BASE, CboardBoard } from '../config/host-config';
import '../styles/EditBoardPage.scss';

const EditBoardPage = () => {
  const API_BASE_URL = BASE + CboardBoard;
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchBoardById = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const responseData = await response.json();
        setTitle(responseData.title);
        setContent(responseData.content);
      } catch (error) {
        console.error('Error fetching board:', error);
      }
    };
    fetchBoardById();
  }, [API_BASE_URL, id]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const token = sessionStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });
      if (response.ok) {
        navigate(`/board/${id}`);
      } else {
        console.error('Failed to edit board');
      }
    } catch (error) {
      console.error('Error editing board:', error);
    }
  };

  return (
    <div className="edit-board">
      <h2>수정 페이지</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label className="label">제목:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="label">내용:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit">수정 완료</button>
      </form>
    </div>
  );
};

export default EditBoardPage;