import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL as BASE, CboardBoards } from '../config/host-config';
import InfiniteScroll from 'react-infinite-scroller';
import '../styles/BoardPage.scss';

const BoardPage = () => {
  const API_BASE_URL = BASE + CboardBoards;
  const navigate = useNavigate();

  const [boards, setBoards] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const fetchData = async (page) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}?page=${page}`);
      const data = await response.json();
      console.log(data);
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setBoards(prevBoards => [...prevBoards, ...data]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchData(page);
    }
  };

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
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={hasMore}
          loader={<p key={0}>Loading...</p>}
          useWindow={true}
          threshold={20}
        >
          {boards.map(board => (
            <div key={board.id} className="board-item">
              <h2>{board.title}</h2>
              <p>{board.content}</p>
              <p>작성일: {board.createdAt}</p>
            </div>
          ))}
        </InfiniteScroll>
      </div>
      <button onClick={handleCreateBoardClick} className="create-board-link">
        게시물 작성
      </button>
    </div>
  );
};

export default BoardPage;