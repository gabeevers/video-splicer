import { NextRequest, NextResponse } from "next/server";
import ffmpeg from "fluent-ffmpeg";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import os from "os";

// Use system FFmpeg
ffmpeg.setFfmpegPath('/opt/homebrew/bin/ffmpeg');
console.log("Using FFmpeg path: /opt/homebrew/bin/ffmpeg");

// Time parsing function matching the Python script
function timeToSeconds(timestr: string): number | null {
  const parts = timestr.trim().split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    return parts[0];
  }
  return null;
}

// Parse clip instruction matching the Python script logic
function parseClipInstruction(instruction: string, duration: number) {
  instruction = instruction.trim();
  if (!instruction) return null;

  if (!instruction.includes("-")) {
    // Just a frame capture
    const t = timeToSeconds(instruction);
    if (t === null || t > duration) return null;
    return { kind: "frame", start: t, end: t };
  }

  if (instruction.startsWith("-")) {
    const end = timeToSeconds(instruction.slice(1));
    if (end === null || end > duration) return null;
    return { kind: "clip", start: 0, end };
  }

  if (instruction.endsWith("-")) {
    const start = timeToSeconds(instruction.slice(0, -1));
    if (start === null || start > duration) return null;
    return { kind: "clip", start, end: duration };
  }

  const parts = instruction.split("-");
  if (parts.length === 2) {
    const start = timeToSeconds(parts[0]);
    const end = timeToSeconds(parts[1]);
    if (start === null || end === null || start >= end || end > duration) return null;
    return { kind: "clip", start, end };
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("video") as File;
    const instructions = formData.get("instructions") as string;

    if (!file || !instructions) {
      return NextResponse.json({ error: "Missing input" }, { status: 400 });
    }

    // Create temp directory and output directory
    const tempDir = os.tmpdir();
    const outputDir = path.join(process.cwd(), "public", "output_clips");
    await fs.mkdir(outputDir, { recursive: true });

    // Save uploaded file to temp location
    const inputPath = path.join(tempDir, `${uuidv4()}.mp4`);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(inputPath, fileBuffer);

    // Get video duration
    const duration = await new Promise<number>((resolve, reject) => {
      ffmpeg.ffprobe(inputPath, (err, metadata) => {
        if (err) {
          console.error("FFprobe error:", err);
          reject(err);
        } else {
          console.log("Video duration:", metadata.format.duration);
          resolve(metadata.format.duration || 0);
        }
      });
    });

    const base = path.parse(file.name).name;
    const instructionList = instructions.split(",").map(s => s.trim());
    const outputFiles: string[] = [];
    let clipCounter = 1;

    for (const instruction of instructionList) {
      const parsed = parseClipInstruction(instruction, duration);
      if (!parsed) {
        console.warn(`⚠️ Skipping invalid instruction: ${instruction}`);
        continue;
      }

      const { kind, start, end } = parsed;

      if (kind === "frame") {
        const framePath = path.join(outputDir, `${base}_frame_${clipCounter}.jpg`);
        
        await new Promise<void>((resolve, reject) => {
          ffmpeg(inputPath)
            .screenshots({
              timestamps: [start],
              filename: `${base}_frame_${clipCounter}.jpg`,
              folder: outputDir,
            })
            .on("end", () => {
              console.log(`Frame captured: ${base}_frame_${clipCounter}.jpg`);
              outputFiles.push(`/output_clips/${base}_frame_${clipCounter}.jpg`);
              resolve();
            })
            .on("error", (err) => {
              console.error("Frame capture error:", err);
              reject(err);
            });
        });
      } else if (kind === "clip") {
        const clipPath = path.join(outputDir, `${base}_clip_${clipCounter}.mp4`);
        
        await new Promise<void>((resolve, reject) => {
          const command = ffmpeg(inputPath)
            .inputOptions([`-ss ${start}`])
            .outputOptions([`-t ${end - start}`])
            .output(clipPath)
            .on("end", () => {
              console.log(`Clip created: ${base}_clip_${clipCounter}.mp4`);
              outputFiles.push(`/output_clips/${base}_clip_${clipCounter}.mp4`);
              resolve();
            })
            .on("error", (err) => {
              console.error("Clip creation error:", err);
              reject(err);
            });
          
          command.run();
        });
      }
      
      clipCounter++;
    }

    // Clean up temp file
    await fs.unlink(inputPath);

    return NextResponse.json({ files: outputFiles });
  } catch (err) {
    console.error("❌ Splicing failed:", err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}