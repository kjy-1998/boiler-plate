import React, {useEffect} from 'react'
import axios from 'axios'

function LandingPage() {

    useEffect(() => {
        // LandingPage 들어오자마자 useEffect함수를 실행. api/hello라는 라우터(엔드포인트)를 서버(index.js)로 던짐
        // index.js에서 response로 '안녕하세요~'를 던져줌 cors(Cross-Origin Resource Sharing) 정책때문에
        // 사이트간 데이터를 주고받기 위해서는 별도의 설정이 필요함. => 여러가지 방법 중 Proxy 사용
        axios
            .get('/api/hello')
            .then(response => {
                console.log(response)
            });
    }, [])

    return (
        <div>
            LandingPage 랜딩페이지
        </div>
    )
}

export default LandingPage
