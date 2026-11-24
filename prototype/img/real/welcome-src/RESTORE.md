# Source videos (not stored in git)

Full-length YouTube sources for the welcome montage. `montage.sh` cuts 3 s clips from them;
the finished clips are already in `../welcome-clips/`, so these are only needed to re-cut.

Re-download them into this folder (same file names as before):

```
cd prototype/img/real/welcome-src
yt-dlp -o "%(id)s.%(ext)s" --merge-output-format mp4 \
  "https://www.youtube.com/watch?v=-hztugvvHGQ" \
  "https://www.youtube.com/watch?v=08PNZxv0hh4" \
  "https://www.youtube.com/watch?v=NYUVOhqazUU" \
  "https://www.youtube.com/watch?v=xPT1hNC8x7A"
```

| File | Video | Length |
|---|---|---|
| -hztugvvHGQ.mp4 | Adventure Beach Waterpark & Camayan Resort Walking Tours | 18:21 |
| 08PNZxv0hh4.mp4 | Segara Villas, Subic | 1:24 |
| NYUVOhqazUU.mp4 | The Lighthouse Marina Resort, Subic Bay | 6:33 |
| xPT1hNC8x7A.mp4 | Ocean Adventure Dolphin Show Subic Bay | 27:13 |
