// API Key 管理
const apiKeySection = document.getElementById('apiKeySection');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
const resetApiBtn = document.getElementById('resetApiBtn');
const storyForm = document.getElementById('storyForm');

// 从本地存储读取 API Key
function loadApiKey() {
    const savedKey = localStorage.getItem('siliconflow_api_key');
    if (savedKey) {
        apiKeySection.style.display = 'none';
        storyForm.style.display = 'block';
        return savedKey;
    }
    return null;
}

// 保存 API Key
saveApiKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (!key) {
        alert('请输入 API Key');
        return;
    }
    localStorage.setItem('siliconflow_api_key', key);
    apiKeySection.style.display = 'none';
    storyForm.style.display = 'block';
});

// 重置 API Key
resetApiBtn.addEventListener('click', () => {
    localStorage.removeItem('siliconflow_api_key');
    apiKeyInput.value = '';
    apiKeySection.style.display = 'block';
    storyForm.style.display = 'none';
});

// 初始化
let currentApiKey = loadApiKey();

// 精力滑块实时显示数值
const energySlider = document.getElementById('energy');
const energyValue = document.getElementById('energyValue');

energySlider.addEventListener('input', (e) => {
    energyValue.textContent = e.target.value;
});

// 表单提交
const form = document.getElementById('storyForm');
const submitBtn = document.getElementById('submitBtn');
const resultSection = document.getElementById('resultSection');
const storyOutput = document.getElementById('storyOutput');
const copyBtn = document.getElementById('copyBtn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 获取表单数据
    const formData = {
        name: document.getElementById('name').value.trim(),
        age: document.getElementById('age').value || '未填写',
        occupation: document.getElementById('occupation').value.trim() || '未知',
        personality: document.getElementById('personality').value.trim() || '普通性格',
        energy: document.getElementById('energy').value,
        mood: document.getElementById('mood').value || '平静',
        currentSituation: document.getElementById('currentSituation').value.trim() || '正常生活',
        genre: document.getElementById('genre').value || 'drama',
        additionalInfo: document.getElementById('additionalInfo').value.trim()
    };
    
    // 显示加载状态
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').style.display = 'none';
    submitBtn.querySelector('.btn-loading').style.display = 'flex';
    resultSection.style.display = 'none';
    
    try {
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
- 姓名：${formData.name}
- 年龄：${formData.age}
- 职业：${formData.occupation}
- 性格特点：${formData.personality}

【当前状态】
- 精力值：${formData.energy}%
- 心境：${moodMap[formData.mood] || '普通'}
- 当前处境：${formData.currentSituation}

【故事设定】
- 故事类型：${genreMap[formData.genre] || '生活剧'}
${formData.additionalInfo ? `- 额外要求：${formData.additionalInfo}` : ''}

请根据以上信息，创作一个精彩的故事脚本。`;
        
        // 调用硅基流动 API
        const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentApiKey}`
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
            const errorData = await response.json();
            throw new Error(errorData.error?.message || '生成失败，请检查 API Key 是否正确');
        }
        
        const data = await response.json();
        const story = data.choices?.[0]?.message?.content || '生成失败，未获取到内容';
        
        // 显示结果
        storyOutput.textContent = story;
        resultSection.style.display = 'block';
        
        // 滚动到结果
        setTimeout(() => {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
        
    } catch (error) {
        alert(error.message || '生成失败，请重试');
    } finally {
        // 恢复按钮状态
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').style.display = 'block';
        submitBtn.querySelector('.btn-loading').style.display = 'none';
    }
});

// 复制功能
copyBtn.addEventListener('click', () => {
    const text = storyOutput.textContent;
    navigator.clipboard.writeText(text).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '已复制 ✓';
        copyBtn.style.background = 'var(--accent)';
        copyBtn.style.color = 'var(--bg-paper)';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = 'transparent';
            copyBtn.style.color = 'var(--accent)';
        }, 2000);
    }).catch(() => {
        alert('复制失败，请手动选择文本复制');
    });
});

// 添加输入时的微交互效果
document.querySelectorAll('.field-input, .field-textarea, .field-select').forEach(field => {
    field.addEventListener('focus', () => {
        field.closest('.field-group')?.classList.add('focused');
    });
    field.addEventListener('blur', () => {
        field.closest('.field-group')?.classList.remove('focused');
    });
});
