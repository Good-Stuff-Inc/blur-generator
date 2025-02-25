import { BlurGenerator } from "@/components/blur-generator";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Blur Generator</h1>
        <p className="text-center text-muted-foreground mb-8">Upload an image and adjust the blur settings to your liking.</p>
        <BlurGenerator />
      </div>
    </main>
  );
}
