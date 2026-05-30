import os
import sys
import subprocess

# 強制重新設定 stdout 與 stderr 編碼為 UTF-8，一勞永逸解決 Windows cp950 (Big5) 控制台列印日文長音的崩潰問題
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

def install_package(package):
    print(f"正在檢查並安裝 {package}...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

# 確保安裝了 yt-dlp
try:
    import ytdlp
except ImportError:
    install_package("yt-dlp")

print("yt-dlp 準備就緒！")

# 建立儲存音樂的 public/audio 目錄
audio_dir = os.path.join("public", "audio")
if not os.path.exists(audio_dir):
    os.makedirs(audio_dir)
    print(f"已建立音訊資料夾: {audio_dir}")

# 定義要下載的寶可夢經典神曲 (簡化歌名，避免 Big5 特殊字元衝突)
songs = {
    "title_theme": {
        "search": "ytsearch1:めざせポケモンマスター 松本梨香",
        "name": "目標是神奇寶貝大師 主題曲",
        "file": "title_theme.m4a"
    },
    "map_theme": {
        "search": "ytsearch1:Pokemon Route 1 Theme Kanto",
        "name": "Kanto 1 號道路冒險曲",
        "file": "map_theme.m4a"
    },
    "battle_theme": {
        "search": "ytsearch1:Pokemon Wild Battle Theme Kanto",
        "name": "關都野生對戰曲",
        "file": "battle_theme.m4a"
    },
    "center_theme": {
        "search": "ytsearch1:Pokemon Center Theme Kanto",
        "name": "寶可夢中心治療曲",
        "file": "center_theme.m4a"
    }
}

for key, info in songs.items():
    output_path = os.path.join(audio_dir, info["file"])
    
    # 如果已經下載過，跳過
    if os.path.exists(output_path):
        print(f"【{info['name']}】已經存在，跳過下載。")
        continue

    print(f"\n==================================================")
    print(f"正在為你從 YouTube 抓取前三名神曲：{info['name']}")
    print(f"==================================================")

    # yt-dlp 命令配置：下載最佳 m4a 音訊，限制長度以節省時間，直接存入目的地
    # 限制下載長度為前 10 分鐘，防止下載超長混音集
    cmd = [
        "yt-dlp",
        "--format", "ba[ext=m4a]/ba",  # 優先選擇最佳 m4a 音訊格式（瀏覽器 100% 原生支援，且不需要 ffmpeg）
        "--match-filter", "duration < 600", # 影片長度需小於 10 分鐘，精準下載原曲
        "--output", output_path,
        info["search"]
    ]

    try:
        subprocess.check_call(cmd)
        print(f"成功下載並儲存：{output_path}")
    except Exception as e:
        print(f"下載 {info['name']} 失敗，嘗試備用方案 (無長度限制下載)...")
        # 備用方案
        backup_cmd = [
            "yt-dlp",
            "--format", "ba[ext=m4a]/ba",
            "--output", output_path,
            info["search"]
        ]
        try:
            subprocess.check_call(backup_cmd)
            print(f"成功備用下載並儲存：{output_path}")
        except Exception as err:
            print(f"❌ 嚴重錯誤：無法下載 {info['name']}。錯誤訊息: {err}")

print("\n🎉 恭喜！所有寶可夢經典音樂抓取程序執行完畢！")
