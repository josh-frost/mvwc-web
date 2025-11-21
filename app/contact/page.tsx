export default function ContactPage() {
  return (
    <div className="container py-12 md:py-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Get in touch with Mount Vernon Wrestling Club.
          </p>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Email</h2>
              <p className="text-muted-foreground">info@mvwc.com</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Location</h2>
              <p className="text-muted-foreground">Mount Vernon, Washington</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Hours</h2>
              <p className="text-muted-foreground">
                Practice schedules available on the Schedule page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
