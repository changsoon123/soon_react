import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL as BASE, CboardBoard } from '../config/host-config';
import { useDropzone } from 'react-dropzone'; // React Dropzone 추가
import Tags from '@yaireo/tagify/dist/react.tagify';
import '@yaireo/tagify/dist/tagify.css';
import '../styles/CreateBoardPage.scss';

const CreateBoardPage = () => {
  const API_BASE_URL = BASE + CboardBoard;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [files, setFiles] = useState([]); // 파일 상태 초기화 추가
  const navigate = useNavigate();

  const handleTagChange = (e) => {
    setTags(e.detail.tagify.value.map(tag => tag.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 제목 또는 내용이 비어있는 경우 알림 표시
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력하세요.');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('tags', tags);
      files.forEach((file) => {
        formData.append('file', file);
      });

      // 게시물 생성 요청
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
    accept:  {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
   // 이미지만 허용
    onDrop: (acceptedFiles) => {
      // 파일 선택 시 처리
      setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    },
  });

  return (
    <div className="container">
      <button className="back-button" onClick={() => navigate(-1)}>&#x2190;</button>
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
        <label>
          태그:
          <Tags settings={{ duplicates: false }} onChange={handleTagChange} />
        </label>
        <br />
        {/* React Dropzone 추가 */}
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} multiple />
          <p>사진을 여기에 끌어다 놓거나 클릭하여 업로드하세요.</p>
        </div>
         {/* 파일 목록 표시 */}
         <div className="file-list-container">
          {files.map((file, index) => (
            <div key={index} className="file-item">
              <span>{file.name} - {file.size} bytes</span>
            </div>
          ))}
        </div>
        <br />
        <button type="submit">작성 완료</button>
      </form>
    </div>
  );
};

export default CreateBoardPage;