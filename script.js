// --- 설정값 ---
const SPEAKING_AVATAR_VIDEO_SRC = 'videos/speaking.mp4'; // 말하는 아바타 영상 경로
const IDLE_AVATAR_VIDEO_SRC = 'videos/idle_loop.mp4';   // 대기 상태 아바타 루프 영상 경로
const YOUR_CONTACT_EMAIL = 'aistonehub@gmail.com'; // 실제 이메일 주소

// --- DOM 요소 가져오기 ---
const avatarVideo = document.getElementById('avatarVideo');
const videoSource = document.getElementById('videoSource');
const questionInput = document.getElementById('questionInput');
const askButton = document.getElementById('askButton');
const faqButtonsContainer = document.getElementById('faqButtons');
const speechBubble = document.getElementById('speechBubble');
const answerTextElement = document.getElementById('answerText');
document.getElementById('currentYear').textContent = new Date().getFullYear();

// 이메일 링크 업데이트
const emailLink = document.querySelector('footer a[href^="mailto:"]');
if (emailLink) {
    emailLink.href = `mailto:${YOUR_CONTACT_EMAIL}`;
    emailLink.textContent = YOUR_CONTACT_EMAIL;
}

// 사전 녹음된 오디오 파일 맵
const prerecordedAudio = {
    "회사소개": "audio/company_intro.mp3",
    "주요사업": "audio/main_business.mp3",
    "핵심역량": "audio/core_capability.mp3",
    "컨설팅비용": "audio/consulting_cost.mp3",
    "개발경험": "audio/dev_experience.mp3",
    "문의": "audio/inquiry.mp3"
};

// --- 답변 데이터 ---
const answerMap = {
    "회사소개": "저희는 ai stone (에이아이스톤)입니다. 기술 기반 가치 혁신을 추구하며, AI와 전문가 네트워크를 통해 기업의 잠재력 발굴을 돕는 파트너입니다.",
    "설립일": "저희는 2020년 11월에 설립되었습니다.",
    "대표": "저희 ai stone의 대표는 문윤수입니다. 약 20년간의 소프트웨어 개발 사업 경험과 AI/데이터 기술 전문성을 바탕으로 기업 가치 혁신에 기여하고자 합니다.",
    "주요사업": "저희는 AI 및 데이터 기반의 기술 컨설팅과 플랫폼 개발을 주요 사업 분야로 하고 있습니다.",
    "주요기술": "저희는 인공지능(AI), 데이터 분석, 소프트웨어 개발, 그리고 IPFS 기술을 핵심적으로 활용하고 있습니다.",
    "비전": "저희 비전은 AI를 통한 기술 혁신으로 여러 산업 분야에서 새로운 잠재 가치를 실현하고, 지속 성장하는 비즈니스 생태계를 구축하는 것입니다.",
    "미션": "저희 미션은 고객분들께 쉽고 빠르고 저렴한 솔루션을 제공하는 것입니다.",
    "핵심역량": "저희는 고도화된 AI 기반 분석 엔진, 20년 경험의 소프트웨어 사업 노하우, 그리고 IPFS 기반의 안전하고 신뢰성 있는 데이터 처리 기술을 핵심 역량으로 보유하고 있습니다.",
    "분석엔진": "저희 AI 분석 엔진은 복잡한 가치 평가 방법론을 내재화하고 있으며, 재무 및 비재무 데이터의 복합적인 영향을 분석하여 객관적이고 신뢰성 높은 가치 분석 결과를 제공합니다.",
    "개발경험": "20년간의 경험을 통해 대규모 데이터 처리 및 복잡한 비즈니스 로직을 위한 견고하고 확장 가능한 시스템 구축 경험을 가지고 있으며, 비전문가도 쉽게 사용할 수 있는 사용자 친화적 인터페이스 개발 역량도 갖추고 있습니다.",
    "데이터보안": "네, 그렇습니다. 저희는 IPFS 기반 데이터 보안 솔루션 개발 경험을 바탕으로 기업의 핵심 자산인 데이터를 안전하게 수집, 저장, 분석하는 프로세스를 구축하고 데이터 무결성을 확보합니다.",
    "차별점": "저희는 AI의 효율성과 객관성에 더해, 법률, 회계, 경영, 기술 등 각 분야 최고 전문가 그룹의 경험과 통찰을 결합한 융합적 솔루션을 제공합니다. 이를 통해 단순 가치 평가를 넘어 실질적인 가치 향상으로 이어지는 도움을 드립니다.",
    "전문가네트워크": "저희는 법률, 회계, 경영, 기술 등 각 분야의 저명한 교수님, 회계법인 대표님, IT 기업 기술 임원 등으로 구성된 자문단을 통해 AI 분석 결과에 깊이 있는 비즈니스 통찰과 현실적인 해법을 더하고 있습니다.",
    "사업영역": "저희의 주요 사업 영역은 AI 기반 기업 가치 관리 플랫폼 개발과 가치 혁신 컨설팅 서비스 제공입니다.",
    "가치관리플랫폼": "중소·중견 기업을 위한 혁신적인 셀프 기업 가치 진단 및 관리 툴을 개발하고 있습니다. 간편한 AI 기반 가치 진단, 가치 변화 추이 모니터링, 핵심 지표 분석 대시보드, AI 기반 가치 향상 액션 아이디어 제시 등의 기능을 제공하여 기업 가치 관리의 대중화 및 상시화를 목표로 합니다.",
    "가치혁신컨설팅": "AI 분석을 기반으로 한 심층적인 기업 가치 평가, 가치 결정 요인 및 잠재력 분석, 그리고 기업 가치 향상을 위한 맞춤형 전략 컨설팅을 제공합니다. 데이터 기반 경영 및 재무 관리 역량 강화 자문도 포함됩니다.",
    "컨설팅진행방식": "저희는 먼저 안전하고 체계적으로 데이터를 수집 및 정제하고, AI 기반으로 심층 분석을 진행합니다. 그 결과를 바탕으로 전문가가 검토하여 통찰을 더하고, 고객 맞춤형 솔루션을 도출하여 이해하기 쉬운 보고서와 함께 전달해 드립니다. 필요시 설명 세션도 진행합니다.",
    "컨설팅비용": `네, 저희 컨설팅 서비스는 고객사의 니즈와 기대 결과물의 수준에 맞춰 4가지 레벨로 제공됩니다. 'Value Snapshot'은 100만원, 'Value Insights'는 400만원, 'Value Acceleration'은 800만원이며, 'Strategic Partnership' 레벨은 별도 협의를 통해 맞춤 설계됩니다. 각 레벨별 상세 내용은 ${YOUR_CONTACT_EMAIL} 로 문의해주시면 안내드리겠습니다.`,
    "컨설팅필요기업": "회사의 현재 가치를 빠르게 파악하고 싶거나, 가치 구성 요소를 심층적으로 이해하고 개선 방향을 찾고 싶은 기업, 또는 구체적인 가치 향상 전략과 실행 아이디어를 얻고 M&A나 투자 유치 등 특정 목적을 달성하고자 하는 모든 기업에게 저희 서비스가 도움이 될 수 있습니다.",
    "회사연혁": "저희는 2020년 11월 설립 이후, IPFS 기반 데이터 솔루션 개발 및 납품, AI Agent 개발 및 납품 등의 성과를 거두며 기술력을 축적해왔습니다. 현재는 기업 가치 혁신을 위한 AI/데이터 분석 솔루션 및 컨설팅 서비스 연구 개발에 집중하고 있습니다.",
    "조직구조": "저희는 20년 SW 사업 경험을 가진 리더를 중심으로, 소수 정예 인력과 검증된 외부 파트너가 협력하는 유연하고 민첩한 조직 구조를 가지고 있습니다. 이를 통해 프로젝트 특성에 맞는 최적의 AI 전문 리소스를 투입하고 불필요한 고정 비용을 최소화합니다.",
    "팀멤버": "저희 팀에는 설립자이신 문윤수 대표님을 비롯하여, 핵심 개발을 담당하는 AI 수진님, 고객 관리를 맡고 있는 AI 미연님 등 열정적인 전문가들이 함께하고 있습니다.",
    "주요파트너": "저희는 기술 파트너, 법률 자문, 회계/세무 자문, 경영/전략 자문, 기술/연구 자문 등 각 분야의 신뢰할 수 있는 파트너들과 협력하고 있습니다.",
    "약속": "저희는 AI 기술과 최고 전문가 네트워크의 독보적인 융합을 통해 가치 '평가'를 넘어 가치 '향상'으로 이끄는 실질적인 솔루션을 제공하며, 기업 가치 성장을 위한 최적의 파트너가 될 것을 약속드립니다."
};
const defaultUnknownAnswer = `문의하신 내용에 대한 답변은 현재 준비되어 있지 않습니다. 더 자세한 정보나 궁금한 점이 있으시면, ${YOUR_CONTACT_EMAIL} 로 문의 내용을 보내주시면 정성껏 답변드리겠습니다. 감사합니다.`;

// --- FAQ 버튼 생성 및 오디오 미리 로드 ---
function initialize() {
    loadVideo(IDLE_AVATAR_VIDEO_SRC);

    const faqKeywords = {
        "회사 소개": "회사소개",
        "주요 사업": "주요사업",
        "핵심 역량": "핵심역량",
        "컨설팅 비용": "컨설팅비용",
        "개발 경험": "개발경험",
        "문의하기": "문의"
    };

    Object.entries(faqKeywords).forEach(([buttonText, keyword]) => {
        const button = document.createElement('button');
        button.className = 'faq-btn';
        button.textContent = buttonText;
        button.dataset.question = keyword;
        faqButtonsContainer.appendChild(button);
    });

    // mp3 파일 미리 로드
    for (const path of Object.values(prerecordedAudio)) {
        const audio = new Audio();
        audio.src = path;
        audio.preload = 'auto';
    }

    addFaqButtonListeners();
}

// --- 비디오 로딩 ---
function loadVideo(videoSrc) {
    videoSource.src = videoSrc;
    avatarVideo.load();
    avatarVideo.play().catch(err => {
        // 자동 재생 정책 등으로 실패 가능
    });
}

// --- FAQ 버튼 리스너 ---
function addFaqButtonListeners() {
    document.querySelectorAll('.faq-btn').forEach(button => {
        button.addEventListener('click', () => {
            const questionKeyword = button.dataset.question;
            if (prerecordedAudio[questionKeyword]) {
                const answer = answerMap[questionKeyword] || defaultUnknownAnswer;
                speakWithAudio(answer, prerecordedAudio[questionKeyword]);
            } else {
                findAndSpeakAnswer(questionKeyword, true);
            }
        });
    });
}

// --- 질문 입력 처리 ---
askButton.addEventListener('click', handleQuestion);
questionInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') handleQuestion();
});

function handleQuestion() {
    const question = questionInput.value.trim();
    if (question) {
        findAndSpeakAnswer(question);
        questionInput.value = '';
    } else {
        speak("죄송합니다. 질문을 입력해주세요.", true);
    }
}

// --- FAQ/유사 질문/AI 답변 찾기 핵심 ---
function findAndSpeakAnswer(questionText, isFaqClick = false) {
    let answer = null;
    let bestMatchKeyword = null;
    const lowerQuestion = questionText.toLowerCase();

    // 1. FAQ 버튼 클릭이면 바로 answerMap에서 찾기
    if (isFaqClick && answerMap[questionText]) {
        answer = answerMap[questionText];
        bestMatchKeyword = questionText;
    } else {
        // 2. FAQ 키워드 매칭
        for (const keyword in answerMap) {
            if (lowerQuestion.includes(keyword.toLowerCase())) {
                answer = answerMap[keyword];
                bestMatchKeyword = keyword;
                break;
            }
        }
        // 3. 매칭 실패 시 Gemini API 호출
        if (!answer) {
            getGeminiAnswer(questionText).then(geminiAnswer => {
                const finalAnswer = geminiAnswer && geminiAnswer.length > 2
                    ? geminiAnswer
                    : defaultUnknownAnswer;
                showAnswer(finalAnswer);
                speak(finalAnswer);
            });
            return;
        }
    }

    // --- 오디오/음성 답변 ---
    showAnswer(answer);
    if (bestMatchKeyword && prerecordedAudio[bestMatchKeyword]) {
        speakWithAudio(answer, prerecordedAudio[bestMatchKeyword]);
    } else {
        speak(answer);
    }
}

// --- Gemini API 연동 ---
async function getGeminiAnswer(questionText) {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: questionText })
        });
        const data = await response.json();
        return data.answer;
    } catch (error) {
        return null;
    }
}

// --- 답변을 화면에 표시 ---
function showAnswer(answer) {
    if (answerTextElement) {
        answerTextElement.textContent = answer;
        speechBubble.classList.add('visible');
    }
}

// --- 오디오로 말하기 ---
function speakWithAudio(textToSpeak, audioPath) {
    showAnswer(textToSpeak);
    if (window.currentAudio) {
        window.currentAudio.pause();
        window.currentAudio = null;
    }
    loadVideo(SPEAKING_AVATAR_VIDEO_SRC);

    const audio = new Audio(audioPath);
    window.currentAudio = audio;
    audio.onended = () => {
        loadVideo(IDLE_AVATAR_VIDEO_SRC);
        window.currentAudio = null;
    };
    audio.onerror = () => {
        speak(textToSpeak);
    };
    audio.play().catch(() => {
        speak(textToSpeak);
    });
}

// --- TTS로 말하기 ---
function speak(textToSpeak) {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    showAnswer(textToSpeak);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.onstart = () => loadVideo(SPEAKING_AVATAR_VIDEO_SRC);
    utterance.onend = () => loadVideo(IDLE_AVATAR_VIDEO_SRC);
    utterance.onerror = () => {
        showAnswer("죄송합니다, 음성을 재생하는 데 문제가 발생했습니다. 브라우저 설정을 확인해주세요.");
        loadVideo(IDLE_AVATAR_VIDEO_SRC);
    };
    speechSynthesis.speak(utterance);
}

document.addEventListener('DOMContentLoaded', initialize);
