#!/usr/bin/env python3
"""Nachversand der Kontaktformular-Queue (chat/data/contact_queue.jsonl).

Wird ausgefuehrt, sobald SMTP-Creds im Container verfuegbar sind (in /home/hermeswebui/.hermes/.env
oder einer der _secret-Dateien). Versendet alle Eintraege per Hostinger-SMTP und entfernt
erfolgreiche Eintraege aus der Queue. Aufruf: /app/venv/bin/python3 chat/flush_contact_queue.py
"""
import json, re, smtplib, sys, time
from email.mime.text import MIMEText
from email.utils import formatdate
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from server import SMTP, CONTACT_FROM, CONTACT_TO, _secret  # noqa: E402

QUEUE = Path(__file__).resolve().parent / "data" / "contact_queue.jsonl"

def main() -> int:
    if not QUEUE.exists():
        print("Keine Queue vorhanden.")
        return 0
    if not SMTP["host"] or not SMTP["user"] or not SMTP["pw"]:
        print("FEHLER: SMTP-Creds fehlen im Container (_secret gefunden: "
              f"host={bool(SMTP['host'])} user={bool(SMTP['user'])} pw={bool(SMTP['pw'])}).")
        return 1
    lines = QUEUE.read_text(encoding="utf-8").splitlines()
    sent, failed = 0, []
    with smtplib.SMTP_SSL(SMTP["host"], SMTP["port"], timeout=30) as s:
        s.login(SMTP["user"], SMTP["pw"])
        for ln in lines:
            try:
                d = json.loads(ln)
                # A.38: CRLF defensiv strippen (alte Queue-Einträge vor R19-Fix)
                name_clean = re.sub(r"[\r\n]+", " ", str(d.get("name", "")))
                text = (f"Neue Anfrage über www.a-bau.info\n\nName: {name_clean}\n"
                        f"E-Mail: {d.get('email','')}\nTelefon: {d.get('telefon','')}\n\n"
                        f"Nachricht:\n{d.get('nachricht','')}\n\n"
                        f"-- Kontaktformular A-Bau Website (DSGVO: Einwilligung erteilt, Queue-Nachversand)")
                m = MIMEText(text, "plain", "utf-8")
                m["Subject"] = f"Anfrage von {name_clean} – a-bau Website (Nachversand)"
                m["From"] = CONTACT_FROM
                m["To"] = CONTACT_TO
                m["Date"] = formatdate(localtime=True)
                s.sendmail(CONTACT_FROM, [CONTACT_TO], m.as_string())
                sent += 1
            except Exception as e:
                failed.append((ln, str(e)[:120]))
    # Erfolgreiche entfernen, fehlgeschlagene behalten
    failed_lines = [ln for ln, _ in failed]
    QUEUE.write_text("\n".join(failed_lines) + ("\n" if failed_lines else ""), encoding="utf-8")
    print(f"VERSAND OK: {sent} gesendet, {len(failed)} fehlgeschlagen (in Queue belassen).")
    for ln, err in failed:
        print(f"  FEHLER: {err}")
    return 0 if not failed else 2

if __name__ == "__main__":
    raise SystemExit(main())
