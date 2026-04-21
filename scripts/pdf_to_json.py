#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CATIA角色PDF转JSON工具
从CATIA_ROLES目录下的PDF文件中提取角色名称和APP列表
生成双向映射的JSON数据文件

使用方法:
    cd scripts
    pip install -r requirements.txt
    python pdf_to_json.py
"""

import os
import json
import re
from pathlib import Path

try:
    import pdfplumber
except ImportError:
    print("错误: 未安装pdfplumber库")
    print("请运行: pip install -r requirements.txt")
    exit(1)


def extract_text_from_pdf(pdf_path):
    """从PDF文件中提取文本内容"""
    try:
        text_content = ""
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    text_content += text + "\n"
        return text_content
    except Exception as e:
        print(f"警告: 无法读取PDF文件 {pdf_path}: {e}")
        return ""


def extract_role_name_from_filename(filename):
    """从文件名中提取角色名称"""
    # 移除.pdf扩展名
    name = filename.replace('.pdf', '')
    return name.strip()


def extract_apps_from_text(text):
    """
    从PDF文本中提取APP列表
    这里需要根据实际PDF内容调整解析逻辑
    """
    apps = []
    
    # 尝试多种模式匹配APP名称
    # 模式1: 查找可能的APP代码(如大写字母组合)
    app_patterns = [
        r'\b[A-Z]{2,10}\b',  # 2-10个大写字母
        r'\b[A-Z][a-zA-Z0-9]{2,20}\b',  # 首字母大写的单词
    ]
    
    # 常见的CATIA/3DEXPERIENCE APP关键词
    catia_keywords = [
        'CATIA', 'DELMIA', 'SIMULIA', 'ENOVIA', 'BIOVIA',
        '3DEXCITE', 'GEOVIA', 'NETVIBES', 'CENTRIC PLM'
    ]
    
    lines = text.split('\n')
    for line in lines:
        line = line.strip()
        
        # 跳过空行和太短的行
        if len(line) < 3:
            continue
            
        # 查找包含CATIA产品线的行
        for keyword in catia_keywords:
            if keyword in line.upper():
                # 提取可能的APP名称
                # 这里需要根据实际PDF结构调整
                potential_apps = re.findall(r'\b[A-Z][A-Z0-9\-]{2,30}\b', line)
                for app in potential_apps:
                    if app not in apps and len(app) > 2:
                        apps.append(app)
                break
    
    # 如果没有找到足够的APP,尝试更宽松的模式
    if len(apps) < 3:
        # 查找所有可能的大写缩写
        all_caps = re.findall(r'\b[A-Z]{3,15}\b', text)
        for cap in all_caps:
            if cap not in apps and len(cap) >= 3:
                # 过滤掉常见的非APP词汇
                if cap not in ['THE', 'AND', 'FOR', 'WITH', 'FROM', 'THIS', 'THAT']:
                    apps.append(cap)
    
    return apps


def process_pdfs(input_dir, output_file):
    """
    处理所有PDF文件并生成JSON
    
    Args:
        input_dir: PDF文件所在目录
        output_file: 输出JSON文件路径
    """
    input_path = Path(input_dir)
    
    if not input_path.exists():
        print(f"错误: 目录不存在 - {input_dir}")
        return False
    
    # 数据结构
    roles_data = []
    apps_mapping = {}
    
    # 获取所有PDF文件
    pdf_files = list(input_path.glob('*.pdf'))
    
    if not pdf_files:
        print(f"警告: 在 {input_dir} 中未找到PDF文件")
        return False
    
    print(f"找到 {len(pdf_files)} 个PDF文件,开始处理...")
    
    for pdf_file in pdf_files:
        print(f"\n处理: {pdf_file.name}")
        
        # 提取角色名称
        role_name = extract_role_name_from_filename(pdf_file.name)
        print(f"  角色名称: {role_name}")
        
        # 提取PDF文本
        text_content = extract_text_from_pdf(str(pdf_file))
        
        if not text_content:
            print(f"  警告: 未能从 {pdf_file.name} 提取文本")
            continue
        
        # 提取APP列表
        apps = extract_apps_from_text(text_content)
        print(f"  提取到 {len(apps)} 个APP: {apps[:5]}..." if len(apps) > 5 else f"  提取到 {len(apps)} 个APP: {apps}")
        
        # 添加到角色数据
        role_entry = {
            "roleName": role_name,
            "apps": apps
        }
        roles_data.append(role_entry)
        
        # 构建APP到角色的反向映射
        for app in apps:
            if app not in apps_mapping:
                apps_mapping[app] = []
            if role_name not in apps_mapping[app]:
                apps_mapping[app].append(role_name)
    
    # 构建最终JSON结构
    final_data = {
        "metadata": {
            "generatedAt": "2026-04-21",
            "totalRoles": len(roles_data),
            "totalApps": len(apps_mapping),
            "sourceDirectory": str(input_dir)
        },
        "roles": roles_data,
        "apps": apps_mapping
    }
    
    # 写入JSON文件
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(final_data, f, ensure_ascii=False, indent=2)
        print(f"\n✓ 成功生成JSON文件: {output_file}")
        print(f"  角色数量: {len(roles_data)}")
        print(f"  APP数量: {len(apps_mapping)}")
        return True
    except Exception as e:
        print(f"错误: 无法写入JSON文件: {e}")
        return False


def main():
    """主函数"""
    # 设置路径
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    input_dir = project_root / "data" / "CATIA_ROLES"
    output_file = project_root / "data" / "roles_apps.json"
    
    print("=" * 60)
    print("CATIA角色PDF转JSON工具")
    print("=" * 60)
    print(f"输入目录: {input_dir}")
    print(f"输出文件: {output_file}")
    print("=" * 60)
    
    # 处理PDF文件
    success = process_pdfs(str(input_dir), str(output_file))
    
    if success:
        print("\n✓ 处理完成!")
        print(f"\n下一步:")
        print(f"1. 检查生成的文件: {output_file}")
        print(f"2. 如需调整解析逻辑,编辑 pdf_to_json.py 中的 extract_apps_from_text 函数")
        print(f"3. 启动Web服务器查看结果")
    else:
        print("\n✗ 处理失败,请检查错误信息")
    
    return success


if __name__ == "__main__":
    main()
