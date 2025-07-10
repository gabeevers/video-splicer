# Video Splicer - Python Command-Line Tool

A simple Python script to extract video clips and frames from an MP4 file using time-based instructions.

## 🚀 Quick Start

1. **Install Python** (https://python.org/)
2. **Install FFmpeg**
   - macOS: `brew install ffmpeg`
   - Windows: Download from https://ffmpeg.org/download.html
   - Linux: `sudo apt install ffmpeg`
3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
4. **Run the script**
   ```bash
   python video_splicer.py your_video.mp4 "00:13:00,00:13:00-00:13:30,-00:05:00,00:20:00-,00:25:00"
   ```

## 📋 Time Instruction Formats

- `13:00` → Capture frame at 13 minutes
- `00:13:00` → Capture frame at 13:00 (HH:MM:SS)
- `13:00-` → From 13 minutes to end of video
- `-13:00` → From start to 13 minutes
- `13:00-13:30` → From 13:00 to 13:30
- `00:13:00-00:13:30` → Full time format

**Multiple instructions:** Separate with commas, e.g. `00:13:00,00:13:00-00:13:30,-00:05:00`

## 📁 Output
- All clips and frames are saved in the `output_clips/` folder.
- Files are named like `original_filename_clip_1.mp4` or `original_filename_frame_1.jpg`.

## 🆘 Troubleshooting
- **FFmpeg not found**: Install FFmpeg (see above)
- **Module not found**: Run `pip install -r requirements.txt`
- **File not found**: Check your video file path
- **Invalid time**: Use formats like `00:13:00`

---

**Ready to process videos from the command line!** 