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
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('生成失败，请重试');
        }
        
        const data = await response.json();
        
        // 显示结果
        storyOutput.textContent = data.story;
        resultSection.style.display = 'block';
        
        // 滚动到结果
        setTimeout(() => {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
        
    } catch (error) {
        alert(error.message || '生成失败，请检查网络连接');
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
