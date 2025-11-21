export default function NewsPage() {
  return (
    <div className="container py-12 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">News</h1>
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Latest news and updates from Mount Vernon Wrestling Club will appear here.
          </p>
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Welcome to MVWC</h2>
            <p className="text-sm text-muted-foreground mb-4">Posted: Coming Soon</p>
            <p className="text-muted-foreground">
              Stay tuned for news, announcements, and updates about our wrestling program.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
