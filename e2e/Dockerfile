# Post-deploy e2e, run by Kargo after each promotion (meanwhile/argocd,
# apps/sample-app/core/verification.yaml). Built and tagged with the app, so a
# release is verified by the tests written for it.
FROM mcr.microsoft.com/playwright:v1.64.1-noble

WORKDIR /e2e
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN chown -R pwuser:pwuser /e2e
USER pwuser

CMD ["npx", "playwright", "test"]
