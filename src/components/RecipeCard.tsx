import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat, Users, Lightbulb, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-secondary text-secondary-foreground";
      case "medium":
        return "bg-accent text-accent-foreground";
      case "hard":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="shadow-card hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">{recipe.title}</CardTitle>
            <CardDescription className="text-base">{recipe.description}</CardDescription>
          </div>
          <Badge className={getDifficultyColor(recipe.difficulty)}>{recipe.difficulty}</Badge>
        </div>
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{recipe.cookingTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{recipe.servings} servings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ChefHat className="h-4 w-4" />
            <span>{recipe.difficulty}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="ingredients" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="addons">Add-ons</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="ingredients" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Required Ingredients
              </h4>
              <ul className="space-y-2">
                {recipe.ingredients.filter((i) => !i.optional).map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span>
                      <span className="font-medium">{ingredient.amount}</span> {ingredient.item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {recipe.ingredients.some((i) => i.optional) && (
              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Optional Ingredients
                </h4>
                <ul className="space-y-2">
                  {recipe.ingredients.filter((i) => i.optional).map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                      <span>
                        <span className="font-medium">{ingredient.amount}</span> {ingredient.item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recipe.substitutions && recipe.substitutions.length > 0 && (
              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Substitutions
                </h4>
                <ul className="space-y-2">
                  {recipe.substitutions.map((sub, index) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium">{sub.original}</span> →{" "}
                      <span className="text-secondary font-medium">{sub.substitute}</span>
                      {sub.note && <p className="text-muted-foreground mt-1">{sub.note}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>

          <TabsContent value="instructions" className="space-y-4 mt-4">
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                    {index + 1}
                  </span>
                  <p className="flex-1 pt-0.5">{instruction}</p>
                </li>
              ))}
            </ol>
          </TabsContent>

          <TabsContent value="addons" className="space-y-3 mt-4">
            {recipe.optionalAddons && recipe.optionalAddons.length > 0 ? (
              <ul className="space-y-3">
                {recipe.optionalAddons.map((addon, index) => (
                  <li key={index} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                    <Lightbulb className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">{addon.item}</p>
                      <p className="text-sm text-muted-foreground mt-1">{addon.benefit}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No additional add-ons suggested for this recipe.
              </p>
            )}
          </TabsContent>

          <TabsContent value="tips" className="space-y-3 mt-4">
            {recipe.tips && recipe.tips.length > 0 ? (
              <ul className="space-y-3">
                {recipe.tips.map((tip, index) => (
                  <li key={index} className="flex gap-3 p-3 rounded-lg bg-secondary/10">
                    <ChefHat className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p>{tip}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No special tips for this recipe.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
