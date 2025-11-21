export default function SchedulePage() {
  return (
    <div className="container py-12 md:py-24">
      <div className="max-w-4xl mx-auto">
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
      </div>
    </div>
  );
}
