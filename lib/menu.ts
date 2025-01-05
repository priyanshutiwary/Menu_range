import { z } from "zod"

export const menuItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  price: z.number().min(0, "Price must be positive"),
  photoUrl: z.string().url().optional(),
})

export const menuSectionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Section name is required").max(100),
  items: z.array(menuItemSchema),
})

export const menuThemeSchema = z.object({
  backgroundType: z.enum(["color", "image"]),
  backgroundColor: z.string(),
  backgroundImage: z.string().optional(),
  fontFamily: z.string(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  accentColor: z.string(),
  headerFontSize: z.string(),
  sectionFontSize: z.string(),
  itemFontSize: z.string(),
  headerFontWeight: z.string(),
  sectionFontWeight: z.string(),
  itemFontWeight: z.string(),
  headerFontStyle: z.string(),
  sectionFontStyle: z.string(),
  itemFontStyle: z.string(),
  borderRadius: z.string(),
  itemSpacing: z.string(),
  backgroundImageOpacity: z.number().min(0).max(1),
  textShadow: z.string(),
  buttonStyle: z.enum(["flat", "gradient", "outline"]),
  buttonRadius: z.string(),
  cardStyle: z.enum(["flat", "raised", "glassmorphic"]),
  animationSpeed: z.enum(["slow", "medium", "fast"]),
})

export type MenuItem = z.infer<typeof menuItemSchema>
export type MenuSection = z.infer<typeof menuSectionSchema>
export type MenuTheme = z.infer<typeof menuThemeSchema>

