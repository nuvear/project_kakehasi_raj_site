"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  browserSessionPersistence,
  setPersistence,
  type User,
} from "firebase/auth";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChartNoAxesCombined,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Printer,
  Settings2,
  ShieldCheck,
  Trash2,
  Upload,
  Users,
  X,
  LockKeyhole,
  LoaderCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { auth } from "@/lib/firebase";
import {
  freshState,
  stateSchema,
  valuePool,
  type DiaryState,
  type Member,
} from "@/lib/model";
import dimensions from "@/content/dimensions.json";
import signals from "@/content/signals.json";
type Section = { title: string; content: string };
type Chapter = { title: string; weekNum?: number; sections: Section[] };
type Content = {
  weeks: Chapter[];
  front_matter: Chapter;
  back_matter: Chapter;
};
const titles = [
  "Economic discipline",
  "Intelligence & autonomy",
  "Strategic value pools",
  "Data foundations",
  "Architecture as economics",
  "Bounded autonomy",
  "Decision rights",
  "Trust & legitimacy",
  "Earned adoption",
  "Industry advantage",
  "Value realization",
  "Leadership legacy",
];
const phases = [
  "Build the foundation",
  "Shape the enterprise",
  "Lead the transformation",
];
const lessons = [
  "Start with the income statement, not the demo.",
  "Decide where creativity ends and guardrails begin.",
  "Turn scattered pilots into board-defensible bets.",
  "Build the road without stopping the business.",
  "Preserve flexibility. Understand the economics.",
  "Know where the agent stops and the human starts.",
  "Decide who owns AI when it fails.",
  "Put trust at the center of every decision.",
  "Turn skeptics into champions through evidence.",
  "Build advantage around your domain.",
  "Connect AI investment to realized value.",
  "Define commitments that outlast the initiative.",
];
const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: n >= 1e6 ? "compact" : "standard",
  }).format(n);
function friendly(e: unknown) {
  const code = (e as { code?: string })?.code || "";
  if (
    code.includes("invalid-credential") ||
    code.includes("wrong-password") ||
    code.includes("user-not-found")
  )
    return "We could not sign you in. Check your email and password.";
  if (code.includes("email-already-in-use"))
    return "An account already uses this email. Sign in or reset your password.";
  if (code.includes("popup-closed"))
    return "The sign-in window was closed. You can try again.";
  if (code.includes("too-many-requests"))
    return "Too many attempts. Please wait a few minutes and try again.";
  if (code.includes("network")) return "Check your connection and try again.";
  if (code)
    return "Sign-in could not be completed. Please try again or use another sign-in method.";
  return e instanceof Error
    ? e.message
    : "Something went wrong. Please try again.";
}
function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">
        <BookOpen size={22} />
      </span>
      <span>
        AI Leadership<span className="brand-sub">THE TWELVE-WEEK DIARY</span>
      </span>
    </div>
  );
}
export default function Diary() {
  const [user, setUser] = useState<User | null>(null),
    [member, setMember] = useState<Member | null>(null),
    [boot, setBoot] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [content, setContent] = useState<Content | null>(null);
  const [state, setState] = useState<DiaryState>(freshState);
  const [saveStatus, setSaveStatus] = useState("Saved"),
    [saveError, setSaveError] = useState(""),
    [mobile, setMobile] = useState(false),
    [settings, setSettings] = useState(false),
    [admin, setAdmin] = useState(false);
  const [members, setMembers] = useState<Member[]>([]),
    [nextMembers, setNextMembers] = useState<string | null>(null);
  const [confirmImport, setConfirmImport] = useState<DiaryState | null>(null);
  const current = useRef(state),
    revision = useRef(0),
    generation = useRef(0),
    dirty = useRef(false),
    saving = useRef(false),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    session = useRef(0),
    userRef = useRef<User | null>(null),
    stopped = useRef(false);
  async function api(
    path: string,
    method = "GET",
    data?: unknown,
    who = userRef.current,
  ) {
    if (!who) throw new Error("Please sign in.");
    const token = await who.getIdToken();
    const response = await fetch(`/diary/api/${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(data ? { "Content-Type": "application/json" } : {}),
      },
      body: data ? JSON.stringify(data) : undefined,
      cache: "no-store",
    });
    const payload = await response.json();
    if (!response.ok)
      throw new Error(payload.error || "Your request could not be completed.");
    return payload;
  }
  async function load(who: User) {
    const epoch = session.current;
    setError("");
    setBusy(true);
    try {
      if (!who.emailVerified) {
        setMember(null);
        return;
      }
      const account = await api("account", "POST", undefined, who);
      if (epoch !== session.current) return;
      setMember(account.member);
      if (account.member?.status === "active") {
        const [saved, book] = await Promise.all([
          api("state", "GET", undefined, who),
          api("content", "GET", undefined, who),
        ]);
        if (epoch !== session.current) return;
        const validated = stateSchema.parse(saved.state);
        current.current = validated;
        revision.current = saved.version;
        dirty.current = false;
        stopped.current = false;
        setSaveError("");
        setSaveStatus("Saved");
        setState(validated);
        setContent(book);
      }
    } catch (e) {
      if (epoch === session.current) setError(friendly(e));
    } finally {
      if (epoch === session.current) setBusy(false);
    }
  }
  useEffect(
    () =>
      onAuthStateChanged(auth(), (who) => {
        session.current++;
        userRef.current = who;
        setUser(who);
        setMember(null);
        setContent(null);
        setAdmin(false);
        setMembers([]);
        dirty.current = false;
        stopped.current = false;
        current.current = freshState();
        setState(current.current);
        if (timer.current) clearTimeout(timer.current);
        setBoot(false);
        if (who) void load(who);
      }),
    [],
  ); // identity changes clear all private state
  useEffect(() => {
    const prevent = (e: BeforeUnloadEvent) => {
      if (dirty.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, []);
  async function flush() {
    if (saving.current || !dirty.current || stopped.current) return;
    const epoch = session.current;
    const who = userRef.current;
    saving.current = true;
    setSaveStatus("Saving…");
    try {
      while (dirty.current && epoch === session.current) {
        const n = generation.current;
        const result = await api(
          "state",
          "PUT",
          { state: current.current, version: revision.current },
          who,
        );
        if (epoch !== session.current) return;
        revision.current = result.version;
        if (n === generation.current) dirty.current = false;
      }
      if (epoch === session.current) {
        setSaveStatus("Saved");
        setSaveError("");
      }
    } catch (e) {
      if (epoch === session.current) {
        stopped.current = true;
        setSaveStatus("Not saved");
        setSaveError(friendly(e));
      }
    } finally {
      saving.current = false;
      if (epoch !== session.current && dirty.current) void flush();
    }
  }
  function update(patch: Partial<DiaryState>) {
    current.current = { ...current.current, ...patch };
    generation.current++;
    dirty.current = true;
    setState(current.current);
    setSaveStatus("Unsaved changes");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void flush(), 650);
  }
  function go(
    screen: DiaryState["activeScreen"],
    week?: DiaryState["activeWeek"],
    workbook = false,
  ) {
    setAdmin(false);
    setMobile(false);
    update({
      activeScreen: screen,
      ...(screen === "reader" &&
      typeof week === "number" &&
      !state.userProgress[week]
        ? {
            userProgress: { ...state.userProgress, [week]: "reading" as const },
          }
        : {}),
      ...(week
        ? {
            activeWeek: week,
            activeTab: workbook ? "workbook_tab" : "Diary Opening",
          }
        : {}),
    });
    window.scrollTo({ top: 0 });
  }
  async function enter(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    const data = new FormData(e.currentTarget),
      email = String(data.get("email")).trim(),
      password = String(data.get("password") || "");
    try {
      await setPersistence(auth(), browserSessionPersistence);
      if (mode === "reset") {
        await sendPasswordResetEmail(auth(), email);
        setNotice("If an account exists, a reset link will arrive shortly.");
      } else if (mode === "signup") {
        const credential = await createUserWithEmailAndPassword(
          auth(),
          email,
          password,
        );
        await sendEmailVerification(credential.user);
        setNotice("Check your inbox to verify your email address.");
      } else await signInWithEmailAndPassword(auth(), email, password);
    } catch (e) {
      setError(friendly(e));
    } finally {
      setBusy(false);
    }
  }
  async function google() {
    setBusy(true);
    setError("");
    try {
      await setPersistence(auth(), browserSessionPersistence);
      await signInWithPopup(auth(), new GoogleAuthProvider());
    } catch (e) {
      setError(friendly(e));
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    if (
      dirty.current &&
      !window.confirm(
        "Your latest changes are not saved. Export a backup before leaving. Sign out anyway?",
      )
    )
      return;
    await signOut(auth());
    setError("");
  }
  function download(data = current.current) {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-leadership-diary-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  async function importBackup(file?: File) {
    if (!file) return;
    try {
      if (file.size > 600000)
        throw new Error("Choose a backup smaller than 600 KB.");
      setConfirmImport(stateSchema.parse(JSON.parse(await file.text())));
    } catch {
      setError(
        "This file is not a valid diary backup. Your saved work has not changed.",
      );
    }
  }
  async function showMembers(more = false) {
    setAdmin(true);
    setMobile(false);
    setBusy(true);
    setError("");
    try {
      const result = await api(
        `members${more && nextMembers ? `?after=${encodeURIComponent(nextMembers)}` : ""}`,
      );
      setMembers(more ? [...members, ...result.members] : result.members);
      setNextMembers(result.next);
    } catch (e) {
      setError(friendly(e));
    } finally {
      setBusy(false);
    }
  }
  async function changeMember(target: Member, patch: Partial<Member>) {
    setBusy(true);
    try {
      await api("members", "PATCH", {
        uid: target.uid,
        status: target.status,
        role: target.role,
        ...patch,
      });
      await showMembers();
    } catch (e) {
      setError(friendly(e));
    } finally {
      setBusy(false);
    }
  }
  const complete = Object.values(state.userProgress).filter(
      (s) => s === "done",
    ).length,
    resume = typeof state.activeWeek === "number" ? state.activeWeek : 1;
  const chapter = content
    ? state.activeWeek === "front"
      ? content.front_matter
      : state.activeWeek === "back"
        ? content.back_matter
        : content.weeks.find((w) => w.weekNum === state.activeWeek)
    : null;
  const sections =
    chapter?.sections.filter(
      (s) => s.content.replace(/[\s\-*#_>]/g, "").length,
    ) || [];
  const section =
    sections.find((s) => s.title === state.activeTab) || sections[0];
  const scored = dimensions.filter((d) => state.maturityRatings[d.id]).length,
    score = dimensions.reduce(
      (n, d) => n + (state.maturityRatings[d.id] || 1),
      0,
    );
  const bracket =
    score / 24 >= 0.85
      ? "AI-Native Master Leader"
      : score / 24 >= 0.5
        ? "Disciplined Enterprise Scale-Builder"
        : "AI-Curious Practitioner";
  const screenLabel = admin
    ? "Access management"
    : {
        dashboard: "Your leadership journey",
        reader:
          typeof state.activeWeek === "number"
            ? `Week ${String(state.activeWeek).padStart(2, "0")}`
            : state.activeWeek === "front"
              ? "Front matter"
              : "Toolkit & checklists",
        maturity: "Leadership maturity",
        manifesto: "Culture manifesto",
      }[state.activeScreen];
  if (boot)
    return (
      <div className="loading">
        <Brand />
        <LoaderCircle className="spin" />
        <p>Opening your diary…</p>
      </div>
    );
  if (!user || !content || member?.status !== "active")
    return (
      <main className="auth-page">
        <section className="auth-story">
          <a href="/en" className="author-link">
            RAJKUMAR RAJAGOBALAN <ArrowUpRight size={15} />
          </a>
          <Brand />
          <div className="auth-title">
            <span className="eyebrow">
              A PRACTICE. A PERSPECTIVE. A LEGACY.
            </span>
            <h1>
              Become the leader
              <br />
              your AI future
              <br />
              <em>needs.</em>
            </h1>
            <p>
              Twelve weeks of reflection, economic discipline, and responsible
              enterprise leadership.
            </p>
          </div>
          <div className="auth-chapters">
            <span>
              <b>01—04</b>Foundation
            </span>
            <span>
              <b>05—08</b>Enterprise
            </span>
            <span>
              <b>09—12</b>Leadership
            </span>
          </div>
          <footer>
            THE 12-WEEK AI LEADERSHIP DIARY <span>By Rajkumar Rajagobalan</span>
            <a
              href="https://unsplash.com/photos/SNdAWKVN1q0"
              target="_blank"
              rel="noreferrer"
            >
              Golden Gate photograph · Griffin Wooldridge
            </a>
          </footer>
        </section>
        <section className="auth-form-area">
          <div className="auth-form">
            <span className="eyebrow">YOUR PRIVATE WORKSPACE</span>
            <h2>
              {!user
                ? mode === "signup"
                  ? "Begin your journey"
                  : mode === "reset"
                    ? "Reset your password"
                    : "Welcome back"
                : !user.emailVerified
                  ? "Verify your email"
                  : member?.status === "revoked"
                    ? "Access paused"
                    : member?.status === "pending"
                      ? "Your request is with us"
                      : busy
                        ? "Opening your diary"
                        : "Connect to your diary"}
            </h2>
            <p>
              {!user
                ? mode === "signup"
                  ? "Create an account to request access to the diary."
                  : mode === "reset"
                    ? "We’ll help you return to your diary."
                    : "Sign in to continue your leadership journey."
                : !user.emailVerified
                  ? `Check ${user.email} for a verification link.`
                  : member?.status === "pending"
                    ? "Your account is awaiting administrator approval. Your private workspace will be available once access is approved."
                    : member?.status === "revoked"
                      ? "Your administrator has paused access to this diary."
                      : `Signed in as ${user.email}`}
            </p>
            {error && (
              <div className="alert" role="alert">
                {error}
              </div>
            )}
            {notice && (
              <div className="notice" role="status">
                {notice}
              </div>
            )}
            {!user ? (
              <>
                <button
                  className="google-button"
                  disabled={busy}
                  onClick={google}
                >
                  <span className="google-letter">G</span>Continue with Google
                </button>
                <div className="divider">or use your email</div>
                <form onSubmit={enter}>
                  <label>
                    Email address
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      required
                    />
                  </label>
                  {mode !== "reset" && (
                    <label>
                      Password
                      <input
                        name="password"
                        type="password"
                        autoComplete={
                          mode === "signup"
                            ? "new-password"
                            : "current-password"
                        }
                        minLength={mode === "signup" ? 12 : undefined}
                        placeholder={
                          mode === "signup"
                            ? "At least 12 characters"
                            : "Enter your password"
                        }
                        required
                      />
                    </label>
                  )}
                  {mode === "signin" && (
                    <button
                      type="button"
                      className="text-button forgot"
                      onClick={() => setMode("reset")}
                    >
                      Forgot password?
                    </button>
                  )}
                  <button className="primary full" disabled={busy}>
                    {busy ? (
                      <LoaderCircle className="spin" size={18} />
                    ) : (
                      <>
                        {mode === "signin"
                          ? "Sign in"
                          : mode === "signup"
                            ? "Create account"
                            : "Send reset link"}
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
                <div className="auth-switch">
                  {mode === "signin" ? "New to the diary? " : ""}
                  <button
                    className="text-button"
                    onClick={() => {
                      setMode(mode === "signin" ? "signup" : "signin");
                      setError("");
                      setNotice("");
                    }}
                  >
                    {mode === "signin" ? "Request access" : "Back to sign in"}
                  </button>
                </div>
              </>
            ) : (
              <div className="stack">
                {!user.emailVerified && (
                  <button
                    className="secondary"
                    disabled={busy}
                    onClick={async () => {
                      try {
                        await sendEmailVerification(user);
                        setNotice("Verification email sent.");
                      } catch (e) {
                        setError(friendly(e));
                      }
                    }}
                  >
                    Resend verification email
                  </button>
                )}
                <button
                  className="primary"
                  disabled={busy}
                  onClick={async () => {
                    try {
                      await user.reload();
                      await user.getIdToken(true);
                      await load(user);
                    } catch (e) {
                      setError(friendly(e));
                    }
                  }}
                >
                  {busy ? (
                    <LoaderCircle className="spin" size={18} />
                  ) : (
                    <>
                      Refresh access
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
                <button className="text-button" onClick={logout}>
                  Sign out
                </button>
              </div>
            )}
            <div className="privacy-note">
              <LockKeyhole size={17} />
              <span>
                Your reflections are private to your account.
                <br />
                Access is approved by the diary administrator.
              </span>
            </div>
          </div>
          <span className="auth-bottom">
            From curiosity to AI-native leadership.
          </span>
        </section>
      </main>
    );
  return (
    <div className="workspace" data-theme={state.theme}>
      <a className="skip-link" href="#diary-main">
        Skip to content
      </a>
      {mobile && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setMobile(false)}
        />
      )}
      <aside className={`sidebar ${mobile ? "open" : ""}`}>
        <Brand />
        <nav aria-label="Diary navigation">
          <span className="nav-caption">WORKSPACE</span>
          {[
            { name: "Overview", screen: "dashboard", Icon: LayoutDashboard },
            {
              name: "Maturity map",
              screen: "maturity",
              Icon: ChartNoAxesCombined,
            },
            {
              name: "Culture manifesto",
              screen: "manifesto",
              Icon: ShieldCheck,
            },
          ].map(({ name, screen, Icon }) => (
            <button
              key={screen}
              className={`nav-link ${!admin && state.activeScreen === screen ? "selected" : ""}`}
              onClick={() => go(screen as DiaryState["activeScreen"])}
            >
              <Icon size={18} />
              {name}
            </button>
          ))}
          <div className="nav-caption journey-caption">
            YOUR TWELVE WEEKS <span>{complete}/12</span>
          </div>
          {phases.map((phase, p) => (
            <div className="phase-nav" key={phase}>
              <span>
                {String(p + 1).padStart(2, "0")} / {phase}
              </span>
              {titles.slice(p * 4, p * 4 + 4).map((title, i) => {
                const w = p * 4 + i + 1;
                return (
                  <button
                    key={w}
                    className={`week-link ${!admin && state.activeScreen === "reader" && state.activeWeek === w ? "selected" : ""}`}
                    onClick={() => go("reader", w)}
                  >
                    <span
                      className={`week-dot ${state.userProgress[w] === "done" ? "done" : ""}`}
                    >
                      {state.userProgress[w] === "done" ? (
                        <Check size={12} />
                      ) : (
                        String(w).padStart(2, "0")
                      )}
                    </span>
                    {title}
                  </button>
                );
              })}
            </div>
          ))}
          <span className="nav-caption">LIBRARY</span>
          <button className="nav-link" onClick={() => go("reader", "front")}>
            <BookOpen size={18} />
            Front matter
          </button>
          <button className="nav-link" onClick={() => go("reader", "back")}>
            <FileText size={18} />
            Toolkit & checklists
          </button>
          {member.role === "admin" && (
            <button
              className={`nav-link ${admin ? "selected" : ""}`}
              onClick={() => showMembers()}
            >
              <Users size={18} />
              Manage access
            </button>
          )}
        </nav>
        <div className="profile">
          <span className="avatar">
            {(member.name || member.email).slice(0, 1).toUpperCase()}
          </span>
          <div>
            <strong>{member.name || member.email.split("@")[0]}</strong>
            <small>
              {member.role === "admin" ? "Administrator" : "Participant"}
            </small>
          </div>
          <button aria-label="Sign out" title="Sign out" onClick={logout}>
            <LogOut size={17} />
          </button>
        </div>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <div>
            <button
              className="mobile-menu icon-button"
              aria-label="Open navigation"
              onClick={() => setMobile(true)}
            >
              <Menu size={20} />
            </button>
            <span className="breadcrumb">
              The leadership diary <ChevronRight size={13} />{" "}
              <strong>{screenLabel}</strong>
            </span>
          </div>
          <div className="top-actions">
            <span
              className={`save-status ${saveError ? "save-failed" : ""}`}
              role="status"
            >
              {saveStatus === "Saved" ? (
                <CheckCheck size={15} />
              ) : (
                <span className="status-dot" />
              )}
              {saveStatus}
            </span>
            <button
              className="icon-button"
              title="Reading preferences"
              aria-label="Reading preferences"
              onClick={() => setSettings(!settings)}
            >
              <Settings2 size={19} />
            </button>
            <button
              className="icon-button"
              title="Print current view"
              aria-label="Print current view"
              onClick={() => window.print()}
            >
              <Printer size={19} />
            </button>
          </div>
        </header>
        {settings && (
          <section className="preferences">
            <label>
              Appearance
              <select
                value={state.theme}
                onChange={(e) =>
                  update({ theme: e.target.value as DiaryState["theme"] })
                }
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="sepia">Sepia</option>
              </select>
            </label>
            <label>
              Reading font
              <select
                value={state.fontFamily}
                onChange={(e) =>
                  update({
                    fontFamily: e.target.value as DiaryState["fontFamily"],
                  })
                }
              >
                <option value="serif">Editorial serif</option>
                <option value="sans">Sans serif</option>
              </select>
            </label>
            <label>
              Text size: {state.fontSizeVal}px
              <input
                type="range"
                min="14"
                max="24"
                value={state.fontSizeVal}
                onChange={(e) =>
                  update({ fontSizeVal: Number(e.target.value) })
                }
              />
            </label>
            <button
              className="icon-button"
              onClick={() => setSettings(false)}
              aria-label="Close preferences"
            >
              <X size={18} />
            </button>
          </section>
        )}
        <main
          id="diary-main"
          className={`main-content ${state.activeScreen === "reader" && !admin ? "reader-content" : ""}`}
        >
          {error && (
            <div className="alert" role="alert">
              {error}
              <button className="text-button" onClick={() => setError("")}>
                Dismiss
              </button>
            </div>
          )}
          {saveError && (
            <div className="alert" role="alert">
              <span>{saveError}</span>
              <div className="actions">
                <button onClick={() => download()} className="secondary">
                  Export unsaved work
                </button>
                <button
                  onClick={() => {
                    stopped.current = false;
                    void flush();
                  }}
                  className="secondary"
                >
                  Retry save
                </button>
                <button
                  className="secondary"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Load the saved version? Unsaved edits will be replaced. Export them first.",
                      )
                    )
                      void load(user);
                  }}
                >
                  Load saved version
                </button>
              </div>
            </div>
          )}
          {admin ? (
            <>
              <PageHeading
                eyebrow="ADMINISTRATION"
                title="People & access"
                description="Approve participants and manage access. Their reflections remain private."
              />
              <section className="panel">
                <div className="panel-heading">
                  <h2>Diary accounts</h2>
                  <span className="pill">{members.length} loaded</span>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Participant</th>
                        <th>Status</th>
                        <th>Role</th>
                        <th>Access</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) => (
                        <tr key={m.uid}>
                          <td>
                            <strong>{m.name || m.email.split("@")[0]}</strong>
                            <small>{m.email}</small>
                          </td>
                          <td>
                            <span
                              className={`pill ${m.status === "active" ? "green" : ""}`}
                            >
                              {m.status}
                            </span>
                          </td>
                          <td>
                            <select
                              aria-label={`Role for ${m.email}`}
                              disabled={busy || m.uid === member.uid}
                              value={m.role}
                              onChange={(e) =>
                                changeMember(m, {
                                  role: e.target.value as Member["role"],
                                })
                              }
                            >
                              <option value="participant">Participant</option>
                              <option value="admin">Administrator</option>
                            </select>
                          </td>
                          <td>
                            {m.uid === member.uid ? (
                              <span className="muted">You</span>
                            ) : (
                              <button
                                className="secondary"
                                disabled={busy}
                                onClick={() =>
                                  changeMember(m, {
                                    status:
                                      m.status === "active"
                                        ? "revoked"
                                        : "active",
                                  })
                                }
                              >
                                {m.status === "active"
                                  ? "Revoke access"
                                  : "Approve access"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {nextMembers && (
                  <button
                    className="secondary"
                    onClick={() => showMembers(true)}
                  >
                    Load more
                  </button>
                )}
              </section>
            </>
          ) : state.activeScreen === "dashboard" ? (
            <>
              <PageHeading
                eyebrow="THE EXECUTIVE WORKSPACE"
                title="Make leadership a practice."
                description="A little perspective. A considered decision. A stronger enterprise."
                extra={
                  <span className="edition">12 WEEKS · YOUR OWN PACE</span>
                }
              />
              <div className="overview-grid">
                <section className="continue-card">
                  <div className="eyebrow">
                    CONTINUE YOUR JOURNEY{" "}
                    <span>WEEK {String(resume).padStart(2, "0")}</span>
                  </div>
                  <h2>{titles[resume - 1]}</h2>
                  <p>{lessons[resume - 1]}</p>
                  <div className="continue-bottom">
                    <button
                      className="white-button"
                      onClick={() => go("reader", resume)}
                    >
                      Resume reading <ArrowRight size={18} />
                    </button>
                    <button
                      className="light-link"
                      onClick={() => go("reader", resume, true)}
                    >
                      Open workbook <ArrowUpRight size={16} />
                    </button>
                  </div>
                </section>
                <section className="progress-card panel">
                  <span className="eyebrow">YOUR PROGRESS</span>
                  <div className="progress-stat">
                    <strong>{String(complete).padStart(2, "0")}</strong>
                    <span>
                      / 12 weeks
                      <br />
                      completed
                    </span>
                  </div>
                  <div className="progress-segments">
                    {Array.from({ length: 12 }, (_, i) => (
                      <span
                        key={i}
                        className={
                          state.userProgress[i + 1] === "done" ? "filled" : ""
                        }
                      />
                    ))}
                  </div>
                  <p>
                    {complete === 12
                      ? "A complete journey. A continuing practice."
                      : `${12 - complete} weeks of perspective ahead.`}
                  </p>
                </section>
              </div>
              <div className="metrics-grid">
                <button className="metric" onClick={() => go("maturity")}>
                  <ChartNoAxesCombined size={20} />
                  <span>
                    <small>LEADERSHIP MATURITY</small>
                    <strong>{scored ? `${score} / 24` : "Not assessed"}</strong>
                    <em>
                      {scored
                        ? `${scored} of 8 dimensions rated`
                        : "Discover your starting point"}
                    </em>
                  </span>
                  <ArrowUpRight size={17} />
                </button>
                <button
                  className="metric"
                  onClick={() => go("reader", 1, true)}
                >
                  <FileText size={20} />
                  <span>
                    <small>IDENTIFIED VALUE POOL</small>
                    <strong>{money(valuePool(state.heatmapRows))}</strong>
                    <em>Illustrative until you enter your figures</em>
                  </span>
                  <ArrowUpRight size={17} />
                </button>
                <button className="metric" onClick={() => go("manifesto")}>
                  <ShieldCheck size={20} />
                  <span>
                    <small>RESPONSIBLE AI COMMITMENT</small>
                    <strong>
                      {state.manifestoSigned.signerName
                        ? "Signed"
                        : "Your leadership promise"}
                    </strong>
                    <em>
                      {state.manifestoSigned.orgName ||
                        "Define the culture you want to build"}
                    </em>
                  </span>
                  <ArrowUpRight size={17} />
                </button>
              </div>
              <div className="section-heading">
                <div>
                  <span className="eyebrow">THE ROAD AHEAD</span>
                  <h2>Twelve weeks. A different perspective.</h2>
                </div>
                <span className="muted">Read · Reflect · Apply</span>
              </div>
              <div className="journey-grid">
                {phases.map((phase, p) => (
                  <section className="phase-card panel" key={phase}>
                    <div className="phase-head">
                      <span className="phase-number">0{p + 1}</span>
                      <div>
                        <small>
                          WEEKS {p * 4 + 1}—{p * 4 + 4}
                        </small>
                        <h3>{phase}</h3>
                      </div>
                    </div>
                    {titles.slice(p * 4, p * 4 + 4).map((title, i) => {
                      const week = p * 4 + i + 1;
                      return (
                        <button
                          className="chapter-row"
                          key={week}
                          onClick={() => go("reader", week)}
                        >
                          <span className="chapter-number">
                            {String(week).padStart(2, "0")}
                          </span>
                          <span>
                            {title}
                            <small>
                              {state.userProgress[week] === "done"
                                ? "Completed"
                                : state.userProgress[week] === "reading"
                                  ? "In progress"
                                  : "Ready when you are"}
                            </small>
                          </span>
                          {state.userProgress[week] === "done" ? (
                            <Check size={17} className="green-text" />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </button>
                      );
                    })}
                  </section>
                ))}
              </div>
              <div className="backup-bar">
                <div>
                  <LockKeyhole size={18} />
                  <span>
                    Your work, your perspective.
                    <small>
                      Saved privately to your account. Keep a copy whenever you
                      need one.
                    </small>
                  </span>
                </div>
                <div className="actions">
                  <button className="secondary" onClick={() => download()}>
                    <Download size={16} />
                    Export backup
                  </button>
                  <label className="secondary import-button">
                    <Upload size={16} />
                    Import backup
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={(e) => {
                        void importBackup(e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>
            </>
          ) : state.activeScreen === "reader" ? (
            <>
              <div className="reader-heading">
                <span className="eyebrow">
                  {typeof state.activeWeek === "number"
                    ? `WEEK ${String(state.activeWeek).padStart(2, "0")} / ${phases[Math.floor((state.activeWeek - 1) / 4)].toUpperCase()}`
                    : "THE LEADERSHIP LIBRARY"}
                </span>
                <h1>
                  {typeof state.activeWeek === "number"
                    ? titles[state.activeWeek - 1]
                    : state.activeWeek === "front"
                      ? "Before the journey"
                      : "Toolkit & checklists"}
                </h1>
                {typeof state.activeWeek === "number" && (
                  <p>{lessons[state.activeWeek - 1]}</p>
                )}
              </div>
              <div className="reader-tabs">
                <button
                  className={state.activeTab !== "workbook_tab" ? "active" : ""}
                  onClick={() =>
                    update({ activeTab: sections[0]?.title || "" })
                  }
                >
                  <BookOpen size={17} />
                  Read the diary
                </button>
                {typeof state.activeWeek === "number" && (
                  <button
                    className={
                      state.activeTab === "workbook_tab" ? "active" : ""
                    }
                    onClick={() => update({ activeTab: "workbook_tab" })}
                  >
                    <FileText size={17} />
                    Interactive workbook
                  </button>
                )}
                <span className="reader-state">
                  {typeof state.activeWeek === "number" &&
                  state.userProgress[state.activeWeek] === "done" ? (
                    <>
                      <Check size={15} />
                      Week complete
                    </>
                  ) : null}
                </span>
              </div>
              {state.activeTab === "workbook_tab" &&
              typeof state.activeWeek === "number" ? (
                <Workbook
                  week={state.activeWeek}
                  chapter={chapter!}
                  state={state}
                  update={update}
                />
              ) : (
                <div className="reading-layout">
                  <aside className="contents">
                    <span className="eyebrow">IN THIS CHAPTER</span>
                    {sections.map((s, i) => (
                      <button
                        className={section?.title === s.title ? "active" : ""}
                        key={i}
                        onClick={() => {
                          update({ activeTab: s.title });
                          window.scrollTo({ top: 0 });
                        }}
                      >
                        {s.title}
                      </button>
                    ))}
                  </aside>
                  <article
                    className={`prose ${state.fontFamily}`}
                    style={{ fontSize: state.fontSizeVal }}
                  >
                    <span className="eyebrow">
                      {section
                        ? `${String(sections.indexOf(section) + 1).padStart(2, "0")} / ${String(sections.length).padStart(2, "0")}`
                        : ""}
                    </span>
                    <h2>{section?.title}</h2>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {section?.content || ""}
                    </ReactMarkdown>
                    <div className="section-pagination">
                      <button
                        className="secondary"
                        disabled={sections.indexOf(section!) <= 0}
                        onClick={() => {
                          update({
                            activeTab:
                              sections[sections.indexOf(section!) - 1].title,
                          });
                          window.scrollTo({ top: 0 });
                        }}
                      >
                        <ChevronLeft size={16} />
                        Previous section
                      </button>
                      <button
                        className="secondary"
                        disabled={
                          sections.indexOf(section!) >= sections.length - 1
                        }
                        onClick={() => {
                          update({
                            activeTab:
                              sections[sections.indexOf(section!) + 1].title,
                          });
                          window.scrollTo({ top: 0 });
                        }}
                      >
                        Next section
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </article>
                </div>
              )}
              {typeof state.activeWeek === "number" && (
                <div className="week-footer">
                  <button
                    className="text-button"
                    disabled={state.activeWeek === 1}
                    onClick={() => go("reader", Number(state.activeWeek) - 1)}
                  >
                    <ChevronLeft size={16} />
                    Previous week
                  </button>
                  <button
                    className="primary"
                    onClick={() =>
                      update({
                        userProgress: {
                          ...state.userProgress,
                          [state.activeWeek]:
                            state.userProgress[state.activeWeek] === "done"
                              ? ("reading" as const)
                              : ("done" as const),
                        },
                      })
                    }
                  >
                    <Check size={17} />
                    {state.userProgress[state.activeWeek] === "done"
                      ? "Mark as in progress"
                      : "Mark week complete"}
                  </button>
                  <button
                    className="text-button"
                    disabled={state.activeWeek === 12}
                    onClick={() => go("reader", Number(state.activeWeek) + 1)}
                  >
                    Next week
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : state.activeScreen === "maturity" ? (
            <>
              <PageHeading
                eyebrow="REFLECT BEFORE YOU ADVANCE"
                title="Your leadership maturity map."
                description="An honest view of eight capabilities. Choose the description that best reflects your enterprise today."
              />
              <div className="maturity-summary panel">
                <Radar ratings={state.maturityRatings} />
                <div>
                  <span className="eyebrow">YOUR CURRENT PERSPECTIVE</span>
                  <h2>
                    {scored ? bracket : "Start with an honest assessment."}
                  </h2>
                  <div className="maturity-score">
                    {scored ? score : "—"} <span>/ 24</span>
                  </div>
                  <p>
                    {scored} of 8 dimensions rated. Unrated dimensions use the
                    original diary’s starting score of 1.
                  </p>
                </div>
              </div>
              <div className="assessment-grid">
                {dimensions.map((d, i) => (
                  <section className="assessment panel" key={d.id}>
                    <div className="assessment-heading">
                      <span>0{i + 1}</span>
                      <h3>{d.name}</h3>
                    </div>
                    {(["emerging", "developing", "mastering"] as const).map(
                      (level, n) => (
                        <button
                          key={level}
                          aria-pressed={state.maturityRatings[d.id] === n + 1}
                          className={`rating ${state.maturityRatings[d.id] === n + 1 ? "chosen" : ""}`}
                          onClick={() =>
                            update({
                              maturityRatings: {
                                ...state.maturityRatings,
                                [d.id]: (n + 1) as 1 | 2 | 3,
                              },
                            })
                          }
                        >
                          <span className="radio-mark">
                            {state.maturityRatings[d.id] === n + 1 && (
                              <Check size={12} />
                            )}
                          </span>
                          <span>
                            <strong>
                              {["Emerging", "Developing", "Mastering"][n]}
                            </strong>
                            <small>{d[level]}</small>
                          </span>
                          <em>0{n + 1}</em>
                        </button>
                      ),
                    )}
                  </section>
                ))}
              </div>
            </>
          ) : (
            <>
              <PageHeading
                eyebrow="LEADERSHIP & LEGACY"
                title="Make your commitment explicit."
                description="A statement of the responsibility you accept—and the culture you choose to build."
              />
              <Manifesto state={state} update={update} />
            </>
          )}
          <footer className="workspace-footer">
            <span>THE AI LEADERSHIP DIARY</span>
            <span>Perspective into practice.</span>
            <a href="/en">
              Rajkumar Rajagobalan <ArrowUpRight size={13} />
            </a>
          </footer>
        </main>
      </div>
      {confirmImport && (
        <div className="modal-backdrop">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="import-title"
          >
            <h2 id="import-title">Replace your diary with this backup?</h2>
            <p>
              This replaces your current reflections, progress, and preferences.
              Export your current work first if you want to keep both versions.
            </p>
            <div className="actions">
              <button className="secondary" onClick={() => download()}>
                Export current diary
              </button>
              <button
                className="secondary"
                onClick={() => setConfirmImport(null)}
              >
                Cancel
              </button>
              <button
                className="primary"
                onClick={() => {
                  update(confirmImport);
                  setConfirmImport(null);
                }}
              >
                Import and replace
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
function PageHeading({
  eyebrow,
  title,
  description,
  extra,
}: {
  eyebrow: string;
  title: string;
  description: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {extra}
    </div>
  );
}
function Workbook({
  week,
  chapter,
  state,
  update,
}: {
  week: number;
  chapter: Chapter;
  state: DiaryState;
  update: (p: Partial<DiaryState>) => void;
}) {
  const prompts =
    week === 1
      ? [
          "Where is the AI value pool showing up on your income statement? List three prioritized categories.",
          "What concrete decision can you make in the next seven days to anchor AI in economic reality?",
        ]
      : week === 2
        ? [
            "Where is the confusion between AI, analytics, and automation showing up in your organization?",
            "If you had to deploy a GenAI customer advocate next week, what hard stops would you enforce?",
          ]
        : (
            chapter.sections
              .find((s) =>
                s.title
                  .toLowerCase()
                  .replace(/[’']/g, "'")
                  .includes("reader's diary"),
              )
              ?.content.split("\n") || []
          )
            .map((l) => l.trim())
            .filter(
              (l) => l.startsWith("-") || l.startsWith("*") || /^\d+\./.test(l),
            )
            .map((l) => l.replace(/^[-*\d.]+\s*/, "").replace(/\*\*/g, ""));
  function row(i: number, key: string, value: string | number) {
    update({
      heatmapRows: state.heatmapRows.map((r, n) =>
        n === i ? { ...r, [key]: value } : r,
      ),
    });
  }
  return (
    <div className="workbook">
      <div className="workbook-heading">
        <span className="eyebrow">PUT THE PERSPECTIVE TO WORK</span>
        <h2>
          {week === 1
            ? "Where will AI create real value?"
            : week === 2
              ? "Define the boundaries of autonomy."
              : "Your reflection log."}
        </h2>
        <p>
          {week === 1
            ? "Start with an income statement. Identify the friction, then estimate the opportunity. All values are in USD."
            : week === 2
              ? "Match each signal to an appropriate level of autonomy and name the human control."
              : "Bring this week’s ideas into the reality of your organization."}
        </p>
      </div>
      {week === 1 ? (
        <>
          <div className="value-summary">
            <span>
              Total identified value pool
              <strong>{money(valuePool(state.heatmapRows))}</strong>
            </span>
            <p>
              Baseline × AI impact, summed across opportunities.
              <br />
              Illustrative estimates, not realized savings.
              <br />
              Total baseline:{" "}
              {money(
                state.heatmapRows.reduce((sum, row) => sum + row.baseline, 0),
              )}
              .
            </p>
            <button
              className="secondary"
              disabled={state.heatmapRows.length >= 50}
              onClick={() =>
                update({
                  heatmapRows: [
                    ...state.heatmapRows,
                    {
                      category: "SG&A",
                      lineItem: "",
                      baseline: 0,
                      friction: "",
                      lever: "",
                      impact: 0,
                    },
                  ],
                })
              }
            >
              <Plus size={16} />
              Add opportunity
            </button>
          </div>
          <div className="opportunity-grid">
            {state.heatmapRows.map((r, i) => (
              <section className="opportunity panel" key={i}>
                <div className="opportunity-top">
                  <span className="eyebrow">
                    OPPORTUNITY {String(i + 1).padStart(2, "0")}
                  </span>
                  <button
                    className="icon-button"
                    aria-label={`Remove opportunity ${i + 1}`}
                    onClick={() => {
                      if (window.confirm("Remove this opportunity?"))
                        update({
                          heatmapRows: state.heatmapRows.filter(
                            (_, n) => n !== i,
                          ),
                        });
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <label>
                  P&L category
                  <select
                    value={r.category}
                    onChange={(e) => row(i, "category", e.target.value)}
                  >
                    {["SG&A", "COGS", "Revenue"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Line item
                  <input
                    maxLength={500}
                    value={r.lineItem}
                    onChange={(e) => row(i, "lineItem", e.target.value)}
                    placeholder="e.g. Customer support"
                  />
                </label>
                <div className="field-pair">
                  <label>
                    Baseline (USD)
                    <input
                      type="number"
                      min="0"
                      max="1000000000000000"
                      value={r.baseline}
                      onChange={(e) =>
                        row(
                          i,
                          "baseline",
                          Math.min(1e15, Math.max(0, Number(e.target.value))),
                        )
                      }
                    />
                  </label>
                  <label>
                    AI impact (%)
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={r.impact}
                      onChange={(e) =>
                        row(
                          i,
                          "impact",
                          Math.min(100, Math.max(0, Number(e.target.value))),
                        )
                      }
                    />
                  </label>
                </div>
                <label>
                  Current friction
                  <textarea
                    maxLength={500}
                    rows={2}
                    value={r.friction}
                    onChange={(e) => row(i, "friction", e.target.value)}
                  />
                </label>
                <label>
                  Proposed AI lever
                  <textarea
                    maxLength={500}
                    rows={2}
                    value={r.lever}
                    onChange={(e) => row(i, "lever", e.target.value)}
                  />
                </label>
                <div className="opportunity-total">
                  <span>Estimated value pool</span>
                  <strong>{money((r.baseline * r.impact) / 100)}</strong>
                </div>
              </section>
            ))}
          </div>
        </>
      ) : week === 2 ? (
        <div className="governance-grid">
          {signals.map((s) => (
            <section className="panel governance-card" key={s.id}>
              <div className="panel-heading">
                <h3>{s.name}</h3>
                <span className="pill">{s.sensitivity} sensitivity</span>
              </div>
              <p>{s.desc}</p>
              <label>
                Autonomy level
                <select
                  value={state.governanceMap[s.id] || s.defaultAutonomy}
                  onChange={(e) =>
                    update({
                      governanceMap: {
                        ...state.governanceMap,
                        [s.id]: e.target.value,
                      },
                    })
                  }
                >
                  {["Autonomous", "Supervised", "Escalated", "Prohibited"].map(
                    (v) => (
                      <option key={v}>{v}</option>
                    ),
                  )}
                </select>
              </label>
              <label>
                Accountable owner & control
                <input
                  maxLength={500}
                  value={state.governanceMap[s.id + "_control"] || ""}
                  onChange={(e) =>
                    update({
                      governanceMap: {
                        ...state.governanceMap,
                        [s.id + "_control"]: e.target.value,
                      },
                    })
                  }
                  placeholder="Name the role and oversight required"
                />
              </label>
            </section>
          ))}
        </div>
      ) : null}
      <div className="reflection-list">
        {(prompts.length
          ? prompts
          : [
              "Record your core organizational reflections, P&L value opportunities, and immediate next steps for this week:",
            ]
        ).map((q, i) => (
          <section className="reflection panel" key={i}>
            <span className="eyebrow">
              REFLECTION {String(i + 1).padStart(2, "0")}
            </span>
            <label htmlFor={`reflection-${i}`}>{q}</label>
            <textarea
              id={`reflection-${i}`}
              maxLength={20000}
              rows={6}
              value={
                state.reflections[`week${week}_q${i + (week <= 2 ? 1 : 0)}`] ||
                ""
              }
              onChange={(e) =>
                update({
                  reflections: {
                    ...state.reflections,
                    [`week${week}_q${i + (week <= 2 ? 1 : 0)}`]: e.target.value,
                  },
                })
              }
              placeholder="Your perspective, in your own words…"
            />
            <small>
              {(
                state.reflections[`week${week}_q${i + (week <= 2 ? 1 : 0)}`] ||
                ""
              ).length.toLocaleString()}{" "}
              / 20,000 characters · Private to you
            </small>
          </section>
        ))}
      </div>
    </div>
  );
}
function Radar({ ratings }: { ratings: DiaryState["maturityRatings"] }) {
  const point = (i: number, r: number) => [
    150 + Math.sin((i * Math.PI) / 4) * r,
    150 - Math.cos((i * Math.PI) / 4) * r,
  ];
  return (
    <svg
      className="radar"
      viewBox="0 0 300 300"
      role="img"
      aria-label={`Maturity radar. ${dimensions.map((d) => `${d.shortName}: ${ratings[d.id] || 1} of 3`).join(". ")}`}
    >
      <title>Eight-dimension maturity map</title>
      {[32, 64, 96].map((r) => (
        <polygon
          key={r}
          points={dimensions.map((_, i) => point(i, r).join(",")).join(" ")}
          fill="none"
          stroke="currentColor"
          opacity=".16"
        />
      ))}
      {dimensions.map((d, i) => {
        const [x, y] = point(i, 96),
          [tx, ty] = point(i, 125);
        return (
          <g key={d.id}>
            <line
              x1="150"
              y1="150"
              x2={x}
              y2={y}
              stroke="currentColor"
              opacity=".12"
            />
            <text
              x={tx}
              y={ty + 3}
              textAnchor="middle"
              fill="currentColor"
              fontSize="10"
            >
              {d.shortName}
            </text>
          </g>
        );
      })}
      <polygon
        points={dimensions
          .map((d, i) => point(i, (ratings[d.id] || 1) * 32).join(","))
          .join(" ")}
        fill="var(--bridge)"
        fillOpacity=".18"
        stroke="var(--bridge)"
        strokeWidth="2"
      />
      {dimensions.map((d, i) => {
        const [x, y] = point(i, (ratings[d.id] || 1) * 32);
        return <circle key={d.id} cx={x} cy={y} r="3" fill="var(--bridge)" />;
      })}
    </svg>
  );
}
function Manifesto({
  state,
  update,
}: {
  state: DiaryState;
  update: (p: Partial<DiaryState>) => void;
}) {
  const [draft, setDraft] = useState(state.manifestoSigned);
  return (
    <div className="manifesto-layout">
      <form
        className="panel commitment-form"
        onSubmit={(e) => {
          e.preventDefault();
          update({ manifestoSigned: draft });
        }}
      >
        <h2>Your commitment</h2>
        <p>
          Sign when these principles reflect the responsibility you are ready to
          accept.
        </p>
        <label>
          Organization
          <input
            required
            maxLength={500}
            value={draft.orgName}
            onChange={(e) => setDraft({ ...draft, orgName: e.target.value })}
            placeholder="Organization name"
          />
        </label>
        <label>
          Signing executive
          <input
            required
            maxLength={500}
            value={draft.signerName}
            onChange={(e) => setDraft({ ...draft, signerName: e.target.value })}
            placeholder="Full name"
          />
        </label>
        <label>
          Date
          <input
            required
            type="date"
            value={draft.signDate}
            onChange={(e) => setDraft({ ...draft, signDate: e.target.value })}
          />
        </label>
        <button className="primary full">
          <ShieldCheck size={17} />
          {state.manifestoSigned.signerName
            ? "Update commitment"
            : "Sign commitment"}
        </button>
        <button
          className="secondary full"
          type="button"
          onClick={() => window.print()}
        >
          <Printer size={17} />
          Print certificate
        </button>
      </form>
      <article className="certificate">
        <span className="eyebrow">A LEADERSHIP COMMITMENT</span>
        <ShieldCheck size={36} />
        <h2>
          Culture of
          <br />
          <em>Responsible AI</em>
        </h2>
        <p>
          We, the leaders of{" "}
          <strong>
            {state.manifestoSigned.orgName || "[Organization name]"}
          </strong>
          , commit to embedding responsibility, fairness, and transparency into
          every aspect of our AI journey. Our AI systems will serve our
          customers, employees, and communities with integrity and respect.
        </p>
        <dl>
          {[
            ["Accountability", "We accept full ownership for AI outcomes."],
            [
              "Equity",
              "We actively identify and mitigate bias to promote fairness.",
            ],
            [
              "Transparency",
              "We disclose AI decision-making logic and data use.",
            ],
            [
              "Privacy",
              "We safeguard personal data consistent with legal standards.",
            ],
            [
              "Human oversight",
              "We maintain meaningful human control over AI agents.",
            ],
          ].map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="signatures">
          <span>
            <strong>
              {state.manifestoSigned.signerName || "Awaiting signature"}
            </strong>
            <small>EXECUTIVE SIGNATURE</small>
          </span>
          <span>
            <strong>{state.manifestoSigned.signDate || "—"}</strong>
            <small>DATE OF COMMITMENT</small>
          </span>
        </div>
        <footer>THE TWELVE-WEEK AI LEADERSHIP DIARY</footer>
      </article>
    </div>
  );
}
