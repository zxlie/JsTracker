#!/bin/sh
MOD_NAME="JsTracker"

#把需要的文件都copy到相应的目录下
rm -rf output && mkdir -p output/${MOD_NAME}
cp -r static output/${MOD_NAME}/
cp manifest.json output/${MOD_NAME}/

# 冗余文件清理
cd output/

#生成zip包
zip -r $MOD_NAME.zip $MOD_NAME/

echo ""
echo "生成压缩包成功，可发布到Chrome web store了！"
