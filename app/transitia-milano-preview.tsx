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
        {subtitle ? (
          <p className="mt-2 max-w-2xl leading-7 text-neutral-600">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white/90 px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm">
      {children}
    </span>
  );
}

type CardProps = { icon: React.ReactNode; title: string; text: string };

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

function ImageStrip({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <img
        src={src}
        alt={alt}
        className="mb-8 h-56 w-full rounded-3xl object-cover shadow-sm border border-neutral-200"
        loading="lazy"
      />
    </div>
  );
}

export default function TransitiaMilanoPreview() {
  const [email, setEmail] = useState("");
  const [zone, setZone] = useState("Milano città");
  const [duration, setDuration] = useState("1–2 mesi");
  const [budget, setBudget] = useState("700–900 €");

  const completion = useMemo(() => {
    let score = 0;
    if (zone) score += 25;
    if (budget) score += 25;
    if (duration) score += 20;
    score += 10; // demo (esigenze)
    return Math.min(score, 100);
  }, [zone, duration, budget]);

  const nav = [
    { href: "#milano", label: "Milano" },
    { href: "#come-funziona", label: "Come funziona" },
    { href: "#sicurezza", label: "Sicurezza" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-stone-100 text-neutral-900">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-neutral-900" />
            <div>
              <p className="text-sm font-semibold leading-4">Transitia</p>
              <p className="text-xs text-neutral-500">Milano • anteprima</p>
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
            href="#cta"
            className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Verifica compatibilità
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </header>

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -right-24 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />

        <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap gap-2">
                <Pill>
                  <MapPin className="mr-2 h-3.5 w-3.5" /> Milano
                </Pill>
                <Pill>
                  <Shield className="mr-2 h-3.5 w-3.5" /> Riservato
                </Pill>
                <Pill>
                  <Users className="mr-2 h-3.5 w-3.5" /> Esigenze simili
                </Pill>
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight">
                Condividere casa a Milano
                <span className="block text-neutral-700">
                  con persone che condividono le tue stesse esigenze (figli, ritmi,
                  responsabilità)
                </span>
              </h1>

              <p className="mt-4 max-w-xl leading-7 text-neutral-600">
                Dopo una separazione o un cambiamento familiare, la casa diventa spesso
                il problema più urgente. Transitia ti aiuta a dividere spese e gestione
                in modo riservato, con contatto graduale.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href="#cta"
                  className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
                >
                  Verifica compatibilità (anonimo)
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a
                  href="#come-funziona"
                  className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold hover:bg-neutral-100"
                >
                  Come funziona
                </a>
              </div>

              <div className="mt-6 overflow-hidden rounded-3xl border border-neutral-200 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop"
                  alt="Interno appartamento luminoso"
                  className="h-56 w-full object-cover"
                  loading="lazy"
                />
              </div>

              <p className="mt-3 text-xs text-neutral-500">
                Nessun annuncio pubblico. Contatti solo con consenso reciproco.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold">Anteprima — Verifica compatibilità</h3>
              <p className="mt-1 text-sm text-neutral-600">
                (Demo) Scegli zona, durata e budget. Poi attivi la notifica.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Zona</label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
                  >
                    <option>Milano città</option>
                    <option>Milano Centro</option>
                    <option>Milano Nord</option>
                    <option>Milano Sud</option>
                    <option>Milano Est</option>
                    <option>Milano Ovest</option>
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
                    <option>1–2 mesi</option>
                    <option>3–6 mesi</option>
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
                    <option>500–700 €</option>
                    <option>700–900 €</option>
                    <option>900–1100 €</option>
                    <option>1100–1400 €</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Email (avviso)</label>
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
                <p className="mt-2 text-xs text-neutral-600">
                  Piccoli aggiustamenti su durata e budget possono aumentare le compatibilità.
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button className="rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
                  Attiva avviso <Bell className="ml-2 inline h-4 w-4" />
                </button>
                <button className="rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold hover:bg-neutral-100">
                  Completa esigenze
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <ImageStrip
          src="https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1600&auto=format&fit=crop"
          alt="Milano al tramonto"
        />

        <Section
          id="milano"
          title="Milano: stessa fase di vita, esigenze simili"
          subtitle="Non è solo dividere l’affitto: è condividere ritmi, spazi e responsabilità con rispetto."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <Card
              icon={<Users className="h-5 w-5" />}
              title="Esigenze familiari"
              text="Compatibilità su figli, orari e gestione degli spazi. Senza esposizione pubblica."
            />
            <Card
              icon={<MessageCircle className="h-5 w-5" />}
              title="Contatto graduale"
              text="Chat riservata e anonima. Identità e contatti solo con consenso reciproco."
            />
            <Card
              icon={<Shield className="h-5 w-5" />}
              title="Rispetto e sicurezza"
              text="Blocca e segnala. Avvisi quando arrivano compatibilità nella tua zona."
            />
          </div>
        </Section>

        <Section
          id="come-funziona"
          title="Come funziona"
          subtitle="Semplice, riservato e senza pressioni. Ti chiediamo solo ciò che serve."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                t: "1) Imposti zona e periodo",
                d: "Zona, budget e durata. Anche per affitti brevi (1 mese).",
              },
              {
                t: "2) Indichi le esigenze (facoltativo)",
                d: "Figli, ritmi, silenzio, lavoro da casa, regole di convivenza.",
              },
              {
                t: "3) Vedi solo compatibilità sensate",
                d: "Profili anonimi. Niente esposizione pubblica o annunci.",
              },
              {
                t: "4) Decidi con calma",
                d: "Chat riservata. Condivisione contatti solo se entrambi volete.",
              },
            ].map((x) => (
              <div
                key={x.t}
                className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-semibold">{x.t}</p>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{x.d}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="sicurezza"
          title="Riservatezza e sicurezza"
          subtitle="La scelta resta sempre tua. Strumenti semplici per proteggerti."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { t: "Anonimato iniziale", d: "Nessun nome pubblico e nessuna foto obbligatoria." },
              { t: "Consenso reciproco", d: "Identità e contatti si condividono solo con accordo." },
              { t: "Blocca e segnala", d: "Strumenti rapidi per evitare situazioni indesiderate." },
              { t: "Avvisi mirati", d: "Notifiche quando arrivano compatibilità nella tua zona." },
            ].map((x) => (
              <div
                key={x.t}
                className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="font-semibold">{x.t}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{x.d}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="faq" title="FAQ" subtitle="Risposte veloci alle domande più comuni.">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                q: "È un portale di annunci?",
                a: "No. Non pubblichiamo immobili e non facciamo intermediazione: mettiamo in contatto persone compatibili.",
              },
              {
                q: "Funziona anche per un solo mese?",
                a: "Sì. È più difficile, ma puoi impostare preferenze e ricevere avvisi mirati.",
              },
              {
                q: "Quando si condividono i contatti?",
                a: "Solo con consenso reciproco, quando vi sentite a vostro agio.",
              },
              {
                q: "Devo dire subito se ho figli?",
                a: "No. Puoi scegliere cosa condividere: l’obiettivo è evitare incompatibilità, non “profilarti”.",
              },
            ].map((x) => (
              <div
                key={x.q}
                className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <p className="font-semibold">{x.q}</p>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{x.a}</p>
              </div>
            ))}
          </div>
        </Section>

        <section id="cta" className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
              <div>
                <h3 className="text-2xl font-semibold">Verifica compatibilità</h3>
                <p className="mt-2 max-w-xl leading-7 text-neutral-600">
                  Inizia in modo riservato e con calma. Nessuna esposizione pubblica.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
                  >
                    Inizia ora <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                  <a
                    href="#come-funziona"
                    className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold hover:bg-neutral-100"
                  >
                    Leggi come funziona
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
                <p className="text-sm font-semibold">Messaggio chiave</p>
                <p className="mt-2 text-sm leading-6 text-neutral-700">
                  Se condividete la stessa fase di vita, spesso condividete anche esigenze simili.
                  Questo riduce stress e perdita di tempo.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-2xl bg-neutral-900" />
              <div>
                <p className="text-sm font-semibold">Transitia</p>
                <p className="text-xs text-neutral-500">
                  Transizione familiare • convivenza temporanea
                </p>
              </div>
            </div>
            <div className="text-xs text-neutral-500">© 2026 Transitia</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
