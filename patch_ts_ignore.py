with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace("          // @ts-ignore\n          {React.cloneElement(icon", "          {\n            // @ts-ignore\n            React.cloneElement(icon")

with open("src/App.tsx", "w") as f:
    f.write(content)
