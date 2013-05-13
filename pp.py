"""
Dummy pre-processor. Currently only handles includes.

    pp.py file.src

"""

import os
import re
import sys

RE_INCLUDE = r'(//)?#include +"(.+)"'

def parse_file(path):
    dirname = os.path.dirname(path)

    with open(path, 'r') as f:
        for line in iter(f):
            match = re.match(RE_INCLUDE, line)
            if match:
                include_path = os.path.join(dirname, match.group(2))
                with open(include_path, 'r') as inc:
                    print inc.read(),
            else:
                print line,


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.stderr.write("usage: pp.py file.src\n")
        sys.exit(1)
    parse_file(sys.argv[1])
