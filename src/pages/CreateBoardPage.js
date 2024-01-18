import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {API_BASE_URL as BASE, CboardBoard} from '../config/host-config'

const CreateBoardPage = () => {

    const API_BASE_URL = BASE + CboardBoard;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        // 서버에 새로운 게시물 생성 요청
        await fetch( API_BASE_URL , {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content,
          }),
        });
  
        // 생성 완료 후 게시판 페이지로 이동
        navigate('/board');
      } catch (error) {
        console.error('Error creating board:', error);
      }
  };

  return (
    <div>
      <h1>게시물 작성</h1>
      <form onSubmit={handleSubmit}>
        <label>
          제목:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <br />
        <label>
          내용:
          <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        </label>
        <br />
        <button type="submit">작성 완료</button>
      </form>
    </div>
  );
};

export default CreateBoardPage;