#!/usr/bin/env python3
"""Blend two hex colors using mathematical HSL averaging and smart harmonious blending."""

import sys
import math


def hex_to_rgb(hex_color):
    """Parse hex color string to (R, G, B) tuple."""
    h = hex_color.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def rgb_to_hex(r, g, b):
    """Convert RGB to hex string."""
    return f"#{int(r):02X}{int(g):02X}{int(b):02X}"


def rgb_to_hsl(r, g, b):
    """Convert RGB (0-255) to HSL (H: 0-360, S: 0-1, L: 0-1)."""
    r, g, b = r / 255.0, g / 255.0, b / 255.0
    max_c = max(r, g, b)
    min_c = min(r, g, b)
    l = (max_c + min_c) / 2.0

    if max_c == min_c:
        h = s = 0.0
    else:
        d = max_c - min_c
        s = d / (2.0 - max_c - min_c) if l > 0.5 else d / (max_c + min_c)

        if max_c == r:
            h = (g - b) / d + (6 if g < b else 0)
        elif max_c == g:
            h = (b - r) / d + 2
        else:
            h = (r - g) / d + 4
        h *= 60

    return h, s, l


def hsl_to_rgb(h, s, l):
    """Convert HSL (H: 0-360, S: 0-1, L: 0-1) to RGB (0-255)."""
    if s == 0:
        v = int(round(l * 255))
        return v, v, v

    def hue_to_rgb(p, q, t):
        if t < 0:
            t += 1
        if t > 1:
            t -= 1
        if t < 1 / 6:
            return p + (q - p) * 6 * t
        if t < 1 / 2:
            return q
        if t < 2 / 3:
            return p + (q - p) * (2 / 3 - t) * 6
        return p

    q = l * (1 + s) if l < 0.5 else l + s - l * s
    p = 2 * l - q
    h_norm = h / 360.0

    r = hue_to_rgb(p, q, h_norm + 1 / 3)
    g = hue_to_rgb(p, q, h_norm)
    b = hue_to_rgb(p, q, h_norm - 1 / 3)

    return int(round(r * 255)), int(round(g * 255)), int(round(b * 255))


def shortest_hue_avg(h1, h2):
    """Average two hue values using the shortest path on the hue circle."""
    diff = h2 - h1
    if diff > 180:
        diff -= 360
    elif diff < -180:
        diff += 360
    avg = h1 + diff / 2
    if avg < 0:
        avg += 360
    if avg >= 360:
        avg -= 360
    return avg


def blend(hex1, hex2):
    """Return math blend and smart blend of two colors."""
    r1, g1, b1 = hex_to_rgb(hex1)
    r2, g2, b2 = hex_to_rgb(hex2)

    h1, s1, l1 = rgb_to_hsl(r1, g1, b1)
    h2, s2, l2 = rgb_to_hsl(r2, g2, b2)

    # Mathematical blend: average HSL
    h_avg = shortest_hue_avg(h1, h2)
    s_avg = (s1 + s2) / 2
    l_avg = (l1 + l2) / 2

    math_rgb = hsl_to_rgb(h_avg, s_avg, l_avg)
    math_hex = rgb_to_hex(*math_rgb)

    # Smart blend: same hue midpoint, boosted saturation, fixed lightness
    s_smart = min(1.0, s_avg * 1.15)
    l_smart = 0.50

    smart_rgb = hsl_to_rgb(h_avg, s_smart, l_smart)
    smart_hex = rgb_to_hex(*smart_rgb)

    return math_hex, smart_hex


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 blend_colors.py <hex1> <hex2>")
        print('Example: python3 blend_colors.py "#2d8659" "#E31837"')
        sys.exit(1)

    hex1 = sys.argv[1].strip().strip("'\"")
    hex2 = sys.argv[2].strip().strip("'\"")

    math_hex, smart_hex = blend(hex1, hex2)
    print(f"MATH_BLEND={math_hex}")
    print(f"SMART_BLEND={smart_hex}")
