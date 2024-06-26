
// 브라우저에서 현재 클라이언트의 호스트 이름 얻어오기

const clientHostName = window.location.hostname;

let backEndHostName; // 백엔드 서버 호스트 이름

if(clientHostName === 'localhost'){ //개발 중
  backEndHostName = 'http://localhost:8080';
} else if(clientHostName === 'soon.com'){ //배포해서 서비스 중
  backEndHostName = 'https://soon.com'
}

export const API_BASE_URL = backEndHostName;
export const SOCKET_BASE_URL = 'ws://localhost:9092';
export const TODO = '/api/todos';
export const USER = '/api/signup';
export const LoginUser = '/api/login';
export const KakaoLoginUser = '/api/kakao/login';
export const CheckField = '/api/check';
export const CboardBoards = '/cboard/boards';
export const CboardBoard = '/cboard/board';
export const Comments = '/api/comments';