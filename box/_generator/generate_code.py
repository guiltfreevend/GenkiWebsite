#!/usr/bin/env python3
"""Generate a unique GK-XXXXXX code for a Genki Box page."""

import sys
import random
import string
from pathlib import Path

# 32-char alphabet: excludes 0, O, 1, I, L for unambiguous printing
ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"


def generate_code(box_dir="box", max_attempts=100):
    """Generate a unique 6-character code."""
    box_path = Path(box_dir)

    for attempt in range(max_attempts):
        code = "".join(random.choices(ALPHABET, k=6))
        full_code = f"GK-{code}"
        folder = box_path / full_code

        if not folder.exists():
            print(f"GENERATED_CODE={full_code}")
            return full_code

    print(f"ERROR: Could not generate a unique code after {max_attempts} attempts")
    sys.exit(1)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Generate a unique Genki Box code")
    parser.add_argument("--box-dir", default="box", help="Path to the box directory")
    args = parser.parse_args()

    generate_code(args.box_dir)
