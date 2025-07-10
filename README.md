# Video Splicer

A simple tool for creating video clips and capturing frames from MP4 videos based on time instructions.

## 🚀 Quick Start

### **Option A: Web Application (Easiest)**

1. **Install Node.js** from https://nodejs.org/
2. **Install FFmpeg**:
   - macOS: `brew install ffmpeg`
   - Windows: Download from https://ffmpeg.org/download.html
   - Linux: `sudo apt install ffmpeg`
3. **Start the app**:
   ```bash
   cd video-splicer
   npm install
   npm run dev
   ```
4. **Open browser** to http://localhost:3000
5. **Upload video** and add time instructions
6. **Download** your generated clips and frames

### **Option B: Python Script**

1. **Install Python** from https://python.org/
2. **Install FFmpeg** (same as above)
3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Run the script**:
   ```bash
   python video_splicer.py your_video.mp4 "00:13:00,00:13:00-00:13:30"
   ```

## 📋 Time Instructions

### **Frame Capture**
- `13:00` → Capture frame at 13 minutes
- `00:13:00` → Full time format (HH:MM:SS)

### **Video Clips**
- `13:00-` → From 13 minutes to end of video
- `-13:00` → From start to 13 minutes
- `13:00-13:30` → From 13:00 to 13:30
- `00:13:00-00:13:30` → Full time format

### **Multiple Instructions**
Separate with commas: `00:13:00,00:13:00-00:13:30,-00:05:00,00:20:00-,00:25:00`

## 🎬 Example

**Input**: `demo.mp4` with instructions `"00:13:00,00:13:00-00:13:30,-00:05:00,00:20:00-,00:25:00"`

**Output**:
- `demo_frame_1.jpg` (frame at 13:00)
- `demo_clip_2.mp4` (13:00 to 13:30)
- `demo_clip_3.mp4` (start to 5:00)
- `demo_clip_4.mp4` (20:00 to end)
- `demo_frame_5.jpg` (frame at 25:00)

## 📁 Files

- **Python Script**: `video_splicer.py`
- **Web App**: `video-splicer/` folder
- **Sample Video**: `sample_input/yasirpod.mp4`
- **Output**: `output_clips/` folder

## 🔧 Troubleshooting

- **FFmpeg not found**: Install FFmpeg (see Quick Start)
- **Port in use**: Try http://localhost:3001
- **Invalid time**: Use formats like `00:13:00`
- **File not found**: Check your video file path

## 📖 Detailed Instructions

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete setup and usage instructions.

---

**Ready to process videos!** 🎉