import {
  ArrowRight,
  BarChart3,
  Brain,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Users,
  DollarSign,
  ShoppingCart,
  Activity,
} from "lucide-react";

import { Link } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================= NAVBAR ================= */}

      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

          <BrandLogo to="/" compact />

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
            <a
              href="#features"
              className="transition hover:text-white"
            >
              Features
            </a>

            <Link
              to="/login"
              className="transition hover:text-white"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-white px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Get Started
            </Link>
          </nav>

          <Link
            to="/login"
            className="text-sm font-semibold text-indigo-400 md:hidden"
          >
            Login
          </Link>
        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main className="relative overflow-hidden">

        {/* Background */}

        <div className="pointer-events-none absolute left-1/2 -top-45 h-125 w-175 -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[130px]" />

        <div className="pointer-events-none absolute -right-25 top-62.5 h-80 w-80 rounded-full bg-violet-600/10 blur-[120px]" />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* ================= HERO ================= */}

        <section className="relative mx-auto max-w-7xl px-5 pb-14 pt-14 sm:px-8 sm:pb-16 sm:pt-16 lg:px-10 lg:pb-20 lg:pt-20">

          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-16">

            {/* LEFT */}

            <div>

              {/* Badge */}

              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-300">
                <Sparkles size={13} />
                AI-powered business intelligence
              </div>

              {/* Heading */}

              <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:text-[4rem]">
                Understand your business.
                <span className="block bg-linear-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                  Grow with confidence.
                </span>
              </h1>

              {/* Description */}

              <p className="mt-5 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Optiora brings sales, customers, products and AI-powered
                insights into one simple workspace — helping you see what
                matters and act faster.
              </p>

              {/* CTA */}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
                >
                  Start for free
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/4 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/8"
                >
                  View dashboard
                </Link>

              </div>

              {/* Trust */}

              <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck
                  size={15}
                  className="text-emerald-400"
                />
                Secure by design · Built for growing businesses
              </div>

            </div>

            {/* ================= DASHBOARD PREVIEW ================= */}

            <div className="relative mx-auto w-full max-w-140">

              {/* Glow */}

              <div className="absolute -inset-5 rounded-4xl bg-indigo-600/10 blur-3xl" />

              {/* Dashboard */}

              <div className="relative rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/50">

                {/* Window bar */}

                <div className="flex h-9 items-center justify-between border-b border-white/10 px-4">

                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
                  </div>

                  <span className="text-[9px] text-slate-600">
                    app.optiora.ai
                  </span>

                  <div className="w-8" />

                </div>

                <div className="p-4">

                  {/* Dashboard header */}

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-[10px] text-slate-500">
                        Business overview
                      </p>

                      <h2 className="mt-0.5 text-sm font-semibold text-white">
                        Dashboard
                      </h2>
                    </div>

                    <span className="rounded-lg bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-400">
                      +18.4%
                    </span>

                  </div>

                  {/* Metrics */}

                  <div className="mt-3 grid grid-cols-4 gap-2">

                    <Metric
                      icon={DollarSign}
                      label="Revenue"
                      value="$84.2K"
                    />

                    <Metric
                      icon={ShoppingCart}
                      label="Sales"
                      value="1,284"
                    />

                    <Metric
                      icon={Users}
                      label="Customers"
                      value="3,842"
                    />

                    <Metric
                      icon={TrendingUp}
                      label="Growth"
                      value="+18.4%"
                    />

                  </div>

                  {/* Chart */}

                  <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/70 p-3.5">

                    <div className="flex items-end justify-between">

                      <div>
                        <p className="text-[9px] text-slate-500">
                          Revenue
                        </p>

                        <p className="mt-0.5 text-lg font-bold text-white">
                          $84,240
                        </p>
                      </div>

                      <span className="text-[9px] text-slate-600">
                        Last 12 months
                      </span>

                    </div>

                    <div className="relative mt-4 h-28">

                      <div className="absolute inset-x-0 top-0 border-t border-white/5" />
                      <div className="absolute inset-x-0 top-1/2 border-t border-white/5" />
                      <div className="absolute inset-x-0 bottom-0 border-t border-white/5" />

                      <div className="absolute inset-0 flex items-end gap-1">

                        {[
                          32,
                          44,
                          39,
                          53,
                          48,
                          63,
                          58,
                          73,
                          68,
                          84,
                          79,
                          96,
                        ].map((height, index) => (
                          <div
                            key={index}
                            className="relative h-full flex-1"
                          >
                            <div
                              className="absolute bottom-0 w-full rounded-t-sm bg-linear-to-t from-indigo-600/80 to-violet-400/80"
                              style={{
                                height: `${height}%`,
                              }}
                            />
                          </div>
                        ))}

                      </div>

                    </div>

                    <div className="mt-2 flex justify-between text-[8px] text-slate-600">
                      <span>Jan</span>
                      <span>Mar</span>
                      <span>Jun</span>
                      <span>Sep</span>
                      <span>Dec</span>
                    </div>

                  </div>

                  {/* Bottom */}

                  <div className="mt-3 grid grid-cols-2 gap-2">

                    <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 p-3">

                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
                          <Sparkles size={12} />
                        </div>

                        <span className="text-[9px] font-semibold text-indigo-300">
                          AI INSIGHT
                        </span>
                      </div>

                      <p className="mt-2 text-[9px] leading-4 text-slate-400">
                        Software is driving your strongest growth.
                      </p>

                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/3 p-3">

                      <div className="flex items-center gap-2">
                        <Activity
                          size={12}
                          className="text-slate-500"
                        />

                        <span className="text-[9px] font-semibold text-slate-500">
                          ACTIVITY
                        </span>
                      </div>

                      <p className="mt-2 text-[9px] text-slate-400">
                        12 new orders today
                      </p>

                      <p className="mt-1 text-[9px] text-slate-600">
                        8 customers added
                      </p>

                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}

        <section
          id="features"
          className="border-t border-white/10 bg-slate-900/40 px-5 py-12 sm:px-8 lg:px-10"
        >
          <div className="mx-auto max-w-7xl">

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
                  Built for business
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Everything important. One workspace.
                </h2>
              </div>

              <p className="max-w-md text-sm leading-6 text-slate-500">
                Focus on the numbers that matter and let Optiora help
                turn them into better decisions.
              </p>

            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-3">

              <Feature
                icon={BarChart3}
                title="Business Analytics"
                text="Monitor revenue, sales, customers and product performance in real time."
              />

              <Feature
                icon={Brain}
                title="AI Insights"
                text="Discover trends, risks and opportunities hidden inside your business data."
              />

              <Feature
                icon={TrendingUp}
                title="Smart Reports"
                text="Turn business data into clear reports your team can understand and act on."
              />

            </div>

          </div>
        </section>

      </main>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-white/10 bg-slate-950 px-5 py-4 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-[11px] text-slate-600">

          <span>© 2026 Optiora AI</span>

          <span className="hidden sm:block">
            Business intelligence for growing businesses.
          </span>

        </div>
      </footer>
    </div>
  );
}


/* ================= COMPONENTS ================= */

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/3 p-2">

      <div className="flex items-center gap-1 text-slate-600">
        <Icon size={10} />

        <span className="text-[8px]">
          {label}
        </span>
      </div>

      <p className="mt-1 text-[11px] font-bold text-white">
        {value}
      </p>

    </div>
  );
}


function Feature({ icon: Icon, title, text }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/2.5 p-5 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-white/4.5">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-400 transition group-hover:bg-indigo-500/20">
        <Icon size={19} />
      </div>

      <h3 className="mt-4 text-base font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-5 text-slate-500">
        {text}
      </p>

    </div>
  );
}