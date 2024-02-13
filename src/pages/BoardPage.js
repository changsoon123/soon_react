import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL as BASE, CboardBoards } from '../config/host-config';
import '../styles/BoardPage.scss';

const BoardPage = () => {
  const API_BASE_URL = BASE + CboardBoards;
  const navigate = useNavigate();

  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!loading && !reachedEnd) {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}?page=${page}`);
        const data = await response.json();
        if (data.length === 0) {
          setReachedEnd(true);
        } else {
          setBoards(prevBoards => [...prevBoards, ...data]);
          setPage(prevPage => prevPage + 1);
        }
      } catch (error) {
        console.error('Error fetching boards:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [API_BASE_URL, loading, page, reachedEnd]);

  useEffect(() => {
    fetchData();
  }, [fetchData, page]); // 페이지 변경 시 데이터 다시 가져오기

  const handleScroll = useCallback(() => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading && !reachedEnd) {
      setPage(prevPage => prevPage + 1);
    }
  }, [loading, reachedEnd]); // 스크롤 이벤트 핸들러 등록 및 해제

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]); // 스크롤 이벤트 핸들러 등록 및 해제

  const handleCreateBoardClick = () => {
    if (!isLoggedIn) {
      alert("로그인 한 사용자만 가능합니다!");
      navigate('/login');
    } else {
      navigate('/create');
    }
  };

  return (
    <div className="board-container">
      <h1>게시판</h1>
      <div className="board-list">
        {boards.length === 0 && !loading ? (
          <BlankBoardItem key="blank" />
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
        {reachedEnd && <p className="no-more-data">더 이상 게시물이 없습니다.</p>}
      </div>
      <button onClick={handleCreateBoardClick} className="create-board-link">
        게시물 작성
      </button>
    </div>
  );
};

const BlankBoardItem = () => (
  <div className="blank-board-container">
    <div className="board-item">
      <h2>게시물이 존재하지 않습니다.</h2>
      <p>작성해주세요!</p>
    </div>
  </div>
);

export default BoardPage;