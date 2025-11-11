# Deployment & CI/CD Configuration

## Netlify
- Deploy main branch to production automatically.
- Use environment variables for Supabase keys and secrets.
- Enable preview deploys for pull requests.

## CI/CD Steps
- Run linting and type checks on every push.
- Run Jest and Playwright tests before deploy.
- Block deploy if tests fail.

## Post-Deployment
- Run database migrations if needed.
- Notify team on successful deploy.
