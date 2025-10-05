import { useState } from "react";
import { RecipeForm } from "@/components/RecipeForm";
import { RecipeCard } from "@/components/RecipeCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChefHat } from "lucide-react";
import heroImage from "@/assets/hero-food.jpg";

interface Recipe {
  title: string;
  description: string;
  cookingTime: string;
  difficulty: string;
  servings: number;
  ingredients: Array<{ item: string; amount: string; optional: boolean }>;
  optionalAddons?: Array<{ item: string; benefit: string }>;
  instructions: string[];
  tips?: string[];
  substitutions?: Array<{ original: string; substitute: string; note: string }>;
}

const Index = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateRecipe = async (formData: {
    ingredients: string[];
    cookingTime: string;
    mealType: string;
    dietaryPreferences: string[];
  }) => {
    setIsLoading(true);
    setRecipes([]);

    try {
      const { data, error } = await supabase.functions.invoke("generate-recipe", {
        body: formData,
      });

      if (error) {
        console.error("Error generating recipe:", error);
        toast.error(error.message || "Failed to generate recipe. Please try again.");
        return;
      }

      if (data?.recipes && Array.isArray(data.recipes)) {
        setRecipes(data.recipes);
        toast.success("Recipes generated successfully!");
        // Scroll to recipe
        setTimeout(() => {
          document.getElementById("recipe-result")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/80" />
        </div>

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <ChefHat className="h-4 w-4" />
              <span>AI-Powered Recipe Generation</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Turn Your Ingredients Into
              <span className="block bg-gradient-warm bg-clip-text text-transparent mt-2">
                Delicious Recipes
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Tell us what you have in your kitchen, and we'll create personalized recipes
              tailored to your time, preferences, and dietary needs.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mt-12 bg-card rounded-2xl shadow-card p-6 md:p-8">
            <RecipeForm onSubmit={handleGenerateRecipe} isLoading={isLoading} />
          </div>
        </div>
      </section>

      {/* Recipe Result Section */}
      {recipes.length > 0 && (
        <section id="recipe-result" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Your Recipes are Ready!</h2>
                <p className="text-muted-foreground">
                  Choose from {recipes.length} delicious recipes created just for you
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe, index) => (
                  <RecipeCard key={index} recipe={recipe} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}


      {/* Features Section */}
      {recipes.length == 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-warm rounded-2xl flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-xl font-semibold">Add Ingredients</h3>
                  <p className="text-muted-foreground">
                    Tell us what ingredients you have available in your kitchen
                  </p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-fresh rounded-2xl flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-xl font-semibold">Set Preferences</h3>
                  <p className="text-muted-foreground">
                    Choose your cooking time, meal type, and dietary preferences
                  </p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-warm rounded-2xl flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-xl font-semibold">Get Recipe</h3>
                  <p className="text-muted-foreground">
                    Receive a personalized recipe with step-by-step instructions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
