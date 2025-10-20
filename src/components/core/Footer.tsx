export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Predictr (Simulado)
      </div>
    </footer>
  );
}
