import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecipeRequest {
  ingredients: string[];
  cookingTime: string;
  mealType: string;
  dietaryPreferences: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ingredients, cookingTime, mealType, dietaryPreferences }: RecipeRequest = await req.json();
    
    console.log('Generating recipe with:', { ingredients, cookingTime, mealType, dietaryPreferences });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert chef and recipe creator. Generate personalized recipe suggestions based on the user's available ingredients, time, and preferences. 

Your response should be a complete, detailed recipe in JSON format with this structure:
{
  "title": "Recipe Name",
  "description": "Brief appealing description",
  "cookingTime": "actual time in minutes",
  "difficulty": "Easy/Medium/Hard",
  "servings": number,
  "ingredients": [
    { "item": "ingredient name", "amount": "quantity", "optional": false }
  ],
  "optionalAddons": [
    { "item": "addon name", "benefit": "why it improves the dish" }
  ],
  "instructions": [
    "Step 1 instruction",
    "Step 2 instruction"
  ],
  "tips": [
    "Helpful tip 1",
    "Helpful tip 2"
  ],
  "substitutions": [
    { "original": "ingredient", "substitute": "alternative", "note": "why this works" }
  ]
}

Make recipes creative, practical, and delicious. Focus on using the provided ingredients while suggesting realistic add-ons.`;

    const userPrompt = `Create a ${mealType} recipe with these details:
- Available ingredients: ${ingredients.join(', ')}
- Maximum cooking time: ${cookingTime}
- Dietary preferences: ${dietaryPreferences.length > 0 ? dietaryPreferences.join(', ') : 'None'}

Generate a complete recipe that:
1. Uses most of the available ingredients
2. Can be prepared within the time limit
3. Respects dietary restrictions
4. Includes optional add-ons to enhance the dish
5. Provides clear step-by-step instructions`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const recipeContent = data.choices[0].message.content;
    const recipe = JSON.parse(recipeContent);

    console.log('Recipe generated successfully');

    return new Response(
      JSON.stringify({ recipe }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-recipe function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to generate recipe'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
