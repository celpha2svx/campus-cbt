import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "2348072517875";
const CONTACT_EMAIL = "afeezademuyiwa40@gmail.com";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-alt mt-auto">
      <div className="max-w-xl mx-auto px-5 py-8">
        <div className="grid grid-cols-2 gap-6 items-start">
          <div>
            <p className="font-serif text-base font-medium leading-tight mb-1">
              The Luminaries class.
            </p>
            <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
              Campus CBT
            </p>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft mb-2">
              Correction or feedback
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Message on WhatsApp"
                className="inline-flex items-center justify-center gap-2 bg-ink text-paper px-3 py-2 rounded-sm font-mono text-[11px] font-semibold uppercase tracking-wide hover:bg-ink-soft transition-colors"
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                aria-label="Send email"
                className="inline-flex items-center justify-center gap-2 border border-ink text-ink px-3 py-2 rounded-sm font-mono text-[11px] font-semibold uppercase tracking-wide hover:bg-paper transition-colors"
              >
                <Mail size={14} />
                Email
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-line mt-6 pt-4 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
            Made by Luminaries
          </p>
          <Link
            href="/admin/upload"
            className="font-mono text-[10px] uppercase tracking-wide text-ink-soft hover:text-ink"
          >
            Upload PQ
          </Link>
        </div>
      </div>
    </footer>
  );
}
