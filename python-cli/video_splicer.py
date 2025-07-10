import os
import re
import sys
import subprocess
from moviepy.video.io.VideoFileClip import VideoFileClip

def time_to_seconds(timestr):
    parts = list(map(int, timestr.strip().split(":")))
    if len(parts) == 3:
        return parts[0] * 3600 + parts[1] * 60 + parts[2]
    elif len(parts) == 2:
        return parts[0] * 60 + parts[1]
    elif len(parts) == 1:
        return parts[0]
    return None

def parse_clip_instruction(instruction, duration):
    instruction = instruction.strip()
    if not instruction:
        return None

    if "-" not in instruction:
        # Just a frame capture
        t = time_to_seconds(instruction)
        if t is None or t > duration:
            return None
        return ("frame", t, t)

    if instruction.startswith("-"):
        end = time_to_seconds(instruction[1:])
        if end is None or end > duration:
            return None
        return ("clip", 0, end)

    if instruction.endswith("-"):
        start = time_to_seconds(instruction[:-1])
        if start is None or start > duration:
            return None
        return ("clip", start, duration)

    parts = instruction.split("-")
    if len(parts) == 2:
        start = time_to_seconds(parts[0])
        end = time_to_seconds(parts[1])
        if start is None or end is None or start >= end or end > duration:
            return None
        return ("clip", start, end)

    return None

def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("video", help="Input .mp4 file")
    parser.add_argument("instructions", help="Clip instructions string (e.g. '00:13:00,-00:05:00,00:20:00-')")
    args = parser.parse_args()

    video_path = args.video
    instructions = args.instructions.split(",")

    if not os.path.exists(video_path):
        print(f"❌ File not found: {video_path}")
        return

    video = VideoFileClip(video_path)
    duration = video.duration
    base = os.path.splitext(os.path.basename(video_path))[0]
    output_dir = "output_clips"
    os.makedirs(output_dir, exist_ok=True)

    clip_counter = 1
    for instr in instructions:
        parsed = parse_clip_instruction(instr, duration)
        if not parsed:
            print(f"⚠️ Skipping invalid instruction: {instr}")
            continue

        kind, start, end = parsed
        if kind == "frame":
            out_path = os.path.join(output_dir, f"{base}_frame_{clip_counter}.jpg")
            try:
                video.save_frame(out_path, t=start)
                print(f"🖼️  Saved frame at {start}s → {out_path}")
            except Exception as e:
                print(f"❌ Failed to save frame: {e}")
        elif kind == "clip":
            out_path = os.path.join(output_dir, f"{base}_clip_{clip_counter}.mp4")
            try:
                command = [
                    "ffmpeg",
                    "-y",
                    "-ss", str(start),
                    "-i", video_path,
                    "-t", str(end - start),
                    "-c", "copy",
                    out_path
                ]
                subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                print(f"🎞️  Saved clip {start}-{end}s → {out_path}")
            except Exception as e:
                print(f"❌ Failed to extract clip: {e}")
        clip_counter += 1

    video.close()
    print("✅ Done!")

if __name__ == "__main__":
    main()