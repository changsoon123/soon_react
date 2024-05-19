import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL as BASE, CboardBoards } from '../config/host-config';
import InfiniteScroll from 'react-infinite-scroller';
import '../styles/BoardPage.scss';
import axios from 'axios';
import {Message} from '../components/Message';




const BoardPage = () => {
  const API_BASE_URL = BASE + CboardBoards;
  const navigate = useNavigate();

  const [boards, setBoards] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("guest")
  const room = "채팅방";
  
  useEffect(() => {
    const fetchData = async () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);

      try {
        const response = await axios.get(`${BASE}/message/userinfo`, {
          headers: {
            Authorization: `Bearer ${token}` // 토큰을 헤더에 포함하여 전송
          }
        });
        setUserName(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }

  }
  fetchData();
  }, []);



  const fetchData = async (currentPage) => {
    if (loading) return; 
  
    setLoading(true);
  
    try {
      const response = await fetch(`${API_BASE_URL}?page=${currentPage}`);
      const responseData = await response.json();
      console.log(responseData.content);
  
      
      if (Array.isArray(responseData.content)) {
        const { content, last, number: pageNumber } = responseData; 
        
        console.log(responseData);
        
        setBoards(prevBoards => [...prevBoards, ...content]);
        setHasMore(!last); 
        setPage(pageNumber + 1);
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
    if (!hasMore || loading) return; 

    fetchData(page); 
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
    <div className="frame-container">
      <div className="board-container">
        <h1>게시판</h1>
        <button onClick={handleCreateBoardClick} className="create-board-link">
          게시물 작성
        </button>
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
              <div className="empty-board-message board-item">
                <h2>게시물이 존재하지 않습니다.</h2>
                <p>게시물을 작성해주세요.</p>
              </div>
            )}
            {boards.map(board => (
              <Link key={board.id} to={`/board/${board.id}`} className="board-item-link">
              <div className="board-item">
                <h2>{board.title}</h2>
                <p>{board.content}</p>
                <p>작성자: {board.nickname}</p>
                <p>작성일: {new Date(board.createdAt).toLocaleString()}</p>
              </div>
              </Link>
            ))}
            {!hasMore && boards.length !== 0 && (
              <div className="end-of-boards-message board-item">
                <h2>더 이상 게시물이 존재하지 않습니다.</h2>
              </div>
            )}
          </InfiniteScroll>
        </div>
        {/* <button onClick={handleCreateBoardClick} className="create-board-link">
          게시물 작성
        </button> */}
        
      </div>
        <div className="chat-container">
        <Message room={room} username={userName} />
        </div>
    </div>
  );
};

export default BoardPage;