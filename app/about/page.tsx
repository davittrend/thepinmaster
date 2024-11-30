export default function AboutPage() {
  return (
    <main className="flex-1">
      <div className="container py-12">
        <div className="max-w-[800px] space-y-6">
          <h1 className="text-3xl font-bold">About PinMaster</h1>
          <p className="text-lg text-muted-foreground">
            PinMaster is your all-in-one solution for managing and scheduling Pinterest content. Our platform helps creators and businesses streamline their Pinterest presence and maximize their reach.
          </p>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Our Mission</h2>
            <p className="text-muted-foreground">
              We're dedicated to making Pinterest management easier and more efficient for everyone. Whether you're a small business owner, content creator, or social media manager, PinMaster provides the tools you need to succeed on Pinterest.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Key Features</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Schedule and automate Pinterest pins</li>
              <li>Manage multiple Pinterest accounts</li>
              <li>Track pin performance and analytics</li>
              <li>Organize content with ease</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

