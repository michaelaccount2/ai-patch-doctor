/**
 * Configuration management for AI Patch
 */

export class Config {
  constructor(
    public baseUrl: string,
    public apiKey: string,
    public provider: string,
    public model?: string
  ) {}

  static autoDetect(provider: string = 'openai-compatible'): Config {
    let baseUrl: string;
    let apiKey: string;
    let model: string | undefined;

    if (provider === 'openai-compatible') {
      baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com';
      apiKey = process.env.OPENAI_API_KEY || '';
      model = process.env.MODEL || 'gpt-3.5-turbo';

      // Check for common gateway env vars
      if (!baseUrl || baseUrl === 'https://api.openai.com') {
        const litellmUrl = process.env.LITELLM_PROXY_URL;
        if (litellmUrl) baseUrl = litellmUrl;

        const portkeyUrl = process.env.PORTKEY_BASE_URL;
        if (portkeyUrl) baseUrl = portkeyUrl;

        const heliconeUrl = process.env.HELICONE_BASE_URL;
        if (heliconeUrl) baseUrl = heliconeUrl;
      }
    } else if (provider === 'anthropic') {
      baseUrl = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
      apiKey = process.env.ANTHROPIC_API_KEY || '';
      model = process.env.MODEL || 'claude-3-5-sonnet-20241022';
    } else if (provider === 'gemini') {
      baseUrl = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com';
      apiKey = process.env.GEMINI_API_KEY || '';
      model = process.env.MODEL || 'gemini-pro';
    } else {
      baseUrl = process.env.OPENAI_BASE_URL || '';
      apiKey = process.env.OPENAI_API_KEY || '';
      model = process.env.MODEL || 'gpt-3.5-turbo';
    }

    return new Config(baseUrl, apiKey, provider, model);
  }

  isValid(): boolean {
    return !!(this.baseUrl && this.apiKey);
  }

  getMissingVars(): string {
    const missing: string[] = [];

    if (!this.baseUrl) {
      if (this.provider === 'anthropic') {
        missing.push('ANTHROPIC_BASE_URL');
      } else if (this.provider === 'gemini') {
        missing.push('GEMINI_BASE_URL');
      } else {
        missing.push('OPENAI_BASE_URL');
      }
    }

    if (!this.apiKey) {
      if (this.provider === 'anthropic') {
        missing.push('ANTHROPIC_API_KEY');
      } else if (this.provider === 'gemini') {
        missing.push('GEMINI_API_KEY');
      } else {
        missing.push('OPENAI_API_KEY');
      }
    }

    return missing.join(', ');
  }
}
