class GradientColor {
    private minNum: number;
    private maxNum: number;
    private startHex: string;
    private endHex: string;
  
    constructor() {
      this.minNum = 0;
      this.maxNum = 10;
      this.startHex = "";
      this.endHex = "";
    }
  
    setColorGradient(colorStart: string, colorEnd: string): void {
      if (!colorStart.startsWith("#") || !colorEnd.startsWith("#")) {
        throw new Error('Colors must be in hexadecimal format starting with "#"');
      }
  
      this.startHex = this.validateAndExpandHex(colorStart);
      this.endHex = this.validateAndExpandHex(colorEnd);
    }
  
    private validateAndExpandHex(hex: string): string {
      if (hex.length === 4) {
        return "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
      } else if (hex.length === 7) {
        return hex;
      } else {
        throw new Error(
          "Invalid color format. Please use full hex color values (e.g., #3f2caf) instead of abbreviated formats",
        );
      }
    }
  
    setMidpoint(minNumber: number = 0, maxNumber: number = 10): void {
      this.minNum = minNumber;
      this.maxNum = maxNumber;
    }
  
    getColor(numberValue: number | undefined): string | undefined {
      if (numberValue === undefined) return undefined;
  
      return (
        "#" +
        this.generateHex(
          numberValue,
          this.startHex.substring(1, 3),
          this.endHex.substring(1, 3),
        ) +
        this.generateHex(
          numberValue,
          this.startHex.substring(3, 5),
          this.endHex.substring(3, 5),
        ) +
        this.generateHex(
          numberValue,
          this.startHex.substring(5, 7),
          this.endHex.substring(5, 7),
        )
      );
    }
  
    private generateHex(number: number, start: string, end: string): string {
      if (number < this.minNum) number = this.minNum;
      else if (number > this.maxNum) number = this.maxNum;
  
      const midPoint: number = this.maxNum - this.minNum;
      const startBase: number = parseInt(start, 16);
      const endBase: number = parseInt(end, 16);
      const average: number = (endBase - startBase) / midPoint;
      const finalBase: number = Math.round(average * (number - this.minNum) + startBase);
      return finalBase.toString(16).padStart(2, "0");
    }
  }
  
  interface Interval {
    lower: number;
    upper: number;
  }
  
  class Gradient {
    private maxNum: number;
    private colors: string[];
    private colorGradients: GradientColor[];
    private intervals: Interval[];
  
    constructor() {
      this.maxNum = 10;
      this.colors = [];
      this.colorGradients = [];
      this.intervals = [];
    }
  
    setColorGradient(...gradientColors: string[]): Gradient {
      if (gradientColors.length < 2) {
        throw new RangeError(`setColorGradient requires at least 2 colors`);
      }
  
      const increment: number = (this.maxNum - 1) / (gradientColors.length - 1);
      this.colorGradients = [];
      this.intervals = [];
  
      for (let i = 0; i < gradientColors.length - 1; i++) {
        const gradientColor: GradientColor = new GradientColor();
        const lower: number = increment * i;
        const upper: number = increment * (i + 1);
        gradientColor.setColorGradient(gradientColors[i], gradientColors[i + 1]);
        gradientColor.setMidpoint(lower, upper);
        this.colorGradients.push(gradientColor);
        this.intervals.push({ lower, upper });
      }
      this.colors = gradientColors;
      return this;
    }
  
    getColors(): string[] {
      const gradientColorsArray: string[] = [];
      const numColors: number = this.maxNum + 1;
  
      for (let j = 0; j < this.intervals.length; j++) {
        const { lower, upper }: Interval = this.intervals[j];
        const start: number = j === 0 ? 0 : Math.ceil(lower);
        const end: number = j === this.intervals.length - 1 ? Math.ceil(upper) : Math.floor(upper);
  
        for (let i = start; i < end; i++) {
          const color: string | undefined = this.colorGradients[j].getColor(i);
          if (color) {
            gradientColorsArray.push(color);
          }
        }
      }
  
      gradientColorsArray.push(this.colors[this.colors.length - 1]);
      return gradientColorsArray.slice(0, numColors);
    }
  
    getColor(numberValue: number): string {
      if (isNaN(numberValue)) {
        throw new TypeError(`getColor requires a numeric value`);
      }
      if (numberValue <= 0) {
        throw new RangeError(`getColor value should be greater than 0`);
      }
  
      const segment: number = (this.maxNum + 1) / this.colorGradients.length;
      const index: number = Math.min(Math.floor(numberValue / segment), this.colorGradients.length - 1);
      const color: string | undefined = this.colorGradients[index].getColor(numberValue);
      if (!color) {
        throw new Error('Failed to generate color');
      }
      return color;
    }
  
    setMidpoint(maxNumber: number = 10): Gradient {
      if (isNaN(maxNumber) || maxNumber < this.colors.length) {
        throw new RangeError(
          `setMidpoint should be a number greater than or equal to the number of colors`,
        );
      }
  
      this.maxNum = maxNumber;
      this.setColorGradient(...this.colors);
      return this;
    }
  }
  
  export default Gradient;