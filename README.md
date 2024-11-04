# Screeps Scripts

## Usage
```bash
pnpm install --frozen-lockfile

pnpm build
# or
pnpm dev
```

Then, create a link to the built files to screeps folder

```powershell
# Powershell Example
New-Item -ItemType SymbolicLink -Path C:\Users\[User]\AppData\Local\Screeps\scripts\screeps.com\default -Value [cloned repository folder]\dist
```








## TODO
- [ ] Use Screeps API

