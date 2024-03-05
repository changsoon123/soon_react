import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL as BASE, CboardBoard } from '../config/host-config';

const BoardDetailPage = () => {

  const API_BASE_URL = BASE + CboardBoard;
  const navigate = useNavigate();

  const { id } = useParams();
  const [board, setBoard] = useState(null);

  useEffect(() => {
    // API를 호출하여 해당 ID의 게시물을 가져오는 함수를 구현해야 합니다.
    fetchBoardById(id);
  }, [id]);

  const fetchBoardById = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      const responseData = await response.json();
      console.log(responseData);
      setBoard(responseData);
    } catch (error) {
      console.error('Error fetching board:', error);
    }
  };

  const handleEditClick = () => {
    // 게시물 작성자만 수정할 수 있도록 확인하는 로직을 추가해야 합니다.
    if (board && isLoggedIn && board.author === sessionStorage.getItem('userId')) {
      // 수정 페이지로 이동하는 코드를 추가해야 합니다.
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
      <p>작성자: {board.author}</p>
      <button onClick={handleEditClick}>수정</button>
    </div>
  );
};

export default BoardDetailPage;