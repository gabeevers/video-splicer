# Video Splicer - Web Application

A modern web app for creating video clips and capturing frames from MP4 videos using time-based instructions.

## 🚀 Quick Start

1. **Install Node.js**: https://nodejs.org/
2. **Install FFmpeg**:
   - macOS: `brew install ffmpeg`
   - Windows: Download from https://ffmpeg.org/download.html
   - Linux: `sudo apt install ffmpeg`
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the app**:
   ```bash
   npm run dev
   ```
5. **Open your browser** to http://localhost:3000
6. **Upload an MP4 video** and add time instructions
7. **Download your generated clips and frames**

## 📋 Time Instruction Formats

- `13:00` → Capture frame at 13 minutes
- `00:13:00` → Capture frame at 13:00 (HH:MM:SS)
- `13:00-` → From 13 minutes to end of video
- `-13:00` → From start to 13 minutes
- `13:00-13:30` → From 13:00 to 13:30
- `00:13:00-00:13:30` → Full time format

**Multiple instructions:** Separate with commas, e.g. `00:13:00,00:13:00-00:13:30,-00:05:00`

## 📁 Output
- All clips and frames are saved in `public/output_clips/`.
- Files are named like `original_filename_clip_1.mp4` or `original_filename_frame_1.jpg`.

## 🆘 Troubleshooting
- **FFmpeg not found**: Install FFmpeg (see above)
- **Port already in use**: Try http://localhost:3001
- **File upload fails**: Make sure you're using an MP4 file
- **Invalid time**: Use formats like `00:13:00`

---

## 🐍 Looking for the Python Command-Line Tool?
See the [`python-cli/`](../python-cli/) folder for the CLI version and its instructions.

---

**Ready to process videos in your browser!**
