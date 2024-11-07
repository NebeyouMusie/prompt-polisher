import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ModeToggle } from "@/components/mode-toggle";
import { Sparkles, Copy, Loader2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const enhancePrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to enhance",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([
        `Enhance the following prompt to make it more detailed and effective: "${prompt}"`,
      ]);
      setEnhancedPrompt(result.response.text());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enhance prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!enhancedPrompt) return;
    await navigator.clipboard.writeText(enhancedPrompt);
    toast({
      title: "Success",
      description: "Enhanced prompt copied to clipboard!",
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            <h1 className="text-2xl md:text-3xl font-bold">Prompt Enhancer</h1>
          </div>
          <ModeToggle />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              Your Prompt
            </label>
            <Textarea
              id="prompt"
              placeholder="Enter your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button
            onClick={enhancePrompt}
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enhancing...
              </>
            ) : (
              "Enhance Prompt"
            )}
          </Button>

          {enhancedPrompt && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Enhanced Prompt</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              </div>
              <div className="p-4 rounded-lg bg-muted whitespace-pre-wrap">
                {enhancedPrompt}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;