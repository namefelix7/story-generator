export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '只支持 POST 请求' });
    }
    
    try {
        const { name, age, occupation, personality, energy, mood, currentSituation, genre, additionalInfo } = req.body;
        
        // 心境映射
        const moodMap = {
            calm: '平静安详',
            anxious: '焦虑不安',
            excited: '兴奋期待',
            melancholy: '忧郁沉思',
            hopeful: '充满希望',
            confused: '迷茫困惑'
        };
        
        // 故事类型映射
        const genreMap = {
            drama: '生活剧',
            romance: '爱情故事',
            adventure: '冒险旅程',
            mystery: '悬疑推理',
            fantasy: '奇幻故事',
            scifi: '科幻故事',
            comedy: '轻喜剧'
        };
        
        // 构建 prompt
        const systemPrompt = `你是一位专业的故事脚本作家，擅长根据人物信息创作引人入胜的故事脚本。
请根据提供的人物信息和设定，创作一个完整的、有深度的故事脚本。
脚本应该包括：开场、冲突/转折、高潮、结局。
注意保持故事逻辑连贯，人物性格一致。
直接输出故事内容，不要有多余的解释。`;
        
        const userPrompt = `请为以下人物创作一个故事脚本：

【人物基本信息】
- 姓名：${name}
- 年龄：${age}
- 职业：${occupation}
- 性格特点：${personality}

【当前状态】
- 精力值：${energy}%
- 心境：${moodMap[mood] || '普通'}
- 当前处境：${currentSituation}

【故事设定】
- 故事类型：${genreMap[genre] || '生活剧'}
${additionalInfo ? `- 额外要求：${additionalInfo}` : ''}

请根据以上信息，创作一个精彩的故事脚本。`;
        
        // 调用硅基流动 API
        const apiKey = process.env.SILICONFLOW_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: 'API Key 未配置' });
        }
        
        const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-ai/DeepSeek-V3',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.8,
                max_tokens: 2000
            })
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            console.error('API Error:', errorData);
            return res.status(500).json({ error: '生成失败，请重试' });
        }
        
        const data = await response.json();
        const story = data.choices?.[0]?.message?.content || '生成失败，未获取到内容';
        
        return res.status(200).json({ story });
        
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: '服务器错误：' + error.message });
    }
}
