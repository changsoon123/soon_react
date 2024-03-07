import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL as BASE, CboardBoard } from '../config/host-config';

const BoardDetailPage = () => {
  const API_BASE_URL = BASE + CboardBoard;
  const navigate = useNavigate();
  const { id } = useParams();
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const fetchBoardById = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const responseData = await response.json();
        console.log(responseData);
        setBoard(responseData);
      } catch (error) {
        console.error('Error fetching board:', error);
      }
    };
    fetchBoardById();
  }, [API_BASE_URL, id]);

  const handleEditClick = async () => {
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/check-permission/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const permissionData = await response.json();

    if (permissionData.hasPermission) {
      console.log("회원 인증 성공!")
      navigate(`/edit/${id}`);
    } else {
      alert('해당 게시물을 수정할 수 있는 권한이 없습니다.');
    }
  };

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <div className="board-detail">
      <h2>{board.title}</h2>
      <p>{board.content}</p>
      <p>작성자: {board.nickname}</p>
      <button onClick={handleEditClick}>수정</button>
    </div>
  );
};

export default BoardDetailPage;