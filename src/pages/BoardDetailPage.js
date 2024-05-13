import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL as BASE, CboardBoard } from '../config/host-config';
import '../styles/BoardDetailPage.scss';
import CommentList from '../components/CommentList.js';
import Swal from 'sweetalert2';

const BoardDetailPage = () => {
  const API_BASE_URL = BASE + CboardBoard;
  const navigate = useNavigate();
  const { id } = useParams();
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const fetchBoardById = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const responseData = await response.json();
        console.log(responseData);
        setBoard(responseData);
      } catch (error) {
        console.error('Error fetching board:', error);
      }
    };
    fetchBoardById();
  }, [API_BASE_URL, id]);

  const handleEditClick = async () => {
    const token = sessionStorage.getItem('token');
    console.log(token)
    if(!token) {
      alert("로그인이 필요 합니다!");
      navigate('/Login');
    } else {

      const response = await fetch(`${API_BASE_URL}/check-permission/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const permissionData = await response.json();

      if (permissionData.hasPermission) {
        console.log("회원 인증 성공!")
        navigate(`/edit/${id}`);
      } else {
        alert('해당 게시물을 수정할 수 있는 권한이 없습니다.');
      }

    }
  };

  const handleDeleteClick = async () => {
    const isConfirmed = window.confirm('정말로 삭제하시겠습니까?');
    
    const token = sessionStorage.getItem('token');


    if (isConfirmed) {
      if(!token) {
        alert("로그인이 필요 합니다!");
        navigate('/Login');
      } else { 
          const response = await fetch(`${API_BASE_URL}/check-permission/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const permissionData = await response.json();
      
          if (permissionData.hasPermission) {
              console.log("회원 인증 성공!")
              
              const responsedelete = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              if (responsedelete.ok) {
                Swal.fire({
                  icon: 'success',
                  title: '삭제 성공',
                  text: '게시물이 성공적으로 삭제되었습니다.'
                }).then(() => {
                  navigate('/board'); 
                });
              } else {
                console.error('Error deleting board');
                alert('게시물 삭제 중 오류가 발생했습니다.');
              }
          } else {
            alert('해당 게시물을 삭제할 수 있는 권한이 없습니다.');
          }
      }
    }
  };

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <div className="board-detail">
      <h2>{board.title}</h2>
      <div className="image-container">
        {board.fileUrls && board.fileUrls.map((url, index) => (
          <img key={index} src={url} alt={`게시물 사진 ${index}`} />
        ))}
      </div>
      <p>{board.content}</p>
      <p>작성자: {board.nickname}</p>
      <p>작성일: {new Date(board.createdAt).toLocaleString()}</p>
      <div className="button-container">
        <button onClick={handleEditClick}>수정</button>
        <button className="board-delete-button" onClick={handleDeleteClick}>삭제</button>
      </div>
      <CommentList />
    </div>
  );
};

export default BoardDetailPage;