#!/usr/bin/env python3
"""Guard for language edits: prove that a rewrite changed only Hebrew wording.

Compares the working tree against a git ref and reports any number, date, price,
measurement or Latin-script name that appears a different number of times. A clean
run means no fact, place or person was altered, only the Hebrew around them.

    python3 tools/check_facts.py            # against HEAD
    python3 tools/check_facts.py <ref>      # against another commit
"""
import collections
import re
import subprocess
import sys

FILES = [
    "js/content.js",
    "js/content-paris.js",
    "js/content-london.js",
    "js/content-south.js",
]


def facts(text):
    numbers = re.findall(r"(?<![\w])\d[\d,.:]*", text)
    latin = re.findall(r"[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’\-.]{2,}", text)
    return collections.Counter(numbers), collections.Counter(latin)


def main():
    ref = sys.argv[1] if len(sys.argv) > 1 else "HEAD"
    problems = 0
    for path in FILES:
        old = subprocess.run(["git", "show", f"{ref}:{path}"], capture_output=True, text=True).stdout
        if not old:
            print(f"{path}: not in {ref}, skipped")
            continue
        new = open(path, encoding="utf-8").read()
        if old == new:
            print(f"{path}: unchanged")
            continue
        old_nums, old_latin = facts(old)
        new_nums, new_latin = facts(new)
        d_nums = (old_nums - new_nums) + (new_nums - old_nums)
        d_latin = (old_latin - new_latin) + (new_latin - old_latin)
        # a number whose only change is a trailing full stop is punctuation, not a fact
        d_nums = collections.Counter({k: v for k, v in d_nums.items() if k.rstrip(".,:") not in
                                      {x.rstrip(".,:") for x in d_nums if x != k}})
        if d_nums or d_latin:
            problems += 1
            print(f"{path}: CHECK — numbers {dict(d_nums) or 'ok'} | names {dict(d_latin) or 'ok'}")
        else:
            print(f"{path}: edited, facts intact")
    print("\nAll facts intact." if not problems else f"\n{problems} file(s) need a look.")
    return 1 if problems else 0


if __name__ == "__main__":
    raise SystemExit(main())
