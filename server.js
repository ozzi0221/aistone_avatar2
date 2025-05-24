const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// 회사소개서 텍스트를 미리 읽어서 변수에 저장
const introText = fs.readFileSync('aistone_intro.txt', 'utf-8');

app.post('/api/gemini', async (req, res) => {
    const { question } = req.body;

    // Gemini에게 전달할 프롬프트 설계
    const prompt = `
아래 회사소개서 내용을 참고해서 답변해 주세요.
만약 소개서에 없는 내용이거나 알 수 없는 질문이면 반드시 "자세한 문의는 이메일로 연락 주세요: aistonehub@gmail.com"으로 안내해 주세요.

회사소개서:
${introText}

질문:
${question}
    `;

    try {
        // Gemini API 호출 (Google Generative Language API)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        const data = await response.json();
        // 답변 추출
        const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        res.json({ answer });
    } catch (error) {
        console.error('Gemini API 호출 에러:', error);
        res.status(500).json({ answer: '서버 오류가 발생했습니다.' });
    }
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
