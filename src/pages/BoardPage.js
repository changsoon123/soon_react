import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL as BASE, CboardBoard } from '../config/host-config';
import '../styles/BoardPage.scss';

const BoardPage = () => {
  const API_BASE_URL = BASE + CboardBoard;
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [reachedEnd, setReachedEnd] = useState(false); // 추가: 데이터의 끝에 도달했는지 여부를 나타내는 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token'); // 로컬 스토리지에서 JWT 토큰 가져오기
    if (token) {
      setIsLoggedIn(true); // JWT 토큰이 있는 경우 로그인 상태로 설정
    }
  }, []);

  const handleCreateBoardClick = () => {
    if (!isLoggedIn) {
      alert("로그인 한 사용자만 가능합니다!");
      navigate('/login');
    }else {
      
      navigate('/create');
    }
  };

  const fetchBoards = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}?page=${page}`);
      const data = await response.json();
      if (data.length === 0 && page === 1) {
        // 첫 페이지에서 데이터가 없는 경우
        setBoards([]); // 기존 게시물을 초기화합니다.
      } else if (data.length === 0 && page > 1) {
        // 더 이상 데이터가 없는 경우
        setReachedEnd(true); // 데이터의 끝에 도달했음을 나타냅니다.
      } else {
        setBoards(prevBoards => [...prevBoards, ...data]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, page]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight
    ) {
      if (!loading && !reachedEnd) { // 추가: 로딩 중이지 않고 데이터의 끝에 도달하지 않은 경우에만 추가 요청 보냄
        fetchBoards();
      }
    }
  }, [fetchBoards, loading, reachedEnd]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="board-container">
      <h1>게시판</h1>
      <div className="board-list">
        {boards.length === 0 && !loading ? (
          <BlankBoardItem />
        ) : (
          boards.map(board => (
            <div key={board.id} className="board-item">
              <h2>{board.title}</h2>
              <p>{board.content}</p>
              <p>작성일: {board.createdAt}</p>
            </div>
          ))
        )}
        {loading && <p>Loading...</p>}
        {/* 게시물이 아예 없을 때만 "No boards available" 메시지를 표시합니다 */}
        {!boards.length === 0 && !loading && !reachedEnd && <p className="no-more-data">더 이상 게시물이 없습니다.</p>}
      </div>
      <button onClick={handleCreateBoardClick} className="create-board-link">
        게시물 작성
      </button>
    </div>
  );
};

// 게시물이 없는 경우에 사용할 수 있는 컴포넌트
const BlankBoardItem = () => (
  <div className="blank-board-container">
    <div className="board-item">
      <h2>게시물이 존재하지 않습니다.</h2>
      <p>작성해주세요!</p>
    </div>
  </div>
);

export default BoardPage;