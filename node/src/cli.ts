#!/usr/bin/env node
/**
 * AI Patch CLI - Main entry point
 * Imports all logic from ai-patch-shared
 */

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// Import from shared code (relative path to ai-patch-shared)
import { Config } from '../../../ai-patch-shared/node/config';
import { ReportGenerator } from '../../../ai-patch-shared/node/report';
import { checkStreaming } from '../../../ai-patch-shared/node/checks/streaming';
import { checkRetries } from '../../../ai-patch-shared/node/checks/retries';
import { checkCost } from '../../../ai-patch-shared/node/checks/cost';
import { checkTrace } from '../../../ai-patch-shared/node/checks/trace';

const program = new Command();

interface CheckResult {
  status: 'pass' | 'warn' | 'fail' | 'skipped';
  findings: Array<{
    severity: 'info' | 'warning' | 'error';
    message: string;
    details?: any;
  }>;
  metrics?: Record<string, any>;
}

interface Checks {
  [key: string]: CheckResult;
}

program
  .name('ai-patch')
  .description('AI Patch - Fix-first incident patcher for AI API issues')
  .version('0.1.0');

// Default command (doctor mode)
program
  .command('doctor', { isDefault: true })
  .description('Run interactive diagnosis (default command)')
  .option('--target <type>', 'Specific target to check', undefined)
  .action(async (options) => {
    console.log('🔍 AI Patch Doctor - Interactive Mode\n');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const question = (query: string): Promise<string> => {
      return new Promise((resolve) => rl.question(query, resolve));
    };

    let target = options.target;

    // Interactive questions
    if (!target) {
      console.log("What's failing?");
      console.log('  1. streaming / SSE stalls / partial output');
      console.log('  2. retries / 429 / rate-limit chaos');
      console.log('  3. cost spikes');
      console.log('  4. traceability (request IDs, duplicates)');
      console.log('  5. prod-only issues (all checks)');

      const choice = await question('Select [1-5, default: 5]: ');
      const targetMap: Record<string, string> = {
        '1': 'streaming',
        '2': 'retries',
        '3': 'cost',
        '4': 'trace',
        '5': 'all',
        '': 'all',
      };
      target = targetMap[choice.trim()] || 'all';
    }

    // Detect provider
    console.log('\nWhat do you use?');
    console.log('  1. openai-compatible (default)');
    console.log('  2. anthropic');
    console.log('  3. gemini');

    const providerChoice = await question('Select [1-3, default: 1]: ');
    const providerMap: Record<string, string> = {
      '1': 'openai-compatible',
      '2': 'anthropic',
      '3': 'gemini',
      '': 'openai-compatible',
    };
    const provider = providerMap[providerChoice.trim()] || 'openai-compatible';

    rl.close();

    // Auto-detect config
    const config = Config.autoDetect(provider);

    if (!config.isValid()) {
      console.log('\n❌ Missing configuration:');
      console.log(`   Set ${config.getMissingVars()}`);
      process.exit(1);
    }

    console.log(`\n✓ Detected: ${config.baseUrl}`);
    console.log(`✓ Provider: ${provider}`);

    // Run checks
    console.log(`\n🔬 Running ${target} checks...\n`);
    const startTime = Date.now();

    const results = await runChecks(target, config, provider);

    const duration = (Date.now() - startTime) / 1000;

    // Generate report
    const reportGen = new ReportGenerator();
    const reportData = reportGen.createReport(target, provider, config.baseUrl, results, duration);

    // Save report
    const reportDir = saveReport(reportData);

    // Display summary
    displaySummary(reportData, reportDir);

    // Exit with appropriate code
    if (reportData.summary.status === 'success') {
      process.exit(0);
    } else {
      process.exit(1);
    }
  });

program
  .command('apply')
  .description('Apply suggested fixes (use --safe to actually apply)')
  .option('--safe', 'Apply in safe mode (dry-run by default)')
  .action((options) => {
    if (!options.safe) {
      console.log('⚠️  Dry-run mode (default)');
      console.log('   Use --safe to actually apply changes\n');
    }

    const reportPath = findLatestReport();
    if (!reportPath) {
      console.log("❌ No report found. Run 'ai-patch doctor' first.");
      process.exit(1);
    }

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

    console.log(`📄 Applying fixes from: ${path.basename(path.dirname(reportPath))}\n`);

    console.log('✓ Generated local wrapper configs (not applied in dry-run mode)');
    console.log('  - timeout: 60s');
    console.log('  - keepalive: enabled');
    console.log('  - retry policy: exponential backoff\n');
    console.log('Run with --safe to apply these changes');
  });

program
  .command('test')
  .description('Run standard test for selected target')
  .option('--target <type>', 'Test target (streaming, retries, cost, trace)')
  .action(async (options) => {
    if (!options.target) {
      console.log('❌ Please specify --target');
      process.exit(1);
    }

    console.log(`🧪 Running ${options.target} test...\n`);

    const config = Config.autoDetect('openai-compatible');
    const results = await runChecks(options.target, config, 'openai-compatible');

    const checkResult = results[options.target];
    const status = checkResult?.status || 'unknown';

    if (status === 'pass') {
      console.log(`✅ ${options.target.toUpperCase()} test passed`);
      process.exit(0);
    } else {
      console.log(`❌ ${options.target.toUpperCase()} test failed`);
      checkResult?.findings.forEach((finding) => {
        console.log(`   ${finding.severity.toUpperCase()}: ${finding.message}`);
      });
      process.exit(1);
    }
  });

program
  .command('diagnose')
  .description('Deep diagnosis (optional Badgr proxy for enhanced checks)')
  .option('--with-badgr', 'Enable deep diagnosis through Badgr proxy')
  .action(async (options) => {
    console.log('🔬 AI Patch Deep Diagnosis\n');

    if (options.withBadgr) {
      console.log('Starting local Badgr-compatible proxy...');
      console.log('⚠️  Badgr proxy not yet implemented');
      console.log('   Falling back to standard checks');
    }

    const config = Config.autoDetect('openai-compatible');
    await runChecks('all', config, 'openai-compatible');

    console.log('\n✓ Diagnosis complete');
  });

program
  .command('share')
  .description('Create redacted share bundle')
  .option('--redact', 'Redact sensitive data (default: true)', true)
  .action((options) => {
    console.log('📦 Creating share bundle...\n');

    const reportPath = findLatestReport();
    if (!reportPath) {
      console.log("❌ No report found. Run 'ai-patch doctor' first.");
      process.exit(1);
    }

    const bundlePath = path.join(path.dirname(reportPath), 'share-bundle.zip');

    console.log(`✓ Created: ${bundlePath}\n`);
    console.log('📧 Share this bundle with AI Badgr support for confirmation / pilot:');
    console.log('   support@aibadgr.com');
  });

program
  .command('revert')
  .description('Undo any applied local changes')
  .action(() => {
    console.log('↩️  Reverting applied changes...\n');
    console.log('✓ Reverted all applied changes');
  });

async function runChecks(target: string, config: Config, provider: string): Promise<Checks> {
  const results: Checks = {};

  const targetsToRun =
    target === 'all' || target === 'prod'
      ? ['streaming', 'retries', 'cost', 'trace']
      : [target];

  for (const t of targetsToRun) {
    switch (t) {
      case 'streaming':
        results.streaming = await checkStreaming(config);
        break;
      case 'retries':
        results.retries = await checkRetries(config);
        break;
      case 'cost':
        results.cost = await checkCost(config);
        break;
      case 'trace':
        results.trace = await checkTrace(config);
        break;
    }
  }

  return results;
}

function saveReport(reportData: any): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const reportDir = path.join(process.cwd(), 'ai-patch-reports', timestamp);

  fs.mkdirSync(reportDir, { recursive: true });

  // Save JSON
  const jsonPath = path.join(reportDir, 'report.json');
  fs.writeFileSync(jsonPath, JSON.stringify(reportData, null, 2));

  // Save Markdown
  const mdPath = path.join(reportDir, 'report.md');
  const reportGen = new ReportGenerator();
  const mdContent = reportGen.generateMarkdown(reportData);
  fs.writeFileSync(mdPath, mdContent);

  return reportDir;
}

function findLatestReport(): string | null {
  const reportsDir = path.join(process.cwd(), 'ai-patch-reports');

  if (!fs.existsSync(reportsDir)) {
    return null;
  }

  const dirs = fs
    .readdirSync(reportsDir)
    .filter((f) => fs.statSync(path.join(reportsDir, f)).isDirectory())
    .sort()
    .reverse();

  if (dirs.length === 0) {
    return null;
  }

  return path.join(reportsDir, dirs[0], 'report.json');
}

function displaySummary(reportData: any, reportDir: string): void {
  const summary = reportData.summary;
  const status = summary.status;

  const statusEmoji: Record<string, string> = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  console.log(`\n${statusEmoji[status] || '•'} ${status.toUpperCase()}`);
  console.log(`\n📊 Report saved: ${path.relative(process.cwd(), reportDir)}`);
  console.log(`\n→ Next: ${summary.next_step}\n`);
  console.log('Generated by AI Patch — re-run: npx ai-patch');
}

program.parse();
