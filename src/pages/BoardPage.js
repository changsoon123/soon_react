import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL as BASE, CboardBoards } from '../config/host-config';
import '../styles/BoardPage.scss';

const BoardPage = () => {
  const API_BASE_URL = BASE + CboardBoards;
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [reachedEnd, setReachedEnd] = useState(false); // 추가: 데이터의 끝에 도달했는지 여부를 나타내는 상태

  const fetchBoards = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}?page=${page}`);
      const data = await response.json();
      if (data.length === 0) {
        setReachedEnd(true); // 추가: 데이터가 더 이상 없음을 나타내는 경우 reachedEnd 상태 변경
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
      <Link to="/board/create">게시물 작성</Link>
      <div className="board-list">
        {boards.map(board => (
          <div key={board.id} className="board-item">
            <h2>{board.title}</h2>
            <p>{board.content}</p>
            <p>작성일: {board.createdAt}</p>
          </div>
        ))}
        {loading && <p>Loading...</p>}
        {reachedEnd && <p>No more data</p>} {/* 추가: 데이터의 끝에 도달한 경우 메시지 표시 */}
      </div>
    </div>
  );
};

export default BoardPage