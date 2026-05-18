import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-5xl font-bold mb-6">TaskForge Pro</h1>
      <p className="text-lg text-muted-foreground mb-8">Manage your tasks effectively.</p>
      <div className="flex gap-4">
        <Link to="/login" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Login
        </Link>
        <Link to="/register" className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
          Register
        </Link>
      </div>
    </div>
  );
}
