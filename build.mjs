#!/usr/bin/env node
/**
 * Build script: bundles JS with esbuild, concatenates CSS from vendor + custom sources.
 * Output: js/bundle.js and styles/bundle.css (both gitignored).
 * Usage: npm run build
 */
import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';

// ── JS ────────────────────────────────────────────────────────────────────────
await esbuild.build({
  entryPoints: ['src/js/index.js'],
  bundle: true,
  minify: true,
  outfile: 'js/bundle.js',
  platform: 'browser',
  target: ['es2017'],
});
console.log('OK js/bundle.js');

// ── CSS ───────────────────────────────────────────────────────────────────────
// Vendor CSS read directly from node_modules (no URL rewriting needed)
const vendorCSS = [
  'node_modules/bootstrap/dist/css/bootstrap.min.css',
  'node_modules/flickity/dist/flickity.min.css',
].map(f => readFileSync(f, 'utf8')).join('\n');

// Custom CSS — paths are relative to styles/ so font URLs stay correct
const customCSS = [
  'styles/fonts.css',
  'styles/style.css',
  'styles/bootsrap-overrides.css',
  'styles/nav.css',
  'styles/home.css',
  'styles/gallery.css',
  'styles/grid-gallery.css',
  'styles/offers.css',
  'styles/jak-powstaje.css',
].map(f => readFileSync(f, 'utf8')).join('\n');

writeFileSync('styles/bundle.css', vendorCSS + '\n' + customCSS);
console.log('OK styles/bundle.css');
