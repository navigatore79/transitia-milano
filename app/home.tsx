"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  ArrowRight,
  Shield,
  Users,
  MapPin,
  MessageCircle,
  Search,
  Plus,
  Send,
  CheckCircle2,
} from "lucide-react";

/** ============ Config zona (semplice) ============ */
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

type Role = "host" | "seeker";

type Profile = {
  id: string;
  display_name: string | null;
  region: string | null;
  city: string | null;
  kids: string | null; // "sì" | "no"
  vibe: string | null; // "tranquillo" | "pratico" | "collaborativo"
};

type Listing = {
  id: string;
  user_id: string;
  role: Role;
  region: string;
  city: string;
  duration: string;
  budget: string | null;
  kids: string;
  vibe: string;
  title: string;
  blurb: string;
  created_at: string;
};

type MatchCard = {
  listing: Listing;
  score: number;
  reasons: string[];
  risks: string[];
};

/** ============ Matching MVP (semplice, trasparente) ============ */
function budgetToRange(b?: string | null): [number, number] | null {
  if (!b) return null;
  const cleaned = b.replaceAll("€", "").replaceAll(" ", "");
  if (cleaned.endsWith("+")) {
    const n = Number(cleaned.slice(0, -1));
    if (Number.isFinite(n)) return [n, n + 999999];
    return null;
  }
  const parts = cleaned.split("-");
  if (parts.length !== 2) return null;
  const a = Number(parts[0]);
  const c = Number(parts[1]);
  if (!Number.isFinite(a) || !Number.isFinite(c)) return null;
  return [Math.min(a, c), Math.max(a, c)];
}
function overlap(a: [number, number], b: [number, number]) {
  return Math.max(a[0], b[0]) <= Math.min(a[1], b[1]);
}
function scoreListingMatch(profile: Profile, x: Listing) {
  let score = 0;
  const reasons: string[] = [];
  const risks: string[] = [];

  // zona
  if (profile.region && profile.region === x.region) score += 15;
  if (profile.city && profile.city === x.city) {
    score += 25;
    reasons.push("stessa zona");
  } else {
    risks.push("zona diversa");
  }

  // vibe / ritmi
  if (profile.vibe && x.vibe) {
    if (profile.vibe === x.vibe) {
      score += 20;
      reasons.push("ritmi compatibili");
    } else score += 10;
  }

  // figli
  if (profile.kids && x.kids) {
    if (profile.kids === x.kids) {
      score += 15;
      reasons.push("esigenze familiari simili");
    } else risks.push("esigenze familiari diverse");
  }

  // budget (se presente)
  const pa = budgetToRange(null); // profilo non ha budget, quindi “neutro”
  const lb = budgetToRange(x.budget);
  if (lb) {
    score += 10;
    reasons.push("spese definite");
  } else {
    score += 8;
    reasons.push("budget flessibile");
  }
  void pa;

  // durata (non nel profilo: premiamo la chiarezza)
  if (x.duration) {
    score += 10;
    reasons.push("durata chiara");
  }

  score = Math.max(0, Math.min(100, score));
  return { score, reasons: reasons.slice(0, 3), risks: risks.slice(0, 2) };
}

/** ============ UI helpers ============ */
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

/** ============ AuthBar (login magic link) ============ */
function AuthBar() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = async () => {
    setStatus("");
    const e = email.trim();
    if (!e) return setStatus("Inserisci una email valida.");
    const { error } = await supabase.auth.signInWithOtp({
      email: e,
      options: { emailRedirectTo: window.location.origin },
    });
    setStatus(error ? `Errore: ${error.message}` : "Link inviato! Controlla email (anche spam).");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setStatus("Disconnesso.");
  };

  if (userEmail) {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden md:inline text-xs text-neutral-600">
          Connesso: <span className="font-semibold">{userEmail}</span>
        </span>
        <button
          onClick={logout}
          className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold hover:bg-neutral-100"
        >
          Esci
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email per accedere"
        className="hidden sm:block w-56 rounded-2xl border border-neutral-200 px-3 py-2 text-xs"
      />
      <button onClick={login} className="rounded-2xl bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-800">
        Accedi
      </button>
      {status ? <span className="hidden lg:inline text-xs text-neutral-600">{status}</span> : null}
    </div>
  );
}

/** ============ Onboarding modal ============ */
function OnboardingModal({ open, onDone }: { open: boolean; onDone: () => void }) {
  const [displayName, setDisplayName] = useState("");
  const [region, setRegion] = useState("Lombardia");
  const [city, setCity] = useState("Milano");
  const [kids, setKids] = useState<"sì" | "no">("no");
  const [vibe, setVibe] = useState<"tranquillo" | "pratico" | "collaborativo">("tranquillo");
  const [status, setStatus] = useState("");

  const cities = useMemo(() => REGION_TO_CITIES[region] ?? ["Milano"], [region]);

  useEffect(() => {
    setCity((REGION_TO_CITIES[region] ?? ["Milano"])[0]);
  }, [region]);

  const save = async () => {
    setStatus("");
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return setStatus("Devi essere connesso.");
    const payload = {
      id: u.user.id,
      display_name: displayName.trim() || null,
      region,
      city,
      kids,
      vibe,
    };
    const { error } = await supabase.from("profiles").upsert(payload);
    if (error) return setStatus("Errore: " + error.message);
    onDone();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl">
        <h3 className="text-xl font-semibold">Completa il profilo (1 minuto)</h3>
        <p className="mt-2 text-sm text-neutral-600">
          Serve per migliorare la compatibilità e ridurre contatti inutili.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold">Nome (opzionale)</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
              placeholder="Es. Marco"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Regione</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
            >
              {Object.keys(REGION_TO_CITIES).map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">Città</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
            >
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">Figli</label>
            <select
              value={kids}
              onChange={(e) => setKids(e.target.value as any)}
              className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
            >
              <option value="no">no</option>
              <option value="sì">sì</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">Stile</label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value as any)}
              className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
            >
              <option value="tranquillo">tranquillo</option>
              <option value="pratico">pratico</option>
              <option value="collaborativo">collaborativo</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={save}
            className="rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Salva profilo
          </button>
          {status ? <span className="text-sm text-neutral-600">{status}</span> : null}
        </div>
      </div>
    </div>
  );
}

/** ============ Quick Chat modal ============ */
function QuickChatModal({
  open,
  onClose,
  listing,
}: {
  open: boolean;
  onClose: () => void;
  listing: Listing | null;
}) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [items, setItems] = useState<Array<{ id: string; sender_id: string; body: string; created_at: string }>>([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!open || !listing) return;
    let unsub: any = null;

    const run = async () => {
      setStatus("");
      setItems([]);
      setConversationId(null);

      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        setStatus("Accedi per usare la chat.");
        return;
      }
      if (u.user.id === listing.user_id) {
        setStatus("Non puoi scrivere al tuo stesso annuncio.");
        return;
      }

      // trova/crea conversazione
      const a = u.user.id;
      const b = listing.user_id;
      const user_a = a < b ? a : b;
      const user_b = a < b ? b : a;

      const { data: existing, error: e1 } = await supabase
        .from("conversations")
        .select("id")
        .eq("listing_id", listing.id)
        .eq("user_a", user_a)
        .eq("user_b", user_b)
        .maybeSingle();

      if (e1) {
        setStatus("Errore chat: " + e1.message);
        return;
      }

      let cid: string | null = (existing?.id as string) ?? null;


      if (!cid) {
        const { data: created, error: e2 } = await supabase
          .from("conversations")
          .insert({ listing_id: listing.id, user_a, user_b })
          .select("id")
          .single();

        if (e2) {
          setStatus("Errore creazione chat: " + e2.message);
          return;
        }
        cid = created.id;
      }
if (!cid) {
  setStatus("Errore: conversation id mancante.");
  return;
}
      setConversationId(cid);

      const loadMessages = async () => {
        const { data: msgs, error: em } = await supabase
          .from("messages")
          .select("id, sender_id, body, created_at")
          .eq("conversation_id", cid!)
          .order("created_at", { ascending: true })
          .limit(200);
        if (!em) setItems((msgs ?? []) as any);
      };

      await loadMessages();

      // realtime
      unsub = supabase
        .channel("messages-" + cid)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${cid}` },
          (payload: any) => {
            setItems((prev) => [...prev, payload.new]);
          }
        )
        .subscribe();
    };

    run();

    return () => {
      if (unsub) supabase.removeChannel(unsub);
    };
  }, [open, listing]);

  const send = async () => {
    setStatus("");
    const t = text.trim();
    if (!t) return;
    if (!conversationId) return;

    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return setStatus("Accedi per inviare.");

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: u.user.id,
      body: t,
    });

    if (error) return setStatus("Errore invio: " + error.message);
    setText("");
  };

  if (!open || !listing) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-neutral-200 bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 p-5">
          <div>
            <p className="text-sm font-semibold text-neutral-900">Chat rapida</p>
            <p className="mt-1 text-sm text-neutral-600">{listing.title}</p>
          </div>
          <button onClick={onClose} className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold hover:bg-neutral-100">
            Chiudi
          </button>
        </div>

        <div className="h-[360px] overflow-y-auto p-5">
          {status ? <p className="mb-3 text-sm text-neutral-600">{status}</p> : null}
          {items.length === 0 ? (
            <p className="text-sm text-neutral-500">Nessun messaggio ancora. Scrivi tu per primo.</p>
          ) : (
            <div className="grid gap-2">
              {items.map((m) => (
                <div key={m.id} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">
                  {m.body}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-neutral-200 p-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Scrivi un messaggio…"
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
          />
          <button onClick={send} className="rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/** ============ Main Home ============ */
export default function Home() {
  // UI state (pulito, senza doppioni)
  const [region, setRegion] = useState("Lombardia");
  const [city, setCity] = useState("Milano");
  const [activeRole, setActiveRole] = useState<"Cerco" | "Ospito">("Cerco");
  const [refreshKey, setRefreshKey] = useState(0);

  // auth/profile
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [me, setMe] = useState<Profile | null>(null);

  // listings + matches
  const [loadingListings, setLoadingListings] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [topMatches, setTopMatches] = useState<MatchCard[]>([]);
  const [err, setErr] = useState("");

  // create listing modal
  const [createOpen, setCreateOpen] = useState(false);

  // chat
  const [chatOpen, setChatOpen] = useState(false);
  const [chatListing, setChatListing] = useState<Listing | null>(null);

  const cities = useMemo(() => REGION_TO_CITIES[region] ?? ["Milano"], [region]);

  useEffect(() => {
    setCity((REGION_TO_CITIES[region] ?? ["Milano"])[0]);
  }, [region]);

  // load profile and maybe onboarding
  useEffect(() => {
    const run = async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        setMe(null);
        setOnboardOpen(false);
        return;
      }

      const { data: prof } = await supabase
        .from("profiles")
        .select("id, display_name, region, city, kids, vibe")
        .eq("id", u.user.id)
        .maybeSingle();

      if (!prof) {
        setMe(null);
        setOnboardOpen(true);
      } else showProfile(prof as Profile);
    };

    const showProfile = (p: Profile) => {
      setMe(p);
      // opzionale: precompila zona dalla persona (se vuoi)
      if (p.region && REGION_TO_CITIES[p.region]) setRegion(p.region);
      if (p.city) setCity(p.city);
      setOnboardOpen(false);
    };

    run();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session?.user) {
        setMe(null);
        setOnboardOpen(false);
      } else {
        run();
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  // load listings for selected zone/role
  useEffect(() => {
    const load = async () => {
      setLoadingListings(true);
      setErr("");

      const role: Role = activeRole === "Cerco" ? "host" : "seeker"; // se io CERCO, voglio vedere OSPITANTI
      const { data, error } = await supabase
        .from("listings")
        .select("id, user_id, role, region, city, duration, budget, kids, vibe, title, blurb, created_at")
        .eq("region", region)
        .eq("city", city)
        .eq("role", role)
        .order("created_at", { ascending: false })
        .limit(40);

      if (error) {
        setErr(error.message);
        setListings([]);
      } else {
        setListings((data ?? []) as Listing[]);
      }

      setLoadingListings(false);
    };

    load();
  }, [region, city, activeRole, refreshKey]);

  // compute top matches
  useEffect(() => {
    if (!me) {
      setTopMatches([]);
      return;
    }
    const cards = listings
      .filter((x) => x.user_id !== me.id)
      .map((x) => {
        const r = scoreListingMatch(me, x);
        return { listing: x, ...r };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
    setTopMatches(cards);
  }, [me, listings]);

  // create listing (quick)
  const createListingQuick = async (payload: Partial<Listing> & { role: Role }) => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return { ok: false, msg: "Accedi prima." };
    const { data: prof } = await supabase.from("profiles").select("id,kids,vibe").eq("id", u.user.id).maybeSingle();
    if (!prof) return { ok: false, msg: "Completa il profilo prima." };

    const title = (payload.title ?? "").trim();
    const blurb = (payload.blurb ?? "").trim();
    if (title.length < 8) return { ok: false, msg: "Titolo troppo corto." };
    if (blurb.length < 20) return { ok: false, msg: "Descrizione troppo corta." };

    const { error } = await supabase.from("listings").insert({
      user_id: u.user.id,
      role: payload.role,
      region,
      city,
      duration: payload.duration ?? "1 mese",
      budget: payload.budget ?? null,
      kids: (payload.kids ?? prof.kids ?? "no") as string,
      vibe: (payload.vibe ?? prof.vibe ?? "tranquillo") as string,
      title,
      blurb,
    });

    if (error) return { ok: false, msg: error.message };
    setRefreshKey((k) => k + 1);
    return { ok: true, msg: "Annuncio pubblicato ✅" };
  };

  const openChat = (x: Listing) => {
    setChatListing(x);
    setChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-stone-100 text-neutral-900">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-neutral-900" />
            <div>
              <p className="text-sm font-extrabold tracking-tight">Transitia</p>
              <p className="text-xs text-neutral-500">Condivisione abitativa temporanea</p>
            </div>
          </div>

          <nav className="hidden items-center gap-3 text-sm text-neutral-700 sm:flex">
            <a href="#come" className="hover:text-neutral-900">Come funziona</a>
            <a href="#annunci" className="hover:text-neutral-900">Annunci</a>
            <a href="#sicurezza" className="hover:text-neutral-900">Sicurezza</a>
          </nav>

          <div className="flex items-center gap-2">
            <AuthBar />
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -right-24 h-96 w-96 rounded-full bg-rose-200/30 blur-3xl" />

        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <Pill><MapPin className="mr-2 h-3.5 w-3.5" />Italia</Pill>
                <Pill><Shield className="mr-2 h-3.5 w-3.5" />Riservato</Pill>
                <Pill><Users className="mr-2 h-3.5 w-3.5" />Esigenze simili</Pill>
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight">
  Condivisione abitativa temporanea
  <span className="block text-neutral-700">
    per affrontare un cambiamento senza restare soli
  </span>
</h1>


            <p className="mt-4 max-w-xl leading-7 text-neutral-600">
  Transitia mette in contatto persone che condividono bisogni, spese e responsabilità,
  per una convivenza temporanea durante una fase di cambiamento.
</p>


              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a href="#annunci" className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
                  Trova persone compatibili <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <button
                  onClick={() => setCreateOpen(true)}
                  className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold hover:bg-neutral-100"
                >
                  Pubblica annuncio <Plus className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Box filtro zona + ruolo */}
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-neutral-900">Cerca per zona</p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Regione</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
                  >
                    {Object.keys(REGION_TO_CITIES).map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Città</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
                  >
                    {cities.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium">Io</label>
                <div className="mt-2 inline-flex rounded-2xl border border-neutral-200 bg-neutral-50 p-1">
                  <button
                    type="button"
                    onClick={() => setActiveRole("Cerco")}
                    className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                      activeRole === "Cerco" ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-white"
                    }`}
                  >
                    Cerco
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveRole("Ospito")}
                    className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                      activeRole === "Ospito" ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-white"
                    }`}
                  >
                    Posso ospitare
                  </button>
                </div>
              </div>

              <p className="mt-4 text-sm text-neutral-600">
                Ti mostriamo annunci compatibili con il tuo profilo, nella zona selezionata.
              </p>
            </div>
          </div>
        </section>

        <Section
          id="come"
          title="Come funziona"
          subtitle="Semplice: profilo minimo → annunci per zona → chat rapida. Nessun “dating”."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="font-semibold">1) Profilo</p>
              <p className="mt-2 text-sm text-neutral-600">Poche info utili: zona, figli, ritmi.</p>
            </div>
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="font-semibold">2) Annunci</p>
              <p className="mt-2 text-sm text-neutral-600">Cerco / Ospito per periodo temporaneo.</p>
            </div>
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="font-semibold">3) Chat</p>
              <p className="mt-2 text-sm text-neutral-600">Contatto diretto, rispettoso, tracciabile.</p>
            </div>
          </div>
        </Section>

        <Section
          id="annunci"
          title="Annunci e compatibilità"
          subtitle="Prima vedi i top compatibili, poi l’elenco. Pubblica in meno di 30 secondi (budget opzionale)."
        >
          {/* Top matches */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold">Top compatibili per te</p>
                <p className="mt-1 text-sm text-neutral-600">Basato su zona, stile e situazione familiare.</p>
              </div>
              <span className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700">
                {city}
              </span>
            </div>

            {!me ? (
              <p className="mt-4 text-sm text-neutral-600">Accedi e completa il profilo per vedere i match.</p>
            ) : loadingListings ? (
              <p className="mt-4 text-sm text-neutral-600">Caricamento…</p>
            ) : topMatches.length === 0 ? (
              <p className="mt-4 text-sm text-neutral-600">
                Ancora pochi annunci in zona. Pubblica il primo per sbloccare il network.
              </p>
            ) : (
              <div className="mt-4 grid gap-4">
                {topMatches.map((m) => (
                  <div key={m.listing.id} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold text-neutral-900">{m.listing.title}</p>
                      <span className="rounded-2xl bg-neutral-900 px-3 py-1 text-xs font-semibold text-white">
                        Compatibilità {m.score}%
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-neutral-700">
                      <span className="rounded-xl border border-neutral-200 bg-white px-2.5 py-1">
                        {m.listing.duration}
                      </span>
                      <span className="rounded-xl border border-neutral-200 bg-white px-2.5 py-1">
                        {m.listing.budget ?? "budget flessibile"}
                      </span>
                      <span className="rounded-xl border border-neutral-200 bg-white px-2.5 py-1">
                        figli: {m.listing.kids}
                      </span>
                      <span className="rounded-xl border border-neutral-200 bg-white px-2.5 py-1">
                        {m.listing.vibe}
                      </span>
                    </div>

                    <div className="mt-3 text-sm text-neutral-700">
                      <p className="font-semibold">Perché</p>
                      <ul className="mt-1 list-disc pl-5 text-neutral-600">
                        {m.reasons.map((x, i) => (
                          <li key={i}>{x}</li>
                        ))}
                      </ul>

                      {m.risks.length ? (
                        <>
                          <p className="mt-3 font-semibold">Da valutare</p>
                          <ul className="mt-1 list-disc pl-5 text-neutral-600">
                            {m.risks.map((x, i) => (
                              <li key={i}>{x}</li>
                            ))}
                          </ul>
                        </>
                      ) : null}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => openChat(m.listing)}
                        className="inline-flex items-center rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Chat rapida
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Listings list */}
          <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold">Annunci in {city}</p>
                <p className="mt-1 text-sm text-neutral-600">
                  Stai vedendo: <span className="font-semibold">{activeRole === "Cerco" ? "Ospitanti" : "Richieste"}</span>
                </p>
              </div>
              <button
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-neutral-100"
              >
                <Plus className="mr-2 h-4 w-4" /> Pubblica
              </button>
            </div>

            {err ? (
              <p className="mt-4 text-sm text-neutral-600">Errore: {err}</p>
            ) : loadingListings ? (
              <p className="mt-4 text-sm text-neutral-600">Caricamento annunci…</p>
            ) : listings.length === 0 ? (
              <p className="mt-4 text-sm text-neutral-600">
                Nessun annuncio in questa zona. Pubblica tu il primo.
              </p>
            ) : (
              <div className="mt-4 grid gap-4">
                {listings.map((x) => (
                  <div key={x.id} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold text-neutral-900">{x.title}</p>
                      <button
                        onClick={() => openChat(x)}
                        className="inline-flex items-center rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" /> Chat
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-neutral-700">{x.blurb}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-neutral-700">
                      <span className="rounded-xl border border-neutral-200 bg-white px-2.5 py-1">{x.duration}</span>
                      <span className="rounded-xl border border-neutral-200 bg-white px-2.5 py-1">{x.budget ?? "budget flessibile"}</span>
                      <span className="rounded-xl border border-neutral-200 bg-white px-2.5 py-1">figli: {x.kids}</span>
                      <span className="rounded-xl border border-neutral-200 bg-white px-2.5 py-1">{x.vibe}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>

        <Section
          id="sicurezza"
          title="Riservatezza e sicurezza"
          subtitle="Proteggiamo il contatto: profilo minimo, consenso, segnalazione."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <CheckCircle2 className="h-5 w-5" />
              <p className="mt-3 font-semibold">Anonimo all’inizio</p>
              <p className="mt-2 text-sm text-neutral-600">Contatto solo via chat, senza dati pubblici.</p>
            </div>
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <Shield className="h-5 w-5" />
              <p className="mt-3 font-semibold">Consenso</p>
              <p className="mt-2 text-sm text-neutral-600">Decidi tu quando e cosa condividere.</p>
            </div>
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <Users className="h-5 w-5" />
              <p className="mt-3 font-semibold">Compatibilità</p>
              <p className="mt-2 text-sm text-neutral-600">Motivazioni chiare: meno perdite di tempo.</p>
            </div>
          </div>
        </Section>

        <footer className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-neutral-900">Transitia</p>
                <p className="mt-1 text-sm text-neutral-600">MVP pronto: annunci + chat + compatibilità.</p>
              </div>
              <a href="#annunci" className="inline-flex items-center rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800">
                <Search className="mr-2 h-4 w-4" /> Vai agli annunci
              </a>
            </div>
          </div>
        </footer>

        {/* Modals */}
        <OnboardingModal open={onboardOpen} onDone={() => setOnboardOpen(false)} />
        <CreateListingModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreate={createListingQuick}
          roleDefault={activeRole === "Cerco" ? "seeker" : "host"}
        />
        <QuickChatModal open={chatOpen} onClose={() => setChatOpen(false)} listing={chatListing} />
      </main>
    </div>
  );
}

/** ============ Create Listing Modal (super semplice) ============ */
function CreateListingModal({
  open,
  onClose,
  onCreate,
  roleDefault,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (p: { role: Role; duration: string; budget: string | null; title: string; blurb: string }) => Promise<{ ok: boolean; msg: string }>;
  roleDefault: Role;
}) {
  const [role, setRole] = useState<Role>(roleDefault);
  const [duration, setDuration] = useState("1 mese");
  const [budget, setBudget] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [blurb, setBlurb] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (open) setRole(roleDefault);
  }, [open, roleDefault]);

  const submit = async () => {
    setStatus("");
    const res = await onCreate({ role, duration, budget, title, blurb });
    setStatus(res.msg);
    if (res.ok) {
      setTitle("");
      setBlurb("");
      setBudget(null);
      setDuration("1 mese");
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">Pubblica annuncio (30 secondi)</h3>
            <p className="mt-2 text-sm text-neutral-600">Budget opzionale. Il resto si discute in chat.</p>
          </div>
          <button onClick={onClose} className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold hover:bg-neutral-100">
            Chiudi
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold">Tipo</label>
            <div className="mt-2 inline-flex rounded-2xl border border-neutral-200 bg-neutral-50 p-1">
              <button
                type="button"
                onClick={() => setRole("seeker")}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                  role === "seeker" ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-white"
                }`}
              >
                Cerco
              </button>
              <button
                type="button"
                onClick={() => setRole("host")}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                  role === "host" ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-white"
                }`}
              >
                Posso ospitare
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Durata</label>
            <select value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm">
              <option>1 mese</option>
              <option>1-2 mesi</option>
              <option>3-6 mesi</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">Budget (opzionale)</label>
            <select
              value={budget ?? ""}
              onChange={(e) => setBudget(e.target.value ? e.target.value : null)}
              className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
            >
              <option value="">Non so / flessibile</option>
              <option value="€300-500">€300-500</option>
              <option value="€500-700">€500-700</option>
              <option value="€700-900">€700-900</option>
              <option value="€900+">€900+</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-semibold">Titolo</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm" placeholder="Es. Condivisione spese per 1 mese vicino ai miei" />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-semibold">Descrizione</label>
            <textarea value={blurb} onChange={(e) => setBlurb(e.target.value)} className="mt-1 min-h-[110px] w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm" placeholder="Regole base, spese, ritmi, bambini, cosa cerchi/offri…" />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button onClick={submit} className="rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
            Pubblica <ArrowRight className="ml-2 inline h-4 w-4" />
          </button>
          {status ? <span className="text-sm text-neutral-600">{status}</span> : null}
        </div>
      </div>
    </div>
  );
}
