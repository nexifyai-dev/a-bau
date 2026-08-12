#!/usr/bin/env python3
"""Nachversand der Kontaktformular-Queue (chat/data/contact_queue.jsonl).

Versand-Reihenfolge: Resend-API (RESEND_API_KEY in .env/_secret; EU-US-DPF, Art. 45 DSGVO)
-> Hostinger-SMTP. Erfolgreiche Einträge werden aus der Queue entfernt.
Aufruf: /app/venv/bin/python3 chat/flush_contact_queue.py
"""
import json, re, smtplib, sys, time
from email.mime.text import MIMEText
from email.utils import formatdate
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from server import SMTP, CONTACT_FROM, CONTACT_TO, RESEND_KEY, _resend_send  # noqa: E402

QUEUE = Path(__file__).resolve().parent / "data" / "contact_queue.jsonl"

def _mail_text(d) -> str:
    # A.38: CRLF defensiv strippen (alte Queue-Einträge vor R19-Fix)
    name = re.sub(r"[\r\n]+", " ", str(d.get("name", "")))
    return (f"Neue Anfrage über www.a-bau.info\n\nName: {name}\nE-Mail: {d.get('email','')}\n"
            f"Telefon: {d.get('telefon','')}\n\nNachricht:\n{d.get('nachricht','')}\n\n"
            f"-- Kontaktformular A-Bau Website (DSGVO: Einwilligung erteilt)")

def _subject(d) -> str:
    return f"Anfrage von {re.sub(r'[\r\n]+', ' ', str(d.get('name', '')))} – a-bau Website"

def main() -> int:
    if not QUEUE.exists():
        print("Keine Queue vorhanden.")
        return 0
    use_resend = bool(RESEND_KEY)
    if not use_resend and not (SMTP["host"] and SMTP["user"] and SMTP["pw"]):
        print("FEHLER: weder RESEND_API_KEY noch SMTP-Creds verfügbar (_secret).")
        return 1
    lines = QUEUE.read_text(encoding="utf-8").splitlines()
    sent, keep = 0, []
    for ln in lines:
        try:
            d = json.loads(ln)
            text, subject = _mail_text(d), _subject(d)
            if use_resend:
                _resend_send(text, subject, CONTACT_TO, d.get("email", ""))
            else:
                m = MIMEText(text, "plain", "utf-8")
                m["Subject"] = subject
                m["From"] = CONTACT_FROM
                m["To"] = CONTACT_TO
                m["Date"] = formatdate(localtime=True)
                with smtplib.SMTP_SSL(SMTP["host"], SMTP["port"], timeout=30) as s:
                    s.login(SMTP["user"], SMTP["pw"])
                    s.sendmail(CONTACT_FROM, [CONTACT_TO], m.as_string())
            sent += 1
        except Exception as e:
            keep.append(ln)  # kein Datenverlust: fehlgeschlagene bleiben in der Queue
            print(f"  FEHLER: {type(e).__name__}: {str(e)[:120]}")
    QUEUE.write_text("\n".join(keep) + ("\n" if keep else ""), encoding="utf-8")
    print(f"Versendet: {sent}, in Queue verblieben: {len(keep)}")
    return 0 if not keep else 2

if __name__ == "__main__":
    raise SystemExit(main())
