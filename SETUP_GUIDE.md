# Video Splicer - Setup Guide

This project contains **two separate tools** for splicing videos and capturing frames:

1. **Web Application** (for browser use)
2. **Python Command-Line Tool** (for terminal use)

---

## 1️⃣ Web Application

- **Location:** `video-splicer/`
- **Best for:** Non-technical users, browser-based use
- **How to use:**
  1. Follow the instructions in [`video-splicer/README.md`](video-splicer/README.md)
  2. Open the app in your browser, upload a video, and process clips/frames visually

---

## 2️⃣ Python Command-Line Tool

- **Location:** `python-cli/`
- **Best for:** Command-line users, automation, scripting
- **How to use:**
  1. Follow the instructions in [`python-cli/README.md`](python-cli/README.md)
  2. Run the script from the terminal with your video and time instructions

---

## 📋 Time Instruction Formats (Both Tools)

- `13:00` → Capture frame at 13 minutes
- `00:13:00` → Capture frame at 13:00 (HH:MM:SS)
- `13:00-` → From 13 minutes to end of video
- `-13:00` → From start to 13 minutes
- `13:00-13:30` → From 13:00 to 13:30
- `00:13:00-00:13:30` → Full time format

**Multiple instructions:** Separate with commas, e.g. `00:13:00,00:13:00-00:13:30,-00:05:00`

---

## 🆘 Troubleshooting
- **FFmpeg not found**: Install FFmpeg (see tool README)
- **File not found**: Check your video file path
- **Invalid time**: Use formats like `00:13:00`

---

**Choose the tool that fits your workflow!** 