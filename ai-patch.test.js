/**
 * AI Patch Doctor - Comprehensive Test Suite
 * 
 * Tests code reuse, structure, and functionality
 */

const fs = require('fs');
const path = require('path');

describe('AI Patch Doctor - Code Reuse & Structure', () => {
  
  describe('Shared Code Structure', () => {
    test('ai-patch-shared directory exists', () => {
      const sharedPath = path.join(__dirname, 'ai-patch-shared');
      expect(fs.existsSync(sharedPath)).toBe(true);
    });

    test('ai-patch-shared/python directory exists', () => {
      const pythonSharedPath = path.join(__dirname, 'ai-patch-shared', 'python');
      expect(fs.existsSync(pythonSharedPath)).toBe(true);
    });

    test('ai-patch-shared/node directory exists', () => {
      const nodeSharedPath = path.join(__dirname, 'ai-patch-shared', 'node');
      expect(fs.existsSync(nodeSharedPath)).toBe(true);
    });

    test('report-schema.json exists in shared', () => {
      const schemaPath = path.join(__dirname, 'ai-patch-shared', 'report-schema.json');
      expect(fs.existsSync(schemaPath)).toBe(true);
    });
  });

  describe('Python Shared Code', () => {
    test('Python checks directory exists in shared', () => {
      const checksPath = path.join(__dirname, 'ai-patch-shared', 'python', 'checks');
      expect(fs.existsSync(checksPath)).toBe(true);
    });

    test('Python streaming check exists in shared', () => {
      const streamingPath = path.join(__dirname, 'ai-patch-shared', 'python', 'checks', 'streaming.py');
      expect(fs.existsSync(streamingPath)).toBe(true);
    });

    test('Python retries check exists in shared', () => {
      const retriesPath = path.join(__dirname, 'ai-patch-shared', 'python', 'checks', 'retries.py');
      expect(fs.existsSync(retriesPath)).toBe(true);
    });

    test('Python cost check exists in shared', () => {
      const costPath = path.join(__dirname, 'ai-patch-shared', 'python', 'checks', 'cost.py');
      expect(fs.existsSync(costPath)).toBe(true);
    });

    test('Python trace check exists in shared', () => {
      const tracePath = path.join(__dirname, 'ai-patch-shared', 'python', 'checks', 'trace.py');
      expect(fs.existsSync(tracePath)).toBe(true);
    });

    test('Python config.py exists in shared', () => {
      const configPath = path.join(__dirname, 'ai-patch-shared', 'python', 'config.py');
      expect(fs.existsSync(configPath)).toBe(true);
    });

    test('Python report.py exists in shared', () => {
      const reportPath = path.join(__dirname, 'ai-patch-shared', 'python', 'report.py');
      expect(fs.existsSync(reportPath)).toBe(true);
    });
  });

  describe('Node Shared Code', () => {
    test('Node checks directory exists in shared', () => {
      const checksPath = path.join(__dirname, 'ai-patch-shared', 'node', 'checks');
      expect(fs.existsSync(checksPath)).toBe(true);
    });

    test('Node streaming check exists in shared', () => {
      const streamingPath = path.join(__dirname, 'ai-patch-shared', 'node', 'checks', 'streaming.ts');
      expect(fs.existsSync(streamingPath)).toBe(true);
    });

    test('Node retries check exists in shared', () => {
      const retriesPath = path.join(__dirname, 'ai-patch-shared', 'node', 'checks', 'retries.ts');
      expect(fs.existsSync(retriesPath)).toBe(true);
    });

    test('Node cost check exists in shared', () => {
      const costPath = path.join(__dirname, 'ai-patch-shared', 'node', 'checks', 'cost.ts');
      expect(fs.existsSync(costPath)).toBe(true);
    });

    test('Node trace check exists in shared', () => {
      const tracePath = path.join(__dirname, 'ai-patch-shared', 'node', 'checks', 'trace.ts');
      expect(fs.existsSync(tracePath)).toBe(true);
    });

    test('Node config.ts exists in shared', () => {
      const configPath = path.join(__dirname, 'ai-patch-shared', 'node', 'config.ts');
      expect(fs.existsSync(configPath)).toBe(true);
    });

    test('Node report.ts exists in shared', () => {
      const reportPath = path.join(__dirname, 'ai-patch-shared', 'node', 'report.ts');
      expect(fs.existsSync(reportPath)).toBe(true);
    });
  });

  describe('Python CLI Structure', () => {
    test('Python CLI directory exists', () => {
      const cliPath = path.join(__dirname, 'ai-patch', 'python');
      expect(fs.existsSync(cliPath)).toBe(true);
    });

    test('Python CLI main file exists', () => {
      const mainPath = path.join(__dirname, 'ai-patch', 'python', 'src', 'ai_patch', 'cli.py');
      expect(fs.existsSync(mainPath)).toBe(true);
    });

    test('Python CLI imports from shared code', () => {
      const mainPath = path.join(__dirname, 'ai-patch', 'python', 'src', 'ai_patch', 'cli.py');
      const content = fs.readFileSync(mainPath, 'utf8');
      // Check for shared imports
      const hasSharedImport = content.includes('ai-patch-shared') || 
                             content.includes('sys.path.insert') ||
                             content.includes('from checks import') ||
                             content.includes('from report import') ||
                             content.includes('from config import');
      expect(hasSharedImport).toBe(true);
    });

    test('Python CLI does NOT have duplicate checks directory', () => {
      const checksPath = path.join(__dirname, 'ai-patch', 'python', 'src', 'ai_patch', 'checks');
      expect(fs.existsSync(checksPath)).toBe(false);
    });

    test('Python CLI does NOT have duplicate config.py', () => {
      const configPath = path.join(__dirname, 'ai-patch', 'python', 'src', 'ai_patch', 'config.py');
      expect(fs.existsSync(configPath)).toBe(false);
    });

    test('Python CLI does NOT have duplicate report.py', () => {
      const reportPath = path.join(__dirname, 'ai-patch', 'python', 'src', 'ai_patch', 'report.py');
      expect(fs.existsSync(reportPath)).toBe(false);
    });
  });

  describe('Node CLI Structure', () => {
    test('Node CLI directory exists', () => {
      const cliPath = path.join(__dirname, 'ai-patch', 'node');
      expect(fs.existsSync(cliPath)).toBe(true);
    });

    test('Node CLI main file exists', () => {
      const mainPath = path.join(__dirname, 'ai-patch', 'node', 'src', 'cli.ts');
      expect(fs.existsSync(mainPath)).toBe(true);
    });

    test('Node CLI imports from shared code', () => {
      const mainPath = path.join(__dirname, 'ai-patch', 'node', 'src', 'cli.ts');
      const content = fs.readFileSync(mainPath, 'utf8');
      // Check for shared imports
      const hasSharedImport = content.includes('ai-patch-shared') ||
                             content.includes('../../../ai-patch-shared');
      expect(hasSharedImport).toBe(true);
    });

    test('Node CLI does NOT have duplicate checks directory', () => {
      const checksPath = path.join(__dirname, 'ai-patch', 'node', 'src', 'checks');
      expect(fs.existsSync(checksPath)).toBe(false);
    });

    test('Node CLI does NOT have duplicate config.ts', () => {
      const configPath = path.join(__dirname, 'ai-patch', 'node', 'src', 'config.ts');
      expect(fs.existsSync(configPath)).toBe(false);
    });

    test('Node CLI does NOT have duplicate report.ts', () => {
      const reportPath = path.join(__dirname, 'ai-patch', 'node', 'src', 'report.ts');
      expect(fs.existsSync(reportPath)).toBe(false);
    });
  });

  describe('Documentation', () => {
    test('Single comprehensive documentation file exists', () => {
      const docPath = path.join(__dirname, 'AI_PATCH_DOCTOR_COMPLETE.md');
      expect(fs.existsSync(docPath)).toBe(true);
    });

    test('Old documentation files removed', () => {
      const oldDoc1 = path.join(__dirname, 'AI_PATCH_DOCTOR.md');
      const oldDoc2 = path.join(__dirname, 'LAUNCH_DOCTOR.md');
      expect(fs.existsSync(oldDoc1)).toBe(false);
      expect(fs.existsSync(oldDoc2)).toBe(false);
    });

    test('Comprehensive doc contains key sections', () => {
      const docPath = path.join(__dirname, 'AI_PATCH_DOCTOR_COMPLETE.md');
      const content = fs.readFileSync(docPath, 'utf8');
      expect(content).toContain('Quick Start');
      expect(content).toContain('Installation');
      expect(content).toContain('Architecture');
      expect(content).toContain('The 4 Wedge Checks');
      expect(content).toContain('Publishing');
      expect(content).toContain('Launch Guide');
      expect(content).toContain('Troubleshooting');
    });
  });

  describe('Package Structure', () => {
    test('Python pyproject.toml exists', () => {
      const pyprojectPath = path.join(__dirname, 'ai-patch', 'python', 'pyproject.toml');
      expect(fs.existsSync(pyprojectPath)).toBe(true);
    });

    test('Node package.json exists', () => {
      const packagePath = path.join(__dirname, 'ai-patch', 'node', 'package.json');
      expect(fs.existsSync(packagePath)).toBe(true);
    });

    test('Node package.json has correct structure', () => {
      const packagePath = path.join(__dirname, 'ai-patch', 'node', 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      expect(packageJson.name).toBeDefined();
      expect(packageJson.version).toBeDefined();
      expect(packageJson.bin).toBeDefined();
    });
  });

  describe('Code Quality Checks', () => {
    test('No duplicate code between Python CLI and shared', () => {
      const cliChecksPath = path.join(__dirname, 'ai-patch', 'python', 'src', 'ai_patch', 'checks');
      const sharedChecksPath = path.join(__dirname, 'ai-patch-shared', 'python', 'checks');
      
      // CLI should not have checks directory (imports from shared)
      expect(fs.existsSync(cliChecksPath)).toBe(false);
      // Shared should have checks
      expect(fs.existsSync(sharedChecksPath)).toBe(true);
    });

    test('No duplicate code between Node CLI and shared', () => {
      const cliChecksPath = path.join(__dirname, 'ai-patch', 'node', 'src', 'checks');
      const sharedChecksPath = path.join(__dirname, 'ai-patch-shared', 'node', 'checks');
      
      // CLI should not have checks directory (imports from shared)
      expect(fs.existsSync(cliChecksPath)).toBe(false);
      // Shared should have checks
      expect(fs.existsSync(sharedChecksPath)).toBe(true);
    });

    test('Report schema is valid JSON', () => {
      const schemaPath = path.join(__dirname, 'ai-patch-shared', 'report-schema.json');
      const content = fs.readFileSync(schemaPath, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    });
  });

  describe('Open Source & Clean', () => {
    test('No Badgr integration directory exists', () => {
      const badgrPath = path.join(__dirname, 'ai-patch-badgr');
      expect(fs.existsSync(badgrPath)).toBe(false);
    });

    test('No Docker Compose directory in cli', () => {
      const dockerPath = path.join(__dirname, 'ai-patch', 'docker-compose');
      expect(fs.existsSync(dockerPath)).toBe(false);
    });

    test('No GitHub Action directory in cli', () => {
      const actionPath = path.join(__dirname, 'ai-patch', 'github-action');
      expect(fs.existsSync(actionPath)).toBe(false);
    });
  });
});

describe('AI Patch Doctor - Functional Tests', () => {
  test('Python CLI has main entry point', () => {
    const mainPath = path.join(__dirname, 'ai-patch', 'python', 'src', 'ai_patch', '__main__.py');
    expect(fs.existsSync(mainPath)).toBe(true);
  });

  test('Python CLI has doctor command', () => {
    const cliPath = path.join(__dirname, 'ai-patch', 'python', 'src', 'ai_patch', 'cli.py');
    const content = fs.readFileSync(cliPath, 'utf8');
    expect(content).toContain('def doctor');
  });

  test('Node CLI has doctor command', () => {
    const cliPath = path.join(__dirname, 'ai-patch', 'node', 'src', 'cli.ts');
    const content = fs.readFileSync(cliPath, 'utf8');
    expect(content).toContain('doctor');
  });
});

console.log('\n✅ AI Patch Doctor Test Suite');
console.log('Testing code reuse, structure, and functionality...\n');
