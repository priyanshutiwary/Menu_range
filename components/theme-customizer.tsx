import React, { useState } from 'react'
import { MenuTheme } from '@/lib/validations/menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { ImageUpload } from './image-upload'

interface ThemeCustomizerProps {
  theme: MenuTheme;
  onThemeChange: (theme: MenuTheme) => void;
}

export function ThemeCustomizer({ theme, onThemeChange }: ThemeCustomizerProps) {
  const [localTheme, setLocalTheme] = useState<MenuTheme>(theme)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLocalTheme({ ...localTheme, [name]: value })
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setLocalTheme({ ...localTheme, [name]: value })
  }

  const handleSliderChange = (name: string) => (value: number[]) => {
    setLocalTheme({ ...localTheme, [name]: `${value[0]}px` })
  }

  const handleBackgroundTypeChange = (value: 'color' | 'image') => {
    setLocalTheme({ ...localTheme, backgroundType: value })
  }

  const handleImageUpload = (imageUrl: string) => {
    setLocalTheme({ ...localTheme, backgroundImage: imageUrl })
  }

  const handleOpacityChange = (value: number[]) => {
    setLocalTheme({ ...localTheme, backgroundImageOpacity: value[0] })
  }

  const handleSave = () => {
    onThemeChange(localTheme)
  }

  return (
    <div className="max-h-[calc(100vh-10rem)] overflow-y-auto pr-4 space-y-6">
      <div>
        <Label>Background Type</Label>
        <RadioGroup
          value={localTheme.backgroundType}
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

      {localTheme.backgroundType === 'color' ? (
        <div>
          <Label htmlFor="backgroundColor">Background Color</Label>
          <Input
            type="color"
            id="backgroundColor"
            name="backgroundColor"
            value={localTheme.backgroundColor}
            onChange={handleChange}
            className="h-10 w-full"
          />
        </div>
      ) : (
        <div>
          <Label>Background Image</Label>
          <ImageUpload onImageUpload={handleImageUpload} currentImage={localTheme.backgroundImage} />
          <div className="mt-4">
            <Label>Background Image Opacity</Label>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[localTheme.backgroundImageOpacity]}
              onValueChange={handleOpacityChange}
            />
            <div className="mt-1 text-sm text-gray-500">
              {localTheme.backgroundImageOpacity.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="fontFamily">Font Family</Label>
        <Input
          type="text"
          id="fontFamily"
          name="fontFamily"
          value={localTheme.fontFamily}
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
          value={localTheme.primaryColor}
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
          value={localTheme.secondaryColor}
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
          value={localTheme.accentColor}
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
          value={[parseInt(localTheme.headerFontSize)]}
          onValueChange={handleSliderChange('headerFontSize')}
        />
        <div className="mt-1 text-sm text-gray-500">{localTheme.headerFontSize}</div>
      </div>

      <div>
        <Label>Section Font Size</Label>
        <Slider
          min={18}
          max={48}
          step={1}
          value={[parseInt(localTheme.sectionFontSize)]}
          onValueChange={handleSliderChange('sectionFontSize')}
        />
        <div className="mt-1 text-sm text-gray-500">{localTheme.sectionFontSize}</div>
      </div>

      <div>
        <Label>Item Font Size</Label>
        <Slider
          min={12}
          max={24}
          step={1}
          value={[parseInt(localTheme.itemFontSize)]}
          onValueChange={handleSliderChange('itemFontSize')}
        />
        <div className="mt-1 text-sm text-gray-500">{localTheme.itemFontSize}</div>
      </div>

      <div>
        <Label>Header Font Weight</Label>
        <Select
          value={localTheme.headerFontWeight}
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
          value={localTheme.sectionFontWeight}
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
          value={localTheme.itemFontWeight}
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
        <Label>Header Font Style</Label>
        <Select
          value={localTheme.headerFontStyle}
          onValueChange={handleSelectChange('headerFontStyle')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="italic">Italic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Section Font Style</Label>
        <Select
          value={localTheme.sectionFontStyle}
          onValueChange={handleSelectChange('sectionFontStyle')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="italic">Italic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Item Font Style</Label>
        <Select
          value={localTheme.itemFontStyle}
          onValueChange={handleSelectChange('itemFontStyle')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="italic">Italic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Border Radius</Label>
        <Slider
          min={0}
          max={24}
          step={1}
          value={[parseInt(localTheme.borderRadius)]}
          onValueChange={handleSliderChange('borderRadius')}
        />
        <div className="mt-1 text-sm text-gray-500">{localTheme.borderRadius}</div>
      </div>

      <div>
        <Label>Item Spacing</Label>
        <Slider
          min={8}
          max={48}
          step={1}
          value={[parseInt(localTheme.itemSpacing)]}
          onValueChange={handleSliderChange('itemSpacing')}
        />
        <div className="mt-1 text-sm text-gray-500">{localTheme.itemSpacing}</div>
      </div>

      <div>
        <Label>Text Shadow</Label>
        <Input
          type="text"
          id="textShadow"
          name="textShadow"
          value={localTheme.textShadow}
          onChange={handleChange}
          placeholder="e.g., 1px 1px 2px rgba(0,0,0,0.1)"
        />
      </div>

      <div>
        <Label>Button Style</Label>
        <Select
          value={localTheme.buttonStyle}
          onValueChange={handleSelectChange('buttonStyle')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select button style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flat">Flat</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Button Radius</Label>
        <Input
          type="text"
          id="buttonRadius"
          name="buttonRadius"
          value={localTheme.buttonRadius}
          onChange={handleChange}
          placeholder="e.g., 4px"
        />
      </div>

      <div>
        <Label>Card Style</Label>
        <Select
          value={localTheme.cardStyle}
          onValueChange={handleSelectChange('cardStyle')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select card style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flat">Flat</SelectItem>
            <SelectItem value="raised">Raised</SelectItem>
            <SelectItem value="glassmorphic">Glassmorphic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Animation Speed</Label>
        <Select
          value={localTheme.animationSpeed}
          onValueChange={handleSelectChange('animationSpeed')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select animation speed" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="slow">Slow</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="fast">Fast</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleSave} className="w-full mt-4">
        Save Changes
      </Button>
    </div>
  )
}

