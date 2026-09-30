"""Phase 1 operator replay: frozen checkpoint renders into ignored staging only."""
import datetime
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys

COMPOSITIONS = {
    "wood-frog": "Magnivis-Wood-Frog",
    "wood-frog-tiktok": "Magnivis-Wood-Frog-TikTok",
    "speed-of-light": "Magnivis-Speed-Of-Light",
    "speed-of-light-tiktok": "Magnivis-Speed-Of-Light-TikTok",
    "earth-to-stars": "Magnivis-Earth-To-Stars",
    "ocean-depth": "Magnivis-Ocean-Depth",
    "billion-dollars": "Magnivis-Billion-Dollars",
    "human-engineering": "Magnivis-Human-Engineering",
}
nodebin = Path(os.environ.get("MAGNIVIS_RECOVERY_NODE_BIN", "/Users/ahmetnishefci/.nvm/versions/node/v22.23.3/bin"))
env = dict(os.environ, PATH=str(nodebin) + os.pathsep + os.environ["PATH"])
for request in sys.argv[1:]:
    vid = request.removesuffix(":repeat")
    composition = COMPOSITIONS[vid]
    stage = Path("recovery-work") / vid
    stage.mkdir(parents=True, exist_ok=True)
    suffix = "-repeat" if request.endswith(":repeat") else ""
    output = stage / (vid + "-narrated" + suffix + ".mp4")
    if output.exists():
        raise RuntimeError("Refusing to overwrite existing staging evidence: " + str(output))
    cmd = ["pnpm", "exec", "remotion", "render", "src/index.ts", composition, str(output), "--codec=h264", "--audio-codec=aac", "--video-bitrate=8M", "--audio-bitrate=192K", "--pixel-format=yuv420p", "--overwrite"]
    record = {"label": "RECOVERY-GENERATED", "videoId": vid, "command": cmd, "output": str(output), "startedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(), "sourceCommit": subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip()}
    with (stage / ("render" + suffix + ".log")).open("w") as log:
        result = subprocess.run(cmd, env=env, stdout=log, stderr=subprocess.STDOUT)
    record["exitCode"] = result.returncode
    record["finishedAt"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    if result.returncode == 0:
        record["sha256"] = hashlib.sha256(output.read_bytes()).hexdigest()
        record["bytes"] = output.stat().st_size
    (stage / ("render" + suffix + ".json")).write_text(json.dumps(record, indent=2) + "\n")
    print(json.dumps(record), flush=True)
    if result.returncode:
        raise SystemExit(result.returncode)
