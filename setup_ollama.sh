#!/bin/bash
# ==============================================================
# Ollama + Qwen Setup for IELTSPrep AI Scoring
# ==============================================================
# Run this script to install Ollama and pull the Qwen model.
# The AI scoring will then run 100% locally with zero cost.
# ==============================================================

set -e

echo "========================================"
echo "  IELTSPrep — Ollama AI Scoring Setup"
echo "========================================"
echo ""

# ── 1. Check OS ───────────────────────────────────────────────────────────────
OS="$(uname -s)"
case "$OS" in
  Linux*)   MACHINE=Linux ;;
  Darwin*)  MACHINE=Mac ;;
  MINGW*|MSYS*|CYGWIN*)  MACHINE=Windows ;;
  *)        echo "Unsupported OS: $OS"; exit 1 ;;
esac
echo "[1/4] Detected OS: $MACHINE"

# ── 2. Install Ollama ─────────────────────────────────────────────────────────
echo "[2/4] Installing Ollama..."

if command -v ollama &> /dev/null; then
  echo "  ✓ Ollama already installed ($(ollama --version))"
else
  case "$MACHINE" in
    Linux)
      curl -fsSL https://ollama.com/install.sh | sh
      ;;
    Mac)
      if command -v brew &> /dev/null; then
        brew install ollama
      else
        echo "  Please download Ollama from: https://ollama.com/download"
        echo "  Then re-run this script."
        exit 1
      fi
      ;;
    Windows)
      echo "  ⚠ Windows detected. Please install manually:"
      echo "     1. Download from: https://ollama.com/download"
      echo "     2. Install (OllamaSetup.exe)"
      echo "     3. Restart your terminal"
      echo "     4. Re-run this script"
      echo ""
      read -p "  Press Enter after installing Ollama..."
      if ! command -v ollama &> /dev/null; then
        echo "  ❌ Ollama not found. Please add it to your PATH."
        exit 1
      fi
      ;;
  esac
fi

# ── 3. Start Ollama service ───────────────────────────────────────────────────
echo "[3/4] Starting Ollama service..."
case "$MACHINE" in
  Linux|Mac)
    ollama serve &>/dev/null &
    ;;
  Windows)
    # On Windows, Ollama runs as a background service after install
    echo "  (Ollama should be running as a Windows service)"
    ;;
esac
sleep 2

# ── 4. Pull Qwen model ────────────────────────────────────────────────────────
echo "[4/4] Pulling Qwen model (qwen2.5:7b)..."
echo "  This may take a few minutes (≈4 GB download)."
ollama pull qwen2.5:7b

echo ""
echo "========================================"
echo "  ✓ Setup Complete!"
echo "========================================"
echo ""
echo "  Model: qwen2.5:7b"
echo "  API:   http://localhost:11434/v1"
echo ""
echo "  Your .env should have:"
echo "    OLLAMA_BASE_URL=http://localhost:11434/v1"
echo "    OLLAMA_MODEL=qwen2.5:7b"
echo ""
echo "  Test it:"
echo "    curl http://localhost:11434/api/generate -d '{"
echo '      "model": "qwen2.5:7b",'
echo '      "prompt": "Hello!",'
echo '      "stream": false'
echo "    }'"
echo ""
