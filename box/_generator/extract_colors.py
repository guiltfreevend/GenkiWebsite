#!/usr/bin/env python3
"""Extract dominant brand colors from a logo image using k-means clustering."""

import sys
import math
import random
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("ERROR: Pillow is not installed. Run: pip install --break-system-packages Pillow")
    sys.exit(1)


def rgb_to_hex(r, g, b):
    return f"#{r:02X}{g:02X}{b:02X}"


def color_name(r, g, b):
    """Return a rough human-readable color name."""
    total = r + g + b
    if total < 100:
        return "dark"
    if total > 680:
        return "light"
    if r > g and r > b:
        if g > b:
            return "orange" if g > r * 0.6 else "red"
        return "red" if b < r * 0.5 else "pink"
    if g > r and g > b:
        return "green"
    if b > r and b > g:
        return "blue"
    if abs(r - g) < 30 and abs(g - b) < 30:
        return "gray"
    if r > 200 and g > 150 and b < 100:
        return "yellow"
    if r > 150 and b > 150 and g < 100:
        return "purple"
    return "mixed"


def kmeans(pixels, k=5, max_iter=20):
    """Simple k-means clustering on RGB pixels."""
    if len(pixels) <= k:
        return [(p, 1) for p in pixels]

    # Initialize centroids randomly
    random.seed(42)
    centroids = random.sample(pixels, k)

    for _ in range(max_iter):
        # Assign pixels to nearest centroid
        clusters = [[] for _ in range(k)]
        for p in pixels:
            min_dist = float("inf")
            best = 0
            for i, c in enumerate(centroids):
                d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2
                if d < min_dist:
                    min_dist = d
                    best = i
            clusters[best].append(p)

        # Update centroids
        new_centroids = []
        for i, cluster in enumerate(clusters):
            if not cluster:
                new_centroids.append(centroids[i])
            else:
                avg = tuple(sum(c) // len(cluster) for c in zip(*cluster))
                new_centroids.append(avg)

        if new_centroids == centroids:
            break
        centroids = new_centroids

    # Return centroids with cluster sizes
    results = []
    for i, c in enumerate(centroids):
        size = len(clusters[i]) if clusters[i] else 0
        if size > 0:
            results.append((c, size))

    results.sort(key=lambda x: x[1], reverse=True)
    return results


def extract_colors(image_path, num_candidates=3):
    """Extract dominant colors from an image."""
    try:
        img = Image.open(image_path)
    except Exception as e:
        print(f"ERROR: Cannot open image: {e}")
        sys.exit(1)

    # Convert to RGBA
    img = img.convert("RGBA")

    # Resize for speed
    max_dim = 200
    if max(img.size) > max_dim:
        ratio = max_dim / max(img.size)
        new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
        img = img.resize(new_size, Image.LANCZOS)

    # Extract pixels, filtering out transparent/white/black
    pixels = []
    for pixel in img.getdata():
        r, g, b, a = pixel
        if a < 30:
            continue  # Skip transparent
        total = r + g + b
        if total > 720:
            continue  # Skip near-white
        if total < 60:
            continue  # Skip near-black
        pixels.append((r, g, b))

    if not pixels:
        print("ERROR: No usable pixels found (image may be all transparent, white, or black)")
        sys.exit(1)

    # Run k-means
    results = kmeans(pixels, k=5)
    total_pixels = sum(size for _, size in results)

    # Take top candidates
    candidates = results[:num_candidates]

    # Print machine-readable output
    for i, (color, size) in enumerate(candidates, 1):
        print(f"CANDIDATE_{i}={rgb_to_hex(*color)}")

    # Print human-readable preview
    print(f"\nFound {len(candidates)} candidate brand colors:")
    for i, (color, size) in enumerate(candidates, 1):
        hex_code = rgb_to_hex(*color)
        name = color_name(*color)
        pct = round(size / total_pixels * 100)
        bar = "\u2588" * max(1, pct // 5)
        print(f"  {i}. {hex_code} ({name}){' ' * (10 - len(name))}{bar} {pct}% of pixels")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 extract_colors.py <path-to-logo>")
        sys.exit(1)
    extract_colors(sys.argv[1])
