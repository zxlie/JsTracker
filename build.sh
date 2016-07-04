#!/bin/sh
MOD_NAME="JsTracker"

#把需要的文件都copy到相应的目录下
rm -rf output && mkdir output
cp -r static output/
cp -r _locales output/
cp online.manifest.json output/manifest.json


# 冗余文件清理
cd output/

#生成zip包
zip -r $MOD_NAME.zip $MOD_NAME/ > /dev/null

echo ""
echo "生成压缩包成功，可发布到Chrome web store了！"
