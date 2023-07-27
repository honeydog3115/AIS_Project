const input_message = document.querySelector("#input_box textarea");
const img_button = document.querySelector("#input_box img");
const color_label = document.querySelector("#color_box label");

const apiKey = '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';
// OpenAI API 엔드포인트 주소를 변수로 저장
const apiEndpoint = 'https://api.openai.com/v1/chat/completions'

// ChatGPT API 요청
async function fetchAIResponse(prompt) {
    // API 요청에 사용할 옵션을 정의
    const requestOptions = {
        method: 'POST',
        // API 요청의 헤더를 설정
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",  // 사용할 AI 모델
            messages: [
                {
                role: "user", // 메시지 역할을 user로 설정
                content: prompt // 사용자가 입력한 메시지
            }, ],

            temperature: 0.8, // 모델의 출력 다양성
            max_tokens: 1024, // 응답받을 메시지 최대 토큰(단어) 수 설정
            top_p: 1, // 토큰 샘플링 확률을 설정
            frequency_penalty: 0.5, // 일반적으로 나오지 않는 단어를 억제하는 정도
            presence_penalty: 0.5, // 동일한 단어나 구문이 반복되는 것을 억제하는 정도
            //stop: ["Human"], // 생성된 텍스트에서 종료 구문을 설정
        }),
    };
    // API 요청후 응답 처리
    try {
        const response = await fetch(apiEndpoint, requestOptions);
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        return aiResponse;
    } catch (error) {
		console.error('OpenAI API 호출 중 오류 발생:', error);
        return 'OpenAI API 호출 중 오류 발생';
    }
}

function resize_textarea(){ 
    input_message.style.height = 'auto';
    input_message.style.height = input_message.scrollHeight-20 + 'px';

    const input_message_style = window.getComputedStyle(input_message);
    const regex = /[^0-9]/g;
    const int_height = parseInt(input_message.style.height.replace(regex,""));

    const line_cnt = 8;
    const font_size = parseInt(input_message_style.fontSize);
    
    if(int_height >= line_cnt*font_size){
        input_message.style.overflowY = "scroll";
    }

    else{
        input_message.style.overflowY = "hidden";
    }



}

// 전송 버튼 클릭 이벤트 처리
img_button.addEventListener('click', async () => {
    if(input_message.value == ""){
        alert("문자를 입력해 주세요.");
        return;
    }

    color_label.innerHTML = '';

    // 사용자가 입력한 메시지
    const prefix = '7글자로만 답해줘. ';
    const postfix = ' 에 해당하는 16진수 rgb값을 알려줘';
    
    const message = prefix + input_message.value.trim() + postfix;
    
    // 메시지가 비어있으면 리턴a
    if (message.length === 0) return;
    input_message.value = '';
    //ChatGPT API 요청후 답변을 화면에 추가
    const aiResponse = await fetchAIResponse(message);

    color_label.style.backgroundColor = aiResponse;
});

// 사용자 입력 필드에서 Enter 키 이벤트를 처리
input_message.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        img_button.click();
    }
});

input_message.addEventListener('input', resize_textarea);