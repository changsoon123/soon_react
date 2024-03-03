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
  const [page, setPage] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const fetchData = async (currentPage) => {
    if (loading) return; // 이미 요청 중이면 중복 요청 방지
  
    setLoading(true);
  
    try {
      const response = await fetch(`${API_BASE_URL}?page=${currentPage}`);
      const responseData = await response.json();
      console.log(responseData.content);
  
      // 서버에서 전달된 데이터를 확인하고 데이터가 배열 형태인지 확인
      if (Array.isArray(responseData.content)) {
        const { content, last, number: pageNumber } = responseData; // 받아온 데이터에서 content(데이터 배열), last(마지막 페이지 여부)를 추출
        
        console.log(responseData);
        
        setBoards(prevBoards => [...prevBoards, ...content]);
        setHasMore(!last); // last가 true면 더 이상 데이터가 없는 것으로 간주하여 hasMore를 false로 설정
        setPage(pageNumber);
      } else {
        console.error('Error: Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const loadMore = () => {
    if (!hasMore || loading) return; // 더 이상 데이터가 없으면 추가 요청 방지

    fetchData(page); // 다음 페이지 데이터 요청
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
          {boards.length === 0 && !loading &&  (
            <p className="empty-board-message">게시물이 존재하지 않습니다. 게시물을 작성해주세요.</p>
          )}
          {boards.map(board => (
            <div key={board.id} className="board-item">
              <h2>{board.title}</h2>
              <p>{board.content}</p>
              <p>작성일: {board.createdAt}</p>
            </div>
          ))}
          {!hasMore && boards.length !== 0 && (
            <p className="end-of-boards-message">더 이상 게시물이 존재하지 않습니다.</p>
          )}
        </InfiniteScroll>
      </div>
      <button onClick={handleCreateBoardClick} className="create-board-link">
        게시물 작성
      </button>
    </div>
  );
};

export default BoardPage;