import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL as BASE, CboardBoard } from '../config/host-config';
import { useDropzone } from 'react-dropzone'; // React Dropzone 추가
import '../styles/CreateBoardPage.scss';

const CreateBoardPage = () => {
  const API_BASE_URL = BASE + CboardBoard;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem('token');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);

      // 이미지를 FormData에 추가하지 않고 업로드
      await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      navigate('/board');
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  // React Dropzone 설정
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*', // 이미지만 허용
    onDrop: (acceptedFiles) => {
      // 파일 선택 시 처리
      console.log(acceptedFiles);
    },
  });

  return (
    <div className="container">
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
        {/* React Dropzone 추가 */}
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>사진을 여기에 끌어다 놓거나 클릭하여 업로드하세요.</p>
        </div>
        <br />
        <button type="submit">작성 완료</button>
      </form>
    </div>
  );
};

export default CreateBoardPage;