const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
        // 클라이언트에서 이 주소와 포트로 request를 하겠다.
        /**
         * 아이피를 Proxy Server에서 임의로 바꿔버릴 수 있음.
         * 그래서 인터넷에서 접근하는 사람의 IP를 모르게 함.
         * 보내는 데이터 또한 임의로 바꿀 수 있음.
         * 유저 <-> Proxy Server <-> 인터넷
         * 
         * 기능 ->
         * 1. 방화벽 기능
         * 2. 웹 필터기능
         * 3. 캐시 데이터, 공유 데이터 제공기능
         * 
         * 사용이유 ->
         * 1. 회사에서 직원들이나 집안에서 아이들 인터넷 사용 제어
         * 2. 캐시를 사용해 더 빠른 인터넷 이용 제공
         * 3. 더 나은 보안 제공
         * 4. 이용 제한된 사이트 접근 가능
         */
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};