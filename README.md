# boiler-plate-ko


## 사용기술/라이브러리
### [Ant Design(antd)](https://ant.design/)
> CSS 프레임워크
1. 디자인보다 기능에 집중하기 위함.
2. Material UI, React Bootstrap, Semantic UI, Ant Design, Materialize 중 선택한 이유
3. 다른 프레임워크에 비해 진입장벽이 낮으며 깔끔함.

### redux
> 상태(State)관리 라이브러리 
1. 공통부모 컴포넌트에 상태를 저장하는게 아니라, 부모와 후손들이 참조할 수 있는 리덕스 스토어에 상태를 저장함.

### redux-promise
> redux to Promise 미들웨어
1. redux는 객체형식으로 받아야 함.
2. Promise, Function형식으로 받아야 하는 경우가 생김.
3. dispatch에게 Promise를 받았을 때 어떻게 대처해야 하는지 알려줌.

### redux-thunc
> redux to Function 미들웨어
1. redux-promise와 비슷하게 Function 대처방법을 알려줌.