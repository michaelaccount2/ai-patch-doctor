# AI Patch Doctor - Deployment Guide

This guide explains how to deploy AI Patch Doctor as an open source project while keeping AI Badgr IP separate.

---

## 📦 Repository Structure Overview

### Current Repository (`gpu-ai`)

This repository contains:
- **AI Patch Doctor** (Open Source CLI) - in `ai-patch/` and `ai-patch-shared/`
- **AI Badgr** (Private SaaS) - in `backend/`, `worker/`, etc.

### Target: Two Separate Repositories

**Goal**: Extract AI Patch Doctor to its own OSS repository while keeping AI Badgr private.

---

## 🎯 Deployment Options

### Option 1: Extract to New Public Repository (Recommended)

**Create a new open source repository for AI Patch Doctor only.**

#### Step 1: Create New Repository

```bash
# On GitHub, create new public repository
# Name: ai-patch-doctor
# Description: CLI tool for diagnosing and fixing AI API issues
# License: MIT (or Apache 2.0)
```

#### Step 2: Extract AI Patch Files

From the current `gpu-ai` repository, extract these directories:

```
📁 Files to Extract (Open Source - No Badgr IP):
├── ai-patch/                    # CLI wrappers
│   ├── python/                  # Python CLI
│   ├── node/                    # Node CLI
│   └── validate.py              # Validation script
├── ai-patch-shared/             # Shared code (3000 LOC)
│   ├── python/                  # Python checks, config, report
│   ├── node/                    # Node checks, config, report
│   └── report-schema.json       # Shared schema
├── AI_PATCH_DOCTOR_COMPLETE.md  # Documentation
├── ai-patch.test.js             # Jest tests
├── package.json                 # Test dependencies
├── package-lock.json            # Lock file
└── .gitignore                   # Git ignore rules
```

#### Step 3: Extraction Script

Create `extract-oss.sh` in `gpu-ai` repo:

```bash
#!/bin/bash
# Extract AI Patch Doctor to new repository

set -e

# Configuration
TARGET_REPO="ai-patch-doctor"
SOURCE_DIR=$(pwd)

echo "🔍 Extracting AI Patch Doctor to new repository..."

# Create new directory
mkdir -p ../$TARGET_REPO
cd ../$TARGET_REPO

# Initialize git
git init
git remote add origin git@github.com:yourusername/$TARGET_REPO.git

# Copy files from source
echo "📦 Copying OSS files..."

# Create directory structure
mkdir -p ai-patch
mkdir -p ai-patch-shared

# Copy ai-patch CLI
cp -r $SOURCE_DIR/ai-patch/python ai-patch/
cp -r $SOURCE_DIR/ai-patch/node ai-patch/
cp $SOURCE_DIR/ai-patch/validate.py ai-patch/

# Copy ai-patch-shared
cp -r $SOURCE_DIR/ai-patch-shared/python ai-patch-shared/
cp -r $SOURCE_DIR/ai-patch-shared/node ai-patch-shared/
cp $SOURCE_DIR/ai-patch-shared/report-schema.json ai-patch-shared/
cp $SOURCE_DIR/ai-patch-shared/README.md ai-patch-shared/

# Copy documentation and tests
cp $SOURCE_DIR/AI_PATCH_DOCTOR_COMPLETE.md ./README.md
cp $SOURCE_DIR/ai-patch.test.js .
cp $SOURCE_DIR/package.json .
cp $SOURCE_DIR/package-lock.json .

# Create .gitignore
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
venv/
ENV/

# Node
node_modules/
dist/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Reports
ai-patch-reports/
*.md
!README.md
!ai-patch-shared/README.md

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
EOF

# Create LICENSE
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2026 AI Patch Doctor Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

# Initial commit
git add .
git commit -m "Initial commit: AI Patch Doctor CLI

- Python CLI with shared code imports
- Node CLI with shared code imports
- 4 wedge checks (streaming, retries, cost, traceability)
- Comprehensive documentation
- 45 Jest tests passing
- Zero code duplication"

echo "✅ Extraction complete!"
echo "📁 New repository created in ../$TARGET_REPO"
echo ""
echo "Next steps:"
echo "1. Review the extracted code"
echo "2. Run tests: npm install && npm test"
echo "3. Push to GitHub: git push -u origin main"
```

#### Step 4: Run Extraction

```bash
# From gpu-ai repository
chmod +x extract-oss.sh
./extract-oss.sh

# Verify extraction
cd ../ai-patch-doctor
npm install
npm test  # Should show 45 tests passing
```

#### Step 5: Push to GitHub

```bash
cd ../ai-patch-doctor
git push -u origin main
```

---

### Option 2: Monorepo with Clear Separation

**Keep everything in one repository but with clear OSS/private boundaries.**

#### Directory Structure

```
gpu-ai/
├── packages/
│   ├── ai-patch-doctor/        # OSS package (can be extracted)
│   │   ├── ai-patch/
│   │   ├── ai-patch-shared/
│   │   ├── README.md
│   │   ├── package.json
│   │   └── LICENSE (MIT)
│   └── ai-badgr/               # Private package (stays private)
│       ├── backend/
│       ├── worker/
│       └── (AI Badgr IP)
├── README.md                   # Root readme explaining structure
└── LICENSE                     # Dual license (OSS for ai-patch, proprietary for badgr)
```

#### Setup Script

```bash
#!/bin/bash
# Reorganize into monorepo structure

mkdir -p packages/ai-patch-doctor
mkdir -p packages/ai-badgr

# Move AI Patch to OSS package
mv ai-patch packages/ai-patch-doctor/
mv ai-patch-shared packages/ai-patch-doctor/
mv AI_PATCH_DOCTOR_COMPLETE.md packages/ai-patch-doctor/README.md
mv ai-patch.test.js packages/ai-patch-doctor/
cp package.json packages/ai-patch-doctor/

# Move AI Badgr to private package
mv backend packages/ai-badgr/
mv worker packages/ai-badgr/
mv frontend packages/ai-badgr/
mv client packages/ai-badgr/

# Create root README explaining the separation
```

---

## 🔒 IP Separation & Security

### What Goes in OSS Repository

✅ **AI Patch Doctor (Open Source)**
- CLI implementation (thin wrappers)
- Shared code (checks, config, report generation)
- Documentation
- Tests
- No AI Badgr code
- No proprietary algorithms
- No billing logic
- No routing/proxy implementation

### What Stays Private

🔒 **AI Badgr (Proprietary)**
- Gateway/proxy implementation
- Receipt storage and ledger
- Routing logic
- Billing and Stripe integration
- Hosted GPU capacity management
- Internal APIs
- All backend/worker code

### Verification

Before pushing to public repo, verify no AI Badgr IP:

```bash
# Check for Badgr references
cd ai-patch-doctor
grep -r "badgr" . --include="*.py" --include="*.ts" --include="*.js"
# Should return no results

# Check for proprietary terms
grep -r "billing\|stripe\|ledger\|receipt" . --include="*.py" --include="*.ts"
# Should only find references in documentation, not in code

# Run tests
npm test
# All 45 tests should pass
```

---

## 📦 Publishing Options

### Option A: Publish to npm and PyPI

Once extracted to separate repo:

**Python (PyPI)**
```bash
cd ai-patch-doctor/ai-patch/python
python -m build
twine upload dist/*
```

**Node (npm)**
```bash
cd ai-patch-doctor/ai-patch/node
npm publish
```

Users install:
```bash
# Python
pipx install ai-patch-doctor

# Node
npm install -g ai-patch-doctor
```

### Option B: GitHub Releases Only

Don't publish to package registries yet. Just use GitHub:

```bash
# Users install directly from GitHub
pipx install git+https://github.com/yourusername/ai-patch-doctor.git#subdirectory=ai-patch/python

npx github:yourusername/ai-patch-doctor/ai-patch/node
```

---

## 🚀 Deployment Workflow

### For OSS Development (ai-patch-doctor repo)

```bash
# Clone
git clone https://github.com/yourusername/ai-patch-doctor.git
cd ai-patch-doctor

# Install dependencies
npm install
cd ai-patch/python && pip install -e .
cd ../node && npm install

# Run tests
npm test  # Jest tests
cd ai-patch/python && python -m pytest tests/

# Make changes
# ... edit code ...

# Test changes
npm test
cd ai-patch/python && python -m pytest

# Commit and push
git commit -am "Add feature X"
git push origin main

# Create release
git tag v1.0.0
git push origin v1.0.0
```

### For Private Development (gpu-ai repo)

```bash
# AI Badgr development continues in gpu-ai repo
cd gpu-ai

# AI Badgr can use AI Patch as dependency if needed
cd backend
pip install git+https://github.com/yourusername/ai-patch-doctor.git#subdirectory=ai-patch/python

# Or reference locally during development
pip install -e ../packages/ai-patch-doctor/ai-patch/python
```

---

## 🔄 Syncing Changes Between Repos

If using separate repos and need to sync AI Patch changes:

### From gpu-ai to ai-patch-doctor

```bash
# In gpu-ai repo
cd ai-patch
git diff HEAD~1 HEAD > /tmp/patch.diff

# In ai-patch-doctor repo
cd ai-patch
git apply /tmp/patch.diff
git commit -m "Sync changes from gpu-ai"
```

### From ai-patch-doctor to gpu-ai

```bash
# In ai-patch-doctor repo
git format-patch -1 HEAD

# In gpu-ai repo
cd ai-patch
git am < /path/to/0001-*.patch
```

---

## ✅ Deployment Checklist

### Before Extraction

- [ ] Remove all Badgr references from AI Patch code
- [ ] Remove all proprietary algorithms
- [ ] Verify tests pass (45/45)
- [ ] Update documentation to remove Badgr mentions
- [ ] Add open source license (MIT or Apache 2.0)

### During Extraction

- [ ] Run extraction script
- [ ] Verify directory structure
- [ ] Run tests in extracted repo
- [ ] Check for sensitive data (API keys, secrets)
- [ ] Verify .gitignore is correct

### After Extraction

- [ ] Push to GitHub
- [ ] Set repository to public
- [ ] Add README badge (license, tests)
- [ ] Set up GitHub Actions for CI
- [ ] Publish to npm/PyPI (optional)
- [ ] Announce on social media

---

## 🔍 Verification Steps

### 1. Code Quality

```bash
cd ai-patch-doctor

# Run linters
cd ai-patch/python && pylint src/
cd ../node && npm run lint

# Run tests
npm test
cd ai-patch/python && python -m pytest

# Check for TODO/FIXME
grep -r "TODO\|FIXME" ai-patch/ ai-patch-shared/
```

### 2. No Proprietary IP

```bash
# Search for Badgr references
grep -ri "badgr" .

# Search for proprietary terms
grep -ri "stripe\|billing\|ledger" . --include="*.py" --include="*.ts"

# Verify no backend/worker code
ls -la | grep -E "backend|worker"
# Should return nothing
```

### 3. Documentation Complete

```bash
# Check README exists
test -f README.md && echo "✅ README exists"

# Check examples work
cd ai-patch/python && pip install -e .
ai-patch doctor --help

cd ../node && npm install && npm run build
npx ai-patch doctor --help
```

---

## 📞 Support & Updates

### Open Source Repository

- **Repository**: https://github.com/yourusername/ai-patch-doctor
- **Issues**: Use GitHub Issues for bugs and features
- **PRs**: Welcome from community
- **License**: MIT (fully open source)

### Private Repository

- **Repository**: https://github.com/yourorg/gpu-ai (private)
- **AI Badgr**: Proprietary code stays here
- **Internal**: Team access only

---

## 🎯 Summary

**Deployment Strategy**:
1. ✅ Extract `ai-patch/` and `ai-patch-shared/` to new public repo
2. ✅ Verify no AI Badgr IP in extracted code
3. ✅ Run tests (45/45 passing)
4. ✅ Push to GitHub as public repository
5. ✅ Publish to npm/PyPI (optional)

**IP Separation**:
- ✅ AI Patch Doctor = Open Source (MIT license)
- ✅ AI Badgr = Private (proprietary)
- ✅ Clear boundaries, no code mixing

**Ready to deploy!** 🚀
