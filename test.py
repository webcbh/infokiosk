with open("src/App.tsx", "r") as f:
    content = f.read()
import re
match = re.search(r"function ActionItem.*?\{.*?\}(?=\s*function|\s*const|\s*export|\Z)", content, re.DOTALL)
if match: print(match.group(0))
