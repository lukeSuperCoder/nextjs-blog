import { Navbar } from '@/components/navbar'

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
      <footer className="mt-auto border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Next.js Blog.</p>
        </div>
      </footer>
    </div>
  )
}
