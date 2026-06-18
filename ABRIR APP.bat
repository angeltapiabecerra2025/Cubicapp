@echo off
title EIMI-CUB - Servidor Local
color 0B
echo.
echo  ==========================================
echo    EIMI-CUB - Iniciando Servidor Local
echo  ==========================================
echo.
echo  Iniciando servidor en http://localhost:8080
echo  El navegador se abrira automaticamente.
echo  Cierra esta ventana para detener el servidor.
echo.

PowerShell -ExecutionPolicy Bypass -NoProfile -File "%~dp0servidor_local.ps1"

echo.
echo  Servidor detenido.
pause
