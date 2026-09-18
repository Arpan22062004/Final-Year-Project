import { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Optiora UI error:', error);
  }

  handleReload = () => window.location.reload();

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Optiora could not render this screen. Reload the app and try again.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold transition hover:bg-indigo-400"
          >
            <RotateCcw className="h-4 w-4" />
            Reload Optiora
          </button>
        </section>
      </main>
    );
  }
}
