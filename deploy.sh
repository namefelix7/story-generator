#!/bin/bash
# 故事工坊部署脚本

echo "🚀 开始部署故事工坊..."

# 进入项目目录
cd ~/.qclaw/workspace/story-generator

# 创建 .env 文件
echo "SILICONFLOW_API_KEY=sk-qqnejbkkdsvvidugibphyycydeblmchhgrsfrhcewmxxjypr" > .env

echo ""
echo "✅ 项目已准备好！"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 下一步操作："
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1️⃣ 打开浏览器，访问："
echo "   👉 https://github.com/new"
echo ""
echo "2️⃣ 创建仓库："
echo "   - Repository name: story-generator"
echo "   - 选择 Public"
echo "   - 点击 'Create repository'"
echo ""
echo "3️⃣ 在终端运行以下命令："
echo ""
echo "   cd ~/.qclaw/workspace/story-generator"
echo "   git remote add origin https://github.com/felix7/story-generator.git"
echo "   git push -u origin master"
echo ""
echo "4️⃣ 打开 Vercel 部署："
echo "   👉 https://vercel.com/new"
echo "   - Import 仓库 story-generator"
echo "   - 添加 Environment Variable:"
echo "     Key: SILICONFLOW_API_KEY"
echo "     Value: sk-qqnejbkkdsvvidugibphyycydeblmchhgrsfrhcewmxxjypr"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
