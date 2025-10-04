import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface RecipeFormProps {
  onSubmit: (data: {
    ingredients: string[];
    cookingTime: string;
    mealType: string;
    dietaryPreferences: string[];
  }) => void;
  isLoading: boolean;
}

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];
const COOKING_TIMES = ["15 minutes", "30 minutes", "45 minutes", "1 hour", "1+ hours"];
const DIETARY_OPTIONS = ["Vegan", "Vegetarian", "Gluten-free", "Dairy-free", "Low-carb", "Keto"];

export const RecipeForm = ({ onSubmit, isLoading }: RecipeFormProps) => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [mealType, setMealType] = useState("");
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  const toggleDietaryPreference = (preference: string) => {
    setDietaryPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((p) => p !== preference)
        : [...prev, preference]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredients.length > 0 && cookingTime && mealType) {
      onSubmit({ ingredients, cookingTime, mealType, dietaryPreferences });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="ingredients" className="text-base font-semibold">
          Your Ingredients
        </Label>
        <div className="flex gap-2">
          <Input
            id="ingredients"
            value={currentIngredient}
            onChange={(e) => setCurrentIngredient(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addIngredient())}
            placeholder="Add an ingredient..."
            className="flex-1"
          />
          <Button
            type="button"
            onClick={addIngredient}
            size="icon"
            variant="secondary"
            className="shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {ingredients.map((ingredient) => (
              <Badge
                key={ingredient}
                variant="secondary"
                className="px-3 py-1.5 text-sm flex items-center gap-1"
              >
                {ingredient}
                <button
                  type="button"
                  onClick={() => removeIngredient(ingredient)}
                  className="ml-1 hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label htmlFor="cookingTime" className="text-base font-semibold">
            Cooking Time
          </Label>
          <Select value={cookingTime} onValueChange={setCookingTime}>
            <SelectTrigger id="cookingTime">
              <SelectValue placeholder="Select time..." />
            </SelectTrigger>
            <SelectContent>
              {COOKING_TIMES.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="mealType" className="text-base font-semibold">
            Meal Type
          </Label>
          <Select value={mealType} onValueChange={setMealType}>
            <SelectTrigger id="mealType">
              <SelectValue placeholder="Select meal type..." />
            </SelectTrigger>
            <SelectContent>
              {MEAL_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">Dietary Preferences (Optional)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {DIETARY_OPTIONS.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={dietaryPreferences.includes(option)}
                onCheckedChange={() => toggleDietaryPreference(option)}
              />
              <label
                htmlFor={option}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full bg-gradient-warm hover:opacity-90 transition-opacity"
        disabled={isLoading || ingredients.length === 0 || !cookingTime || !mealType}
      >
        {isLoading ? "Generating Recipe..." : "Generate Recipe"}
      </Button>
    </form>
  );
};
