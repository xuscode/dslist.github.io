#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CATIA角色TXT转JSON工具
从roles.txt文件中提取角色和APP映射关系
格式: 每个角色之间用空行分隔,每段第一行是角色名称,后续每行是一个APP名称

使用方法:
    cd scripts
    python txt_to_json.py
"""

import os
import json
from pathlib import Path


def parse_roles_txt(txt_path):
    """
    解析roles.txt文件
    
    Args:
        txt_path: TXT文件路径
        
    Returns:
        dict: 包含roles和apps映射的字典
    """
    roles_data = []
    apps_mapping = {}
    
    with open(txt_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 按双换行符分割成不同的角色块
    role_blocks = content.split('\n\n\n')
    
    print(f"找到 {len(role_blocks)} 个角色块")
    
    for block_idx, block in enumerate(role_blocks, 1):
        lines = [line.strip() for line in block.split('\n') if line.strip()]
        
        if not lines:
            continue
        
        # 第一行是角色名称
        role_name = lines[0]
        
        # 剩余行是APP列表
        apps = lines[1:]
        
        print(f"\n处理角色 {block_idx}: {role_name}")
        print(f"  APP数量: {len(apps)}")
        if apps:
            print(f"  示例APP: {apps[:3]}")
        
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
            "sourceFile": str(txt_path),
            "method": "TXT parsing (more accurate than PDF)"
        },
        "roles": roles_data,
        "apps": apps_mapping
    }
    
    return final_data


def main():
    """主函数"""
    # 设置路径
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    txt_file = project_root / "data" / "CATIA_ROLES" / "roles.txt"
    output_file = project_root / "data" / "roles_apps.json"
    
    print("=" * 70)
    print("CATIA角色TXT转JSON工具")
    print("=" * 70)
    print(f"输入文件: {txt_file}")
    print(f"输出文件: {output_file}")
    print("=" * 70)
    
    # 检查文件是否存在
    if not txt_file.exists():
        print(f"错误: 文件不存在 - {txt_file}")
        return False
    
    # 解析TXT文件
    print("\n开始解析...")
    final_data = parse_roles_txt(str(txt_file))
    
    # 写入JSON文件
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(final_data, f, ensure_ascii=False, indent=2)
        
        print("\n" + "=" * 70)
        print("✓ 成功生成JSON文件!")
        print("=" * 70)
        print(f"输出文件: {output_file}")
        print(f"角色数量: {final_data['metadata']['totalRoles']}")
        print(f"APP数量: {final_data['metadata']['totalApps']} (去重后)")
        print("=" * 70)
        
        # 显示统计信息
        print("\n前5个角色及其APP数量:")
        for i, role in enumerate(final_data['roles'][:5], 1):
            print(f"  {i}. {role['roleName']}: {len(role['apps'])} 个APP")
        
        print("\n前5个APP及其包含的角色数量:")
        sample_apps = list(final_data['apps'].items())[:5]
        for app, roles in sample_apps:
            print(f"  - {app}: {len(roles)} 个角色")
        
        print("\n✓ 处理完成!")
        print(f"\n下一步:")
        print(f"1. 检查生成的文件: {output_file}")
        print(f"2. 启动Web服务器查看结果")
        
        return True
        
    except Exception as e:
        print(f"\n✗ 错误: 无法写入JSON文件: {e}")
        return False


if __name__ == "__main__":
    main()
