"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Shield,
  Users,
  MapPin,
  MessageCircle,
  Send,
  Search,
  HandHeart,
  CheckCircle2,
  Sparkles,
  Wallet,
  Scale,
} from "lucide-react";

type Role = "host" | "seeker";

type Listing = {
  id: string;
  role: Role;
  region: string;
  city: string;
  duration: "1 mese" | "1-2 mesi" | "3-6 mesi";
  budget: "€300-500" | "€500-700" | "€700-900" | "€900+";
  kids: "sì" | "no";
  vibe: "tranquillo" | "pratico" | "collaborativo";
  title: string;
  blurb: string;
};

const REGION_TO_CITIES: Record<string, string[]> = {
  Lombardia: ["Milano", "Bergamo", "Brescia", "Monza", "Como", "Varese"],
  Lazio: ["Roma", "Latina", "Viterbo", "Frosinone"],
  Campania: ["Napoli", "Salerno", "Caserta", "Avellino", "Benevento"],
  Piemonte: ["Torino", "Novara", "Alessandria"],
  "Emilia-Romagna": ["Bologna", "Modena", "Parma", "Reggio Emilia", "Rimini"],
  Toscana: ["Firenze", "Pisa", "Prato", "Livorno"],
  Puglia: ["Bari", "Lecce", "Taranto", "Foggia"],
  Sicilia: ["Palermo", "Catania", "Messina"],
  Liguria: ["Genova", "La Spezia", "Savona"],
  Veneto: ["Venezia", "Verona", "Padova", "Treviso"],
};

// Foto “calde” (Unsplash) — puoi sostituire con file locali più avanti
const IMG = {
  hero:
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80",
  community:
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
  home:
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
};

const DEMO_LISTINGS: Listing[] = [
  {
    id: "h1",
    role: "host",
    region: "Lombardia",
    city: "Milano",
    duration: "1 mese",
    budget: "€500-700",
    kids: "sì",
    vibe: "collaborativo",
    title: "Posso ospitare per 1 mese (spese chiare)",
    blurb:
      "Casa già avviata. Preferisco accordi semplici, rispetto e comunicazione tranquilla. Ideale come soluzione ponte.",
  },
  {
    id: "h2",
    role: "host",
    region: "Lazio",
    city: "Roma",
    duration: "1-2 mesi",
    budget: "€700-900",
    kids: "no",
    vibe: "tranquillo",
    title: "Condivisione temporanea, ambiente tranquillo",
    blurb:
      "Ritmi regolari, regole chiare e divisione spese trasparente. Mi interessa una convivenza ordinata e rispettosa.",
  },
  {
    id: "s1",
    role: "seeker",
    region: "Campania",
    city: "Napoli",
    duration: "1 mese",
    budget: "€300-500",
    kids: "sì",
    vibe: "pratico",
    title: "Cerco soluzione per 1 mese vicino ai miei",
    blurb:
      "Transizione familiare, bisogno di stabilità temporanea. Priorità: costi sostenibili, rispetto dei ritmi e comunicazione chiara.",
  },
  {
    id: "s2",
    role: "seeker",
    region: "Lombardia",
    city: "Milano",
    duration: "1-2 mesi",
    budget: "€500-700",
    kids: "no",
    vibe: "collaborativo",
    title: "Cerco condivisione spese per 1-2 mesi",
    blurb:
      "Compatibilità pratica: regole chiare, divisione spese, clima sereno. Soluzione temporanea, non per sempre.",
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function LogoMark() {
  return (
    <div className="relative grid h-9 w-9 place-items-center rounded-2xl bg-neutral-900">
      <div className="h-4 w-4 rounded-sm border-2 border-white/90" />
      <div className="absolute -right-1.5 -bottom-1.5 h-3 w-3 rounded-full bg-white/90" />
    </div>
  );
}

function BrandName() {
  return (
    <span className="text-base font-extrabold tracking-tight">
      <span className="bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 bg-clip-text text-transparent">
        Transitia
      </span>
    </span>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm">
      {children}
    </span>
  );
}

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">{title}</h2>
        {subtitle ? <p className="mt-2 max-w-2xl leading-7 text-neutral-600">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Card({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">{icon}</div>
        <div>
          <p className="font-semibold text-neutral-900">{title}</p>
          <p className="mt-1 text-sm leading-6 text-neutral-600">{text}</p>
        </div>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-semibold text-neutral-700">
      {children}
    </span>
  );
}

function WarmImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm", className)}>
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
    </div>
  );
}

function ListingCard({ item, onOpenChat }: { item: Listing; onOpenChat: (l: Listing) => void }) {
  const roleLabel = item.role === "host" ? "POSSO OSPITARE" : "CERCO";
  const roleIcon = item.role === "host" ? <HandHeart className="h-4 w-4" /> : <Search className="h-4 w-4" />;

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>
              <span className="mr-1 inline-flex">{roleIcon}</span>
              {roleLabel}
            </Badge>
            <Badge>
              <MapPin className="mr-1 h-3.5 w-3.5" />
              {item.city}
            </Badge>
            <Badge>{item.duration}</Badge>
            <Badge>{item.budget}</Badge>
            <Badge>figli: {item.kids}</Badge>
            <Badge>{item.vibe}</Badge>
          </div>

          <p className="mt-3 text-base font-semibold text-neutral-900">{item.title}</p>
          <p className="mt-2 text-sm leading-6 text-neutral-600">{item.blurb}</p>
        </div>

        <button
          type="button"
          onClick={() => onOpenChat(item)}
          className="shrink-0 rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Chat rapida
        </button>
      </div>
    </div>
  );
}

type ChatMsg = { from: "me" | "them"; text: string };

function QuickChatModal({
  open,
  onClose,
  listing,
}: {
  open: boolean;
  onClose: () => void;
  listing: Listing | null;
}) {
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);

  useEffect(() => {
    if (open && listing) {
      setDraft("");
      setMsgs([
        {
          from: "them",
          text:
            "Ciao! Prima di chattare liberamente facciamo 4 check rapidi: durata, spese, figli, regole base. Va bene?",
        },
      ]);
    }
  }, [open, listing?.id]);

  if (!open || !listing) return null;

  const title = listing.role === "host" ? "Chat rapida con un ospitante" : "Chat rapida con chi cerca";

  const pushMe = (text: string) => setMsgs((m) => [...m, { from: "me", text }]);
  const pushThem = (text: string) => setMsgs((m) => [...m, { from: "them", text }]);

  const guidedStart = () => {
    pushMe("Sì, va bene");
    pushThem("1) Durata: per quanto tempo ti serve / puoi ospitare?");
    pushThem("2) Spese: quota fissa o metà e metà? Cosa è incluso?");
    pushThem("3) Figli/ritmi: ci sono giorni particolari da considerare?");
    pushThem("4) Regole base: orari, ospiti, pulizie. Che impostazione vuoi?");
    pushThem("Se ti va, lascia un contatto per la beta (questa chat è demo).");
  };

  const send = () => {
    const t = draft.trim();
    if (!t) return;
    pushMe(t);
    setDraft("");
    pushThem("Ricevuto ✅ (demo) — In beta: chat reale, profili verificati, blocco/segnalazione e limiti anti-spam.");
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-neutral-900">{title}</p>
            <p className="mt-0.5 text-xs text-neutral-500">
              {listing.city} • {listing.duration} • {listing.budget}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold hover:bg-neutral-100"
          >
            Chiudi
          </button>
        </div>

        <div className="max-h-[50vh] space-y-3 overflow-auto px-5 py-4">
          {msgs.map((m, i) => (
            <div key={i} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-6",
                  m.from === "me"
                    ? "bg-neutral-900 text-white"
                    : "border border-neutral-200 bg-neutral-50 text-neutral-800"
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-200 px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={guidedStart}
              className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              Avvia check rapido
              <CheckCircle2 className="ml-2 h-4 w-4" />
            </button>

            <div className="flex flex-1 items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Scrivi un messaggio (demo)..."
                className="w-full rounded-2xl border border-neutral-200 px-4 py-2 text-sm"
              />
              <button
                type="button"
                onClick={send}
                className="rounded-2xl bg-neutral-900 p-2 text-white hover:bg-neutral-800"
                aria-label="Invia"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="mt-2 text-xs text-neutral-500">
            Demo UI: non salva messaggi. In beta: chat reale con profili verificati, blocco/segnalazione e limiti anti-spam.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  // Default nazionale: Lombardia → Milano
  const [region, setRegion] = useState<string>("Lombardia");
  const [city, setCity] = useState<string>("Milano");

  const [activeRole, setActiveRole] = useState<Role>("seeker");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatListing, setChatListing] = useState<Listing | null>(null);

  useEffect(() => {
    const first = REGION_TO_CITIES[region]?.[0] ?? "Milano";
    setCity(first);
  }, [region]);

  const filtered = useMemo(() => {
    return DEMO_LISTINGS.filter((l) => l.role === activeRole).filter((l) => l.region === region && l.city === city);
  }, [activeRole, region, city]);

  const openChat = (listing: Listing) => {
    setChatListing(listing);
    setChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-stone-100 text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <LogoMark />
            <div className="leading-tight">
              <BrandName />
              <p className="text-xs text-neutral-500">Condivisione abitativa temporanea</p>
            </div>
          </div>

          <nav className="hidden items-center gap-2 sm:flex">
            <a href="#annunci" className="rounded-2xl px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100">
              Annunci
            </a>
            <a href="#chat" className="rounded-2xl px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100">
              Chat
            </a>
            <a href="#sicurezza" className="rounded-2xl px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100">
              Sicurezza
            </a>
          </nav>

          <a
            href="#annunci"
            className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Inizia
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -right-24 h-96 w-96 rounded-full bg-rose-200/25 blur-3xl" />

        {/* HERO */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <Pill>
                  <Sparkles className="mr-2 h-3.5 w-3.5" />
                  Umanità prima
                </Pill>
                <Pill>
                  <Wallet className="mr-2 h-3.5 w-3.5" />
                  Divisione spese
                </Pill>
                <Pill>
                  <Shield className="mr-2 h-3.5 w-3.5" />
                  Contatto graduale
                </Pill>
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900">
                Condivisione abitativa temporanea
              </h1>

              <p className="mt-4 max-w-xl leading-7 text-neutral-700">
                Una soluzione concreta per attraversare una transizione familiare: trovi persone compatibili con cui
                condividere casa e <strong>dividere le spese</strong>, per il tempo che serve.
              </p>

              <p className="mt-3 max-w-xl text-neutral-700">
                Non scegli una casa “perfetta”: <strong>scegli prima una persona compatibile</strong>. Lo spazio viene dopo.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#annunci"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800 sm:w-auto"
                  onClick={() => setActiveRole("seeker")}
                >
                  Cerco una soluzione
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>

                <a
                  href="#annunci"
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold hover:bg-neutral-100 sm:w-auto"
                  onClick={() => setActiveRole("host")}
                >
                  Posso ospitare
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>

              <p className="mt-4 text-sm text-neutral-600">
                Transitia non è un portale immobiliare e non è dating: è un network umano con regole chiare.
              </p>
            </div>

            <div className="grid gap-4">
              <WarmImage src={IMG.hero} alt="Casa calda e accogliente" className="h-[360px]" />
              <div className="grid gap-4 sm:grid-cols-2">
                <WarmImage src={IMG.community} alt="Comunità e supporto" className="h-[220px]" />
                <WarmImage src={IMG.home} alt="Casa e serenità" className="h-[220px]" />
              </div>
            </div>
          </div>
        </section>

        {/* VALUE */}
        <Section
          id="value"
          title="Pratico subito, umano per davvero"
          subtitle="Non stiamo “vendendo stanze”: stiamo facilitando accordi temporanei con chiarezza su spese e regole."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <Card icon={<Users className="h-5 w-5" />} title="Compatibilità umana" text="Ritmi, figli, rispetto: la persona viene prima dello spazio." />
            <Card icon={<Scale className="h-5 w-5" />} title="Accordi chiari" text="Durata, spese, regole base: meno ambiguità, più serenità." />
            <Card icon={<MessageCircle className="h-5 w-5" />} title="Chat guidata" text="Prima 4 check pratici, poi conversazione. Qualità > caos." />
          </div>
        </Section>

        {/* ANNUNCI */}
        <Section
          id="annunci"
          title="Annunci per Regione e Città"
          subtitle="Due percorsi sullo stesso piano: chi ospita e chi cerca. Filtra per zona e avvia una chat rapida (demo)."
        >
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="inline-flex rounded-2xl border border-neutral-200 bg-neutral-50 p-1">
                  <button
                    type="button"
                    onClick={() => setActiveRole("host")}
                    className={cn(
                      "rounded-2xl px-4 py-2 text-sm font-semibold",
                      activeRole === "host" ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-white"
                    )}
                  >
                    Posso ospitare
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveRole("seeker")}
                    className={cn(
                      "rounded-2xl px-4 py-2 text-sm font-semibold",
                      activeRole === "seeker" ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-white"
                    )}
                  >
                    Cerco
                  </button>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-2">
                    <MapPin className="h-4 w-4 text-neutral-500" />
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="bg-transparent text-sm font-semibold text-neutral-800 outline-none"
                    >
                      {Object.keys(REGION_TO_CITIES).map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-2">
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="bg-transparent text-sm font-semibold text-neutral-800 outline-none"
                    >
                      {(REGION_TO_CITIES[region] ?? []).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="text-sm text-neutral-700">
                {activeRole === "host" ? (
                  <span>
                    Vedi disponibilità di <strong>ospitanti</strong> a {city}.
                  </span>
                ) : (
                  <span>
                    Vedi richieste di chi <strong>cerca</strong> a {city}.
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              {filtered.length === 0 ? (
                <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
                  <p className="font-semibold">Nessun annuncio demo per questa zona.</p>
                  <p className="mt-2 text-sm text-neutral-600">Per ora cambia città o tipo. In produzione qui vedrai gli annunci reali.</p>
                </div>
              ) : (
                filtered.map((item) => <ListingCard key={item.id} item={item} onOpenChat={openChat} />)
              )}
            </div>
          </div>
        </Section>

        {/* CHAT */}
        <Section
          id="chat"
          title="Chat rapida (demo)"
          subtitle="Contatto graduale: prima 4 check pratici, poi conversazione. La UI è pronta: in beta la rendiamo reale."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <Card icon={<CheckCircle2 className="h-5 w-5" />} title="Durata" text="Quanto tempo serve davvero (1 mese, 1-2 mesi, 3-6 mesi)." />
            <Card icon={<CheckCircle2 className="h-5 w-5" />} title="Spese" text="Quota chiara: cosa include, come dividere, zero ambiguità." />
            <Card icon={<CheckCircle2 className="h-5 w-5" />} title="Ritmi e figli" text="Settimane, orari, regole casa: compatibilità pratica." />
          </div>

          <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-neutral-900">Provala subito</p>
            <p className="mt-2 text-sm text-neutral-600">Apri una chat rapida da un annuncio nella sezione “Annunci”.</p>
            <a href="#annunci" className="mt-4 inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
              Vai agli annunci <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </Section>

        {/* SICUREZZA */}
        <Section id="sicurezza" title="Sicurezza e rispetto" subtitle="Network umano sì, ma con confini chiari: consenso, controllo, regole.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card icon={<Shield className="h-5 w-5" />} title="Contatto graduale" text="Richiesta guidata e check pratici prima della chat reale." />
            <Card icon={<Users className="h-5 w-5" />} title="Community non dating" text="Transitia non è un servizio di coppia. È condivisione abitativa temporanea." />
          </div>

          <div className="mt-6 rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
            <p className="text-sm font-semibold text-neutral-900">Trasparenza</p>
            <p className="mt-2 text-sm text-neutral-600">
              Transitia non assegna alloggi e non gestisce pagamenti: facilita contatto e chiarezza tra persone consenzienti.
            </p>
          </div>
        </Section>

        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-semibold">Pronto a iniziare?</h3>
            <p className="mt-2 max-w-xl text-neutral-600">
              Scegli il percorso: cerca una soluzione o renditi disponibile a ospitare. Entrambi hanno lo stesso valore.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="#annunci"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800 sm:w-auto"
                onClick={() => setActiveRole("seeker")}
              >
                Cerco una soluzione <ArrowRight className="ml-2 h-4 w-4" />
              </a>

              <a
                href="#annunci"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold hover:bg-neutral-100 sm:w-auto"
                onClick={() => setActiveRole("host")}
              >
                Posso ospitare <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <QuickChatModal open={chatOpen} onClose={() => setChatOpen(false)} listing={chatListing} />
      </main>
    </div>
  );
}
