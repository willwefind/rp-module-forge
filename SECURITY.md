# Security

V0 should work locally in the browser and should not require API keys.

Never commit:
- API keys
- auth tokens
- private chat exports
- passwords
- personal identifying data

If future integrations need credentials, use platform-appropriate secret storage
and never hard-code secrets into the repository.
