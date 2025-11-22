export default function SchedulePage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Schedule</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Practice Schedule</h2>
          <p className="text-muted-foreground mb-4">
            Practice times and locations will be posted here.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Upcoming Matches</h2>
          <p className="text-muted-foreground">Match schedule coming soon.</p>
        </div>
      </div>
    </main>
  );
}
