import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL as BASE, CboardBoard } from '../config/host-config';
import { useDropzone } from 'react-dropzone'; 
import '../styles/EditBoardPage.scss';

const EditBoardPage = () => {
  const API_BASE_URL = BASE + CboardBoard;
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]); // 기존 파일 정보를 저장하는 상태 변수 추가

  useEffect(() => {
    const fetchBoardById = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const responseData = await response.json();
        setTitle(responseData.title);
        setContent(responseData.content);
        
        // 기존 파일 정보 설정
        if (responseData.fileUrls) {
          const existingFiles = responseData.fileUrls.map((url, index) => {
            // 파일 이름 추출
            const fileName = url.split('_').pop(); 
            
        
            return {
              name: fileName,
              size: '', 
              url: url 
            };
          });
        
          setFiles(existingFiles);
        }
      } catch (error) {
        console.error('Error fetching board:', error);
      }
    };
    fetchBoardById();
  }, [API_BASE_URL, id]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const token = sessionStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    files.forEach((file) => {
      formData.append('file', file);
    });
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        navigate(`/board/${id}`);
      } else {
        console.error('Failed to edit board');
      }
    } catch (error) {
      console.error('Error editing board:', error);
    }
  };

  // React Dropzone 설정
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    onDrop: (acceptedFiles) => {
      // 파일 선택 시 처리
      setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    },
  });

  
  const handleFileCancel = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  return (
    <div className="edit-board">
      <h2>수정 페이지</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label className="label">제목:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="label">내용:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        {/* 파일 업로드 인터페이스 추가 */}
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>사진을 여기에 끌어다 놓거나 클릭하여 업로드하세요.</p>
        </div>
        {/* 파일 목록 표시 */}
        <div className="file-list-container">
          {files.map((file, index) => (
            <div key={index} className="file-item">
              <span>{file.name} {file.url ? '' : `- ${file.size} bytes`}</span>
              {file.url && (
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  기존 파일 보기
                </a>
              )}
              <button onClick={() => handleFileCancel(index)}>취소</button>
            </div>
          ))}
        </div>
        <button type="submit">수정 완료</button>
      </form>
    </div>
  );
};

export default EditBoardPage;