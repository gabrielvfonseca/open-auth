# Guardian Package Overview

The `@open-auth/guardian` package is the proactive security layer of the platform. It monitors all authentication and authorization activity to detect and mitigate threats early.

## Key Modules

- **Account Lockout**: Tracks failed attempts and manages lockout states.
- **Risk Evaluation**: Scores requests based on IP, Location, and User Agent.
- **Bot Mitigation**: Validates challenges from bot-detection services like Turnstile.
- **Enforcement**: Blocks or challenges requests that exceed risk thresholds.
