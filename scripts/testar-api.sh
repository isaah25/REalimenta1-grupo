#!/usr/bin/env bash
set -e
BASE="http://127.0.0.1:3001"
echo "1) Status da API"
curl -fsS "$BASE/api/status"; echo

echo "2) Login do aluno de demonstração"
curl -fsS -X POST "$BASE/api/login" \
  -H "Content-Type: application/json" \
  -d '{"ra":"123456","password":"123456"}'; echo

echo "3) Login do administrador de demonstração"
curl -fsS -X POST "$BASE/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'; echo

echo "API básica validada."
