import React from 'react'
import { MenuTheme } from '../types/MenuTypes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { ImageUpload } from './ImageUpload'

interface ThemeCustomizerProps {
  theme: MenuTheme;
  onThemeChange: (theme: MenuTheme) => void;
}

export function ThemeCustomizer({ theme, onThemeChange }: ThemeCustomizerProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onThemeChange({ ...theme, [name]: value })
  }

  const handleSelectChange = (name: string) => (value: string) => {
    onThemeChange({ ...theme, [name]: value })
  }

  const handleSliderChange = (name: string) => (value: number[]) => {
    onThemeChange({ ...theme, [name]: `${value[0]}px` })
  }

  const handleBackgroundTypeChange = (value: 'color' | 'image') => {
    onThemeChange({ ...theme, backgroundType: value })
  }

  const handleImageUpload = (imageUrl: string) => {
    onThemeChange({ ...theme, backgroundImage: imageUrl })
  }

  return (
    <div className="space-y-6">
      <div>
        <Label>Background Type</Label>
        <RadioGroup
          value={theme.backgroundType}
          onValueChange={handleBackgroundTypeChange}
          className="flex space-x-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="color" id="background-color" />
            <Label htmlFor="background-color">Color</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="image" id="background-image" />
            <Label htmlFor="background-image">Image</Label>
          </div>
        </RadioGroup>
      </div>

      {theme.backgroundType === 'color' ? (
        <div>
          <Label htmlFor="backgroundColor">Background Color</Label>
          <Input
            type="color"
            id="backgroundColor"
            name="backgroundColor"
            value={theme.backgroundColor}
            onChange={handleChange}
            className="h-10 w-full"
          />
        </div>
      ) : (
        <div>
          <Label>Background Image</Label>
          <ImageUpload onImageUpload={handleImageUpload} currentImage={theme.backgroundImage} />
        </div>
      )}

      <div>
        <Label htmlFor="fontFamily">Font Family</Label>
        <Input
          type="text"
          id="fontFamily"
          name="fontFamily"
          value={theme.fontFamily}
          onChange={handleChange}
          placeholder="e.g., Inter, sans-serif"
        />
      </div>

      <div>
        <Label htmlFor="primaryColor">Primary Color</Label>
        <Input
          type="color"
          id="primaryColor"
          name="primaryColor"
          value={theme.primaryColor}
          onChange={handleChange}
          className="h-10 w-full"
        />
      </div>

      <div>
        <Label htmlFor="secondaryColor">Secondary Color</Label>
        <Input
          type="color"
          id="secondaryColor"
          name="secondaryColor"
          value={theme.secondaryColor}
          onChange={handleChange}
          className="h-10 w-full"
        />
      </div>

      <div>
        <Label htmlFor="accentColor">Accent Color</Label>
        <Input
          type="color"
          id="accentColor"
          name="accentColor"
          value={theme.accentColor}
          onChange={handleChange}
          className="h-10 w-full"
        />
      </div>

      <div>
        <Label>Header Font Size</Label>
        <Slider
          min={24}
          max={72}
          step={1}
          value={[parseInt(theme.headerFontSize)]}
          onValueChange={handleSliderChange('headerFontSize')}
        />
        <div className="mt-1 text-sm text-gray-500">{theme.headerFontSize}</div>
      </div>

      <div>
        <Label>Section Font Size</Label>
        <Slider
          min={18}
          max={48}
          step={1}
          value={[parseInt(theme.sectionFontSize)]}
          onValueChange={handleSliderChange('sectionFontSize')}
        />
        <div className="mt-1 text-sm text-gray-500">{theme.sectionFontSize}</div>
      </div>

      <div>
        <Label>Item Font Size</Label>
        <Slider
          min={12}
          max={24}
          step={1}
          value={[parseInt(theme.itemFontSize)]}
          onValueChange={handleSliderChange('itemFontSize')}
        />
        <div className="mt-1 text-sm text-gray-500">{theme.itemFontSize}</div>
      </div>

      <div>
        <Label>Header Font Weight</Label>
        <Select
          value={theme.headerFontWeight}
          onValueChange={handleSelectChange('headerFontWeight')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select weight" />
          </SelectTrigger>
          <SelectContent>
            {['400', '500', '600', '700', '800', '900'].map((weight) => (
              <SelectItem key={weight} value={weight}>
                {weight}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Section Font Weight</Label>
        <Select
          value={theme.sectionFontWeight}
          onValueChange={handleSelectChange('sectionFontWeight')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select weight" />
          </SelectTrigger>
          <SelectContent>
            {['400', '500', '600', '700', '800'].map((weight) => (
              <SelectItem key={weight} value={weight}>
                {weight}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Item Font Weight</Label>
        <Select
          value={theme.itemFontWeight}
          onValueChange={handleSelectChange('itemFontWeight')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select weight" />
          </SelectTrigger>
          <SelectContent>
            {['300', '400', '500', '600'].map((weight) => (
              <SelectItem key={weight} value={weight}>
                {weight}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Border Radius</Label>
        <Slider
          min={0}
          max={24}
          step={1}
          value={[parseInt(theme.borderRadius)]}
          onValueChange={handleSliderChange('borderRadius')}
        />
        <div className="mt-1 text-sm text-gray-500">{theme.borderRadius}</div>
      </div>

      <div>
        <Label>Item Spacing</Label>
        <Slider
          min={8}
          max={48}
          step={1}
          value={[parseInt(theme.itemSpacing)]}
          onValueChange={handleSliderChange('itemSpacing')}
        />
        <div className="mt-1 text-sm text-gray-500">{theme.itemSpacing}</div>
      </div>
    </div>
  )
}

