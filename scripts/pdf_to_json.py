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
    """从PDF文件中提取所有页面的文本内容"""
    try:
        text_content = ""
        with pdfplumber.open(pdf_path) as pdf:
            total_pages = len(pdf.pages)
            print(f"  PDF总页数: {total_pages}")
            
            for page_num, page in enumerate(pdf.pages, 1):
                text = page.extract_text()
                if text:
                    text_content += text + "\n"
                    print(f"  第{page_num}页提取成功")
        
        print(f"  总文本长度: {len(text_content)} 字符")
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
    从 PDF文本中提取APP列表
    APP名称通常每行一个,需要识别有效的APP名称行
    """
    apps = []
    
    # 定义需要跳过的行模式
    skip_patterns = [
        r'^https?://',  # URL
        r'^\d+/\d+',   # 页码如 1/3
        r'^Building and Civil',  # 角色标题
        r'^Role \(',  # 角色标识
        r'^\(B[A-Z]{2,4}C\)$',  # 角色代码如 (BCELC)
        r'Engineer \(BCMDC\)$',  # Building Design Engineer (BCMDC)
        r'Designer \(BUDEC\)$',  # Building Designer (BUDEC)
        r'^$',  # 空行
    ]
    
    # 定义APP名称的特征模式
    app_indicators = [
        r'^\d+D ',  # 以数字+D开头,如 "2D Layout", "3D Annotation"
        r'^Converter for ',  # 转换器
        r'^Design ',  # 设计相关
        r'^Assembly ',  # 装配
        r'^Collaborative ',  # 协作
        r'^Data ',  # 数据
        r'^Bookmark ',  # 书签
        r'^Component ',  # 组件
        r'^Building ',  # 建筑
        r'^Drafting',  # 制图
        r'^Engineering ',  # 工程
        r'^Exchange ',  # 交换
        r'^Imagine ',  # 想象
        r'^Interference ',  # 干涉
        r'^Know-how ',  # 知识
        r'^Live ',  # 实时
        r'^Manufacturing ',  # 制造
        r'^Material ',  # 材料
        r'^Mechanical ',  # 机械
        r'^Multi[- ]',  # 多学科
        r'^Natural ',  # 自然
        r'^PartSupply',  # 零件供应
        r'^Product ',  # 产品
        r'^Quality ',  # 质量
        r'^Bent ',  # 弯曲
        r'^Piping',  # 管道
        r'^Electrical',  # 电气
        r'^HVAC',  # 暖通
        r'^Structural',  # 结构
        r'^Reinforcement',  # 钢筋
        r'^Formwork',  # 模板
        r'^Costing',  # 成本
        r'^Sustainability',  # 可持续性
        r'^Relations',  # 关系
        r'^Report ',  # 报告
        r'^Simulation',  # 仿真
        r'^Sketch ',  # 草图
        r'^Smart ',  # 智能
        r'^System ',  # 系统
        r'^Terrain',  # 地形
        r'^Weight',  # 重量
        r'^Analysis',  # 分析
        r'^Definition',  # 定义
        r'^Integration',  # 集成
        r'^Management',  # 管理
        r'^Essentials',  # 基础
        r'^Resources',  # 资源
        r'^Templates',  # 模板
        r'^Capture',  # 捕获
        r'^Finder',  # 查找器
        r'^Reuse',  # 重用
        r'^Control',  # 控制
        r'^Specification',  # 规格
        r'^Adapter',  # 适配器
        r'^Review',  # 审查
        r'^Rendering',  # 渲染
        r'^Check',  # 检查
        r'^Shape',  # 形状
        r'^Context',  # 上下文
        r'^Sheet',  # 钣金
        r'^Generative',  # 生成式
        r'^Functional',  # 功能性
        r'^Composites',  # 复合材料
        r'^Tolerance',  # 公差
        r'^Kinematics',  # 运动学
        r'^Optimization',  # 优化
        r'^Validation',  # 验证
        r'^Visualization',  # 可视化
        r'^Collaboration',  # 协作
        r'^Innovation',  # 创新
    ]
    
    lines = text.split('\n')
    in_app_list = False
    
    for line in lines:
        line = line.strip()
        
        # 跳过空行
        if not line:
            continue
        
        # 检查是否应该跳过此行
        should_skip = False
        for pattern in skip_patterns:
            if re.search(pattern, line, re.IGNORECASE):
                should_skip = True
                break
        
        if should_skip:
            continue
        
        # 检查是否是APP名称
        is_app = False
        for pattern in app_indicators:
            if re.match(pattern, line, re.IGNORECASE):
                is_app = True
                break
        
        # 如果匹配APP模式,添加到列表
        if is_app and len(line) > 3:
            # 避免重复
            if line not in apps:
                apps.append(line)
    
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
