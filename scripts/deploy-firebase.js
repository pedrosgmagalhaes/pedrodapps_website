#!/usr/bin/env node
/**
 * Deploy script for Firebase Hosting with Vite build.
 *
 * Features:
 * - Builds the project (npm run build)
 * - Deploys to Firebase Hosting using a target (default: "oficial")
 * - Uses FIREBASE_TOKEN from env if available
 * - Optionally fetches FIREBASE_TOKEN from Google Secret Manager
 * - Supports preview channels (e.g., --channel staging)
 *
 * Usage examples:
 *   node scripts/deploy-firebase.js
 *   node scripts/deploy-firebase.js --channel staging
 *   node scripts/deploy-firebase.js --project pixley-website --target oficial --channel staging
 *   FIREBASE_TOKEN=XXXX node scripts/deploy-firebase.js
 *
 * Secret Manager (optional):
 *   gcloud secrets create FIREBASE_TOKEN --replication-policy="automatic" --project pixley-website
 *   echo "<YOUR_FIREBASE_CI_TOKEN>" | gcloud secrets versions add FIREBASE_TOKEN --data-file=- --project pixley-website
 */

import { execSync } from "node:child_process";

function run(cmd, opts = {}) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: "inherit", ...opts });
}

function getArg(name, defaultVal) {
  const args = process.argv.slice(2);
  const idx = args.findIndex((a) => a === `--${name}`);
  if (idx >= 0 && idx + 1 < args.length) return args[idx + 1];
  return defaultVal;
}

const project = getArg("project", "pixley-website");
const target = getArg("target", "oficial");
const channel = getArg("channel", null); // e.g., "staging" for preview
const site = getArg("site", null); // optional explicit site id override

// Verify Firebase CLI is available
try {
  run("firebase --version");
} catch (e) {
  console.error("Firebase CLI not found. Install it with: npm i -g firebase-tools");
  console.error(e);
  process.exit(1);
}

// Try to acquire FIREBASE_TOKEN from env or Secret Manager
let token = process.env.FIREBASE_TOKEN || "";
if (!token) {
  const secretName = process.env.FIREBASE_TOKEN_SECRET || "FIREBASE_TOKEN";
  try {
    const fetched = execSync(
      `gcloud secrets versions access latest --secret=${secretName} --project ${project}`,
      { encoding: "utf8" }
    ).trim();
    if (fetched) {
      token = fetched;
      console.log(`Using token from Secret Manager: ${secretName}`);
    }
  } catch (e) {
    console.log(
      `No FIREBASE_TOKEN env and couldn't fetch Secret Manager secret "${secretName}". Proceeding with local Firebase auth (if logged in).`
    );
    console.log(e?.message || e);
  }
}

// Build the project
console.log("\nBuilding Vite project...");
try {
  run("npm run build");
} catch (e) {
  console.error("Build failed.");
  console.error(e);
  process.exit(1);
}

// Construct deploy command
let deployCmd = "";
if (channel && channel !== "live") {
  // Use hosting:channel:deploy for preview channels
  deployCmd = `firebase hosting:channel:deploy ${channel} --only ${target} --project ${project} --non-interactive`;
} else {
  // Use standard deploy for live
  deployCmd = `firebase deploy --only hosting:${target} --project ${project} --non-interactive`;
}
if (site && !channel) deployCmd += ` --site ${site}`; // site override only applies to live deploy
if (token) deployCmd += ` --token ${token}`;

console.log(`\nDeploying to Firebase Hosting...`);
console.log(`  project: ${project}`);
console.log(`  target : ${target}`);
if (site && !channel) console.log(`  site   : ${site}`);
console.log(`  channel: ${channel || "live"}`);

try {
  run(deployCmd);
  console.log("\nDeploy complete.");
} catch (e) {
  console.error("Deploy failed.");
  console.error(e);
  process.exit(1);
}
