"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Shield,
  Users,
  MessageCircle,
  Bell,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

// ---- Helper components ----
type SectionProps = {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

function Section({ id, title, subtitle, children }: SectionProps) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 max-w-2xl leading-7 text-neutral-600">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm">
      {children}
    </span>
  );
}

type CardProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

function Card({ icon, title, text }: CardProps) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-neutral-900">{title}</p>
          <p className="mt-1 text-sm leading-6 text-neutral-600">{text}</p>
        </div>
      </div>
    </div>
  );
}

// ---- Main page ----
export default function Home() {
  const [email, setEmail] = useState("");
  const [regione, setRegione] = useState("Lombardia");
  const [duration, setDuration] = useState("1-2 mesi");
  const [budget, setBudget] = useState("700-900 EUR");

  const completion = useMemo(() => {
    let score = 0;
    if (regione) score += 25;
    if (budget) score += 25;
    if (duration) score += 20;
    score += 10; // demo
    return Math.min(score, 100);
  }, [regione, duration, budget]);

  const nav = [
    { href: "#come-funziona", label: "Come funziona" },
    { href: "#sicurezza", label: "Sicurezza" },
    { href: "#faq", label: "FAQ" },
    { href: "#sondaggio", label: "Sondaggio" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-stone-100 text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-neutral-900" />
            <div>
              <p className="text-sm font-semibold leading-4">Transitia</p>
              <p className="text-xs text-neutral-500">Italia • anteprima</p>
            </div>
          </div>

          <nav className="hidden items-center gap-3 text-sm text-neutral-700 sm:flex">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="hover:text-neutral-900">
                {n.label}
              </a>
            ))}
          </nav>

          <a
            href="#sondaggio"
            className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Sondaggio (30 sec)
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -right-24 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />

        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap gap-2">
                <Pill>
                  <MapPin className="mr-2 h-3.5 w-3.5" />
                  In tutta Italia
                </Pill>
                <Pill>
                  <Shield className="mr-2 h-3.5 w-3.5" />
                  Riservato
                </Pill>
                <Pill>
                  <Users className="mr-2 h-3.5 w-3.5" />
                  Esigenze simili
                </Pill>
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight">
                Uniamo persone in tutta Italia
                <span className="block text-neutral-700">
                  che attraversano una transizione familiare
                </span>
              </h1>

              <p className="mt-4 max-w-xl leading-7 text-neutral-600">
                Per il tempo necessario a normalizzare il cambiamento, restando
                vicini ai propri affetti e condividendo casa e spese con chi vive
                una fase simile.
              </p>

              <p className="mt-3 max-w-xl text-neutral-600">
                Incontrerai persone nuove che vivono una fase simile e che
                possono aiutarti anche grazie alla loro esperienza.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#sondaggio"
                  className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
                >
                  Partecipa al sondaggio (30 sec)
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a
                  href="#come-funziona"
                  className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold hover:bg-neutral-100"
                >
                  Come funziona
                </a>
              </div>

              <p className="mt-4 text-sm text-neutral-500">
                Transitia non è un portale immobiliare: mette in contatto persone
                compatibili.
              </p>
            </motion.div>

            {/* Demo box */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <p className="mb-4 max-w-md text-sm leading-6 text-neutral-600">
                <strong>
                  Condividi con chi sta attraversando la tua stessa fase di vita,
                </strong>
                <br />
                per il tempo necessario a normalizzare il cambiamento.
              </p>

              <h3 className="text-lg font-semibold">
                Anteprima — Verifica compatibilità
              </h3>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Regione</label>
                  <select
                    value={regione}
                    onChange={(e) => setRegione(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
                  >
                    <option>Abruzzo</option>
                    <option>Basilicata</option>
                    <option>Calabria</option>
                    <option>Campania</option>
                    <option>Emilia-Romagna</option>
                    <option>Friuli-Venezia Giulia</option>
                    <option>Lazio</option>
                    <option>Liguria</option>
                    <option>Lombardia</option>
                    <option>Marche</option>
                    <option>Molise</option>
                    <option>Piemonte</option>
                    <option>Puglia</option>
                    <option>Sardegna</option>
                    <option>Sicilia</option>
                    <option>Toscana</option>
                    <option>Trentino-Alto Adige</option>
                    <option>Umbria</option>
                    <option>Valle d'Aosta</option>
                    <option>Veneto</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Durata</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
                  >
                    <option>1 mese</option>
                    <option>1-2 mesi</option>
                    <option>3-6 mesi</option>
                    <option>6+ mesi</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Budget</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
                  >
                    <option>500-700 EUR</option>
                    <option>700-900 EUR</option>
                    <option>900-1100 EUR</option>
                    <option>1100-1400 EUR</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Email (facoltativa)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome@email.it"
                    className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
                  />
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Completezza profilo</p>
                  <p className="text-sm font-semibold">{completion}%</p>
                </div>
                <div className="mt-2 h-2 rounded-full bg-neutral-200">
                  <div
                    className="h-2 rounded-full bg-neutral-900"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <a
                  href="#sondaggio"
                  className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
                >
                  Vai al sondaggio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold hover:bg-neutral-100"
                  onClick={() => alert("Anteprima: l’avviso email verrà attivato dopo la fase di sondaggio.")}
                >
                  Attiva avviso (demo)
                  <Bell className="ml-2 h-4 w-4" />
                </button>
              </div>

              <p className="mt-3 text-xs text-neutral-500">
                Nota: questa è un’anteprima. In questa fase raccogliamo feedback con il sondaggio.
              </p>
            </motion.div>
          </div>
        </section>

        <Section
          id="come-funziona"
          title="Come funziona"
          subtitle="Semplice, riservato e senza pressioni."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <Card
              icon={<Users className="h-5 w-5" />}
              title="Esigenze e tempi"
              text="Indichi durata e priorità. Nessun vincolo: è per il tempo che ti serve."
            />
            <Card
              icon={<MessageCircle className="h-5 w-5" />}
              title="Contatto graduale"
              text="Quando sarà attivo, il contatto sarà progressivo e riservato."
            />
            <Card
              icon={<Shield className="h-5 w-5" />}
              title="Rispetto e sicurezza"
              text="Segnalazioni e blocchi: convivenza sì, ma con regole chiare."
            />
          </div>
        </Section>

        <Section id="sicurezza" title="Riservatezza e sicurezza">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card
              icon={<CheckCircle2 className="h-5 w-5" />}
              title="Anonimato"
              text="Nessuna esposizione pubblica: prima si ascolta, poi si costruisce."
            />
            <Card
              icon={<CheckCircle2 className="h-5 w-5" />}
              title="Consenso"
              text="Condivisione e contatti solo quando sarà tutto chiaro e reciproco."
            />
          </div>
        </Section>

        <Section id="faq" title="FAQ">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="font-semibold text-neutral-900">È un portale immobiliare?</p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                No. Transitia non pubblica annunci di case: facilita l’incontro tra persone compatibili.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="font-semibold text-neutral-900">È un servizio “di coppia”?</p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                No. Parliamo di condivisione abitativa e spese, con rispetto e compatibilità di bisogni e ritmi.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:col-span-2">
              <p className="font-semibold text-neutral-900">Cosa succede ora?</p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                In questa fase raccogliamo feedback con un sondaggio anonimo. Se il bisogno è reale, avvieremo una beta.
              </p>
            </div>
          </div>
        </Section>

        <section id="sondaggio" className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-semibold">Sondaggio anonimo (30 secondi)</h3>
            <p className="mt-2 max-w-xl text-neutral-600">
              Stiamo ascoltando, prima di costruire qualsiasi soluzione.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="INSERISCI_QUI_LINK_GOOGLE_FORMS"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Apri il sondaggio
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>

              <a
                href="#faq"
                className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold hover:bg-neutral-100"
              >
                Prima voglio capire meglio
              </a>
            </div>

            <p className="mt-4 text-sm text-neutral-500">
              Nessun servizio attivo in questa fase: raccogliamo opinioni e bisogni reali.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
