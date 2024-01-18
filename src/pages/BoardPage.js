import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {API_BASE_URL as BASE, CboardBoards} from '../config/host-config'

const BoardPage = () => {

    const API_BASE_URL = BASE + CboardBoards;

  const [boards, setBoards] = useState([]);

  useEffect(() => {
    // 서버에서 게시판 데이터를 가져오는 API 호출
    fetch(API_BASE_URL)
      .then(response => response.json())
      .then(data => setBoards(data))
      .catch(error => {
        console.error('Error fetching boards:', error);
      });
  }, []);

  return (
    <div>
      <h1>게시판</h1>
      <ul>
        {boards.map(board => (
          <li key={board.id}>
            <h2>{board.title}</h2>
            <p>{board.content}</p>
            <p>작성일: {board.createdAt}</p>
          </li>
        ))}
      </ul>
      <Link to="/board/create">게시물 작성</Link>
    </div>
  );
};

export default BoardPage;