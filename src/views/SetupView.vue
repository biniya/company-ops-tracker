<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
    <div class="w-full max-w-lg card p-8">
      <div class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
        <svg class="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <h1 class="text-xl font-bold text-slate-900 dark:text-white">Supabase not configured</h1>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
        The app needs your Supabase project URL and anon key to run.
      </p>

      <ol class="mt-6 space-y-4 text-sm text-slate-700 dark:text-slate-300">
        <li class="flex gap-3">
          <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">1</span>
          <span>
            In Supabase, open <strong>Project Settings → API</strong> and copy the
            <strong>Project URL</strong> and <strong>anon public</strong> key.
          </span>
        </li>
        <li class="flex gap-3">
          <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">2</span>
          <span>
            Create a <code class="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">.env</code> file in the project root (copy from <code class="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">.env.example</code>).
          </span>
        </li>
        <li class="flex gap-3">
          <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">3</span>
          <span>Run the SQL in <code class="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">supabase/schema.sql</code> in the Supabase SQL Editor.</span>
        </li>
        <li class="flex gap-3">
          <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">4</span>
          <span>Restart the dev server: <code class="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">npm run dev</code></span>
        </li>
      </ol>

      <div class="mt-6 rounded-lg bg-slate-100 p-4 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
        <p>VITE_SUPABASE_URL=https://xxxx.supabase.co</p>
        <p class="mt-1">VITE_SUPABASE_ANON_KEY=eyJhbGciOi...</p>
      </div>
    </div>
  </div>
</template>
