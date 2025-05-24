export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    const { question } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ answer: '서버에 API KEY가 설정되어 있지 않습니다.' });
    }
    if (!question) {
        return res.status(400).json({ answer: '질문이 누락되었습니다.' });
    }
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: question }] }]
                })
            }
        );
        const data = await response.json();
        console.log("Gemini API 응답:", data); // ★ 이 줄 추가
        const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        res.status(200).json({ answer });
    } catch (error) {
        console.error("Gemini API 호출 에러:", error); // ★ 이 줄 추가
        res.status(500).json({ answer: 'Gemini API 호출 에러' });
    }
}
