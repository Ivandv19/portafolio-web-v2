module.exports = {
  branches: [
    "develop",
  ],
  repositoryUrl: "https://github.com/Ivandv19/portafolio-web-v2.git",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@semantic-release/npm",
      {
        npmPublish: false,
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: [], // Sin archivos adicionales para incluir en el release
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json", "pnpm-lock.yaml"],
        message:
          "chore(release): 🔖 Versión ${nextRelease.version}\n\n${nextRelease.notes}",
      },
    ],
  ],
};
